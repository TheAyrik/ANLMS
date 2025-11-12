// hero-particles-canvas.tsx
'use client'
import { useEffect, useRef } from 'react'

type HeroParticlesCanvasProps = {
  text?: string
  className?: string
}

export default function HeroParticlesCanvas({ text = 'AI', className }: HeroParticlesCanvasProps) {
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

    const cfg = {
      density: 0.25,
      sampleStep: 2,
      sizeMin: 1.5,
      sizeMax: 2.8,
      speed: 0.08,
      floatAmp: 5,
      floatFreq: 0.0025,
      mouseRepel: 70,         // ← نصف شد
      damping: 0.9,
      spawnRadius: 55,
      targetJitter: 24,        // پخش شدن بیشتر در حالت عادی
      stars: 80,
    }

    const mouse = { x: -9999, y: -9999 }
    let maskImage: HTMLImageElement | null = null
    let maskLoaded = false

    const createOffscreen = (w: number, h: number) => {
      if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h)
      const off = document.createElement('canvas')
      off.width = w
      off.height = h
      return off
    }

    const loadMask = () =>
      new Promise<void>(resolve => {
        const img = new Image()
        img.decoding = 'async'
        img.src = '/pardis-mask.svg'
        img.onload = () => {
          maskImage = img
          maskLoaded = true
          resolve()
        }
        img.onerror = () => resolve()
      })

    const buildMaskSilhouette = () => {
      if (!width || !height) return null
      const off = createOffscreen(width, height)
      const octx = off.getContext('2d', { willReadFrequently: true } as any)
      if (!octx) return null
      octx.clearRect(0, 0, width, height)
      if (maskLoaded && maskImage) {
        const { naturalWidth, naturalHeight } = maskImage
        const scale = Math.min(width / naturalWidth, height / naturalHeight) * 0.7
        const drawWidth = naturalWidth * scale
        const drawHeight = naturalHeight * scale
        const dx = (width - drawWidth) / 2
        const dy = (height - drawHeight) / 2
        octx.drawImage(maskImage, 0, 0, naturalWidth, naturalHeight, dx, dy, drawWidth, drawHeight)
      } else {
        octx.fillStyle = '#fff'
        octx.textAlign = 'center'
        octx.textBaseline = 'middle'
        const fontSize = Math.min(width, height) * 1
        octx.font = `900 ${fontSize}px system-ui,Roboto`
        octx.fillText(text, width / 2, height / 2)
      }
      return octx.getImageData(0, 0, width, height).data
    }

    class Particle {
      x: number; y: number; tx: number; ty: number; color: string
      vx = 0; vy = 0; sz: number; ph: number
      constructor(x: number, y: number, color: string) {
        const a = Math.random() * Math.PI * 2
        const r = cfg.spawnRadius * Math.random()
        this.x = x + Math.cos(a) * r
        this.y = y + Math.sin(a) * r
        this.tx = x; this.ty = y
        this.sz = cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin)
        this.ph = Math.random() * Math.PI * 2
        this.color = color
      }
      step(dt: number) {
        const ax = (this.tx - this.x) * cfg.speed
        const ay = (this.ty - this.y) * cfg.speed
        this.vx = (this.vx + ax) * cfg.damping
        this.vy = (this.vy + ay) * cfg.damping
        const dx = this.x - mouse.x
        const dy = this.y - mouse.y
        const d2 = dx * dx + dy * dy
        const r = (cfg.mouseRepel * dpr) ** 2
        if (d2 < r) {
          const f = 1 - d2 / r
          this.vx += dx * 0.12 * f
          this.vy += dy * 0.12 * f
        }
        const t = performance.now()
        const wind = Math.cos((t + this.ph * 1000) * 0.0005) * 0.02
        this.vx += wind * dt
        this.x += this.vx * dt
        this.y += this.vy * dt
      }
      draw(now: number) {
        const bob = Math.sin(now * cfg.floatFreq + this.ph) * cfg.floatAmp
        const py = this.y + bob
        ctx.beginPath()
        ctx.arc(this.x, py, this.sz, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    class Star {
      x!: number; y!: number; r!: number; s!: number
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.r = Math.random() * 1.2 + 0.3
        this.s = (Math.random() * 0.3 + 0.1) * dpr
      }
      step(dt: number) {
        this.y += this.s * dt * 20
        if (this.y > height) this.reset()
      }
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    let particles: Particle[] = []
    let stars: Star[] = []

    const rebuildParticles = () => {
      const img = buildMaskSilhouette()
      if (!img) return
      const targets: { x: number; y: number; color: string }[] = []
      for (let y = 0; y < height; y += cfg.sampleStep) {
        for (let x = 0; x < width; x += cfg.sampleStep) {
          const i = (y * width + x) * 4 + 3
          if (img[i] > 20 && Math.random() < cfg.density) {
            const r = img[i - 3]
            const g = img[i - 2]
            const b = img[i - 1]
            const a = img[i] / 255
            const color = `rgba(${r},${g},${b},${a.toFixed(2)})`
            const jitterX = Math.max(0, Math.min(width, x + (Math.random() - 0.5) * cfg.targetJitter))
            const jitterY = Math.max(0, Math.min(height, y + (Math.random() - 0.5) * cfg.targetJitter))
            targets.push({ x: jitterX, y: jitterY, color })
          }
        }
      }
      particles = targets.map(p => new Particle(p.x, p.y, p.color))
      stars = Array.from({ length: cfg.stars }, () => new Star())
    }

    const resize = () => {
      const parent = canvas.parentElement ?? canvas
      const rect = parent.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      dpr = Math.min(window.devicePixelRatio ?? 1, 2)
      width = Math.floor(rect.width * dpr)
      height = Math.floor(rect.height * dpr)
      canvas.width = width
      canvas.height = height
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      rebuildParticles()
    }

    // ← به جای canvas، از window شنود می‌کنیم تا حتی زیر محتوا هم کار کند
    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = (e.clientX - rect.left) * dpr
      mouse.y = (e.clientY - rect.top) * dpr
    }
    const resetMouse = () => { mouse.x = mouse.y = -9999 }

    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(resize)
      ro.observe(canvas.parentElement ?? canvas)
    } else {
      window.addEventListener('resize', resize)
    }
    resize()

    loadMask().then(() => {
      if (!running) return
      if (!width || !height) {
        resize()
      } else {
        rebuildParticles()
      }
    })

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerleave', resetMouse)

    let last = performance.now()
    const frame = (now: number) => {
      if (!running) return
      const dt = Math.min(1, (now - last) / (1000 / 60))
      last = now

      ctx.clearRect(0, 0, width, height)

      // ستاره‌ها
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      for (const s of stars) { s.step(dt); s.draw() }

      // ذرات متن
      for (const p of particles) {
        ctx.fillStyle = p.color
        p.step(dt)
        p.draw(now)
      }

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      ro?.disconnect()
      if (!ro) window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', resetMouse)
    }
  }, [text])

  return <canvas ref={canvasRef} className={`absolute inset-0 ${className ?? ''}`} />
}
