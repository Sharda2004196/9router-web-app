export default function HeroSection({ content }) {
  return (
    <section className="minisite-section hero">
      <div className="container-narrow">
        <h1>{content.title || 'Welcome'}</h1>
        <p style={{ fontSize: '1.25rem', marginBottom: 'var(--space-6)' }}>
          {content.subtitle || 'Your page description'}
        </p>
        {content.buttonText && (
          <a
            href={content.buttonUrl || '#'}
            className="btn btn-accent btn-large"
          >
            {content.buttonText}
          </a>
        )}
      </div>
    </section>
  )
}
