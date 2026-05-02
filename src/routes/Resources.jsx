import { Link } from 'react-router-dom'
import resourcesData from '../data/resources.json'

export default function Resources() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-darkest)', color: 'var(--color-accent)', fontFamily: '"Segoe UI", sans-serif' }}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', padding: '40px 30px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <Link to="/" style={{ color: 'rgba(176,228,204,0.6)', textDecoration: 'none', fontSize: 13 }}>← Home</Link>
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 800, margin: 0, marginBottom: 8 }}>📚 Learning Resources</h1>
          <p style={{ opacity: 0.8, fontSize: 16, margin: 0 }}>
            Curated collection of resources for DSA, LLD, HLD, and Software Engineering
          </p>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        {resourcesData.resources.map(category => (
          <div key={category.id} style={{ marginBottom: 38 }}>
            {/* Category header */}
            <div style={{ marginBottom: 19 }}>
              <div style={{ fontSize: 23, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 26 }}>{category.icon}</span>
                {category.category}
              </div>
              
              {/* Links grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 10 }}>
                {category.links.map(link => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      minHeight: 72,
                      background: 'var(--color-bg-dark)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 12,
                      padding: 13,
                      textDecoration: 'none',
                      color: 'var(--color-accent)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(16, 185, 129, 0.08)'
                      e.currentTarget.style.borderColor = '#10b981'
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--color-bg-dark)'
                      e.currentTarget.style.borderColor = 'var(--color-border)'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>
                      {link.title}
                      <span style={{ marginLeft: 8, opacity: 0.6 }}>↗</span>
                    </h3>
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Stats footer */}
        <div style={{ marginTop: 48, padding: 26, background: 'var(--color-bg-dark)', borderRadius: 16, border: '1px solid var(--color-border)', textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: 'rgba(176,228,204,0.6)', marginBottom: 16 }}>📊 RESOURCE STATISTICS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#10b981', marginBottom: 3 }}>
                {resourcesData.resources.length}
              </div>
              <div style={{ fontSize: 12, opacity: 0.6 }}>Categories</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#6366f1', marginBottom: 3 }}>
                {resourcesData.resources.reduce((sum, cat) => sum + cat.links.length, 0)}
              </div>
              <div style={{ fontSize: 12, opacity: 0.6 }}>Resources</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b', marginBottom: 3 }}>∞</div>
              <div style={{ fontSize: 12, opacity: 0.6 }}>Learning Value</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
