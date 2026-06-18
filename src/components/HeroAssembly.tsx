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
  const currentFrameRef = useRef<number>(0) // Track frame for resize redraws

  const [loadedCount, setLoadedCount] = useState(0)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // 1. Preload all images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = new Array(frameCount)
    let loaded = 0

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image()
      const idx = i - 1
      img.onload = () => {
        loaded++
        setLoadedCount(loaded)
        if (loaded === frameCount) {
          setImages([...loadedImages])
          setIsLoaded(true)
        }
      }
      img.onerror = () => {
        // Count failed loads too so we don't hang forever
        loaded++
        if (loaded === frameCount) {
          setImages([...loadedImages])
          setIsLoaded(true)
        }
      }
      img.src = `/assets/hero-section-video-frames/ezgif-frame-${framePad(i)}.jpg`
      loadedImages[idx] = img
    }
  }, [])

  // 2. Setup canvas + ScrollTrigger after images are ready
  useEffect(() => {
    if (!isLoaded || images.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas pixel dimensions immediately
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const renderFrame = (index: number) => {
      const clampedIndex = Math.max(0, Math.min(frameCount - 1, index))
      const img = images[clampedIndex]
      if (!img || !img.complete || img.naturalWidth === 0) return

      // Update canvas size if window changed (e.g. resize)
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }

      // Object-fit: cover math
      const hRatio = canvas.width / img.naturalWidth
      const vRatio = canvas.height / img.naturalHeight
      const ratio = Math.max(hRatio, vRatio)
      const shiftX = (canvas.width - img.naturalWidth * ratio) / 2
      const shiftY = (canvas.height - img.naturalHeight * ratio) / 2

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(
        img,
        0, 0, img.naturalWidth, img.naturalHeight,
        shiftX, shiftY, img.naturalWidth * ratio, img.naturalHeight * ratio
      )

      currentFrameRef.current = clampedIndex
    }

    // Draw first frame immediately
    renderFrame(0)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      renderFrame(currentFrameRef.current) // Redraw same frame at new size
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', handleResize, { passive: true })

    const gsapCtx = gsap.context(() => {
      // Frame scrubber — NO requestAnimationFrame wrapper here.
      // GSAP scrub already runs in sync with browser paint.
      // Wrapping in RAF causes cancelAnimationFrame to kill frames before they render.
      ScrollTrigger.create({
        trigger: outerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const frameIdx = Math.round(self.progress * (frameCount - 1))
          renderFrame(frameIdx)
        },
      })

      // Text overlay: fade in between 15%–30% scroll progress through the hero
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: outerRef.current,
            start: 'top+=15% top',
            end: 'top+=30% top',
            scrub: true,
          },
        }
      )
    }, outerRef)

    return () => {
      gsapCtx.revert()
      window.removeEventListener('resize', handleResize)
    }
  }, [isLoaded, images])

  return (
    <div ref={outerRef} style={{ height: '400vh', position: 'relative', backgroundColor: 'var(--bg-void)' }}>

      {/* Sticky Viewport */}
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
        {/* Loading Screen */}
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
            <div style={{
              fontFamily: 'var(--font-body)',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.3em',
              marginBottom: '20px',
              fontSize: '10px',
              textTransform: 'uppercase',
            }}>
              INITIALIZING SEQUENCE
            </div>
            <div style={{ width: '200px', height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <div
                style={{
                  height: '100%',
                  backgroundColor: 'var(--red-primary)',
                  width: `${(loadedCount / frameCount) * 100}%`,
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '9px', letterSpacing: '0.2em', marginTop: '12px' }}>
              {loadedCount} / {frameCount}
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
            transition: 'opacity 0.6s ease',
          }}
        />

        {/* Vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* Bottom gradient for text readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%)',
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
            opacity: 0,
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(48px, 8vw, 120px)',
              lineHeight: 1,
              letterSpacing: '0.02em',
              color: 'white',
              margin: '0 0 16px 0',
              textShadow: '0 4px 32px rgba(0,0,0,0.6)',
            }}
          >
            BEYOND LIMITS.
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(11px, 1.5vw, 14px)',
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.7)',
              margin: '0 0 40px 0',
              textTransform: 'uppercase',
            }}
          >
            The PARFMAN · 820 BHP · Born on the track.
          </p>
          <button className="btn-red">
            DISCOVER THE CAR →
          </button>
        </div>
      </div>
    </div>
  )
}
