import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { NotificationsProvider } from './context/NotificationsContext'
import AppRoutes from './routes'
import VideoBackground from './components/VideoBackground'
import MobileNav from './components/MobileNav'

export default function App() {
  return (
    <ThemeProvider>
      <NotificationsProvider>
        <BrowserRouter>
          <VideoBackground />
          <div className="mobile-container">
            <AppRoutes />
            <MobileNav />
          </div>
        </BrowserRouter>
      </NotificationsProvider>
    </ThemeProvider>
  )
}
