"use client"

import { useEffect, useRef } from "react"

type Leaf = {
  bornAt: number
  kind: number
  rotation: number
  rotationSpeed: number
  centerBias: number
  orbitRadiusX: number
  orbitRadiusY: number
  orbitSpeed: number
  scaleX: number
  scaleY: number
  sway: number
  swayPhase: number
  twist: number
}

const SPAWN_INTERVAL_MS = 750
const LEAF_LIFE_MS = 16000
const MAX_LEAVES = 32
const INITIAL_BURST = 14
const CENTER_HOLE_RATIO = 0.3
const FEATHER_SPRITE_SIZE = 256

const COLORS = {
  accent: "#fb7d4f",
  accentSoft: "#ffb07d",
  background: "#05080c",
  backgroundDeep: "#0b1118",
  emerald: "#30d39f",
  foreground: "#f5efe8",
  muted: "#8d99a6",
  primary: "#1d2631",
  sky: "#5cb5ff",
}

const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3)

function drawFeatherPath(ctx: CanvasRenderingContext2D, size: number) {
  const half = size / 2

  ctx.beginPath()
  ctx.moveTo(0, -half)
  ctx.bezierCurveTo(half * 0.3, -half * 0.98, half * 0.52, -half * 0.12, half * 0.16, half * 0.62)
  ctx.bezierCurveTo(half * 0.08, half * 0.9, -half * 0.08, half * 0.9, -half * 0.16, half * 0.62)
  ctx.bezierCurveTo(-half * 0.52, -half * 0.12, -half * 0.3, -half * 0.98, 0, -half)
  ctx.closePath()
}

function drawVeins(ctx: CanvasRenderingContext2D, size: number, kind: number) {
  const half = size / 2
  const veinAlpha = kind === 0 ? 0.34 : 0.26

  ctx.save()
  ctx.lineCap = "round"
  ctx.lineJoin = "round"
  ctx.strokeStyle = `rgba(252, 250, 245, ${veinAlpha})`
  ctx.lineWidth = Math.max(1.1, size * 0.024)
  ctx.beginPath()
  ctx.moveTo(0, -half * 0.76)
  ctx.quadraticCurveTo(size * 0.03, 0, 0, half * 0.74)
  ctx.stroke()

  ctx.lineWidth = Math.max(0.7, size * 0.012)
  ctx.strokeStyle = `rgba(141, 123, 99, ${kind === 0 ? 0.3 : 0.22})`
  const branches = [-0.58, -0.28, 0.02, 0.31, 0.58]

  for (const branch of branches) {
    const y = half * branch
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.quadraticCurveTo(size * 0.2, y - size * 0.06, size * 0.28, y - size * 0.16)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.quadraticCurveTo(-size * 0.2, y - size * 0.06, -size * 0.28, y - size * 0.16)
    ctx.stroke()
  }
  ctx.restore()
}

function drawFeather(ctx: CanvasRenderingContext2D, size: number, kind: number) {
  drawFeatherPath(ctx, size)

  const fill = ctx.createLinearGradient(-size * 0.48, -size * 0.52, size * 0.42, size * 0.5)
  fill.addColorStop(0, kind === 0 ? "rgba(255, 214, 187, 0.98)" : "rgba(216, 238, 255, 0.94)")
  fill.addColorStop(0.18, kind === 0 ? "rgba(251, 125, 79, 0.94)" : "rgba(92, 181, 255, 0.9)")
  fill.addColorStop(0.42, kind === 0 ? "rgba(5, 8, 12, 0.98)" : "rgba(29, 38, 49, 0.98)")
  fill.addColorStop(0.76, kind === 0 ? "rgba(48, 211, 159, 0.42)" : "rgba(245, 158, 11, 0.34)")
  fill.addColorStop(1, COLORS.background)
  ctx.fillStyle = fill
  ctx.fill()

  ctx.lineWidth = Math.max(1.1, size * 0.018)
  ctx.strokeStyle = kind === 0 ? "rgba(255, 244, 236, 0.24)" : "rgba(232, 248, 255, 0.2)"
  ctx.stroke()

  ctx.save()
  ctx.clip()
  ctx.globalAlpha = 0.2
  ctx.fillStyle = kind === 0 ? COLORS.accentSoft : COLORS.sky
  ctx.fillRect(-size / 2, -size / 2, size, size)
  ctx.restore()

  drawVeins(ctx, size, kind)
}

function drawFeatherSpine(ctx: CanvasRenderingContext2D, size: number, kind: number) {
  const half = size / 2

  ctx.save()
  ctx.lineCap = "round"
  ctx.strokeStyle = kind === 0 ? "rgba(255, 244, 236, 0.62)" : "rgba(232, 248, 255, 0.52)"
  ctx.lineWidth = Math.max(1, size * 0.016)
  ctx.beginPath()
  ctx.moveTo(0, -half * 0.88)
  ctx.lineTo(0, half * 0.76)
  ctx.stroke()

  ctx.lineWidth = Math.max(0.68, size * 0.0085)
  ctx.strokeStyle = kind === 0 ? "rgba(255, 176, 125, 0.22)" : "rgba(92, 181, 255, 0.18)"
  const barbs = [-0.66, -0.42, -0.18, 0.04, 0.22, 0.4, 0.58]

  for (const barb of barbs) {
    const y = half * barb
    const reach = half * (0.2 + Math.abs(barb) * 0.18)
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.quadraticCurveTo(reach * 0.9, y - size * 0.04, reach, y - size * 0.11)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.quadraticCurveTo(-reach * 0.9, y - size * 0.04, -reach, y - size * 0.11)
    ctx.stroke()
  }
  ctx.restore()
}

function createFeatherSprite(kind: number) {
  const sprite = document.createElement("canvas")
  sprite.width = FEATHER_SPRITE_SIZE
  sprite.height = FEATHER_SPRITE_SIZE

  const spriteCtx = sprite.getContext("2d")
  if (!spriteCtx) {
    return sprite
  }

  const size = FEATHER_SPRITE_SIZE * 0.76

  spriteCtx.translate(FEATHER_SPRITE_SIZE / 2, FEATHER_SPRITE_SIZE / 2)
  spriteCtx.rotate((kind === 0 ? -1 : 1) * 0.06)
  spriteCtx.scale(1.02, 0.98)
  spriteCtx.shadowColor = kind === 0 ? "rgba(251, 125, 79, 0.34)" : "rgba(92, 181, 255, 0.28)"
  spriteCtx.shadowBlur = 14
  spriteCtx.shadowOffsetY = 3
  drawFeather(spriteCtx, size, kind)
  drawFeatherSpine(spriteCtx, size, kind)

  return sprite
}

export function NotFoundLeafReveal() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const spawnRef = useRef<number | null>(null)
  const leavesRef = useRef<Leaf[]>([])
  const sizeRef = useRef({ height: 0, width: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const context = canvas.getContext("2d")
    if (!context) {
      return
    }

    const sprites = [createFeatherSprite(0), createFeatherSprite(1)]

    const resize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const dpr = window.devicePixelRatio || 1

      sizeRef.current = { width, height }
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.imageSmoothingEnabled = true
      context.imageSmoothingQuality = "high"
    }

    const spawnLeaf = () => {
      const { width, height } = sizeRef.current
      if (!width || !height) {
        return
      }

      leavesRef.current = leavesRef.current
        .filter((leaf) => performance.now() - leaf.bornAt < LEAF_LIFE_MS)
        .slice(-MAX_LEAVES + 1)

      const centerX = width * 0.5
      const centerY = height * 0.5
      const minRadius = Math.min(width, height) * CENTER_HOLE_RATIO
      const maxRadiusX = width * 0.67
      const maxRadiusY = height * 0.67
      const lane = Math.random() > 0.48 ? 0 : 1
      const radiusScale = lane === 0 ? 1 : 0.72 + Math.random() * 0.18
      const orbitRadiusX = lane === 0 ? maxRadiusX * (0.78 + Math.random() * 0.22) : minRadius * (1.18 + Math.random() * 0.34)
      const orbitRadiusY = lane === 0 ? maxRadiusY * (0.78 + Math.random() * 0.22) : minRadius * (1.12 + Math.random() * 0.32)
      const angle = Math.random() * Math.PI * 2

      leavesRef.current.push({
        bornAt: performance.now(),
        kind: leavesRef.current.length % 2,
        rotation: angle + (Math.random() - 0.5) * 0.28,
        rotationSpeed: (Math.random() - 0.5) * 0.00008,
        centerBias: lane,
        orbitRadiusX,
        orbitRadiusY,
        orbitSpeed: lane === 0 ? 0.00006 + Math.random() * 0.00004 : 0.00008 + Math.random() * 0.00005,
        scaleX: 1.08 + Math.random() * 0.5,
        scaleY: (0.48 + Math.random() * 0.18) * radiusScale,
        sway: 1.5 + Math.random() * 3,
        swayPhase: Math.random() * Math.PI * 2,
        twist: (Math.random() - 0.5) * 0.018,
      })
    }

    const draw = (now: number) => {
      const { width, height } = sizeRef.current
      const leaves = leavesRef.current

      context.clearRect(0, 0, width, height)

      const aliveLeaves: Leaf[] = []

      for (const leaf of leaves) {
        const age = now - leaf.bornAt
        const progress = Math.min(1, age / LEAF_LIFE_MS)
        const grow = easeOutCubic(Math.min(1, progress / 0.9))
        const centerX = width * 0.5
        const centerY = height * 0.5
        const orbitAngle = leaf.rotation + leaf.orbitSpeed * age + leaf.twist * Math.sin(progress * Math.PI * 1.4)
        const radiusPulse = Math.sin(progress * Math.PI * 0.9 + leaf.swayPhase) * leaf.sway
        const x = centerX + Math.cos(orbitAngle) * (leaf.orbitRadiusX + radiusPulse * 0.04)
        const y = centerY + Math.sin(orbitAngle) * (leaf.orbitRadiusY + radiusPulse * 0.04)
        const size = 118 * leaf.scaleX * (0.86 + grow * 0.14) * (0.95 + leaf.scaleY * 0.14)
        const alphaIn = Math.min(1, progress / 0.14)
        const alphaOut = Math.max(0, 1 - Math.max(0, progress - 0.94) / 0.06)
        const alpha = alphaIn * alphaOut
        const rotation = orbitAngle + leaf.rotationSpeed * age + Math.sin(progress * Math.PI * 0.85) * 0.035

        const dx = x - centerX
        const dy = y - centerY
        const centerClearRadius = Math.min(width, height) * CENTER_HOLE_RATIO * 1.02

        if (progress < 1 && Math.hypot(dx, dy) > centerClearRadius * 0.92) {
          aliveLeaves.push(leaf)
        }

        context.save()
        context.translate(x, y)
        context.rotate(rotation)
        context.scale(1, 0.92 + leaf.scaleY * 0.08)
        context.globalAlpha = alpha
        context.drawImage(sprites[leaf.kind], -size / 2, -size / 2, size, size)
        context.restore()
      }

      leavesRef.current = aliveLeaves
      frameRef.current = window.requestAnimationFrame(draw)
    }

    resize()
    for (let i = 0; i < INITIAL_BURST; i += 1) {
      spawnLeaf()
    }

    window.addEventListener("resize", resize)
    spawnRef.current = window.setInterval(spawnLeaf, SPAWN_INTERVAL_MS)
    frameRef.current = window.requestAnimationFrame(draw)

    return () => {
      window.removeEventListener("resize", resize)
      if (spawnRef.current) {
        window.clearInterval(spawnRef.current)
      }
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full pointer-events-none"
    />
  )
}
