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
          start: 'top 85%',
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
          fontSize: 'clamp(28px, 4vw, 36px)',
          color: 'white',
          fontFamily: 'var(--font-display)',
        }}
      >
        <span ref={numRef}>0</span>
        {suffix}
      </div>
      <div style={{ width: '32px', height: '1px', background: 'var(--red-primary)', margin: '12px 0' }} />
      <div
        style={{
          fontSize: '10px',
          letterSpacing: '0.25em',
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-body)',
        }}
      >
        {label}
      </div>
    </div>
  )
}

export default function EngineeringSection() {
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
      id="engineering"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-void)',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <div style={{ position: 'absolute', inset: -60, zIndex: 0 }}>
        <img
          ref={bgRef}
          src="/assets/engine-cover.png"
          alt="Engine"
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
        ref={contentRef}
        style={{
          position: 'relative',
          zIndex: 10,
          padding: 'clamp(40px, 8vw, 100px) clamp(24px, 6vw, 96px)',
          width: '100%',
          maxWidth: '900px',
        }}
        className="will-change-transform"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'white', opacity: 0.6 }}>04</span>
          <div style={{ width: '24px', height: '1px', background: 'var(--red-primary)' }} />
          <span className="section-label">ENGINEERING</span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 6vw, 88px)',
            lineHeight: 0.92,
            letterSpacing: '-0.01em',
            color: 'white',
            margin: '0 0 24px 0',
          }}
        >
          PRECISION.
          <br />
          <em>ENGINEERED.</em>
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            lineHeight: 1.8,
            color: 'var(--text-muted)',
            maxWidth: '500px',
            margin: '0 0 48px 0',
          }}
        >
          Every component machined beyond tolerance. Every gram interrogated. The PARFMAN powertrain begins where others reach their limit.
        </p>

        {/* CRITICAL FIX 5: 2x2 Grid Layout with Counter Animations */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', maxWidth: '600px' }}>
          <AnimatedStat value={820} suffix=" BHP" label="POWER OUTPUT" />
          <AnimatedStat value={2.4} suffix=" SEC" label="0–100 KM/H" />
          <AnimatedStat value={12} suffix=" CYLINDERS" label="ENGINE TYPE" />
          <AnimatedStat value={340} suffix=" KM/H" label="TOP SPEED" />
        </div>
      </div>
    </section>
  )
}
