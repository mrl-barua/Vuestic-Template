import { ref } from 'vue'

export interface NavigationItem {
  name: string
  path: string
  icon?: string
  description?: string
  badge?: string | number
  children?: NavigationItem[]
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
      name: 'Dashboard',
      path: '/dashboard',
      icon: 'dashboard',
      description: 'Real-time application overview',
      badge: 'New'
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

  const getNavItemByPath = (path: string): NavigationItem | undefined => {
    return navItems.value.find(item => item.path === path)
  }

  const getBreadcrumbs = (currentPath: string): NavigationItem[] => {
    const breadcrumbs: NavigationItem[] = []
    const currentItem = getNavItemByPath(currentPath)
    
    if (currentItem) {
      breadcrumbs.push(currentItem)
    }
    
    return breadcrumbs
  }

  return {
    navItems,
    addNavItem,
    removeNavItem,
    updateNavItem,
    getNavItemByPath,
    getBreadcrumbs
  }
}
