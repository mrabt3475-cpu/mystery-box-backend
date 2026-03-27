import { useState, useEffect, createContext, useContext } from 'react'

// Theme Context
const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('athena-theme')
    if (saved) {
      setTheme(saved)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('athena-theme', theme)
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme, isLoaded])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
