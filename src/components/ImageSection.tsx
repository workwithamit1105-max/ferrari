import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ImageSectionProps {
  id: string
  number: string
  label: string
  heading: string
  description: string
  imageSrc: string
  altText: string
}

export default function ImageSection({
  id,
  number,
  label,
  heading,
  description,
  imageSrc,
  altText,
}: ImageSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLImageElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background Parallax: y: -60px over the scroll range
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

      // Text Slide Up + Fade In
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 85%',
        },
      })

      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      )

      // Section label fade in with 0.3s delay
      gsap.fromTo(
        labelRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          delay: 0.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 85%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id={id}
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-void)',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      {/* Parallax Background Image */}
      <div
        style={{
          position: 'absolute',
          inset: -60, // extend bounds for parallax movement
          zIndex: 0,
        }}
      >
        <img
          ref={bgRef}
          src={imageSrc}
          alt={altText}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            willChange: 'transform',
          }}
        />
      </div>

      {/* Dark Overlay Gradient — Bottom 40% -> Black, Left 40% -> Black */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 40%),
            linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 40%)
          `,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Content Block */}
      <div
        ref={contentRef}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          padding: 'clamp(40px, 8vw, 100px) clamp(24px, 6vw, 96px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          maxWidth: '800px',
        }}
        className="will-change-transform"
      >
        {/* Top line with Number and Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              color: 'var(--text-white)',
              opacity: 0.6,
            }}
          >
            {number}
          </span>
          <div style={{ width: '24px', height: '1px', background: 'var(--red-primary)' }} />
          <span ref={labelRef} className="section-label">
            {label}
          </span>
        </div>

        {/* Heading */}
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 6vw, 72px)',
            lineHeight: 1.0,
            letterSpacing: '-0.01em',
            margin: 0,
          }}
        >
          {heading}
        </h2>

        {/* Description */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(13px, 1.5vw, 15px)',
            lineHeight: 1.8,
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
            margin: 0,
            maxWidth: '500px',
          }}
        >
          {description}
        </p>
      </div>
    </section>
  )
}
