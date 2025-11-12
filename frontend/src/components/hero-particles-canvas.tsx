'use client'
import { useEffect, useRef } from 'react'

type Props = {
  text?: string
  className?: string
}

export default function HeroParticlesCanvas({ text = 'AI', className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // -------- config --------
    const cfg = {
      density: 0.35,       // احتمال انتخاب پیکسل برای تبدیل به ذره
      sampleStep: 2,       // گام نمونه‌برداری پیکسل‌ها
      size: [1.5, 2.8],    // بازه شعاع ذرات
      speed: 0.08,         // شدت بازگشت به هدف
      floatAmp: 5,         // دامنه‌ی شناوری
      floatFreq: 0.0025,   // فرکانس شناوری
      mouseRepel: 100,     // شعاع دافعه کرسر (px)
      cursorAttract: 0.018,// میلِ ملایم به سمت کرسر وقتی دور است
      cursorFarFactor: 1.4 // اعمال attraction وقتی فاصله > mouseRepel * این مقدار
    }

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let W = 1, H = 1, running = true
    let particles: Particle[] = []
    let targets: { x: number; y: number }[] = []

    const mouse = { x: -9999, y: -9999 }

    // ---------- sizing to container (not window) ----------
    function fit() {
      const rect = canvas.getBoundingClientRect()
      W = Math.max(1, Math.floor(rect.width * dpr))
      H = Math.max(1, Math.floor(rect.height * dpr))
      canvas.width = W
      canvas.height = H
    }

    function getOffscreen(width: number, height: number): CanvasRenderingContext2D {
      // OffscreenCanvas fallback
      const off: HTMLCanvasElement | OffscreenCanvas =
        'OffscreenCanvas' in window ? new (window as any).OffscreenCanvas(width, height) : document.createElement('canvas')
      ;(off as HTMLCanvasElement).width = width
      ;(off as HTMLCanvasElement).height = height
      const octx = (off as any).getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
      return octx
    }

    function drawTextSilhouette(w: number, h: number) {
      const octx = getOffscreen(w, h)
      octx.clearRect(0, 0, w, h)
      octx.fillStyle = '#fff'
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'
      octx.font = `900 ${Math.min(w, h) * 0.55}px system-ui,Roboto`;
      octx.fillText(text, w / 2, h / 2)
      const img = octx.getImageData(0, 0, w, h).data
      return img
    }

    function extractTargets(w: number, h: number) {
      const img = drawTextSilhouette(w, h)
      const step = cfg.sampleStep
      const pts: { x: number; y: number }[] = []
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const a = (y * w + x) * 4 + 3 // آلفا
          if (img[a] > 20 && Math.random() < cfg.density) pts.push({ x, y })
        }
      }
      return pts
    }

    class Particle {
      x: number; y: number; tx: number; ty: number; vx = 0; vy = 0; sz: number; ph: number
      constructor(x: number, y: number) {
        const a = Math.random() * Math.PI * 2
        const r = 40 * Math.random()
        this.x = x + Math.cos(a) * r
        this.y = y + Math.sin(a) * r
        this.tx = x; this.ty = y
        this.sz = cfg.size[0] + Math.random() * (cfg.size[1] - cfg.size[0])
        this.ph = Math.random() * Math.PI * 2
      }
      step(dt: number) {
        // جذب به هدف (حفظ شکل)
        const ax = (this.tx - this.x) * cfg.speed
        const ay = (this.ty - this.y) * cfg.speed
        this.vx += ax; this.vy += ay

        // میرایی
        this.vx *= 0.9; this.vy *= 0.9

        // تعامل با کرسر
        const dx = this.x - mouse.x, dy = this.y - mouse.y
        const d2 = dx * dx + dy * dy
        const repelR2 = cfg.mouseRepel * cfg.mouseRepel
        if (d2 < repelR2) {
          // دافعه (نزدیک)
          const f = 1 - d2 / repelR2
          this.vx += dx * 0.12 * f
          this.vy += dy * 0.12 * f
        } else {
          // میل ملایم به سمت کرسر (دور)
          const d = Math.sqrt(d2) || 1
          const far = cfg.mouseRepel * cfg.cursorFarFactor
          if (d > far) {
            const ux = (mouse.x - this.x) / d
            const uy = (mouse.y - this.y) / d
            const w = Math.min(1, (d - far) / Math.max(W, H))
            this.vx += ux * cfg.cursorAttract * (0.5 + 0.5 * w)
            this.vy += uy * cfg.cursorAttract * (0.5 + 0.5 * w)
          }
        }

        // انتگرال‌گیری
        this.x += this.vx * dt
        this.y += this.vy * dt
      }
      draw(t: number) {
        const bob = Math.sin(t * cfg.floatFreq + this.ph) * cfg.floatAmp
        const px = this.x, py = this.y + bob
        ctx!.beginPath()
        ctx!.arc(px, py, this.sz, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    function rebuild() {
      targets = extractTargets(W, H)
      particles = targets.map(p => new Particle(p.x, p.y))
    }

    // ---------- events ----------
    function onMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect()
      // نگاشت مختصات ماوس به مقیاس پیکسلیِ کانواس (نه CSS)
      mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width)
      mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height)
    }
    function onMouseLeave() {
      mouse.x = mouse.y = -9999
    }

    const ro = new ResizeObserver(() => {
      fit()
      rebuild()
    })

    // ---------- boot ----------
    fit()
    rebuild()

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)
    ro.observe(canvas)

    let last = performance.now()
    function frame(now: number) {
      if (!running) return
      const dt = Math.min(1, (now - last) / (1000 / 60))
      last = now
      ctx!.clearRect(0, 0, W, H)

      // (اختیاری) اگر پس‌زمینه می‌خواهی اینجا بکش؛ فعلاً ساده نگه می‌داریم
      ctx!.fillStyle = 'rgba(200,230,255,0.95)'
      for (const p of particles) {
        p.step(dt)
        p.draw(now)
      }
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)

    // ---------- cleanup ----------
    return () => {
      running = false
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      ro.disconnect()
    }
  }, [text])

  return <canvas ref={canvasRef} className={['absolute inset-0', className].filter(Boolean).join(' ')} />
}
