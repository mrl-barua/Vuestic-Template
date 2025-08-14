import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  name: string
  email: string
  role: string
  isActive: boolean
  lastLogin?: string
}

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)

  // Getters
  const activeUsers = computed(() => 
    users.value.filter(user => user.isActive)
  )

  const usersByRole = computed(() => {
    const grouped: Record<string, User[]> = {}
    users.value.forEach(user => {
      if (!grouped[user.role]) {
        grouped[user.role] = []
      }
      grouped[user.role].push(user)
    })
    return grouped
  })

  const totalUsers = computed(() => users.value.length)

  // Actions
  const fetchUsers = async () => {
    isLoading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Sample data
      const sampleUsers: User[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin',
          isActive: true,
          lastLogin: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'user',
          isActive: true,
          lastLogin: '2024-01-14T15:45:00Z'
        },
        {
          id: 3,
          name: 'Bob Johnson',
          email: 'bob@example.com',
          role: 'moderator',
          isActive: false,
          lastLogin: '2024-01-10T09:20:00Z'
        }
      ]
      
      users.value = sampleUsers
    } catch (error) {
      console.error('Failed to fetch users:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: Date.now() + Math.random()
    }
    users.value.push(newUser)
    return newUser
  }

  const updateUser = (id: number, updates: Partial<User>) => {
    const index = users.value.findIndex(user => user.id === id)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updates }
      return users.value[index]
    }
    return null
  }

  const deleteUser = (id: number) => {
    const index = users.value.findIndex(user => user.id === id)
    if (index !== -1) {
      users.value.splice(index, 1)
      return true
    }
    return false
  }

  const setCurrentUser = (user: User | null) => {
    currentUser.value = user
  }

  const login = async (email: string, password: string) => {
    // Simulate authentication
    const user = users.value.find(u => u.email === email)
    if (user && user.isActive) {
      currentUser.value = user
      return user
    }
    throw new Error('Invalid credentials')
  }

  const logout = () => {
    currentUser.value = null
  }

  return {
    // State
    users,
    currentUser,
    isLoading,
    
    // Getters
    activeUsers,
    usersByRole,
    totalUsers,
    
    // Actions
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    setCurrentUser,
    login,
    logout
  }
})
