import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { NotificationsProvider } from './context/NotificationsContext'
import { SoundProvider } from './context/SoundContext'
import { VFXProvider } from './context/VFXContext'
import AppRoutes from './routes'
import VideoBackground from './components/VideoBackground'
import MobileNav from './components/MobileNav'
import VisualEffects from './components/VisualEffects'

export default function App() {
  return (
    <VFXProvider>
      <SoundProvider>
        <ThemeProvider>
          <NotificationsProvider>
            <BrowserRouter>
              <VideoBackground />
              <VisualEffects />
              <div className="mobile-container">
                <AppRoutes />
                <MobileNav />
              </div>
            </BrowserRouter>
          </NotificationsProvider>
        </ThemeProvider>
      </SoundProvider>
    </VFXProvider>
  )
}
