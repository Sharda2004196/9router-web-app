import { getThemeClassName } from '../lib/themes'
import MiniSite from './MiniSite'
import './PreviewFrame.css'

export default function PreviewFrame({ page, viewportMode }) {
  const themeClass = getThemeClassName(page.theme)

  const viewportWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px'
  }

  return (
    <div className="preview-frame">
      <div
        className="preview-container"
        style={{
          width: viewportWidths[viewportMode],
          maxWidth: '100%'
        }}
      >
        <div className={`preview-content ${themeClass}`}>
          <MiniSite page={page} />
        </div>
      </div>
    </div>
  )
}
