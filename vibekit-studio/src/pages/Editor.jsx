import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAutoSave from '../hooks/useAutoSave'
import { themes, getThemeClassName } from '../lib/themes'
import ThemePicker from '../components/ThemePicker'
import SectionEditor from '../components/SectionEditor'
import PreviewFrame from '../components/PreviewFrame'
import './Editor.css'

export default function Editor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(!!id)
  const [viewportMode, setViewportMode] = useState('desktop') // 'desktop' | 'tablet' | 'mobile'

  const [page, setPage] = useState({
    title: '',
    slug: '',
    theme: 'minimal',
    status: 'draft',
    content: {
      sections: []
    }
  })

  const { isSaving, saveStatus, debouncedSave } = useAutoSave(async (pageData) => {
    const url = id
      ? `/.netlify/functions/pages/${id}`
      : '/.netlify/functions/pages'

    const res = await fetch(url, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pageData)
    })

    if (res.ok) {
      const data = await res.json()
      if (!id) {
        // Update the URL to include the new page ID
        navigate(`/builder/${data.page.id}`, { replace: true })
      }
      return data
    } else {
      throw new Error('Save failed')
    }
  }, 1500) // 1.5 second debounce

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
    try {
      await debouncedSave(page)
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  const handlePublish = async () => {
    const newStatus = page.status === 'published' ? 'draft' : 'published'
    setPage({ ...page, status: newStatus })
    await handleSave()
  }

  const addSection = (type) => {
    const newSection = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type)
    }
    setPage({
      ...page,
      content: {
        ...page.content,
        sections: [...page.content.sections, newSection]
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

  const removeSection = (sectionId) => {
    setPage({
      ...page,
      content: {
        ...page.content,
        sections: page.content.sections.filter(s => s.id !== sectionId)
      }
    })
  }

  const moveSection = (sectionId, direction) => {
    const sections = [...page.content.sections]
    const index = sections.findIndex(s => s.id === sectionId)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= sections.length) return

    [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]]
    setPage({
      ...page,
      content: { ...page.content, sections }
    })
  }

  const getDefaultContent = (type) => {
    switch (type) {
      case 'hero':
        return { title: 'Welcome', subtitle: 'Your page description', buttonText: 'Get Started', buttonUrl: '#' }
      case 'features':
        return { items: [{ title: 'Feature 1', description: 'Description here' }] }
      case 'gallery':
        return { images: [] }
      case 'contact':
        return { heading: 'Get in Touch' }
      default:
        return {}
    }
  }

  if (loading) {
    return (
      <div className="editor-loading">
        <div className="spinner" style={{ borderTopColor: 'var(--primary)' }} />
      </div>
    )
  }

  return (
    <div className="editor theme-minimal">
      {/* Top Bar */}
      <div className="editor-topbar">
        <div className="topbar-left">
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary btn-sm">
            ← Back
          </button>
          <input
            type="text"
            value={page.title}
            onChange={(e) => setPage({ ...page, title: e.target.value })}
            placeholder="Page title"
            className="title-input"
          />
        </div>

        <div className="topbar-center">
          {saveStatus === 'saving' && <span className="save-status">Saving...</span>}
          {saveStatus === 'saved' && <span className="save-status saved">Saved ✓</span>}
        </div>

        <div className="topbar-right">
          <button
            onClick={handleSave}
            className="btn btn-primary btn-sm"
            disabled={isSaving || !page.title || !page.slug}
          >
            {isSaving ? <span className="spinner" /> : 'Save'}
          </button>
          <button
            onClick={handlePublish}
            className={`btn btn-sm ${page.status === 'published' ? 'btn-secondary' : 'btn-accent'}`}
            disabled={!id}
          >
            {page.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Main Editor Layout */}
      <div className="editor-layout">
        {/* Left Panel */}
        <div className="editor-panel">
          <div className="panel-section">
            <h3>Page Settings</h3>
            <div className="form-group">
              <label>URL Slug</label>
              <input
                type="text"
                value={page.slug}
                onChange={(e) => setPage({ ...page, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                placeholder="my-page"
              />
            </div>

            <div className="form-group">
              <label>Theme</label>
              <ThemePicker
                selectedTheme={page.theme}
                onSelectTheme={(themeId) => setPage({ ...page, theme: themeId })}
              />
            </div>
          </div>

          <div className="panel-section">
            <div className="section-header">
              <h3>Sections</h3>
              <div className="add-section-buttons">
                <button onClick={() => addSection('hero')} className="btn-icon" title="Add Hero">
                  H
                </button>
                <button onClick={() => addSection('features')} className="btn-icon" title="Add Features">
                  F
                </button>
                <button onClick={() => addSection('gallery')} className="btn-icon" title="Add Gallery">
                  G
                </button>
                <button onClick={() => addSection('contact')} className="btn-icon" title="Add Contact">
                  C
                </button>
              </div>
            </div>

            {page.content.sections.length === 0 ? (
              <p className="text-muted">No sections yet. Add your first section above.</p>
            ) : (
              <div className="sections-list">
                {page.content.sections.map((section, index) => (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    index={index}
                    totalSections={page.content.sections.length}
                    onUpdate={(content) => updateSection(section.id, content)}
                    onRemove={() => removeSection(section.id)}
                    onMoveUp={() => moveSection(section.id, 'up')}
                    onMoveDown={() => moveSection(section.id, 'down')}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="preview-panel">
          <div className="preview-toolbar">
            <div className="viewport-toggle">
              <button
                className={`viewport-btn ${viewportMode === 'desktop' ? 'active' : ''}`}
                onClick={() => setViewportMode('desktop')}
                title="Desktop"
              >
                Desktop
              </button>
              <button
                className={`viewport-btn ${viewportMode === 'tablet' ? 'active' : ''}`}
                onClick={() => setViewportMode('tablet')}
                title="Tablet"
              >
                Tablet
              </button>
              <button
                className={`viewport-btn ${viewportMode === 'mobile' ? 'active' : ''}`}
                onClick={() => setViewportMode('mobile')}
                title="Mobile"
              >
                Mobile
              </button>
            </div>
          </div>

          <PreviewFrame
            page={page}
            viewportMode={viewportMode}
          />
        </div>
      </div>
    </div>
  )
}
