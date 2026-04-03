import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function PageBuilder({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState({
    title: '',
    slug: '',
    theme: 'minimal',
    status: 'draft',
    content: { sections: [] }
  })

  useEffect(() => {
    if (id) {
      fetchPage()
    }
  }, [id])

  const fetchPage = async () => {
    try {
      const res = await fetch(`/.netlify/functions/pages/${id}`)
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

  const handleSave = async () => {
    setSaving(true)

    try {
      const url = id
        ? `/.netlify/functions/pages/${id}`
        : '/.netlify/functions/pages'

      const res = await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page)
      })

      if (res.ok) {
        const data = await res.json()
        if (!id) {
          navigate(`/builder/${data.page.id}`)
        }
      }
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setSaving(false)
    }
  }

  const addSection = (type) => {
    setPage({
      ...page,
      content: {
        ...page.content,
        sections: [
          ...page.content.sections,
          { type, id: Date.now().toString(), content: {} }
        ]
      }
    })
  }

  const removeSection = (sectionId) => {
    setPage({
      ...page,
      content: {
        ...page.content,
        sections: page.content.sections.filter(s => s.id !== sectionId)
      }
    })
  }

  const updateSection = (sectionId, content) => {
    setPage({
      ...page,
      content: {
        ...page.content,
        sections: page.content.sections.map(s =>
          s.id === sectionId ? { ...s, content } : s
        )
      }
    })
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner" style={{ borderTopColor: 'var(--primary)' }} />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: 'var(--space-4) 0',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)'
        }}>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary"
          >
            ← Back
          </button>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button
              onClick={handleSave}
              className="btn btn-primary"
              disabled={saving || !page.title || !page.slug}
            >
              {saving ? <span className="spinner" /> : 'Save'}
            </button>
            {id && (
              <button
                onClick={() => navigate(`/p/${page.slug}`)}
                className="btn btn-secondary"
              >
                Preview
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{
        paddingTop: 'var(--space-8)',
        paddingBottom: 'var(--space-8)',
        maxWidth: '800px'
      }}>
        <h1 style={{ marginBottom: 'var(--space-6)' }}>
          {id ? 'Edit Page' : 'New Page'}
        </h1>

        {/* Page Settings */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>
            Page Settings
          </h2>

          <div className="form-group">
            <label htmlFor="title">Page Title</label>
            <input
              id="title"
              type="text"
              value={page.title}
              onChange={(e) => setPage({ ...page, title: e.target.value })}
              placeholder="My Awesome Page"
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug">URL Slug</label>
            <input
              id="slug"
              type="text"
              value={page.slug}
              onChange={(e) => setPage({ ...page, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
              placeholder="my-awesome-page"
            />
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 'var(--space-2)', marginBottom: 0 }}>
              Your page will be available at: /p/{page.slug || 'your-slug'}
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              value={page.theme}
              onChange={(e) => setPage({ ...page, theme: e.target.value })}
            >
              <option value="minimal">Minimal</option>
              <option value="modern">Modern</option>
              <option value="bold">Bold</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={page.status}
              onChange={(e) => setPage({ ...page, status: e.target.value })}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Page Content */}
        <div className="card">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-4)'
          }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 0 }}>
              Page Content
            </h2>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button
                onClick={() => addSection('hero')}
                className="btn btn-secondary"
                style={{ fontSize: '0.875rem', padding: 'var(--space-2) var(--space-3)' }}
              >
                + Hero
              </button>
              <button
  onClick={() => addSection('features')}
  className="btn btn-secondary"
  style={{ fontSize: '0.875rem', padding: 'var(--space-2)' }}
>
  + Features
</button>
<button
  onClick={() => addSection('gallery')}
  className="btn btn-secondary"
  style={{ fontSize: '0.875rem', padding: 'var(--space-2)' }}
>
  + Gallery
</button>
              <button
                onClick={() => addSection('contact')}
                className="btn btn-secondary"
                style={{ fontSize: '0.875rem', padding: 'var(--space-2) var(--space-3)' }}
              >
                + Contact
              </button>
            </div>
          </div>

          {page.content.sections.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: 'var(--space-8)',
              color: 'var(--text-muted)'
            }}>
              <p>No sections yet. Add your first section above.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {page.content.sections.map((section, index) => (
                <div
                  key={section.id}
                  style={{
                    padding: 'var(--space-4)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--background)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-3)'
                  }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: 0, textTransform: 'capitalize' }}>
                      {section.type} Section
                    </h3>
                    <button
                      onClick={() => removeSection(section.id)}
                      className="btn btn-secondary"
                      style={{
                        fontSize: '0.875rem',
                        padding: 'var(--space-1) var(--space-3)',
                        color: 'var(--error)'
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  {section.type === 'hero' && (
                    <>
                      <div className="form-group">
                        <label>Headline</label>
                        <input
                          type="text"
                          value={section.content.headline || ''}
                          onChange={(e) => updateSection(section.id, { ...section.content, headline: e.target.value })}
                          placeholder="Welcome to my page"
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Subheadline</label>
                        <input
                          type="text"
                          value={section.content.subheadline || ''}
                          onChange={(e) => updateSection(section.id, { ...section.content, subheadline: e.target.value })}
                          placeholder="A brief description"
                        />
                      </div>
                    </>
                  )}

                  {section.type === 'text' && (
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Content</label>
                      <textarea
                        value={section.content.text || ''}
                        onChange={(e) => updateSection(section.id, { ...section.content, text: e.target.value })}
                        placeholder="Enter your text content..."
                        rows={4}
                      />
                    </div>
                  )}

                  {section.type === 'contact' && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 0 }}>
                      Contact form will be displayed on the published page
                    </p>
                  )}
                  {section.type === 'features' && (
  <div>
    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>Feature Cards</p>
    {(section.content.cards || []).map((card, i) => (
      <div key={i} style={{ marginBottom: 'var(--space-2)', padding: 'var(--space-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
        <input
          type="text"
          placeholder="Feature title"
          value={card.title || ''}
          onChange={(e) => {
            const cards = [...(section.content.cards || [])]
            cards[i] = { ...cards[i], title: e.target.value }
            updateSection(section.id, { ...section.content, cards })
          }}
          style={{ width: '100%', marginBottom: '8px' }}
        />
        <textarea
          placeholder="Feature description"
          value={card.description || ''}
          onChange={(e) => {
            const cards = [...(section.content.cards || [])]
            cards[i] = { ...cards[i], description: e.target.value }
            updateSection(section.id, { ...section.content, cards })
          }}
          rows={2}
          style={{ width: '100%' }}
        />
        <button onClick={() => {
          const cards = (section.content.cards || []).filter((_, idx) => idx !== i)
          updateSection(section.id, { ...section.content, cards })
        }} className="btn btn-secondary" style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--error)' }}>Remove</button>
      </div>
    ))}
    {(section.content.cards || []).length < 6 && (
      <button onClick={() => {
        const cards = [...(section.content.cards || []), { title: '', description: '' }]
        updateSection(section.id, { ...section.content, cards })
      }} className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>+ Add Card</button>
    )}
  </div>
)}

{section.type === 'gallery' && (
  <div>
    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>Image URLs</p>
    {(section.content.images || []).map((url, i) => (
      <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="https://example.com/image.jpg"
          value={url || ''}
          onChange={(e) => {
            const images = [...(section.content.images || [])]
            images[i] = e.target.value
            updateSection(section.id, { ...section.content, images })
          }}
          style={{ flex: 1 }}
        />
        {url && <img src={url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
        <button onClick={() => {
          const images = (section.content.images || []).filter((_, idx) => idx !== i)
          updateSection(section.id, { ...section.content, images })
        }} className="btn btn-secondary" style={{ fontSize: '0.75rem', color: 'var(--error)' }}>✕</button>
      </div>
    ))}
    {(section.content.images || []).length < 8 && (
      <button onClick={() => {
        const images = [...(section.content.images || []), '']
        updateSection(section.id, { ...section.content, images })
      }} className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>+ Add Image</button>
    )}
  </div>
)}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
