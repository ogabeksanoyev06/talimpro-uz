// plugins/lazy-load-image.js

import { DirectiveBinding } from 'vue'

export function VLazyLoad(el: HTMLElement, binding: DirectiveBinding) {
  // Options for the Intersection Observer
  const options = {
    rootMargin: '0px',
    threshold: 0.5,
  }

  // Add the 'image-loading' class to the element
  el.classList.add('image-loading')

  // Intersection Observer callback
  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Create an image element
        const img = new Image()

        const image = el.getElementsByTagName('IMG')[0]
        // Set up the onLoad and onError callbacks
        img.onload = () => {
          image.src = binding.value
          el.classList.remove('image-loading')
          el.classList.remove('error') // Remove error class if image is successfully loaded
          observer.unobserve(el)
        }

        img.onerror = () => {
          image.src =
            el.attributes['error-state']?.value || `/images/default.svg` // Use default loading image if provided, otherwise, clear the src
          el.classList.remove('image-loading')
          el.classList.add('error')
          observer.unobserve(el)
        }

        // Start loading the image
        img.src = binding.value
      }
    })
  }

  // Create Intersection Observer
  const observer = new IntersectionObserver(callback, options)

  // Start observing the element
  observer.observe(el)
}
