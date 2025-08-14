export interface UserId {
  value: string
}

export interface UserEmail {
  value: string
  isValid(): boolean
}

export interface UserRole {
  value: 'admin' | 'user' | 'moderator'
  permissions: string[]
  can(permission: string): boolean
}

export interface UserProfile {
  firstName: string
  lastName: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
}

export interface UserStatus {
  value: 'active' | 'inactive' | 'pending' | 'suspended'
  reason?: string
  changedAt: Date
  changedBy?: string
}

export interface User {
  id: UserId
  email: UserEmail
  role: UserRole
  profile: UserProfile
  status: UserStatus
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: NotificationSettings
  privacy: PrivacySettings
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  marketing: boolean
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends'
  showEmail: boolean
  showLocation: boolean
  allowSearch: boolean
}

// Value Objects
export class UserIdValue implements UserId {
  constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('User ID cannot be empty')
    }
  }

  equals(other: UserId): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}

export class UserEmailValue implements UserEmail {
  constructor(public readonly value: string) {
    if (!this.isValid()) {
      throw new Error('Invalid email format')
    }
  }

  isValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(this.value)
  }

  getDomain(): string {
    return this.value.split('@')[1]
  }

  toString(): string {
    return this.value
  }
}

export class UserRoleValue implements UserRole {
  constructor(
    public readonly value: 'admin' | 'user' | 'moderator',
    public readonly permissions: string[] = []
  ) {
    this.permissions = this.getDefaultPermissions()
  }

  private getDefaultPermissions(): string[] {
    switch (this.value) {
      case 'admin':
        return ['read', 'write', 'delete', 'manage_users', 'manage_system']
      case 'moderator':
        return ['read', 'write', 'moderate_content', 'manage_users']
      case 'user':
        return ['read', 'write']
      default:
        return ['read']
    }
  }

  can(permission: string): boolean {
    return this.permissions.includes(permission)
  }

  isAdmin(): boolean {
    return this.value === 'admin'
  }

  isModerator(): boolean {
    return this.value === 'moderator'
  }

  isUser(): boolean {
    return this.value === 'user'
  }
}

export class UserStatusValue implements UserStatus {
  constructor(
    public readonly value: 'active' | 'inactive' | 'pending' | 'suspended',
    public readonly reason?: string,
    public readonly changedAt: Date = new Date(),
    public readonly changedBy?: string
  ) {}

  isActive(): boolean {
    return this.value === 'active'
  }

  canLogin(): boolean {
    return this.value === 'active'
  }

  requiresApproval(): boolean {
    return this.value === 'pending'
  }

  isSuspended(): boolean {
    return this.value === 'suspended'
  }
}

// Factory for creating User entities
export class UserFactory {
  static create(
    id: string,
    email: string,
    role: 'admin' | 'user' | 'moderator',
    firstName: string,
    lastName: string,
    status: 'active' | 'inactive' | 'pending' | 'suspended' = 'pending'
  ): User {
    return {
      id: new UserIdValue(id),
      email: new UserEmailValue(email),
      role: new UserRoleValue(role),
      profile: {
        firstName,
        lastName,
        avatar: undefined,
        bio: undefined,
        location: undefined,
        website: undefined
      },
      status: new UserStatusValue(status),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: undefined,
      preferences: {
        theme: 'system',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false,
          marketing: false
        },
        privacy: {
          profileVisibility: 'public',
          showEmail: false,
          showLocation: false,
          allowSearch: true
        }
      }
    }
  }

  static fromData(data: any): User {
    return {
      id: new UserIdValue(data.id),
      email: new UserEmailValue(data.email),
      role: new UserRoleValue(data.role),
      profile: data.profile,
      status: new UserStatusValue(
        data.status.value || data.status,
        data.status.reason,
        new Date(data.status.changedAt || data.updatedAt),
        data.status.changedBy
      ),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      lastLoginAt: data.lastLoginAt ? new Date(data.lastLoginAt) : undefined,
      preferences: data.preferences
    }
  }
}
