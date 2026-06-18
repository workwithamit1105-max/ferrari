import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const numRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const state = { val: 0 }
      gsap.to(state, {
        val: value,
        duration: 2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: numRef.current,
          start: 'top 95%',
        },
        onUpdate: () => {
          if (numRef.current) {
            numRef.current.innerHTML =
              value % 1 === 0
                ? Math.round(state.val).toLocaleString()
                : state.val.toFixed(1)
          }
        },
      })
    }, numRef)
    return () => ctx.revert()
  }, [value])

  return (
    <div style={{ flex: '1 1 160px' }}>
      <div style={{
        fontSize: 'clamp(24px, 3vw, 36px)',
        color: 'white',
        letterSpacing: '0.02em',
        fontFamily: 'var(--font-display)',
      }}>
        <span ref={numRef}>0</span>{suffix}
      </div>
      <div style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.55)', marginTop: '8px', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>
        {label}
      </div>
    </div>
  )
}

export default function BuiltForDriverSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLImageElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: labelRef.current, start: 'top 80%' },
        }
      )

      gsap.fromTo(
        statsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="performance"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-void)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <div style={{ position: 'absolute', inset: -60, zIndex: 0 }}>
        <img
          ref={bgRef}
          src="/assets/engine-v12-red.png"
          alt="PARFMAN V12 Engine"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', willChange: 'transform' }}
        />
      </div>

      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.1) 60%)', zIndex: 1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 50%)', zIndex: 1, pointerEvents: 'none' }} />

      {/* Section label floats above the dark bar */}
      <div ref={labelRef} style={{ position: 'relative', zIndex: 10, padding: 'clamp(40px, 8vw, 60px) clamp(24px, 6vw, 96px) 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'white', opacity: 0.5 }}>05</span>
          <div style={{ width: '24px', height: '1px', background: 'var(--red-primary)' }} />
          <span className="section-label">PERFORMANCE</span>
        </div>
      </div>

      {/* Dark red stats bar */}
      <div
        ref={statsRef}
        style={{
          position: 'relative',
          zIndex: 10,
          backgroundColor: '#5a0015',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: 'clamp(36px, 5vw, 72px) clamp(24px, 6vw, 96px)',
        }}
      >
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 4vw, 52px)',
          color: 'white',
          margin: '0 0 20px 0',
          fontWeight: 400,
        }}>
          Built for the driver.
        </h2>

        <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.12)', marginBottom: '36px' }} />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(32px, 5vw, 64px)', alignItems: 'flex-start' }}>
          <AnimatedStat value={820} suffix=" BHP" label="POWER" />
          <AnimatedStat value={2.4} suffix=" SEC" label="0–100 KM/H" />
          <AnimatedStat value={340} suffix=" KM/H" label="TOP SPEED" />
          <AnimatedStat value={1280} suffix=" KG" label="DRY WEIGHT" />
        </div>
      </div>
    </section>
  )
}
