import { useEffect, useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(24px, 5vw, 80px)',
        background: scrolled ? 'rgba(0,0,0,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease',
      }}
    >
      {/* LEFT — Wordmark */}
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '22px',
          letterSpacing: '0.25em',
          color: 'white',
          fontWeight: 400,
        }}
      >
        PARFMAN
      </div>

      {/* CENTER — Nav links */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '40px',
        }}
        className="hidden-mobile"
      >
        {['Engineering', 'Performance', 'Design', 'Configure'].map((item) => (
          <a
            key={item}
            href="#"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
          >
            {item}
          </a>
        ))}
      </div>

      {/* RIGHT — Discover More + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <a
          href="#"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            letterSpacing: '0.18em',
            color: 'rgba(255,255,255,0.55)',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
        >
          Discover More
        </a>
        <button
          className="btn-red"
          style={{ padding: '10px 24px' }}
        >
          CONFIGURE YOURS →
        </button>
      </div>
    </nav>
  )
}
