import type { User, UserId } from '../entities/User'

export interface IUserRepository {
  findById(id: UserId): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(): Promise<User[]>
  findActive(): Promise<User[]>
  findByRole(role: string): Promise<User[]>
  findByStatus(status: string): Promise<User[]>
  save(user: User): Promise<User>
  update(user: User): Promise<User>
  delete(id: UserId): Promise<boolean>
  exists(id: UserId): Promise<boolean>
  count(): Promise<number>
  countByStatus(status: string): Promise<number>
  countByRole(role: string): Promise<number>
}

export interface UserSearchCriteria {
  role?: string
  status?: string
  isActive?: boolean
  createdAfter?: Date
  createdBefore?: Date
  searchTerm?: string
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface UserSearchResult {
  users: User[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface IUserRepositoryExtended extends IUserRepository {
  search(criteria: UserSearchCriteria): Promise<UserSearchResult>
  findUsersWithLowActivity(daysInactive: number): Promise<User[]>
  findUsersByPermission(permission: string): Promise<User[]>
  bulkUpdateStatus(userIds: UserId[], status: string, reason?: string): Promise<number>
  getStatistics(): Promise<UserStatistics>
}

export interface UserStatistics {
  totalUsers: number
  activeUsers: number
  pendingUsers: number
  suspendedUsers: number
  usersByRole: Record<string, number>
  usersByStatus: Record<string, number>
  newUsersThisMonth: number
  activeUsersThisMonth: number
}
