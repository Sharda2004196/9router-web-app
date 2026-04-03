import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { themes } from '../lib/themes'
import { initFadeUpAnimations, initStaggerAnimations } from '../utils/animations'
import './Landing.css'

export default function Landing() {
  useEffect(() => {
    initFadeUpAnimations()
    initStaggerAnimations()
  }, [])
  return (
    <div className="landing theme-minimal">
      {/* Hero Section */}
      <section className="hero-section fade-up">
        <div className="container">
          <h1 className="hero-title">
            Generate a theme,<br />
            build a mini-site,<br />
            publish it.
          </h1>
          <p className="hero-subtitle">
            Choose your vibe, design your page, and share it with the world in minutes.
          </p>
          <Link to="/signup" className="btn btn-accent btn-large">
            Create your first page
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works fade-up">
        <div className="container">
          <h2 className="text-center">How it works</h2>
          <div className="steps-grid stagger-container">
            <div className="step-card stagger-item">
              <div className="step-number">1</div>
              <h3>Pick a vibe</h3>
              <p>Choose from 6 unique themes that match your style</p>
            </div>
            <div className="step-card stagger-item">
              <div className="step-number">2</div>
              <h3>Build your page</h3>
              <p>Add sections, customize content, see live preview</p>
            </div>
            <div className="step-card stagger-item">
              <div className="step-number">3</div>
              <h3>Publish</h3>
              <p>Get a public URL and share your page instantly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Showcase */}
      <section className="theme-showcase fade-up">
        <div className="container">
          <h2 className="text-center">Choose your vibe</h2>
          <p className="text-center text-muted" style={{ marginBottom: 'var(--space-12)' }}>
            Each theme comes with its own personality, colors, and typography
          </p>
          <div className="themes-grid">
            {themes.map((theme) => (
              <div key={theme.id} className="theme-card">
                <div
                  className="theme-preview"
                  style={{
                    background: `linear-gradient(135deg, ${theme.preview.primary} 0%, ${theme.preview.secondary} 100%)`
                  }}
                >
                  <div className="theme-preview-content">
                    <div
                      className="preview-box"
                      style={{ background: theme.preview.background }}
                    />
                    <div
                      className="preview-accent"
                      style={{ background: theme.preview.accent }}
                    />
                  </div>
                </div>
                <div className="theme-info">
                  <h3>{theme.name}</h3>
                  <p className="text-muted">{theme.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container text-center">
          <h2>Ready to build your page?</h2>
          <p className="text-muted" style={{ marginBottom: 'var(--space-6)' }}>
            Join thousands of creators sharing their stories
          </p>
          <Link to="/signup" className="btn btn-accent btn-large">
            Get started for free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>VibeKit Studio</h3>
              <p className="text-muted">Build beautiful pages in minutes</p>
            </div>
            <div className="footer-links">
              <Link to="/login">Log in</Link>
              <Link to="/signup">Sign up</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="text-muted">© 2026 VibeKit Studio. Built with Claude Code.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
