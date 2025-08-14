import type { User, UserId } from '../entities/User'
import type { UserSearchCriteria, UserSearchResult, UserStatistics } from '../repositories/IUserRepository'

export interface CreateUserRequest {
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'user' | 'moderator'
  password: string
  profile?: {
    bio?: string
    location?: string
    website?: string
  }
  preferences?: {
    theme?: 'light' | 'dark' | 'system'
    language?: string
    notifications?: {
      email?: boolean
      push?: boolean
      sms?: boolean
      marketing?: boolean
    }
    privacy?: {
      profileVisibility?: 'public' | 'private' | 'friends'
      showEmail?: boolean
      showLocation?: boolean
      allowSearch?: boolean
    }
  }
}

export interface UpdateUserRequest {
  id: string
  profile?: Partial<{
    firstName: string
    lastName: string
    bio: string
    location: string
    website: string
    avatar: string
  }>
  preferences?: Partial<{
    theme: 'light' | 'dark' | 'system'
    language: string
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
      marketing: boolean
    }
    privacy: {
      profileVisibility: 'public' | 'private' | 'friends'
      showEmail: boolean
      showLocation: boolean
      allowSearch: boolean
    }
  }>
}

export interface ChangeUserStatusRequest {
  id: string
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  reason?: string
  changedBy: string
}

export interface ChangeUserRoleRequest {
  id: string
  role: 'admin' | 'user' | 'moderator'
  changedBy: string
  reason?: string
}

export interface IUserService {
  // User Management
  createUser(request: CreateUserRequest): Promise<User>
  updateUser(request: UpdateUserRequest): Promise<User>
  deleteUser(id: string): Promise<boolean>
  getUserById(id: string): Promise<User | null>
  getUserByEmail(email: string): Promise<User | null>
  
  // User Status Management
  activateUser(id: string, activatedBy: string): Promise<User>
  deactivateUser(id: string, deactivatedBy: string, reason?: string): Promise<User>
  suspendUser(id: string, suspendedBy: string, reason: string): Promise<User>
  unsuspendUser(id: string, unsuspendedBy: string): Promise<User>
  
  // User Role Management
  changeUserRole(request: ChangeUserRoleRequest): Promise<User>
  getUserPermissions(id: string): Promise<string[]>
  canUserPerformAction(userId: string, action: string): Promise<boolean>
  
  // User Search and Queries
  searchUsers(criteria: UserSearchCriteria): Promise<UserSearchResult>
  getActiveUsers(): Promise<User[]>
  getUsersByRole(role: string): Promise<User[]>
  getUsersByStatus(status: string): Promise<User[]>
  findAll(): Promise<User[]>
  
  // User Statistics and Analytics
  getUserStatistics(): Promise<UserStatistics>
  getUsersWithLowActivity(daysInactive: number): Promise<User[]>
  getNewUsersThisMonth(): Promise<User[]>
  
  // Bulk Operations
  bulkChangeUserStatus(userIds: string[], status: string, reason?: string, changedBy: string): Promise<number>
  bulkChangeUserRole(userIds: string[], role: string, changedBy: string, reason?: string): Promise<number>
  
  // User Preferences and Settings
  updateUserPreferences(id: string, preferences: any): Promise<User>
  getUserPreferences(id: string): Promise<any>
  
  // Authentication and Security
  validateUserCredentials(email: string, password: string): Promise<User | null>
  changeUserPassword(id: string, oldPassword: string, newPassword: string): Promise<boolean>
  resetUserPassword(email: string): Promise<boolean>
  
  // User Activity
  recordUserLogin(id: string): Promise<void>
  getUserActivity(id: string): Promise<any>
}
