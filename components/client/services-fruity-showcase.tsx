"use client"

import type { CSSProperties, ReactNode } from "react"
import { useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type FruityScene = {
  eyebrow: string
  title: string
  summary: string
  bullets: readonly string[]
}

type ServicesFruityShowcaseProps = {
  scenes: ReadonlyArray<FruityScene>
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const lerp = (start: number, end: number, ratio: number) => start + (end - start) * ratio

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  return reduced
}

function useCompactViewport(maxWidth = 639) {
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${maxWidth}px)`)
    const update = () => setCompact(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [maxWidth])

  return compact
}

function AnimatedSceneTitle({
  title,
  active,
  className,
  style,
}: {
  title: string
  active: boolean
  className?: string
  style?: CSSProperties
}) {
  const words = title.split(/\s+/)

  return (
    <h2
      className={cn(
        "text-balance font-serif text-[clamp(2.35rem,8vw,4rem)] leading-[0.98] tracking-tight text-card-foreground sm:text-5xl lg:text-6xl",
        className,
      )}
      style={style}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <span
            className={cn(
              "inline-block transition-all duration-500 ease-out",
              active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
            )}
            style={{ transitionDelay: `${index * 70}ms` }}
          >
            {word}
          </span>
          {index < words.length - 1 ? "\u00a0" : null}
        </span>
      ))}
    </h2>
  )
}

function SceneShell({
  className,
  title,
  eyebrow,
  strength,
  reducedMotion,
  children,
}: {
  className: string
  title: string
  eyebrow: string
  strength: number
  reducedMotion: boolean
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "relative h-full overflow-hidden rounded-[2rem] border border-border/70 bg-card/96 shadow-[0_24px_60px_rgba(2,6,23,0.18)]",
        className,
      )}
      style={{
        opacity: strength < 0.05 ? 0.04 : lerp(0.5, 1, strength),
        transform: `translate3d(0, ${lerp(34, 0, strength)}px, 0) scale(${lerp(0.89, 1, strength)})`,
        filter: `blur(${strength < 0.08 ? 1 : 0}px)`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_30%)]" />
      <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-border/60 bg-background/75 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[color:var(--accent)] backdrop-blur">
        {eyebrow}
      </div>
      <div className="absolute right-4 top-4 z-20 rounded-full border border-border/60 bg-background/75 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground backdrop-blur">
        {title}
      </div>

      <div className="relative h-full">{children}</div>

      {!reducedMotion ? (
        <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden>
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent" />
          <div className="absolute inset-x-8 bottom-0 h-12 rounded-full bg-black/10 blur-2xl dark:bg-black/20" />
        </div>
      ) : null}
    </div>
  )
}

const BOARD_TICK_MS = 760
const BOARD_RESET_TICKS = 18

type BoardCellKind = "empty" | "home" | "slash" | "fire" | "douse" | "dig"

type BoardGameState = {
  cells: BoardCellKind[]
  homeIndex: number
  focusIndex: number
  diceCol: number
  diceRow: number
  actionsLeft: number
  digCount: number
  turn: number
  resetCountdown: number
  message: string
}

function randomInt(max: number) {
  return Math.floor(Math.random() * max)
}

function randomPick<T>(items: readonly T[]) {
  return items.length > 0 ? items[randomInt(items.length)] : undefined
}

function boardIndex(boardSize: number, row: number, col: number) {
  return row * boardSize + col
}

function boardOrthogonalNeighbors(boardSize: number, index: number) {
  const row = Math.floor(index / boardSize)
  const col = index % boardSize
  const neighbors: number[] = []

  if (row > 0) neighbors.push(boardIndex(boardSize, row - 1, col))
  if (row < boardSize - 1) neighbors.push(boardIndex(boardSize, row + 1, col))
  if (col > 0) neighbors.push(boardIndex(boardSize, row, col - 1))
  if (col < boardSize - 1) neighbors.push(boardIndex(boardSize, row, col + 1))

  return neighbors
}

function boardAllNeighbors(boardSize: number, index: number) {
  const row = Math.floor(index / boardSize)
  const col = index % boardSize
  const neighbors: number[] = []

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) continue
      const nextRow = row + rowOffset
      const nextCol = col + colOffset
      if (nextRow < 0 || nextRow >= boardSize || nextCol < 0 || nextCol >= boardSize) continue
      neighbors.push(boardIndex(boardSize, nextRow, nextCol))
    }
  }

  return neighbors
}

function createBoardGameState(boardSize: number): BoardGameState {
  const boardCellCount = boardSize * boardSize
  const cells: BoardCellKind[] = Array.from({ length: boardCellCount }, () => "empty")
  const homeIndex = randomInt(boardCellCount)
  cells[homeIndex] = "home"

  const safeZone = new Set([homeIndex, ...boardAllNeighbors(boardSize, homeIndex)])
  const fireCandidates = Array.from({ length: boardCellCount }, (_, index) => index).filter((index) => !safeZone.has(index))
  const firstFire = randomPick(fireCandidates)

  if (typeof firstFire === "number") {
    cells[firstFire] = "fire"
  }

  const slashCandidates = fireCandidates.filter((index) => index !== firstFire)
  const firstSlash = randomPick(slashCandidates)
  const secondSlash = randomPick(slashCandidates.filter((index) => index !== firstSlash))

  if (typeof firstSlash === "number") {
    cells[firstSlash] = "slash"
  }

  if (typeof secondSlash === "number" && Math.random() > 0.55) {
    cells[secondSlash] = "slash"
  }

  return {
    cells,
    homeIndex,
    focusIndex: homeIndex,
    diceCol: randomInt(boardSize) + 1,
    diceRow: randomInt(boardSize) + 1,
    actionsLeft: 1,
    digCount: 2,
    turn: 0,
    resetCountdown: 0,
    message: "Autoplay board",
  }
}

function advanceBoardGameState(boardSize: number, state: BoardGameState): BoardGameState {
  if (state.resetCountdown > 0) {
    if (state.resetCountdown === 1) {
      return createBoardGameState(boardSize)
    }

    return {
      ...state,
      resetCountdown: state.resetCountdown - 1,
      turn: state.turn + 1,
      message: "Resetting board",
    }
  }

  if (state.turn >= BOARD_RESET_TICKS) {
    return {
      ...state,
      resetCountdown: 2,
      message: "Resetting board",
      turn: state.turn + 1,
    }
  }

  const cells = [...state.cells]
  const diceCol = randomInt(boardSize) + 1
  const diceRow = randomInt(boardSize) + 1
  const focusIndex = boardIndex(boardSize, diceRow - 1, diceCol - 1)
  const phase = state.turn % 3
  let actionsLeft = state.actionsLeft
  let digCount = state.digCount
  let message = state.message

  if (phase === 0) {
    const focusedCell = cells[focusIndex]
    if (focusedCell === "empty") {
      cells[focusIndex] = "slash"
      message = "Marked"
    } else if (focusedCell === "slash") {
      cells[focusIndex] = "fire"
      message = "Burning"
    } else if (focusedCell === "home") {
      actionsLeft = 2
      message = "Home found"
    } else if (focusedCell === "fire") {
      boardOrthogonalNeighbors(boardSize, focusIndex).forEach((neighbor) => {
        if (cells[neighbor] === "empty") {
          cells[neighbor] = "slash"
        }
      })
      message = "Heat spread"
    } else if (focusedCell === "douse" || focusedCell === "dig") {
      message = "Resolve"
    }
  } else if (phase === 1) {
    const slashIndices = cells.flatMap((cell, index) => (cell === "slash" ? [index] : []))
    const emptyIndices = cells.flatMap((cell, index) => (cell === "empty" ? [index] : []))

    if (slashIndices.length > 0 && actionsLeft > 0) {
      const targetIndex = randomPick(slashIndices)
      if (typeof targetIndex === "number") {
        cells[targetIndex] = "douse"
        actionsLeft -= 1
        message = "Douse"
      }
    } else if (digCount > 0 && emptyIndices.length > 0) {
      const targetIndex = randomPick(emptyIndices)
      if (typeof targetIndex === "number") {
        cells[targetIndex] = "dig"
        digCount -= 1
        message = "Dig"
      }
    } else {
      message = "Hold"
    }
  } else {
    const fireIndices = cells.flatMap((cell, index) => (cell === "fire" ? [index] : []))

    if (fireIndices.length > 0) {
      const sourceIndex = randomPick(fireIndices)
      if (typeof sourceIndex === "number") {
        boardOrthogonalNeighbors(boardSize, sourceIndex).forEach((neighbor) => {
          if (cells[neighbor] === "empty") {
            cells[neighbor] = "slash"
          } else if (cells[neighbor] === "slash") {
            cells[neighbor] = "fire"
          } else if (cells[neighbor] === "home") {
            cells[neighbor] = "fire"
            message = "Home burned"
          }
        })
        message = message === "Home burned" ? message : "Fire spread"
      }
    } else if (cells.every((cell) => cell === "empty" || cell === "home")) {
      message = "Resetting board"
      return {
        ...state,
        resetCountdown: 2,
        turn: state.turn + 1,
        message,
      }
    }
  }

  const homeBurned = cells[state.homeIndex] === "fire"

  if (homeBurned) {
    message = "Home burned"
  }

  const slashCount = cells.filter((cell) => cell === "slash").length
  const fireCount = cells.filter((cell) => cell === "fire").length
  const shouldReset = homeBurned || (state.turn > 4 && slashCount === 0 && fireCount === 0)

  return {
    cells,
    homeIndex: state.homeIndex,
    focusIndex,
    diceCol,
    diceRow,
    actionsLeft: Math.max(actionsLeft, 0),
    digCount: Math.max(digCount, 0),
    turn: state.turn + 1,
    resetCountdown: shouldReset ? 2 : 0,
    message: shouldReset && !homeBurned ? "Resetting board" : message,
  }
}

function BoardGlyph({
  kind,
}: {
  kind: BoardCellKind
}) {
  if (kind === "home") {
    return (
      <svg viewBox="0 0 32 32" className="h-4.5 w-4.5" aria-hidden>
        <path
          d="M14.2679 8C15.0377 6.66667 16.9623 6.66667 17.7321 8L24.6603 20C25.4301 21.3333 24.4678 23 22.9282 23H9.0718C7.5322 23 6.56995 21.3333 7.33975 20L14.2679 8Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    )
  }

  if (kind === "slash") {
    return (
      <svg viewBox="0 0 32 32" className="h-4.5 w-4.5" aria-hidden>
        <path d="M9 23L23 9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    )
  }

  if (kind === "fire") {
    return (
      <svg viewBox="0 0 32 32" className="h-4.5 w-4.5" aria-hidden>
        <path d="M16 7C12 11 10 14 10 18c0 4.4 3.3 7 6 7s6-2.6 6-7c0-4-2-7-6-11Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    )
  }

  if (kind === "douse") {
    return (
      <svg viewBox="0 0 32 32" className="h-4.5 w-4.5" aria-hidden>
        <circle cx="16" cy="16" r="9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    )
  }

  if (kind === "dig") {
    return (
      <svg viewBox="0 0 32 32" className="h-4.5 w-4.5" aria-hidden>
        <rect x="8" y="8" width="16" height="16" rx="1.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    )
  }

  return null
}

function ProductBuildVisual({
  strength,
  reducedMotion,
}: {
  strength: number
  reducedMotion: boolean
}) {
  const compact = useCompactViewport()
  const boardSize = compact ? 4 : 6
  const boardCellCount = boardSize * boardSize
  const [boardState, setBoardState] = useState<BoardGameState>(() => createBoardGameState(boardSize))

  useEffect(() => {
    if (reducedMotion) {
      setBoardState(createBoardGameState(boardSize))
      return
    }

    const interval = window.setInterval(() => {
      setBoardState((current) => advanceBoardGameState(boardSize, current))
    }, BOARD_TICK_MS)

    return () => window.clearInterval(interval)
  }, [boardSize, reducedMotion])

  useEffect(() => {
    setBoardState(createBoardGameState(boardSize))
  }, [boardSize])

  const statusLabel = boardState.resetCountdown > 0 ? "Resetting" : boardState.message
  const actionLabel = `Actions ${boardState.actionsLeft}`
  const digLabel = `Dig ${boardState.digCount}`
  return (
    <SceneShell
      className="bg-[#050301] dark:bg-[#030203]"
      title="iPhone game preview"
      eyebrow="A / Product motion"
      strength={strength}
      reducedMotion={reducedMotion}
    >
      <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,122,61,0.18),transparent_30%),radial-gradient(circle_at_70%_22%,rgba(255,176,85,0.12),transparent_24%),radial-gradient(circle_at_20%_78%,rgba(255,71,151,0.08),transparent_26%),linear-gradient(180deg,#050301,#030203)]">
        <div className="absolute inset-0 opacity-[0.1] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.45)_1px,transparent_0)] [background-size:24px_24px]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 28%, rgba(255, 255, 248, 0.12) 0%, rgba(255, 191, 119, 0.06) 24%, transparent 56%)",
            animation: reducedMotion ? "none" : "service-board-field 9.5s ease-in-out infinite",
          }}
        />

        <div className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-3">
          <div className="rounded-full border border-white/10 bg-black/32 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-[color:var(--accent)] backdrop-blur">
            {statusLabel}
          </div>
        </div>

        <div className="absolute left-4 top-4 hidden rounded-full border border-white/10 bg-black/24 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/60 backdrop-blur sm:block">
          Auto play
        </div>

        <div className="absolute inset-0 flex items-center justify-center px-4 pt-14 pb-16 sm:px-6 sm:pt-18 sm:pb-20">
          <div className="relative w-full max-w-[560px]">
            <div className="relative mx-auto aspect-[9/19] w-[min(56vw,288px)]">
              <div
                className="absolute inset-0 rounded-[2.75rem] border border-white/16 bg-[linear-gradient(180deg,rgba(18,18,20,0.98),rgba(8,8,10,0.99))] shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
                style={{ transform: `scale(${lerp(0.98, 1.02, strength)})` }}
              />
              <div className="absolute left-1/2 top-3 z-20 h-7 w-28 -translate-x-1/2 rounded-full border border-white/15 bg-black/65">
                <div className="flex h-full items-center justify-center gap-2">
                  <span className="h-1.5 w-10 rounded-full bg-white/24" />
                  <span className="h-2 w-2 rounded-full bg-black shadow-[0_0_8px_rgba(0,0,0,0.5)]" />
                </div>
              </div>
              <div className="absolute inset-[9px] rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(6,5,7,0.96),rgba(8,5,4,0.98))] p-3 pt-11">
                <div className="relative h-full overflow-hidden rounded-[1.65rem] border border-white/12 bg-[radial-gradient(circle_at_25%_16%,rgba(255,158,88,0.24),transparent_38%),radial-gradient(circle_at_76%_20%,rgba(255,88,167,0.18),transparent_42%),linear-gradient(180deg,rgba(12,8,6,0.98),rgba(8,5,4,0.98))] p-2.5">
                  <div className="absolute inset-x-2 top-2 rounded-xl border border-white/10 bg-black/35 px-2 py-1 text-center text-[9px] font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)]">
                    Game Session
                  </div>
                  <div className="absolute inset-x-2 bottom-2 rounded-xl border border-white/10 bg-black/35 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/58">
                    Turno {boardState.turn}
                  </div>
                  <div className="absolute inset-x-2 bottom-8 top-11 rounded-[1.05rem] border border-white/10 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.05),transparent_56%)] p-1.5">
                    <div
                      className="grid h-full gap-1.5"
                      style={{
                        gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
                        gridTemplateRows: `repeat(${boardSize}, minmax(0, 1fr))`,
                      }}
                    >
                      {boardState.cells.slice(0, boardCellCount).map((kind, index) => {
                        const isFocus = boardState.focusIndex === index
                        const isHome = kind === "home"
                        const isFire = kind === "fire"
                        const isSlash = kind === "slash"
                        const isDouse = kind === "douse"
                        const isDig = kind === "dig"

                        return (
                          <div
                            key={`${kind}-${index}`}
                            className={cn(
                              "relative grid place-items-center rounded-xl border transition-[transform,background-color,border-color,box-shadow,opacity] duration-500 ease-out will-change-transform",
                              isHome
                                ? "border-[color:var(--accent)]/35 bg-[radial-gradient(circle_at_45%_35%,rgba(255,244,220,0.18),transparent_64%),rgba(255,122,61,0.1)] text-[color:var(--accent)]"
                                : isFire
                                  ? "border-[#ff8b4a]/45 bg-[radial-gradient(circle_at_50%_40%,rgba(255,180,104,0.22),transparent_48%),rgba(55,19,9,0.82)] text-[#ff9a53]"
                                  : isSlash
                                    ? "border-[#ff7a3d]/40 bg-[rgba(61,22,12,0.62)] text-[#ff7a3d]"
                                    : isDouse
                                      ? "border-[#23c79a]/30 bg-[rgba(12,41,30,0.7)] text-[#23c79a]"
                                      : isDig
                                        ? "border-[#f4b14a]/30 bg-[rgba(46,31,10,0.62)] text-[#f4b14a]"
                                        : "border-white/8 bg-white/[0.025] text-white/20",
                              isFocus ? "shadow-[0_0_0_1px_rgba(255,122,61,0.3),0_0_20px_rgba(255,122,61,0.18)]" : "",
                            )}
                            style={{
                              transform: `scale(${isFocus ? 1.06 : 1})`,
                              opacity: lerp(0.84, 1, strength),
                              animation:
                                reducedMotion
                                  ? "none"
                                  : isFire
                                    ? "service-board-fire 1.28s ease-in-out infinite"
                                    : isSlash
                                      ? "service-board-scan 1.8s ease-in-out infinite"
                                      : isHome
                                        ? "service-board-home 2.8s ease-in-out infinite"
                                        : isDouse
                                          ? "service-board-douse 2.2s ease-in-out infinite"
                                          : isDig
                                            ? "service-board-dig 2.35s ease-in-out infinite"
                                            : "none",
                              animationDelay: `${(index % boardSize) * 70}ms`,
                            }}
                          >
                            {isFocus ? (
                              <span className="absolute inset-0 rounded-xl border border-[color:var(--accent)]/20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,122,61,0.1),transparent_62%)]" />
                            ) : null}
                            <span className="relative z-10">
                              <BoardGlyph kind={kind} />
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-4 bottom-4">
          <div className="mx-auto flex max-w-[560px] items-center gap-2 rounded-full border border-white/10 bg-black/38 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55 backdrop-blur">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[color:var(--accent)]">{actionLabel}</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{digLabel}</span>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}

function VisibilityVisual({
  strength,
  reducedMotion,
}: {
  strength: number
  reducedMotion: boolean
}) {
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)")
    const update = () => setCompact(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  return (
    <SceneShell
      className="bg-[#020305] dark:bg-[#010204]"
      title="Visibility"
      eyebrow="B / Visibility graph"
      strength={strength}
      reducedMotion={reducedMotion}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.02),transparent_26%),linear-gradient(180deg,rgba(2,3,5,1),rgba(2,3,5,1))]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />

        <svg className="absolute inset-0 h-full w-full" viewBox={compact ? "0 0 1000 980" : "0 0 1000 700"} preserveAspectRatio={compact ? "xMidYMid meet" : "none"} aria-hidden>
          <defs>
            <linearGradient id="visLineA" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="48%" stopColor="#ff2f9e" />
              <stop offset="68%" stopColor="#ff7a3d" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <linearGradient id="visLineB" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="46%" stopColor="#ff22a6" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <linearGradient id="visLineC" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="42%" stopColor="#ffb35c" />
              <stop offset="62%" stopColor="#ff4ab9" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <filter id="visGlow">
              <feGaussianBlur stdDeviation="5.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g transform={compact ? "translate(-465 -112) scale(1.65)" : "translate(-154 0)"}>
            <path
              d="M 624 118 C 744 132, 796 208, 752 274 C 704 346, 676 402, 706 470"
              fill="none"
              stroke="url(#visLineA)"
              strokeWidth={compact ? "9.2" : "5"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={compact ? "18 22" : "12 16"}
              style={{
                filter: "url(#visGlow)",
                animation: reducedMotion ? "none" : "service-line-drift 7.2s linear infinite",
                opacity: 1,
              }}
            />
            <path
              d="M 648 124 C 756 145, 780 214, 742 276 C 702 344, 694 390, 726 458"
              fill="none"
              stroke="url(#visLineB)"
              strokeWidth={compact ? "7.2" : "3.6"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={compact ? "14 18" : "8 12"}
              style={{
                filter: "url(#visGlow)",
                animation: reducedMotion ? "none" : "service-line-drift 8.2s linear infinite reverse",
                opacity: 0.96,
              }}
            />
            <path
              d="M 610 150 C 714 168, 764 228, 738 288 C 710 353, 704 406, 746 474"
              fill="none"
              stroke="url(#visLineC)"
              strokeWidth={compact ? "5.8" : "2.2"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={compact ? "10 16" : "4 10"}
              style={{
                filter: "url(#visGlow)",
                animation: reducedMotion ? "none" : "service-line-drift 6.4s linear infinite",
                opacity: 0.92,
              }}
            />
            <path
              d="M 614 198 C 726 198, 790 228, 796 278 C 801 325, 778 374, 744 446"
              fill="none"
              stroke="#ff61c6"
              strokeWidth={compact ? "4.2" : "1.5"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={compact ? "6 14" : "2 10"}
              style={{
                filter: "url(#visGlow)",
                animation: reducedMotion ? "none" : "service-line-drift 9s linear infinite reverse",
                opacity: 0.78,
              }}
            />
          </g>
        </svg>
      </div>
    </SceneShell>
  )
}

function SystemsLayerVisual({
  strength,
  reducedMotion,
}: {
  strength: number
  reducedMotion: boolean
}) {
  const spheres = useMemo(
    () =>
      [
        { x: 0.24, y: 0.17, vx: 0.016, vy: 0.012, size: 0.15, color: "rgba(56, 189, 248, 0.98)", glow: "rgba(56, 189, 248, 0.28)" },
        { x: 0.47, y: 0.22, vx: -0.013, vy: 0.015, size: 0.095, color: "rgba(244, 114, 182, 0.98)", glow: "rgba(244, 114, 182, 0.24)" },
        { x: 0.73, y: 0.2, vx: 0.011, vy: -0.013, size: 0.11, color: "rgba(251, 146, 60, 0.98)", glow: "rgba(251, 146, 60, 0.28)" },
        { x: 0.26, y: 0.5, vx: 0.014, vy: -0.012, size: 0.08, color: "rgba(16, 185, 129, 0.96)", glow: "rgba(16, 185, 129, 0.22)" },
        { x: 0.56, y: 0.48, vx: -0.01, vy: 0.013, size: 0.125, color: "rgba(249, 115, 22, 0.98)", glow: "rgba(249, 115, 22, 0.28)" },
        { x: 0.72, y: 0.7, vx: -0.014, vy: 0.012, size: 0.085, color: "rgba(245, 158, 11, 0.98)", glow: "rgba(245, 158, 11, 0.24)" },
        { x: 0.18, y: 0.78, vx: 0.01, vy: -0.014, size: 0.07, color: "rgba(34, 211, 238, 0.94)", glow: "rgba(34, 211, 238, 0.2)" },
      ] as const,
    [],
  )

  return (
    <SceneShell
      className="bg-[#04070b] dark:bg-[#030407]"
      title="Systems layer"
      eyebrow="C / Systems layer"
      strength={strength}
      reducedMotion={reducedMotion}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_30%),linear-gradient(180deg,rgba(4,7,11,1),rgba(4,7,11,1))]" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.35)_1px,transparent_0)] [background-size:26px_26px]" />
        <div className="absolute left-1/2 top-1/2 h-[min(54vw,340px)] w-[min(54vw,340px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07),transparent_66%)]" />
        <div className="absolute left-1/2 top-[48%] h-[min(58vw,390px)] w-[min(58vw,390px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,73,179,0.14),transparent_42%)] blur-2xl" />

        <div className="absolute left-1/2 top-1/2 w-full max-w-[520px] -translate-x-1/2 -translate-y-1/2 px-6">
          <div
            className="relative mx-auto aspect-square h-[min(64vw,520px)] w-[min(64vw,520px)]"
            style={{
              animation: reducedMotion ? "none" : "service-system-bob 3.8s ease-in-out infinite",
            }}
          >
            {spheres.map((sphere, index) => (
              <div
                key={`${sphere.color}-${index}`}
                className="absolute rounded-full"
                style={{
                  left: `${sphere.x * 100}%`,
                  top: `${sphere.y * 100}%`,
                  width: `calc(${sphere.size * 100}% * ${lerp(0.94, 1.03, strength)})`,
                  height: `calc(${sphere.size * 100}% * ${lerp(0.94, 1.03, strength)})`,
                  background: sphere.color,
                  boxShadow: `0 0 48px ${sphere.glow}, 0 0 96px ${sphere.glow}`,
                  filter: `saturate(${lerp(1.1, 1.35, strength)}) brightness(${lerp(0.96, 1.12, strength)})`,
                  transform: `translate3d(-50%, -50%, 0)`,
                  opacity: lerp(0.82, 1, strength),
                  animation: reducedMotion ? "none" : `service-system-float-${index % 4} ${2.8 + (index % 4) * 0.4}s ease-in-out infinite`,
                  animationDelay: `${index * 90}ms`,
                }}
              />
            ))}
            <div className="absolute inset-0 rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(255,255,255,0.03)_60%,transparent_100%)]" />
          </div>
        </div>
      </div>
    </SceneShell>
  )
}

function SceneVisual({
  index,
  progress,
  reducedMotion,
}: {
  index: number
  progress: number
  reducedMotion: boolean
}) {
  const distance = index - progress
  const absDistance = Math.abs(distance)
  const enter = clamp(1 - absDistance, 0, 1)

  return (
    <div
      className="relative h-full rounded-[2rem]"
      style={{
        transform: `translate3d(0, ${distance * 30 + lerp(28, 0, enter)}px, 0) scale(${lerp(0.91, 1, enter)})`,
        opacity: absDistance > 1.2 ? 0 : lerp(0.56, 1, enter),
      }}
    >
      {index === 0 ? (
        <ProductBuildVisual strength={enter} reducedMotion={reducedMotion} />
      ) : index === 1 ? (
        <VisibilityVisual strength={enter} reducedMotion={reducedMotion} />
      ) : (
        <SystemsLayerVisual strength={enter} reducedMotion={reducedMotion} />
      )}
    </div>
  )
}

function ScenePanel({
  scene,
  index,
  progress,
  reducedMotion,
}: {
  scene: FruityScene
  index: number
  progress: number
  reducedMotion: boolean
}) {
  const distance = Math.abs(index - progress)
  const isActive = distance < 0.5
  const visibility = clamp(1 - distance * 1.5, 0, 1)
  const opacity = visibility < 0.12 ? 0 : lerp(0.65, 1, visibility)
  const lift = lerp(18, 0, clamp(1 - distance, 0, 1))
  const isVisibilityScene = index === 1

  return (
    <div
      className="absolute inset-0 p-4 sm:p-6 lg:p-8"
      style={{
        opacity,
        transform: `translate3d(0, ${lift}px, 0)`,
        pointerEvents: isActive ? "auto" : "none",
      }}
    >
      <div className="grid h-full items-center gap-6 lg:grid-cols-[1.04fr_0.96fr]">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">{scene.eyebrow}</p>
          <div className={cn(isVisibilityScene ? "lg:flex lg:justify-center" : "")}>
            <AnimatedSceneTitle title={scene.title} active={isActive} />
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">{scene.summary}</p>
          <div className="grid gap-2 sm:max-w-xl sm:grid-cols-3">
            {scene.bullets.map((bullet, bulletIndex) => (
              <div
                key={bullet}
                className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-sm leading-6 text-card-foreground transition-all duration-500 ease-out"
                style={{
                  transform: `translateY(${isActive ? 0 : 12 + bulletIndex * 4}px)`,
                  transitionDelay: `${bulletIndex * 80}ms`,
                }}
              >
                {bullet}
              </div>
            ))}
          </div>
        </div>

        <SceneVisual index={index} progress={progress} reducedMotion={reducedMotion} />
      </div>
    </div>
  )
}

function MobileSceneCard({
  scene,
  index,
  reducedMotion,
}: {
  scene: FruityScene
  index: number
  reducedMotion: boolean
}) {
  return (
    <section className="rounded-[2rem] border border-border/70 bg-card/96 p-4 shadow-[0_24px_60px_rgba(2,6,23,0.18)] sm:p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">{scene.eyebrow}</p>
        <AnimatedSceneTitle title={scene.title} active />
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{scene.summary}</p>
      </div>

      <div className="mb-4 rounded-[1.75rem] border border-border/60 bg-background/60">
        <div className="h-[320px] overflow-hidden sm:h-[280px]">
          {index === 0 ? (
            <ProductBuildVisual strength={1} reducedMotion={reducedMotion} />
          ) : index === 1 ? (
            <VisibilityVisual strength={1} reducedMotion={reducedMotion} />
          ) : (
            <SystemsLayerVisual strength={1} reducedMotion={reducedMotion} />
          )}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {scene.bullets.map((bullet) => (
          <div
            key={bullet}
            className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-sm leading-6 text-card-foreground"
          >
            {bullet}
          </div>
        ))}
      </div>
    </section>
  )
}

export function ServicesFruityShowcase({ scenes }: ServicesFruityShowcaseProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const reducedMotion = useReducedMotion()
  const [state, setState] = useState({ progress: 0 })

  useEffect(() => {
    if (reducedMotion) {
      setState({ progress: 0 })
      return
    }

    let frame = 0

    const update = () => {
      const wrapper = wrapperRef.current
      if (!wrapper) return

      const rect = wrapper.getBoundingClientRect()
      const start = window.scrollY + rect.top
      const rawProgress = (window.scrollY - start) / (window.innerHeight * 0.88)
      const clampedProgress = clamp(rawProgress, 0, Math.max(0, scenes.length - 1))
      setState({ progress: clampedProgress })
    }

    const schedule = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [reducedMotion, scenes.length])

  const jumpToScene = (index: number) => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const top = wrapper.getBoundingClientRect().top + window.scrollY
    window.scrollTo({
      top: top + index * window.innerHeight,
      behavior: reducedMotion ? "auto" : "smooth",
    })
  }

  return (
    <>
    <section ref={wrapperRef} className="relative mt-8">
        <div className="relative hidden lg:block" style={{ height: `${Math.max(1, scenes.length) * 92}svh` }}>
          <div className="sticky top-24 h-[calc(100svh-7rem)]">
            <div className="relative h-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_42%),linear-gradient(135deg,rgba(251,146,60,0.04),transparent_42%,rgba(59,130,246,0.05))]" />
              <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.45)_1px,transparent_0)] [background-size:24px_24px] dark:opacity-[0.08]" />

              <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2 sm:left-6 sm:top-6">
                {scenes.map((scene, index) => {
                  const active = Math.round(state.progress) === index
                  return (
                    <button
                      key={scene.title}
                      type="button"
                      onClick={() => jumpToScene(index)}
                      className={cn(
                        "relative overflow-hidden rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition",
                        active
                          ? "border-[color:var(--accent)]/35 bg-[color:var(--accent)]/12 text-[color:var(--accent)]"
                          : "border-border/60 bg-background/70 text-muted-foreground hover:border-[color:var(--accent)]/30 hover:text-card-foreground",
                      )}
                    >
                      {active ? (
                        <span className="absolute inset-0 rounded-full border border-[color:var(--accent)]/20 opacity-20" />
                      ) : null}
                      <span className="relative">{scene.eyebrow}</span>
                    </button>
                  )
                })}
              </div>

              <div className="relative h-full">
                {scenes.map((scene, index) => (
                  <ScenePanel
                    key={scene.title}
                    scene={scene}
                    index={index}
                    progress={state.progress}
                    reducedMotion={reducedMotion}
                  />
                ))}
              </div>

              <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 sm:bottom-6">
                <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-2 shadow-[0_14px_32px_rgba(2,6,23,0.12)] backdrop-blur">
                  {scenes.map((scene, index) => {
                    const active = Math.round(state.progress) === index
                    return (
                      <button
                        key={scene.title}
                        type="button"
                        onClick={() => jumpToScene(index)}
                        className={cn(
                          "h-2.5 rounded-full transition-all duration-300",
                          active ? "w-10 bg-[color:var(--accent)]" : "w-2.5 bg-border/80 hover:bg-[color:var(--accent)]/45",
                        )}
                        aria-label={scene.title}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:hidden">
          {scenes.map((scene, index) => (
            <MobileSceneCard key={scene.title} scene={scene} index={index} reducedMotion={reducedMotion} />
          ))}
        </div>
      </section>

      <style jsx global>{`
        @keyframes service-board-field {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          22% {
            transform: translate3d(-8px, -12px, 0) scale(1.02);
          }
          50% {
            transform: translate3d(10px, 8px, 0) scale(1.05);
          }
          75% {
            transform: translate3d(-6px, 14px, 0) scale(1.01);
          }
        }

        @keyframes service-board-scan {
          0% {
            transform: translate3d(0, 0, 0) scale(0.98);
            box-shadow: 0 0 0 rgba(255, 122, 61, 0);
          }
          50% {
            transform: translate3d(0, -1px, 0) scale(1.04);
            box-shadow: 0 0 18px rgba(255, 122, 61, 0.22);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(0.98);
            box-shadow: 0 0 0 rgba(255, 122, 61, 0);
          }
        }

        @keyframes service-board-fire {
          0%,
          100% {
            transform: scale(0.96);
            filter: saturate(1.05) brightness(0.95);
          }
          50% {
            transform: scale(1.08);
            filter: saturate(1.2) brightness(1.1);
          }
        }

        @keyframes service-board-home {
          0%,
          100% {
            transform: scale(0.98);
            opacity: 0.92;
          }
          50% {
            transform: scale(1.04);
            opacity: 1;
          }
        }

        @keyframes service-board-douse {
          0%,
          100% {
            transform: scale(0.97);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }

        @keyframes service-board-dig {
          0%,
          100% {
            transform: scale(0.96);
            opacity: 0.86;
          }
          42% {
            transform: scale(1.06);
            opacity: 1;
          }
        }

        @keyframes service-line-drift {
          0% {
            stroke-dashoffset: 0;
            transform: translate3d(0, 0, 0);
          }
          50% {
            stroke-dashoffset: -60;
            transform: translate3d(2px, -2px, 0);
          }
          100% {
            stroke-dashoffset: -120;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes service-system-bob {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -16px, 0);
          }
        }

        @keyframes service-system-float-0 {
          0%,
          100% {
            transform: translate3d(-50%, -50%, 0) translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-50%, -50%, 0) translate3d(34px, -26px, 0);
          }
        }

        @keyframes service-system-float-1 {
          0%,
          100% {
            transform: translate3d(-50%, -50%, 0) translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-50%, -50%, 0) translate3d(-30px, 26px, 0);
          }
        }

        @keyframes service-system-float-2 {
          0%,
          100% {
            transform: translate3d(-50%, -50%, 0) translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-50%, -50%, 0) translate3d(26px, 32px, 0);
          }
        }

        @keyframes service-system-float-3 {
          0%,
          100% {
            transform: translate3d(-50%, -50%, 0) translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-50%, -50%, 0) translate3d(-24px, -24px, 0);
          }
        }

        @keyframes service-bounce-drift {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          22% {
            transform: translate3d(10px, -12px, 0);
          }
          48% {
            transform: translate3d(-12px, 14px, 0);
          }
          74% {
            transform: translate3d(8px, 10px, 0);
          }
        }
      `}</style>
    </>
  )
}
