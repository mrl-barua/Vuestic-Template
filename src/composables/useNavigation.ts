import { ref } from 'vue'

export interface NavigationItem {
  name: string
  path: string
  icon?: string
  description?: string
}

export function useNavigation() {
  const navItems = ref<NavigationItem[]>([
    {
      name: 'Home',
      path: '/',
      icon: 'home',
      description: 'Welcome page with overview'
    },
    {
      name: 'Components',
      path: '/components',
      icon: 'widgets',
      description: 'UI component examples'
    },
    {
      name: 'Forms',
      path: '/forms',
      icon: 'edit',
      description: 'Form handling examples'
    },
    {
      name: 'Data',
      path: '/data',
      icon: 'data_usage',
      description: 'Data management examples'
    }
  ])

  const addNavItem = (item: NavigationItem) => {
    navItems.value.push(item)
  }

  const removeNavItem = (path: string) => {
    const index = navItems.value.findIndex(item => item.path === path)
    if (index > -1) {
      navItems.value.splice(index, 1)
    }
  }

  const updateNavItem = (path: string, updates: Partial<NavigationItem>) => {
    const item = navItems.value.find(item => item.path === path)
    if (item) {
      Object.assign(item, updates)
    }
  }

  return {
    navItems,
    addNavItem,
    removeNavItem,
    updateNavItem
  }
}
