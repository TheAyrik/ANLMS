'use client'
import { useEffect, useRef } from 'react'

export default function HeroParticlesCanvas({ text = 'AI' }: { text?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let W = window.innerWidth * dpr
    let H = window.innerHeight * dpr
    let running = true
    const mouse = { x: -9999, y: -9999 }

    function fit() {
      W = window.innerWidth * dpr
      H = window.innerHeight * dpr
      canvas.width = W
      canvas.height = H
    }

    function drawTextSilhouette() {
      const off = new OffscreenCanvas(W, H)
      const octx = off.getContext('2d')!
      octx.clearRect(0, 0, W, H)
      octx.fillStyle = '#fff'
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'
      octx.font = `900 ${Math.min(W, H) * 0.45}px system-ui,Roboto`
      octx.fillText(text, W / 2, H / 2)
      return octx.getImageData(0, 0, W, H).data
    }

    class Particle {
      constructor(public x: number, public y: number, public tx: number, public ty: number, public vx = 0, public vy = 0) {}
      step(dt: number) {
        const ax = (this.tx - this.x) * 0.08
        const ay = (this.ty - this.y) * 0.08
        this.vx += ax; this.vy += ay
        this.vx *= 0.9; this.vy *= 0.9
        const dx = this.x - mouse.x, dy = this.y - mouse.y
        const d2 = dx * dx + dy * dy
        const r = 100 * 100
        if (d2 < r) {
          const f = (1 - d2 / r)
          this.vx += dx * 0.12 * f; this.vy += dy * 0.12 * f
        }
        this.x += this.vx * dt
        this.y += this.vy * dt
      }
      draw(t: number) {
        const bob = Math.sin(t * 0.0025 + this.y * 0.01) * 5
        ctx.beginPath()
        ctx.arc(this.x, this.y + bob, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    fit()
    const img = drawTextSilhouette()
    const step = 2, density = 0.35
    const targets: { x: number; y: number }[] = []
    for (let y = 0; y < H; y += step)
      for (let x = 0; x < W; x += step) {
        const i = (y * W + x) * 4 + 3
        if (img[i] > 20 && Math.random() < density) targets.push({ x, y })
      }

    const particles = targets.map(p => new Particle(p.x, p.y, p.x, p.y))

    window.addEventListener('resize', fit)
    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX * dpr
      mouse.y = e.clientY * dpr
    })
    window.addEventListener('mouseleave', () => (mouse.x = mouse.y = -9999))

    let last = performance.now()
    function frame(now: number) {
      if (!running) return
      const dt = Math.min(1, (now - last) / (1000 / 60))
      last = now
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = 'rgba(200,230,255,0.95)'
      for (const p of particles) {
        p.step(dt)
        p.draw(now)
      }
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)

    return () => {
      running = false
      window.removeEventListener('resize', fit)
      window.removeEventListener('mousemove', () => {})
    }
  }, [text])

  return <canvas ref={canvasRef} className="absolute inset-0" />
}
