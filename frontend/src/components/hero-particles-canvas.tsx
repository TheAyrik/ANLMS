'use client'
import { useEffect, useRef } from 'react'

type HeroParticlesCanvasProps = {
  text?: string
}

export default function HeroParticlesCanvas({ text = 'AI' }: HeroParticlesCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let dpr = Math.min(window.devicePixelRatio ?? 1, 2)
    let width = 0
    let height = 0
    let raf: number | null = null
    let running = true
    let particles: Particle[] = []
    const mouse = { x: -9999, y: -9999 }

    const createOffscreen = (w: number, h: number) => {
      if (typeof OffscreenCanvas !== 'undefined') {
        return new OffscreenCanvas(w, h)
      }
      const off = document.createElement('canvas')
      off.width = w
      off.height = h
      return off
    }

    const buildTextSilhouette = () => {
      if (!width || !height) return null
      const off = createOffscreen(width, height)
      const octx = off.getContext('2d')
      if (!octx) return null
      octx.clearRect(0, 0, width, height)
      octx.fillStyle = '#fff'
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'
      const fontSize = Math.min(width, height) * 0.6
      octx.font = `900 ${fontSize}px system-ui,Roboto`
      octx.fillText(text, width / 2, height / 2)
      return octx.getImageData(0, 0, width, height).data
    }

    class Particle {
      constructor(
        public x: number,
        public y: number,
        public tx = x,
        public ty = y,
        public vx = 0,
        public vy = 0,
      ) {}

      step(dt: number) {
        const ax = (this.tx - this.x) * 0.08
        const ay = (this.ty - this.y) * 0.08
        this.vx = (this.vx + ax) * 0.9
        this.vy = (this.vy + ay) * 0.9
        const dx = this.x - mouse.x
        const dy = this.y - mouse.y
        const d2 = dx * dx + dy * dy
        const r = (110 * dpr) ** 2
        if (d2 < r) {
          const f = 1 - d2 / r
          this.vx += dx * 0.12 * f
          this.vy += dy * 0.12 * f
        }
        this.x += this.vx * dt
        this.y += this.vy * dt
      }

      draw(t: number) {
        const bob = Math.sin(t * 0.003 + this.y * 0.01) * 4
        ctx.beginPath()
        ctx.arc(this.x, this.y + bob, 2.2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const rebuildParticles = () => {
      const img = buildTextSilhouette()
      if (!img) return
      const targets: { x: number; y: number }[] = []
      const step = 3
      const density = 0.45
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const i = (y * width + x) * 4 + 3
          if (img[i] > 20 && Math.random() < density) {
            targets.push({ x, y })
          }
        }
      }
      particles = targets.map(p => new Particle(p.x, p.y))
    }

    const resize = () => {
      const parent = canvas.parentElement ?? canvas
      const rect = parent.getBoundingClientRect()
      if (!rect.width || !rect.height) {
        return
      }
      dpr = Math.min(window.devicePixelRatio ?? 1, 2)
      width = Math.floor(rect.width * dpr)
      height = Math.floor(rect.height * dpr)
      canvas.width = width
      canvas.height = height
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      rebuildParticles()
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = (event.clientX - rect.left) * dpr
      mouse.y = (event.clientY - rect.top) * dpr
    }

    const resetMouse = () => {
      mouse.x = mouse.y = -9999
    }

    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(resize)
      ro.observe(canvas.parentElement ?? canvas)
    } else {
      window.addEventListener('resize', resize)
    }
    resize()

    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerleave', resetMouse)

    let last = performance.now()
    const frame = (now: number) => {
      if (!running) return
      const dt = Math.min(1, (now - last) / (1000 / 60))
      last = now
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = 'rgba(200,230,255,0.95)'
      for (const particle of particles) {
        particle.step(dt)
        particle.draw(now)
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      ro?.disconnect()
      if (!ro) {
        window.removeEventListener('resize', resize)
      }
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerleave', resetMouse)
    }
  }, [text])

  return <canvas ref={canvasRef} className="absolute inset-0" />
}
