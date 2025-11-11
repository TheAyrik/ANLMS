'use client'
import Particles from '@tsparticles/react'
import { loadAll } from '@tsparticles/all'
import { useCallback } from 'react'
import type { Engine } from '@tsparticles/engine'

export default function ParticlesAI() {
  const init = useCallback(async (engine: Engine) => {
    await loadAll(engine)
  }, [])

  return (
    <Particles
      id="pardisParticles"
      init={init}
      className="absolute inset-0 z-0"
      options={{
        background: { color: 'transparent' },
        detectRetina: true,
        fpsLimit: 60,
        polygon: {
          enable: true,
          scale: 1,
          type: 'inline',
          move: { radius: 6 },
          url: '/pardis-mask.svg',  // همون لوگوی رسمی که آپلود کردی
          inline: { arrangement: 'equidistant' },
          draw: { enable: false }
        },
        particles: {
          number: { value: 800 },
          color: { value: ['#13b5de', '#208ea8'] },
          opacity: {
            value: 0.35,
            anim: { enable: true, speed: 0.4, minimumValue: 0.15, sync: false }
          },
          size: { value: { min: 1, max: 2 } },
          move: { enable: true, speed: 0.9, direction: 'none', outModes: { default: 'bounce' } },
          links: { enable: false }
        },
        interactivity: {
          detectsOn: 'window',
          events: {
            onHover: [
              { enable: true, mode: 'repulse' },
              { enable: true, mode: 'bubble' }
            ],
            resize: true
          },
          modes: {
            repulse: { distance: 120, duration: 0.3 },
            bubble:  { distance: 130, size: 3.2, duration: 0.3, opacity: 0.5 }
          },
          parallax: { enable: true, force: 50, smooth: 10 }
        }
      }}
    />
  )
}
