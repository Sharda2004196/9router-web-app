import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SkeletonList } from '../components/SkeletonLoader'
import './Dashboard.css'

export default function Dashboard({ user, onLogout }) {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const res = await fetch('/.netlify/functions/pages')
      if (res.ok) {
        const data = await res.json()
        setPages(data.pages)
      }
    } catch (error) {
      console.error('Failed to fetch pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/.netlify/functions/logout', { method: 'POST' })
      onLogout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this page?')) return

    try {
      const res = await fetch(`/.netlify/functions/pages/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setPages(pages.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: 'var(--space-4) 0'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 0 }}>VibeKit Studio</h1>
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {user.email}
            </span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-6)'
        }}>
          <h2 style={{ marginBottom: 0 }}>Your Pages</h2>
          <button
            onClick={() => navigate('/builder')}
            className="btn btn-primary"
          >
            + New Page
          </button>
        </div>

        {loading ? (
          <SkeletonList count={3} />
        ) : pages.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
            <h3>No pages yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-6)' }}>
              Create your first page to get started
            </p>
            <button
              onClick={() => navigate('/builder')}
              className="btn btn-primary"
            >
              Create Page
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--space-4)'
          }}>
            {pages.map(page => (
              <div key={page.id} className="card" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)'
              }}>
                <div>
                  <h3 style={{ marginBottom: 'var(--space-2)' }}>{page.title}</h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)',
                    marginBottom: 'var(--space-2)'
                  }}>
                    /{page.slug}
                  </p>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <span>{page.status === 'published' ? '✓ Published' : '○ Draft'}</span>
                    <span>•</span>
                    <span>{page.viewCount} views</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'auto' }}>
                  <button
                    onClick={() => navigate(`/builder/${page.id}`)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Edit
                  </button>
                  <Link
                    to={`/p/${page.slug}`}
                    className="btn btn-secondary"
                    style={{ flex: 1, textDecoration: 'none' }}
                  >
                    Preview
                  </Link>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="btn btn-secondary"
                    style={{ color: 'var(--error)' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
