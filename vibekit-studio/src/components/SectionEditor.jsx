import { useState } from 'react'
import './SectionEditor.css'

export default function SectionEditor({ section, index, totalSections, onUpdate, onRemove, onMoveUp, onMoveDown }) {
  const [isExpanded, setIsExpanded] = useState(true)

  const renderEditor = () => {
    switch (section.type) {
      case 'hero':
        return (
          <>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={section.content.title || ''}
                onChange={(e) => onUpdate({ ...section.content, title: e.target.value })}
                placeholder="Welcome to my page"
              />
            </div>
            <div className="form-group">
              <label>Subtitle</label>
              <input
                type="text"
                value={section.content.subtitle || ''}
                onChange={(e) => onUpdate({ ...section.content, subtitle: e.target.value })}
                placeholder="A brief description"
              />
            </div>
            <div className="form-group">
              <label>Button Text</label>
              <input
                type="text"
                value={section.content.buttonText || ''}
                onChange={(e) => onUpdate({ ...section.content, buttonText: e.target.value })}
                placeholder="Get Started"
              />
            </div>
            <div className="form-group">
              <label>Button URL</label>
              <input
                type="text"
                value={section.content.buttonUrl || ''}
                onChange={(e) => onUpdate({ ...section.content, buttonUrl: e.target.value })}
                placeholder="#"
              />
            </div>
          </>
        )

      case 'features':
        return (
          <div className="features-editor">
            <div className="features-list">
              {(section.content.items || []).map((item, idx) => (
                <div key={idx} className="feature-item">
                  <div className="form-group">
                    <label>Feature {idx + 1} Title</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => {
                        const newItems = [...section.content.items]
                        newItems[idx] = { ...item, title: e.target.value }
                        onUpdate({ ...section.content, items: newItems })
                      }}
                      placeholder="Feature title"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={item.description || ''}
                      onChange={(e) => {
                        const newItems = [...section.content.items]
                        newItems[idx] = { ...item, description: e.target.value }
                        onUpdate({ ...section.content, items: newItems })
                      }}
                      placeholder="Feature description"
                      rows={2}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newItems = section.content.items.filter((_, i) => i !== idx)
                      onUpdate({ ...section.content, items: newItems })
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ color: 'var(--error)' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const newItems = [...(section.content.items || []), { title: '', description: '' }]
                onUpdate({ ...section.content, items: newItems })
              }}
              className="btn btn-secondary btn-sm"
            >
              + Add Feature
            </button>
          </div>
        )

      case 'gallery':
        return (
          <div className="gallery-editor">
            <div className="gallery-list">
              {(section.content.images || []).map((image, idx) => (
                <div key={idx} className="gallery-item">
                  <div className="form-group">
                    <label>Image {idx + 1} URL</label>
                    <input
                      type="text"
                      value={image || ''}
                      onChange={(e) => {
                        const newImages = [...section.content.images]
                        newImages[idx] = e.target.value
                        onUpdate({ ...section.content, images: newImages })
                      }}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  {image && (
                    <img
                      src={image}
                      alt={`Gallery ${idx + 1}`}
                      className="gallery-preview"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                  <button
                    onClick={() => {
                      const newImages = section.content.images.filter((_, i) => i !== idx)
                      onUpdate({ ...section.content, images: newImages })
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ color: 'var(--error)' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const newImages = [...(section.content.images || []), '']
                onUpdate({ ...section.content, images: newImages })
              }}
              className="btn btn-secondary btn-sm"
            >
              + Add Image
            </button>
          </div>
        )

      case 'contact':
        return (
          <div className="form-group">
            <label>Heading</label>
            <input
              type="text"
              value={section.content.heading || ''}
              onChange={(e) => onUpdate({ ...section.content, heading: e.target.value })}
              placeholder="Get in Touch"
            />
            <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: 'var(--space-2)' }}>
              Contact form will be displayed automatically
            </p>
          </div>
        )

      default:
        return <p className="text-muted">Unknown section type</p>
    }
  }

  return (
    <div className="section-editor">
      <div className="section-header">
        <button
          className="section-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="section-title">
            {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
          </span>
          <span className="toggle-icon">{isExpanded ? '−' : '+'}</span>
        </button>

        <div className="section-actions">
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="btn-icon-sm"
            title="Move up"
          >
            ↑
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === totalSections - 1}
            className="btn-icon-sm"
            title="Move down"
          >
            ↓
          </button>
          <button
            onClick={onRemove}
            className="btn-icon-sm"
            style={{ color: 'var(--error)' }}
            title="Remove"
          >
            ×
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="section-content">
          {renderEditor()}
        </div>
      )}
    </div>
  )
}
