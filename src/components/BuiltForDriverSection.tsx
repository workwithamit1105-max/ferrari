import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

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
            if (value % 1 === 0) {
              numRef.current.innerHTML = Math.round(state.val).toLocaleString()
            } else {
              numRef.current.innerHTML = state.val.toFixed(1)
            }
          }
        },
      })
    }, numRef)
    return () => ctx.revert()
  }, [value])

  return (
    <div>
      <div
        style={{
          fontSize: 'clamp(24px, 3vw, 32px)',
          color: 'white',
          letterSpacing: '0.05em',
          fontFamily: 'var(--font-display)',
        }}
      >
        <span ref={numRef}>0</span>
        {suffix}
      </div>
      <div
        style={{
          fontSize: '10px',
          letterSpacing: '0.25em',
          color: 'rgba(255,255,255,0.5)',
          marginTop: '8px',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-body)',
        }}
      >
        {label}
      </div>
    </div>
  )
}

export default function BuiltForDriverSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax Background
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

      // Content fade in
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
        },
      })

      tl.fromTo(contentRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
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

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 60%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 50%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          padding: 'clamp(40px, 8vw, 60px) clamp(24px, 6vw, 96px)',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'white', opacity: 0.6 }}>05</span>
          <div style={{ width: '24px', height: '1px', background: 'var(--red-primary)' }} />
          <span className="section-label">PERFORMANCE</span>
        </div>
      </div>

      <div
        ref={contentRef}
        style={{
          position: 'relative',
          zIndex: 10,
          backgroundColor: '#6B0018',
          padding: 'clamp(40px, 6vw, 80px) clamp(24px, 6vw, 96px)',
          width: '100%',
        }}
        className="will-change-transform"
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 56px)',
            color: 'white',
            margin: '0 0 24px 0',
            fontWeight: 400,
          }}
        >
          Built for the driver.
        </h2>

        <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: '32px' }} />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(32px, 5vw, 64px)',
            alignItems: 'center',
          }}
        >
          <AnimatedStat value={820} suffix=" BHP" label="POWER" />
          <AnimatedStat value={2.4} suffix=" SEC" label="0–100 KM/H" />
          <AnimatedStat value={340} suffix=" KM/H" label="TOP SPEED" />
          <AnimatedStat value={1280} suffix=" KG" label="DRY WEIGHT" />
        </div>
      </div>
    </section>
  )
}
