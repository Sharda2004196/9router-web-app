import HeroSection from './MiniSite/HeroSection'
import FeaturesSection from './MiniSite/FeaturesSection'
import GallerySection from './MiniSite/GallerySection'
import ContactSection from './MiniSite/ContactSection'
import './MiniSite.css'

export default function MiniSite({ page }) {
  const renderSection = (section) => {
    switch (section.type) {
      case 'hero':
        return <HeroSection key={section.id} content={section.content} />
      case 'features':
        return <FeaturesSection key={section.id} content={section.content} />
      case 'gallery':
        return <GallerySection key={section.id} content={section.content} />
      case 'contact':
        return <ContactSection key={section.id} content={section.content} pageId={page.id} />
      default:
        return null
    }
  }

  return (
    <div className="minisite">
      {page.content.sections.length === 0 ? (
        <div className="minisite-empty">
          <h2>Your page is empty</h2>
          <p>Add sections to start building your page</p>
        </div>
      ) : (
        page.content.sections.map(renderSection)
      )}
    </div>
  )
}
