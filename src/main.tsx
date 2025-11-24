import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TextSizeProvider } from './contexts/TextSizeContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { VoiceFeedbackProvider } from './contexts/VoiceFeedbackContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VoiceFeedbackProvider>
      <ThemeProvider>
        <TextSizeProvider>
          <App />
        </TextSizeProvider>
      </ThemeProvider>
    </VoiceFeedbackProvider>
  </StrictMode>,
)
