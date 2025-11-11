'use client'

import { useEffect, useMemo, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadAll } from '@tsparticles/all'            // همه پلاگین‌ها (polygon mask، …)
import type { ISourceOptions } from '@tsparticles/engine'

export default function ParticlesAI() {
  const [ready, setReady] = useState(false)

  // فقط یکبار در عمر اپ اجرا شود (init engine)
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadAll(engine)
    }).then(() => setReady(true))
  }, [])

const options = useMemo<ISourceOptions>(() => ({
  background: { color: 'transparent' },
  detectRetina: true,
  fpsLimit: 60,
  fullScreen: { enable: false },

  // اگر SVG تو مسیرهای بسته دارد، از inside استفاده کن تا لوگو توپر شود
  // اگر لوگو فقط Stroke است و داخل ندارد، 'inline' را نگه دار.
  polygon: {
    enable: true,
    scale: 1,
    type: 'inside',               // <— توپر؛ اگر خروجی نداد، 'inline' بگذار
    move: { radius: 3 },          // لرزش خیلی کم
    url: '/pardis-mask.svg',
    inline: { arrangement: 'equidistant' },
    draw: { enable: false },
    clip: false                    // ذرات بیرون شکل، رندر نشوند
  },

  particles: {
    number: { value: 1100 },      // کمی بیشتر برای پر شدن شکل
    color: { value: ['#000000', '#3d3d3d'] },
    opacity: {
      value: 0.45,
      animation: { enable: true, speed: 0.25, minimumValue: 0.25, sync: false }
    },
    size: { value: { min: 1, max: 2 } },
    move: {
      enable: true,
      speed: 1,                // آهسته تا بعد از repulse برگردند
      direction: 'none',
      outModes: { default: 'bounce' }
    },
    links: { enable: false }
  },

  interactivity: {
    // مهم: فقط داخل بوم، تا اختلاف مختصات ایجاد نشود
    detectsOn: 'canvas',
    events: {
      onHover: { enable: true, mode: 'repulse' },  // bubble حذف شد برای مینیمال بودن
      resize: true
    },
    modes: {
      // شعاع/قدرت/مدت کم تا پاشش ظریف باشد و سریع برگردد
      repulse: { distance: 20, duration: 0.1, factor: 15 }
    }
  }
}), [])


  if (!ready) return null

  return (
    <Particles
      id="pardisParticles"
      className="absolute inset-0 z-10"          // z-index را بالاتر از گرادیان بگذار
      options={options}
    />
  )
}
