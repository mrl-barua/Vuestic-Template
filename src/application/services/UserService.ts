import type { User } from '@/domain/entities/User'
import type { IUserService, CreateUserRequest, UpdateUserRequest, ChangeUserStatusRequest, ChangeUserRoleRequest } from '@/domain/services/IUserService'
import type { IUserRepository, UserSearchCriteria, UserSearchResult, UserStatistics } from '@/domain/repositories/IUserRepository'
import { UserFactory } from '@/domain/entities/User'

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async createUser(request: CreateUserRequest): Promise<User> {
    // Validate request
    if (!request.email || !request.firstName || !request.lastName || !request.role) {
      throw new Error('Missing required fields')
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(request.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Create new user
    const user = UserFactory.create(
      Date.now().toString(),
      request.email,
      request.role,
      request.firstName,
      request.lastName,
      'pending' // New users start as pending
    )

    // Set custom preferences if provided
    if (request.profile) {
      user.profile = { ...user.profile, ...request.profile }
    }

    if (request.preferences) {
      user.preferences = { ...user.preferences, ...request.preferences }
    }

    // Save user
    return await this.userRepository.save(user)
  }

  async updateUser(request: UpdateUserRequest): Promise<User> {
    const user = await this.userRepository.findById({ value: request.id } as any)
    if (!user) {
      throw new Error('User not found')
    }

    // Update profile if provided
    if (request.profile) {
      user.profile = { ...user.profile, ...request.profile }
    }

    // Update preferences if provided
    if (request.preferences) {
      user.preferences = { ...user.preferences, ...request.preferences }
    }

    // Update timestamp
    user.updatedAt = new Date()

    return await this.userRepository.update(user)
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.userRepository.delete({ value: id } as any)
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findById({ value: id } as any)
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email)
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll()
  }

  async activateUser(id: string, activatedBy: string): Promise<User> {
    const user = await this.getUserById(id)
    if (!user) {
      throw new Error('User not found')
    }

    // Create new status
    const newStatus = {
      value: 'active' as const,
      reason: 'Activated by administrator',
      changedAt: new Date(),
      changedBy: activatedBy
    }

    // Update user
    const updatedUser = { ...user, status: newStatus, updatedAt: new Date() }
    return await this.userRepository.update(updatedUser)
  }

  async deactivateUser(id: string, deactivatedBy: string, reason?: string): Promise<User> {
    const user = await this.getUserById(id)
    if (!user) {
      throw new Error('User not found')
    }

    // Create new status
    const newStatus = {
      value: 'inactive' as const,
      reason: reason || 'Deactivated by administrator',
      changedAt: new Date(),
      changedBy: deactivatedBy
    }

    // Update user
    const updatedUser = { ...user, status: newStatus, updatedAt: new Date() }
    return await this.userRepository.update(updatedUser)
  }

  async suspendUser(id: string, suspendedBy: string, reason: string): Promise<User> {
    const user = await this.getUserById(id)
    if (!user) {
      throw new Error('User not found')
    }

    if (!reason) {
      throw new Error('Suspension reason is required')
    }

    // Create new status
    const newStatus = {
      value: 'suspended' as const,
      reason,
      changedAt: new Date(),
      changedBy: suspendedBy
    }

    // Update user
    const updatedUser = { ...user, status: newStatus, updatedAt: new Date() }
    return await this.userRepository.update(updatedUser)
  }

  async unsuspendUser(id: string, unsuspendedBy: string): Promise<User> {
    const user = await this.getUserById(id)
    if (!user) {
      throw new Error('User not found')
    }

    // Create new status
    const newStatus = {
      value: 'active' as const,
      reason: 'Suspension lifted by administrator',
      changedAt: new Date(),
      changedBy: unsuspendedBy
    }

    // Update user
    const updatedUser = { ...user, status: newStatus, updatedAt: new Date() }
    return await this.userRepository.update(updatedUser)
  }

  async changeUserRole(request: ChangeUserRoleRequest): Promise<User> {
    const user = await this.getUserById(request.id)
    if (!user) {
      throw new Error('User not found')
    }

    // Create new role
    const newRole = {
      value: request.role,
      permissions: [] // Will be set by the role constructor
    }

    // Update user
    const updatedUser = { 
      ...user, 
      role: newRole, 
      updatedAt: new Date() 
    }
    return await this.userRepository.update(updatedUser)
  }

  async getUserPermissions(id: string): Promise<string[]> {
    const user = await this.getUserById(id)
    if (!user) {
      throw new Error('User not found')
    }

    return user.role.permissions
  }

  async canUserPerformAction(userId: string, action: string): Promise<boolean> {
    const user = await this.getUserById(userId)
    if (!user) {
      return false
    }

    return user.role.can(action)
  }

  async searchUsers(criteria: UserSearchCriteria): Promise<UserSearchResult> {
    // This would require the extended repository interface
    if ('search' in this.userRepository) {
      return await (this.userRepository as any).search(criteria)
    }
    
    // Fallback to basic filtering
    let users = await this.userRepository.findAll()
    
    if (criteria.role) {
      users = users.filter(user => user.role.value === criteria.role)
    }
    
    if (criteria.status) {
      users = users.filter(user => user.status.value === criteria.status)
    }
    
    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase()
      users = users.filter(user => 
        user.profile.firstName.toLowerCase().includes(term) ||
        user.profile.lastName.toLowerCase().includes(term) ||
        user.email.value.toLowerCase().includes(term)
      )
    }
    
    const total = users.length
    const pageSize = criteria.limit || 10
    const page = Math.floor((criteria.offset || 0) / pageSize) + 1
    const totalPages = Math.ceil(total / pageSize)
    
    const start = criteria.offset || 0
    const end = start + pageSize
    const paginatedUsers = users.slice(start, end)
    
    return {
      users: paginatedUsers,
      total,
      page,
      pageSize,
      totalPages
    }
  }

  async getActiveUsers(): Promise<User[]> {
    return await this.userRepository.findActive()
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await this.userRepository.findByRole(role)
  }

  async getUsersByStatus(status: string): Promise<User[]> {
    return await this.userRepository.findByStatus(status)
  }

  async getUserStatistics(): Promise<UserStatistics> {
    if ('getStatistics' in this.userRepository) {
      return await (this.userRepository as any).getStatistics()
    }
    
    // Fallback to basic statistics
    const users = await this.userRepository.findAll()
    const totalUsers = users.length
    const activeUsers = users.filter(user => user.status.isActive()).length
    const pendingUsers = users.filter(user => user.status.requiresApproval()).length
    const suspendedUsers = users.filter(user => user.status.isSuspended()).length
    
    const usersByRole: Record<string, number> = {}
    const usersByStatus: Record<string, number> = {}
    
    users.forEach(user => {
      const role = user.role.value
      const status = user.status.value
      usersByRole[role] = (usersByRole[role] || 0) + 1
      usersByStatus[status] = (usersByStatus[status] || 0) + 1
    })
    
    return {
      totalUsers,
      activeUsers,
      pendingUsers,
      suspendedUsers,
      usersByRole,
      usersByStatus,
      newUsersThisMonth: 0,
      activeUsersThisMonth: 0
    }
  }

  async getUsersWithLowActivity(daysInactive: number): Promise<User[]> {
    if ('findUsersWithLowActivity' in this.userRepository) {
      return await (this.userRepository as any).findUsersWithLowActivity(daysInactive)
    }
    return []
  }

  async getNewUsersThisMonth(): Promise<User[]> {
    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)
    
    const users = await this.userRepository.findAll()
    return users.filter(user => user.createdAt >= thisMonth)
  }

  async bulkChangeUserStatus(userIds: string[], status: string, reason?: string, changedBy: string): Promise<number> {
    if ('bulkUpdateStatus' in this.userRepository) {
      const userIdObjects = userIds.map(id => ({ value: id } as any))
      return await (this.userRepository as any).bulkUpdateStatus(userIdObjects, status, reason)
    }
    
    // Fallback to individual updates
    let updatedCount = 0
    for (const userId of userIds) {
      try {
        switch (status) {
          case 'active':
            await this.activateUser(userId, changedBy)
            break
          case 'inactive':
            await this.deactivateUser(userId, changedBy, reason)
            break
          case 'suspended':
            if (reason) {
              await this.suspendUser(userId, changedBy, reason)
            }
            break
        }
        updatedCount++
      } catch (error) {
        console.error(`Failed to update user ${userId}:`, error)
      }
    }
    
    return updatedCount
  }

  async bulkChangeUserRole(userIds: string[], role: string, changedBy: string, reason?: string): Promise<number> {
    let updatedCount = 0
    
    for (const userId of userIds) {
      try {
        await this.changeUserRole({
          id: userId,
          role: role as any,
          changedBy,
          reason
        })
        updatedCount++
      } catch (error) {
        console.error(`Failed to update user role for ${userId}:`, error)
      }
    }
    
    return updatedCount
  }

  async updateUserPreferences(id: string, preferences: any): Promise<User> {
    return await this.updateUser({ id, preferences })
  }

  async getUserPreferences(id: string): Promise<any> {
    const user = await this.getUserById(id)
    if (!user) {
      throw new Error('User not found')
    }
    return user.preferences
  }

  async validateUserCredentials(email: string, password: string): Promise<User | null> {
    // In a real application, this would validate against hashed passwords
    const user = await this.getUserByEmail(email)
    if (!user || !user.status.canLogin()) {
      return null
    }
    
    // For demo purposes, accept any password
    // In production, you would hash and compare passwords
    return user
  }

  async changeUserPassword(id: string, oldPassword: string, newPassword: string): Promise<boolean> {
    // In a real application, this would validate old password and hash new password
    const user = await this.getUserById(id)
    if (!user) {
      return false
    }
    
    // For demo purposes, always return true
    // In production, you would implement proper password validation and hashing
    return true
  }

  async resetUserPassword(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email)
    if (!user) {
      return false
    }
    
    // In a real application, this would send a password reset email
    // For demo purposes, return true
    return true
  }

  async recordUserLogin(id: string): Promise<void> {
    const user = await this.getUserById(id)
    if (!user) {
      return
    }
    
    // Update last login time
    const updatedUser = { ...user, lastLoginAt: new Date(), updatedAt: new Date() }
    await this.userRepository.update(updatedUser)
  }

  async getUserActivity(id: string): Promise<any> {
    // In a real application, this would return user activity logs
    // For demo purposes, return mock activity
    return {
      lastLogin: new Date(),
      loginCount: Math.floor(Math.random() * 100),
      actions: ['login', 'profile_update', 'preferences_change']
    }
  }
}
