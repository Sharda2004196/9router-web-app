export default function FeaturesSection({ content }) {
  const items = content.items || []

  if (items.length === 0) {
    return (
      <section className="minisite-section features">
        <div className="container">
          <p className="text-muted text-center">No features added yet</p>
        </div>
      </section>
    )
  }

  return (
    <section className="minisite-section features">
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-8)'
        }}>
          {items.map((item, index) => (
            <div key={index} className="card">
              <h3>{item.title || `Feature ${index + 1}`}</h3>
              <p style={{ marginBottom: 0 }}>
                {item.description || 'Feature description'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
