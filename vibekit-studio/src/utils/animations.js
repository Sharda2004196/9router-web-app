// Intersection Observer for fade-up animations
export function initFadeUpAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-up-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  )

  document.querySelectorAll('.fade-up').forEach((el) => {
    observer.observe(el)
  })
}

// Stagger animation for lists
export function initStaggerAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const children = entry.target.querySelectorAll('.stagger-item')
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('stagger-visible')
            }, index * 100)
          })
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1
    }
  )

  document.querySelectorAll('.stagger-container').forEach((el) => {
    observer.observe(el)
  })
}

// Slide-in animation
export function initSlideInAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-in-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1
    }
  )

  document.querySelectorAll('.slide-in-left, .slide-in-right').forEach((el) => {
    observer.observe(el)
  })
}
