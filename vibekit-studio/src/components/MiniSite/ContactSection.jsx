import { useState } from 'react'

export default function ContactSection({ content, pageId }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId,
          ...formData
        })
      })

      if (res.ok) {
        setSuccess(true)
        setFormData({ name: '', email: '', message: '' })
      } else {
        setError('Failed to send message. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="minisite-section contact">
      <div className="container-narrow">
        <h2 className="text-center">{content.heading || 'Get in Touch'}</h2>

        {success ? (
          <div style={{
            padding: 'var(--space-6)',
            background: 'var(--success)',
            color: 'white',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center'
          }}>
            <h3>Thank you!</h3>
            <p style={{ marginBottom: 0 }}>Your message has been sent successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
              />
            </div>

            {error && (
              <div className="error-message">{error}</div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ width: '100%' }}
            >
              {submitting ? <span className="spinner" /> : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
