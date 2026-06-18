export default function Footer() {
  const navLinks = ['Engineering', 'Performance', 'Design', 'Configure', 'Contact']
  const socialLinks = ['Instagram', 'YouTube', 'X']

  const linkStyle = {
    fontSize: '10px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.35)',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    cursor: 'pointer',
  }

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-void)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: 'clamp(48px, 6vw, 80px) clamp(24px, 6vw, 96px)',
      }}
    >
      {/* 3-column grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: '80px',
          alignItems: 'start',
        }}
      >
        {/* COL 1 — Brand */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              color: 'white',
              letterSpacing: '0.25em',
              fontWeight: 400,
            }}
          >
            PARFMAN
          </div>
          <div
            style={{
              fontSize: '9px',
              letterSpacing: '0.35em',
              color: 'rgba(255,255,255,0.3)',
              marginTop: '12px',
              textTransform: 'uppercase',
            }}
          >
            SINCE 2025.
          </div>
        </div>

        {/* COL 2 — Nav links */}
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', paddingTop: '4px' }}>
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              style={linkStyle}
              className="hover-underline"
            >
              {link}
            </a>
          ))}
        </div>

        {/* COL 3 — Social */}
        <div>
          <div
            style={{
              fontSize: '9px',
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.2)',
              marginBottom: '12px',
              textTransform: 'uppercase',
            }}
          >
            FOLLOW US
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {socialLinks.map((social) => (
              <a
                key={social}
                href="#"
                style={linkStyle}
                className="hover-underline"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div
        style={{
          marginTop: '48px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)' }}>
          © 2025 PARFMAN AUTOMOBILI S.p.A. ALL RIGHTS RESERVED.
        </span>
        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)' }}>
          Privacy · Legal · Cookies
        </span>
      </div>
    </footer>
  )
}
