import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function PagePreview() {
  const { slug } = useParams()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactSuccess, setContactSuccess] = useState(false)

  useEffect(() => {
    fetchPage()
  }, [slug])

  const fetchPage = async () => {
    try {
      const res = await fetch(`/.netlify/functions/pages/${slug}`)
      if (res.ok) {
        const data = await res.json()
        setPage(data.page)
      }
    } catch (error) {
      console.error('Failed to fetch page:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: page.id,
          ...contactForm
        })
      })

      if (res.ok) {
        setContactSuccess(true)
        setContactForm({ name: '', email: '', message: '' })
      }
    } catch (error) {
      console.error('Contact submission failed:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner" style={{ borderTopColor: 'var(--primary)' }} />
      </div>
    )
  }

  if (!page) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h1>Page Not Found</h1>
          <p style={{ color: 'var(--text-muted)' }}>The page you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const themeStyles = {
    minimal: {
      background: '#FFFFFF',
      color: '#1E293B',
      accent: '#2563EB'
    },
    modern: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#FFFFFF',
      accent: '#F97316'
    },
    bold: {
      background: '#000000',
      color: '#FFFFFF',
      accent: '#F97316'
    }
  }

  const theme = themeStyles[page.theme] || themeStyles.minimal

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.background,
      color: theme.color
    }}>
      <div className="container" style={{
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-16)',
        maxWidth: '800px'
      }}>
        {page.content.sections.map((section) => (
          <div key={section.id} style={{ marginBottom: 'var(--space-12)' }}>
            {section.type === 'hero' && (
              <div style={{ textAlign: 'center' }}>
                <h1 style={{
                  fontSize: '3rem',
                  fontWeight: 700,
                  marginBottom: 'var(--space-4)',
                  color: theme.color
                }}>
                  {section.content.headline || 'Welcome'}
                </h1>
                <p style={{
                  fontSize: '1.25rem',
                  color: theme.color,
                  opacity: 0.8,
                  marginBottom: 0
                }}>
                  {section.content.subheadline || 'Your page description'}
                </p>
              </div>
            )}

            {section.type === 'text' && (
              <div style={{
                fontSize: '1.125rem',
                lineHeight: 1.8,
                color: theme.color,
                opacity: 0.9
              }}>
                {section.content.text?.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}

            {section.type === 'contact' && (
              <div className="card" style={{
                background: page.theme === 'minimal' ? 'var(--surface)' : 'rgba(255, 255, 255, 0.1)',
                border: page.theme === 'minimal' ? '1px solid var(--border)' : '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  marginBottom: 'var(--space-4)',
                  color: theme.color
                }}>
                  Get in Touch
                </h2>

                {contactSuccess ? (
                  <div style={{
                    padding: 'var(--space-4)',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    color: page.theme === 'minimal' ? 'var(--success)' : theme.color
                  }}>
                    Thank you! Your message has been sent.
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit}>
                    <div className="form-group">
                      <label htmlFor="name" style={{ color: theme.color }}>Name</label>
                      <input
                        id="name"
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                        style={{
                          background: page.theme === 'minimal' ? 'var(--surface)' : 'rgba(255, 255, 255, 0.1)',
                          color: theme.color,
                          border: page.theme === 'minimal' ? '1px solid var(--border)' : '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" style={{ color: theme.color }}>Email</label>
                      <input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                        style={{
                          background: page.theme === 'minimal' ? 'var(--surface)' : 'rgba(255, 255, 255, 0.1)',
                          color: theme.color,
                          border: page.theme === 'minimal' ? '1px solid var(--border)' : '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="message" style={{ color: theme.color }}>Message</label>
                      <textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        required
                        rows={4}
                        style={{
                          background: page.theme === 'minimal' ? 'var(--surface)' : 'rgba(255, 255, 255, 0.1)',
                          color: theme.color,
                          border: page.theme === 'minimal' ? '1px solid var(--border)' : '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                      style={{
                        width: '100%',
                        background: theme.accent
                      }}
                    >
                      {submitting ? <span className="spinner" /> : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          paddingTop: 'var(--space-8)',
          borderTop: `1px solid ${page.theme === 'minimal' ? 'var(--border)' : 'rgba(255, 255, 255, 0.2)'}`,
          fontSize: '0.875rem',
          color: theme.color,
          opacity: 0.6
        }}>
          <p style={{ marginBottom: 0 }}>
            Powered by VibeKit Studio • {page.viewCount} views
          </p>
        </div>
      </div>
    </div>
  )
}
