import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { NotificationsProvider } from './context/NotificationsContext'
import { SoundProvider } from './context/SoundContext'
import AppRoutes from './routes'
import VideoBackground from './components/VideoBackground'
import MobileNav from './components/MobileNav'
import SoundController from './components/SoundController'

export default function App() {
  return (
    <SoundProvider>
      <ThemeProvider>
        <NotificationsProvider>
          <BrowserRouter>
            <VideoBackground />
            <SoundController />
            <div className="mobile-container">
              <AppRoutes />
              <MobileNav />
            </div>
          </BrowserRouter>
        </NotificationsProvider>
      </ThemeProvider>
    </SoundProvider>
  )
}
