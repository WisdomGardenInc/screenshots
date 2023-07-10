import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'

const mouseMove = (event) => {
  const touch = event.touches[0]
  const mouseEvent = new MouseEvent('mousemove', {
    clientX: touch.clientX,
    clientY: touch.clientY
  })
  window.dispatchEvent(mouseEvent)
}

const mouseUp = (event) => {
  const touch = event.changedTouches[0]
  const mouseEvent = new MouseEvent('mouseup', {
    clientX: touch.clientX,
    clientY: touch.clientY
  })
  window.dispatchEvent(mouseEvent)
}

document.removeEventListener('touchmove', mouseMove)
document.removeEventListener('touchend', mouseUp)
document.addEventListener('touchmove', mouseMove)
document.addEventListener('touchend', mouseUp)

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
