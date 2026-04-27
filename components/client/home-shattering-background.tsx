"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import {
  BufferGeometry,
  DoubleSide,
  Face3,
  Geometry,
  InstancedBufferAttribute,
  InstancedMesh,
  LinearFilter,
  MathUtils,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  CanvasTexture,
  sRGBEncoding,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three"

type HomeShatteringBackgroundProps = {
  src: string
}

type ScreenState = {
  height: number
  ratio: number
  width: number
  wHeight: number
  wWidth: number
}

type AnimatedPlaneParams = {
  anim: 1 | 2
  renderer: WebGLRenderer
  screen: ScreenState
  size: number
  texture: Texture
}

const INITIAL_CYCLE_DELAY_MS = 1200
const AUTO_CYCLE_MS = 120000
const INTERPOLATION = 0.08

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const lerp = (a: number, b: number, x: number) => a + x * (b - a)
const limit = (val: number, min: number, max: number) => (val < min ? min : val > max ? max : val)

type SlideVariant = {
  accent: string
  offsetX: number
  offsetY: number
  overlay: string
  zoom: number
}

const SLIDE_VARIANTS: SlideVariant[] = [
  {
    zoom: 1.02,
    offsetX: 0,
    offsetY: -18,
    overlay: "rgba(5, 8, 12, 0.14)",
    accent: "rgba(251, 125, 79, 0.16)",
  },
  {
    zoom: 1.1,
    offsetX: -34,
    offsetY: 8,
    overlay: "rgba(48, 211, 159, 0.11)",
    accent: "rgba(92, 181, 255, 0.12)",
  },
  {
    zoom: 1.16,
    offsetX: 38,
    offsetY: -10,
    overlay: "rgba(92, 181, 255, 0.12)",
    accent: "rgba(251, 125, 79, 0.12)",
  },
]

function createCoverTexture(source: HTMLImageElement, variant: SlideVariant) {
  const canvas = document.createElement("canvas")
  canvas.width = 1600
  canvas.height = 1000

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    const fallback = new CanvasTexture(canvas)
    fallback.encoding = sRGBEncoding
    fallback.minFilter = LinearFilter
    fallback.magFilter = LinearFilter
    return fallback
  }

  const width = canvas.width
  const height = canvas.height
  const scale = Math.max(width / source.width, height / source.height) * variant.zoom
  const drawWidth = source.width * scale
  const drawHeight = source.height * scale
  const x = (width - drawWidth) / 2 + variant.offsetX
  const y = (height - drawHeight) / 2 + variant.offsetY

  const bg = ctx.createLinearGradient(0, 0, width, height)
  bg.addColorStop(0, "#05080c")
  bg.addColorStop(0.48, "#0b1118")
  bg.addColorStop(1, "#111b25")
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, width, height)

  ctx.save()
  ctx.filter = "saturate(1.08) contrast(1.04) brightness(1.02)"
  ctx.drawImage(source, x, y, drawWidth, drawHeight)
  ctx.restore()

  ctx.fillStyle = variant.overlay
  ctx.fillRect(0, 0, width, height)

  const glow = ctx.createRadialGradient(width * 0.28, height * 0.24, 10, width * 0.28, height * 0.24, width * 0.44)
  glow.addColorStop(0, variant.accent)
  glow.addColorStop(1, "rgba(5, 8, 12, 0)")
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, width, height)

  const vignette = ctx.createRadialGradient(width * 0.5, height * 0.5, height * 0.2, width * 0.5, height * 0.5, width * 0.72)
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)")
  vignette.addColorStop(1, "rgba(2, 6, 23, 0.24)")
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, width, height)

  const texture = new CanvasTexture(canvas)
  texture.encoding = sRGBEncoding
  texture.minFilter = LinearFilter
  texture.magFilter = LinearFilter
  texture.needsUpdate = true
  return texture
}

class AnimatedPlane {
  anim: 1 | 2

  bGeometry!: BufferGeometry

  dx = 0

  dy = 0

  wSize = 0

  icount = 0

  imesh!: InstancedMesh

  material!: MeshBasicMaterial

  nx = 0

  ny = 0

  o3d = new Object3D()

  renderer: WebGLRenderer

  screen: ScreenState

  size: number

  texture: Texture

  uProgress = { value: 0 }

  uvScale = new Vector2()

  constructor(params: AnimatedPlaneParams) {
    this.anim = params.anim
    this.renderer = params.renderer
    this.screen = params.screen
    this.size = params.size
    this.texture = params.texture

    this.initMaterial()
    this.initPlane()
  }

  initMaterial() {
    this.material = new MeshBasicMaterial({
      side: DoubleSide,
      transparent: true,
      map: this.texture,
    })

    this.material.onBeforeCompile = (shader: any) => {
      shader.uniforms.progress = this.uProgress
      shader.uniforms.uvScale = { value: this.uvScale }

      shader.vertexShader = `
          uniform float progress;
          uniform vec2 uvScale;

          attribute vec3 offset;
          attribute vec3 rotation;
          attribute vec2 uvOffset;

          mat3 rotationMatrixXYZ(vec3 r)
          {
            float cx = cos(r.x);
            float sx = sin(r.x);
            float cy = cos(r.y);
            float sy = sin(r.y);
            float cz = cos(r.z);
            float sz = sin(r.z);

            return mat3(
               cy * cz, cx * sz + sx * sy * cz, sx * sz - cx * sy * cz,
              -cy * sz, cx * cz - sx * sy * sz, sx * cz + cx * sy * sz,
                    sy,               -sx * cy,                cx * cy
            );
          }
        ` + shader.vertexShader

      shader.vertexShader = shader.vertexShader.replace("#include <uv_vertex>", `
          #include <uv_vertex>
          vUv = vUv * uvScale + uvOffset;
        `)

      shader.vertexShader = shader.vertexShader.replace("#include <project_vertex>", `
          mat3 rotMat = rotationMatrixXYZ(progress * rotation);
          transformed = rotMat * transformed;

          vec4 mvPosition = vec4(transformed, 1.0);
          #ifdef USE_INSTANCING
            mvPosition = instanceMatrix * mvPosition;
          #endif

          mvPosition.xyz += progress * offset;

          mvPosition = modelViewMatrix * mvPosition;
          gl_Position = projectionMatrix * mvPosition;
        `)
    }
  }

  initPlane() {
    const { width, wWidth, wHeight } = this.screen
    this.wSize = (this.size * wWidth) / width
    this.nx = Math.ceil(wWidth / this.wSize) + 1
    this.ny = Math.ceil(wHeight / this.wSize) + 1
    this.icount = this.nx * this.ny

    this.initGeometry()
    this.initUV()
    this.initAnimAttributes()

    if (this.imesh) {
      this.o3d.remove(this.imesh)
    }

    this.imesh = new InstancedMesh(this.bGeometry, this.material, this.icount)
    this.o3d.add(this.imesh)

    const dummy = new Object3D()
    let index = 0
    let x = -(wWidth - (wWidth - this.nx * this.wSize)) / 2 + this.dx

    for (let i = 0; i < this.nx; i += 1) {
      let y = -(wHeight - (wHeight - this.ny * this.wSize)) / 2 + this.dy
      for (let j = 0; j < this.ny; j += 1) {
        dummy.position.set(x, y, 0)
        dummy.updateMatrix()
        this.imesh.setMatrixAt(index++, dummy.matrix)
        y += this.wSize
      }
      x += this.wSize
    }
  }

  initGeometry() {
    const geometry = new Geometry()
    geometry.vertices.push(new Vector3(0, 0, 0))
    geometry.vertices.push(new Vector3(this.wSize, 0, 0))
    geometry.vertices.push(new Vector3(0, this.wSize, 0))
    geometry.vertices.push(new Vector3(this.wSize, this.wSize, 0))
    geometry.faces.push(new Face3(0, 2, 1))
    geometry.faces.push(new Face3(2, 3, 1))

    geometry.faceVertexUvs[0].push([
      new Vector2(0, 0),
      new Vector2(0, 1),
      new Vector2(1, 0),
    ])
    geometry.faceVertexUvs[0].push([
      new Vector2(0, 1),
      new Vector2(1, 1),
      new Vector2(1, 0),
    ])

    this.dx = this.wSize / 2
    this.dy = this.wSize / 2
    geometry.translate(-this.dx, -this.dy, 0)

    this.bGeometry = new BufferGeometry().fromGeometry(geometry)
  }

  initAnimAttributes() {
    const { randFloat: rnd, randFloatSpread: rndFS } = MathUtils
    const v3 = new Vector3()

    const offsets = new Float32Array(this.icount * 3)
    for (let i = 0; i < offsets.length; i += 3) {
      if (this.anim === 1) v3.set(rndFS(10), rnd(50, 100), rnd(20, 50)).toArray(offsets, i)
      else v3.set(rndFS(20), rndFS(20), rnd(20, 200)).toArray(offsets, i)
    }
    this.bGeometry.setAttribute("offset", new InstancedBufferAttribute(offsets, 3))

    const rotations = new Float32Array(this.icount * 3)
    const angle = Math.PI * 4
    for (let i = 0; i < rotations.length; i += 3) {
      rotations[i] = rndFS(angle)
      rotations[i + 1] = rndFS(angle)
      rotations[i + 2] = rndFS(angle)
    }
    this.bGeometry.setAttribute("rotation", new InstancedBufferAttribute(rotations, 3))
  }

  initUV() {
    const ratio = this.nx / this.ny
    const tRatio = this.texture.image.width / this.texture.image.height
    if (ratio > tRatio) this.uvScale.set(1 / this.nx, (tRatio / ratio) / this.ny)
    else this.uvScale.set((ratio / tRatio) / this.nx, 1 / this.ny)

    const nW = this.uvScale.x * this.nx
    const nH = this.uvScale.y * this.ny

    const v2 = new Vector2()
    const uvOffsets = new Float32Array(this.icount * 2)
    for (let i = 0; i < this.nx; i += 1) {
      for (let j = 0; j < this.ny; j += 1) {
        v2
          .set(this.uvScale.x * i + (1 - nW) / 2, this.uvScale.y * j + (1 - nH) / 2)
          .toArray(uvOffsets, (i * this.ny + j) * 2)
      }
    }
    this.bGeometry.setAttribute("uvOffset", new InstancedBufferAttribute(uvOffsets, 2))
  }

  resize() {
    this.initPlane()
  }

  setTexture(texture: Texture) {
    this.texture = texture
    this.material.map = texture
    this.material.needsUpdate = true
    this.initUV()
  }
}

function useReducedMotion() {
  const reducedMotionRef = useRef(false)
  const [, forceRender] = useState(0)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => {
      reducedMotionRef.current = media.matches
      forceRender((value) => value + 1)
    }

    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  return reducedMotionRef.current
}

export function HomeShatteringBackground({ src }: HomeShatteringBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let frame = 0
    let cycleTimer = 0
    let firstCycleTimer = 0
    let resizeTimer = 0
    let disposed = false

    const mouse = new Vector2()
    const screen: ScreenState = {
      height: 0,
      ratio: 1,
      width: 0,
      wHeight: 0,
      wWidth: 0,
    }

    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)

    const camera = new PerspectiveCamera(50)
    camera.position.z = 150

    let scene: Scene
    let planes: Object3D
    let plane1: AnimatedPlane
    let plane2: AnimatedPlane
    let progress = 0
    let targetProgress = 0
    let direction = 1
    let textures: Texture[] = []

    const loader = new TextureLoader()
    const loadTexture = (imageSrc: string) =>
      new Promise<Texture>((resolve, reject) => {
        loader.load(
          imageSrc,
          (texture) => {
            texture.encoding = sRGBEncoding
            texture.minFilter = LinearFilter
            texture.magFilter = LinearFilter
            resolve(texture)
          },
          undefined,
          reject,
        )
      })

    const getRendererSize = () => {
      const vFOV = (camera.fov * Math.PI) / 180
      const h = 2 * Math.tan(vFOV / 2) * Math.abs(camera.position.z)
      const w = h * camera.aspect
      return [w, h]
    }

    const setPlanesProgress = (nextProgress: number) => {
      if (!plane1 || !plane2) return
      plane1.uProgress.value = nextProgress
      plane2.uProgress.value = -1 + nextProgress
      plane1.material.opacity = 1 - nextProgress
      plane2.material.opacity = nextProgress
      plane1.o3d.position.z = nextProgress
      plane2.o3d.position.z = nextProgress - 1
    }

    const updateProgress = () => {
      const nextProgress = lerp(progress, targetProgress, reducedMotion ? 1 : INTERPOLATION)
      const diff = nextProgress - progress
      if (diff === 0) return

      const p0 = progress % 1
      const p1 = nextProgress % 1
      if ((diff > 0 && p1 < p0) || (diff < 0 && p0 < p1)) {
        const index = Math.floor(clamp(nextProgress, 0, textures.length - 1))
        const nextIndex = Math.min(index + 1, textures.length - 1)
        plane1.setTexture(textures[index])
        plane2.setTexture(textures[nextIndex])
      }

      progress = nextProgress
      setPlanesProgress(progress % 1)
    }

    const updateSize = () => {
      screen.width = window.innerWidth
      screen.height = window.innerHeight
      screen.ratio = screen.width / screen.height

      renderer.setSize(screen.width, screen.height)
      camera.aspect = screen.ratio
      camera.updateProjectionMatrix()

      const [wWidth, wHeight] = getRendererSize()
      screen.wWidth = wWidth
      screen.wHeight = wHeight

      if (plane1) plane1.resize()
      if (plane2) plane2.resize()
    }

    const initScene = () => {
      scene = new Scene()

      plane1 = new AnimatedPlane({
        renderer,
        screen,
        size: 10,
        anim: 1,
        texture: textures[0],
      })

      plane2 = new AnimatedPlane({
        renderer,
        screen,
        size: 10,
        anim: 2,
        texture: textures[1] ?? textures[0],
      })

      planes = new Object3D()
      planes.add(plane1.o3d)
      planes.add(plane2.o3d)
      scene.add(planes)
      setPlanesProgress(0)
    }

    const animate = () => {
      if (disposed) return
      frame = window.requestAnimationFrame(animate)
      updateProgress()

      const tiltX = lerp(planes.rotation.x, -mouse.y * 0.12, 0.08)
      const tiltY = lerp(planes.rotation.y, mouse.x * 0.12, 0.08)
      planes.rotation.set(tiltX, tiltY, 0)

      renderer.render(scene, camera)
    }

    const scheduleAutoCycle = () => {
      window.clearTimeout(firstCycleTimer)
      window.clearInterval(cycleTimer)
      if (reducedMotion || textures.length <= 1) return

      const advanceSlide = () => {
        const next = targetProgress + direction
        if (next >= textures.length - 1) {
          direction = -1
          targetProgress = textures.length - 1
        } else if (next <= 0) {
          direction = 1
          targetProgress = 0
        } else {
          targetProgress = next
        }
      }

      firstCycleTimer = window.setTimeout(() => {
        advanceSlide()
        cycleTimer = window.setInterval(advanceSlide, AUTO_CYCLE_MS)
      }, INITIAL_CYCLE_DELAY_MS)
    }

    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(updateSize, 180)
    }

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    const start = async () => {
      const baseTexture = await loadTexture(src)
      if (disposed) return

      const sourceImage = baseTexture.image as HTMLImageElement
      textures = SLIDE_VARIANTS.map((variant) => createCoverTexture(sourceImage, variant))
      baseTexture.dispose()

      updateSize()
      initScene()
      scheduleAutoCycle()
      frame = window.requestAnimationFrame(animate)
    }

    window.addEventListener("resize", onResize)
    window.addEventListener("mousemove", onMouseMove, { passive: true })

    void start()

    return () => {
      disposed = true
      window.cancelAnimationFrame(frame)
      window.clearTimeout(firstCycleTimer)
      window.clearTimeout(resizeTimer)
      window.clearInterval(cycleTimer)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("mousemove", onMouseMove)

      if (scene) {
        scene.traverse((object) => {
          const mesh = object as InstancedMesh
          if (mesh.geometry) mesh.geometry.dispose?.()
          const material = mesh.material as MeshBasicMaterial | MeshBasicMaterial[]
          if (Array.isArray(material)) {
            material.forEach((entry) => entry.dispose())
          } else if (material?.dispose) {
            material.dispose()
          }
        })
      }

      textures.forEach((texture) => texture.dispose())
      renderer.dispose()
    }
  }, [reducedMotion, src])

  return (
    <div className="absolute inset-0">
      <Image
        src={src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="z-0 object-cover"
        style={{
          objectPosition: "center 45%",
          filter: "saturate(1.04) contrast(1.06) brightness(1.02)",
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 z-10 h-full w-full pointer-events-none opacity-95 mix-blend-normal"
      />
    </div>
  )
}
