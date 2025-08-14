import type { User, UserId } from '@/domain/entities/User'
import type { 
  IUserRepository, 
  UserSearchCriteria, 
  UserSearchResult, 
  UserStatistics 
} from '@/domain/repositories/IUserRepository'
import { enhancedMockUsers, mockUserCategories, mockUserStatuses } from '@/infrastructure/data/mockUsers'

export class MockUserRepository implements IUserRepository {
  private users: User[] = [...enhancedMockUsers]

  async findById(id: UserId): Promise<User | null> {
    return this.users.find(user => user.id.value === id.value) || null
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email.value === email) || null
  }

  async findAll(): Promise<User[]> {
    return [...this.users]
  }

  async findActive(): Promise<User[]> {
    return this.users.filter(user => user.status.isActive())
  }

  async findByRole(role: string): Promise<User[]> {
    return this.users.filter(user => user.role.value === role)
  }

  async findByStatus(status: string): Promise<User[]> {
    return this.users.filter(user => user.status.value === status)
  }

  async save(user: User): Promise<User> {
    const existingIndex = this.users.findIndex(u => u.id.value === user.id.value)
    if (existingIndex >= 0) {
      this.users[existingIndex] = user
    } else {
      this.users.push(user)
    }
    return user
  }

  async update(user: User): Promise<User> {
    const index = this.users.findIndex(u => u.id.value === user.id.value)
    if (index >= 0) {
      this.users[index] = user
      return user
    }
    throw new Error('User not found')
  }

  async delete(id: UserId): Promise<boolean> {
    const index = this.users.findIndex(u => u.id.value === id.value)
    if (index >= 0) {
      this.users.splice(index, 1)
      return true
    }
    return false
  }

  async exists(id: UserId): Promise<boolean> {
    return this.users.some(user => user.id.value === id.value)
  }

  async count(): Promise<number> {
    return this.users.length
  }

  async countByStatus(status: string): Promise<number> {
    return this.users.filter(user => user.status.value === status).length
  }

  async countByRole(role: string): Promise<number> {
    return this.users.filter(user => user.role.value === role).length
  }
}

export class MockUserRepositoryExtended extends MockUserRepository {
  async search(criteria: UserSearchCriteria): Promise<UserSearchResult> {
    let filteredUsers = [...enhancedMockUsers]

    // Apply filters
    if (criteria.role) {
      filteredUsers = filteredUsers.filter(user => user.role.value === criteria.role)
    }

    if (criteria.status) {
      filteredUsers = filteredUsers.filter(user => user.status.value === criteria.status)
    }

    if (criteria.isActive !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.status.isActive() === criteria.isActive)
    }

    if (criteria.createdAfter) {
      filteredUsers = filteredUsers.filter(user => user.createdAt >= criteria.createdAfter!)
    }

    if (criteria.createdBefore) {
      filteredUsers = filteredUsers.filter(user => user.createdAt <= criteria.createdBefore!)
    }

    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase()
      filteredUsers = filteredUsers.filter(user => 
        user.profile.firstName.toLowerCase().includes(term) ||
        user.profile.lastName.toLowerCase().includes(term) ||
        user.email.value.toLowerCase().includes(term) ||
        user.profile.bio?.toLowerCase().includes(term) ||
        user.profile.location?.toLowerCase().includes(term)
      )
    }

    // Apply sorting
    if (criteria.sortBy) {
      filteredUsers.sort((a, b) => {
        let aValue: any, bValue: any
        
        switch (criteria.sortBy) {
          case 'firstName':
            aValue = a.profile.firstName
            bValue = b.profile.firstName
            break
          case 'lastName':
            aValue = a.profile.lastName
            bValue = b.profile.lastName
            break
          case 'email':
            aValue = a.email.value
            bValue = b.email.value
            break
          case 'role':
            aValue = a.role.value
            bValue = b.role.value
            break
          case 'status':
            aValue = a.status.value
            bValue = b.status.value
            break
          case 'createdAt':
            aValue = a.createdAt
            bValue = b.createdAt
            break
          case 'updatedAt':
            aValue = a.updatedAt
            bValue = b.updatedAt
            break
          default:
            aValue = a.profile.firstName
            bValue = b.profile.firstName
        }

        if (aValue < bValue) return criteria.sortOrder === 'desc' ? 1 : -1
        if (aValue > bValue) return criteria.sortOrder === 'desc' ? -1 : 1
        return 0
      })
    }

    const total = filteredUsers.length
    const pageSize = criteria.limit || 10
    const page = Math.floor((criteria.offset || 0) / pageSize) + 1
    const totalPages = Math.ceil(total / pageSize)

    // Apply pagination
    const start = criteria.offset || 0
    const end = start + pageSize
    const paginatedUsers = filteredUsers.slice(start, end)

    return {
      users: paginatedUsers,
      total,
      page,
      pageSize,
      totalPages
    }
  }

  async findUsersWithLowActivity(daysInactive: number): Promise<User[]> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysInactive)
    
    return enhancedMockUsers.filter(user => 
      !user.lastLoginAt || user.lastLoginAt < cutoffDate
    )
  }

  async findUsersByPermission(permission: string): Promise<User[]> {
    return enhancedMockUsers.filter(user => user.role.can(permission))
  }

  async bulkUpdateStatus(userIds: UserId[], status: string, reason?: string): Promise<number> {
    let updatedCount = 0
    
    for (const userId of userIds) {
      const user = await this.findById(userId)
      if (user) {
        // Create new status object
        const newStatus = {
          value: status as any,
          reason,
          changedAt: new Date(),
          changedBy: 'system'
        }
        
        // Update user with new status
        const updatedUser = { ...user, status: newStatus }
        await this.update(updatedUser)
        updatedCount++
      }
    }
    
    return updatedCount
  }

  async getStatistics(): Promise<UserStatistics> {
    const totalUsers = enhancedMockUsers.length
    const activeUsers = enhancedMockUsers.filter(user => user.status.isActive()).length
    const pendingUsers = enhancedMockUsers.filter(user => user.status.requiresApproval()).length
    const suspendedUsers = enhancedMockUsers.filter(user => user.status.isSuspended()).length

    const usersByRole: Record<string, number> = {}
    const usersByStatus: Record<string, number> = {}

    // Count by role
    enhancedMockUsers.forEach(user => {
      const role = user.role.value
      usersByRole[role] = (usersByRole[role] || 0) + 1
    })

    // Count by status
    enhancedMockUsers.forEach(user => {
      const status = user.status.value
      usersByStatus[status] = (usersByStatus[status] || 0) + 1
    })

    // Calculate new users this month
    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)
    
    const newUsersThisMonth = enhancedMockUsers.filter(user => 
      user.createdAt >= thisMonth
    ).length

    // Calculate active users this month
    const activeUsersThisMonth = enhancedMockUsers.filter(user => 
      user.lastLoginAt && user.lastLoginAt >= thisMonth
    ).length

    return {
      totalUsers,
      activeUsers,
      pendingUsers,
      suspendedUsers,
      usersByRole,
      usersByStatus,
      newUsersThisMonth,
      activeUsersThisMonth
    }
  }
}
