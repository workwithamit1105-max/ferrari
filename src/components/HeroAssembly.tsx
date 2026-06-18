import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const frameCount = 129
const framePad = (n: number) => n.toString().padStart(3, '0')

export default function HeroAssembly() {
  const outerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  
  const [loadedCount, setLoadedCount] = useState(0)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // 1. Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = []
    let loaded = 0

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image()
      img.src = `/assets/hero-section-video-frames/ezgif-frame-${framePad(i)}.jpg`
      img.onload = () => {
        loaded++
        setLoadedCount(loaded)
        if (loaded === frameCount) {
          setImages(loadedImages)
          setIsLoaded(true)
        }
      }
      loadedImages.push(img)
    }
  }, [])

  // 2. Setup Canvas Render & ScrollTrigger
  useEffect(() => {
    if (!isLoaded || images.length === 0) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let renderTask: number

    // Render function using requestAnimationFrame for smoothness
    const renderFrame = (index: number) => {
      const img = images[index]
      if (!img || !img.complete) return

      // Update canvas size to match window
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }

      // Calculate object-fit: cover sizing
      const hRatio = canvas.width / img.width
      const vRatio = canvas.height / img.height
      const ratio = Math.max(hRatio, vRatio)
      const centerShift_x = (canvas.width - img.width * ratio) / 2
      const centerShift_y = (canvas.height - img.height * ratio) / 2

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(
        img,
        0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
      )
    }

    // Initial render
    renderFrame(0)

    // Handle Resize
    const handleResize = () => {
      // Just re-render current frame
      if (typeof window !== 'undefined' && ScrollTrigger) {
        ScrollTrigger.refresh()
      }
    }
    window.addEventListener('resize', handleResize)

    const gsapCtx = gsap.context(() => {
      // Direct scroll scrubbing without proxy state object for instant reactivity
      ScrollTrigger.create({
        trigger: outerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          // self.progress is exactly 0.0 to 1.0 across the 400vh
          const frameIdx = Math.min(frameCount - 1, Math.max(0, Math.round(self.progress * (frameCount - 1))))
          if (renderTask) cancelAnimationFrame(renderTask)
          renderTask = requestAnimationFrame(() => renderFrame(frameIdx))
        }
      })

      // Text Overlay fade in after 20% scroll
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: outerRef.current,
            start: '20% top', // trigger when outerRef has scrolled 20%
            end: '30% top',
            scrub: true,
          },
        }
      )
    }, outerRef)

    return () => {
      gsapCtx.revert()
      window.removeEventListener('resize', handleResize)
      if (renderTask) cancelAnimationFrame(renderTask)
    }
  }, [isLoaded, images])

  return (
    <div ref={outerRef} style={{ height: '400vh', position: 'relative', backgroundColor: 'var(--bg-void)' }}>
      
      {/* Sticky Container */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-void)',
        }}
      >
        {/* Loading Progress Bar */}
        {!isLoaded && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              backgroundColor: 'var(--bg-void)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-display)', color: 'white', letterSpacing: '0.2em', marginBottom: '16px', fontSize: '12px' }}>
              INITIALIZING SEQUENCE
            </div>
            <div style={{ width: '200px', height: '2px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <div
                style={{
                  height: '100%',
                  backgroundColor: 'var(--red-primary)',
                  width: `${(loadedCount / frameCount) * 100}%`,
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
          </div>
        )}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* Subtle vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* Text Overlay */}
        <div
          ref={textRef}
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            padding: '0 24px',
            opacity: 0, // GSAP will animate this
          }}
          className="will-change-transform"
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(48px, 8vw, 120px)',
              lineHeight: 1,
              letterSpacing: '0.02em',
              color: 'white',
              margin: '0 0 16px 0',
              textShadow: '0 4px 24px rgba(0,0,0,0.5)',
            }}
          >
            BEYOND LIMITS.
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(14px, 2vw, 18px)',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.8)',
              margin: '0 0 40px 0',
              textTransform: 'uppercase',
            }}
          >
            The PARFMAN. 820 BHP. Born on the track.
          </p>
          <button className="btn-red">
            DISCOVER THE CAR →
          </button>
        </div>

      </div>
    </div>
  )
}
