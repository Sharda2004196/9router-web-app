export default function GallerySection({ content }) {
  const images = content.images || []

  if (images.length === 0) {
    return (
      <section className="minisite-section gallery">
        <div className="container">
          <p className="text-muted text-center">No images added yet</p>
        </div>
      </section>
    )
  }

  return (
    <section className="minisite-section gallery">
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-4)'
        }}>
          {images.map((image, index) => (
            <div
              key={index}
              style={{
                aspectRatio: '16/9',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: 'var(--surface)'
              }}
            >
              {image ? (
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted)">Image not found</div>'
                  }}
                />
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'var(--text-muted)'
                }}>
                  No image
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
