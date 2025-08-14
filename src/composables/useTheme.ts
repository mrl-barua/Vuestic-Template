import { ref, watch, onMounted } from 'vue'

export function useTheme() {
  const isDark = ref(false)
  const isInitialized = ref(false)

  // Initialize theme from localStorage or system preference
  const initTheme = () => {
    try {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        isDark.value = savedTheme === 'dark'
      } else {
        // Check system preference
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      applyTheme()
      isInitialized.value = true
    } catch (error) {
      console.error('Failed to initialize theme:', error)
      // Fallback to light theme
      isDark.value = false
      applyTheme()
      isInitialized.value = true
    }
  }

  // Apply theme to document
  const applyTheme = () => {
    try {
      // Remove any existing theme classes first
      document.documentElement.classList.remove('light', 'dark')
      
      if (isDark.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.add('light')
      }
    } catch (error) {
      console.error('Failed to apply theme:', error)
    }
  }

  // Toggle theme
  const toggleTheme = () => {
    isDark.value = !isDark.value
    try {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
      applyTheme()
    } catch (error) {
      console.error('Failed to save theme preference:', error)
    }
  }

  // Watch for system theme changes
  const setupSystemThemeListener = () => {
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem('theme')) {
          isDark.value = e.matches
          applyTheme()
        }
      }
      
      mediaQuery.addEventListener('change', handleChange)
      
      // Return cleanup function
      return () => mediaQuery.removeEventListener('change', handleChange)
    } catch (error) {
      console.error('Failed to setup system theme listener:', error)
      return () => {}
    }
  }

  // Initialize on mount
  onMounted(() => {
    // Apply theme immediately to prevent flash
    initTheme()
    const cleanup = setupSystemThemeListener()
    
    // Cleanup on unmount (though this composable is typically used at app level)
    return cleanup
  })

  return {
    isDark,
    isInitialized,
    toggleTheme,
    applyTheme
  }
}
