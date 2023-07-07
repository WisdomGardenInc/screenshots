import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'

document.addEventListener('touchmove', function (event) {
  const touch = event.touches[0]
  const mouseEvent = new MouseEvent('mousemove', {
    clientX: touch.clientX,
    clientY: touch.clientY
  })
  window.dispatchEvent(mouseEvent)
})

document.addEventListener('touchend', function (event) {
  const touch = event.changedTouches[0]
  const mouseEvent = new MouseEvent('mouseup', {
    clientX: touch.clientX,
    clientY: touch.clientY
  })
  window.dispatchEvent(mouseEvent)
})

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
