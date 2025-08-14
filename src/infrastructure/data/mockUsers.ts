import type { User } from '@/domain/entities/User'
import { UserFactory } from '@/domain/entities/User'

export const mockUsers: User[] = [
  UserFactory.create(
    '1',
    'admin@company.com',
    'admin',
    'John',
    'Admin',
    'active'
  ),
  UserFactory.create(
    '2',
    'sarah.johnson@company.com',
    'moderator',
    'Sarah',
    'Johnson',
    'active'
  ),
  UserFactory.create(
    '3',
    'mike.chen@company.com',
    'user',
    'Mike',
    'Chen',
    'active'
  ),
  UserFactory.create(
    '4',
    'emma.wilson@company.com',
    'user',
    'Emma',
    'Wilson',
    'pending'
  ),
  UserFactory.create(
    '5',
    'david.brown@company.com',
    'user',
    'David',
    'Brown',
    'active'
  ),
  UserFactory.create(
    '6',
    'lisa.garcia@company.com',
    'moderator',
    'Lisa',
    'Garcia',
    'active'
  ),
  UserFactory.create(
    '7',
    'james.lee@company.com',
    'user',
    'James',
    'Lee',
    'suspended'
  ),
  UserFactory.create(
    '8',
    'anna.martinez@company.com',
    'user',
    'Anna',
    'Martinez',
    'active'
  ),
  UserFactory.create(
    '9',
    'robert.taylor@company.com',
    'user',
    'Robert',
    'Taylor',
    'inactive'
  ),
  UserFactory.create(
    '10',
    'maria.rodriguez@company.com',
    'user',
    'Maria',
    'Rodriguez',
    'active'
  )
]

// Enhance mock users with additional data
export const enhancedMockUsers = mockUsers.map((user, index) => {
  const enhancedUser = { ...user }
  
  // Add profile information
  enhancedUser.profile = {
    ...enhancedUser.profile,
    bio: [
      'Experienced software engineer with a passion for clean code and user experience.',
      'Creative designer focused on intuitive interfaces and beautiful user experiences.',
      'Data scientist specializing in machine learning and predictive analytics.',
      'Product manager with expertise in agile methodologies and user research.',
      'Full-stack developer with strong backend and frontend skills.',
      'UX researcher passionate about understanding user needs and behaviors.',
      'DevOps engineer with experience in cloud infrastructure and automation.',
      'Marketing specialist with expertise in digital campaigns and analytics.',
      'Business analyst with strong analytical and communication skills.',
      'Customer success manager dedicated to ensuring customer satisfaction.'
    ][index] || 'Passionate professional committed to excellence.',
    location: [
      'San Francisco, CA',
      'New York, NY',
      'Seattle, WA',
      'Austin, TX',
      'Boston, MA',
      'Denver, CO',
      'Chicago, IL',
      'Los Angeles, CA',
      'Portland, OR',
      'Miami, FL'
    ][index] || 'United States',
    website: [
      'https://johnadmin.dev',
      'https://sarahjohnson.design',
      'https://mikechen.tech',
      'https://emmawilson.product',
      'https://davidbrown.code',
      'https://lisagarcia.ux',
      'https://jameslee.devops',
      'https://annamartinez.marketing',
      'https://roberttaylor.business',
      'https://mariarodriguez.success'
    ][index] || 'https://example.com',
    avatar: `https://i.pravatar.cc/150?img=${index + 1}`
  }

  // Add preferences
  enhancedUser.preferences = {
    ...enhancedUser.preferences,
    theme: ['light', 'dark', 'system', 'light', 'dark', 'system', 'light', 'dark', 'system', 'light'][index] as 'light' | 'dark' | 'system',
    language: ['en', 'en', 'en', 'es', 'en', 'en', 'en', 'en', 'en', 'es'][index],
    notifications: {
      email: true,
      push: [true, false, true, false, true, false, true, false, true, false][index],
      sms: false,
      marketing: [true, false, true, false, true, false, true, false, true, false][index]
    },
    privacy: {
      profileVisibility: ['public', 'private', 'public', 'friends', 'public', 'private', 'public', 'friends', 'public', 'private'][index] as 'public' | 'private' | 'friends',
      showEmail: false,
      showLocation: [true, false, true, false, true, false, true, false, true, false][index],
      allowSearch: true
    }
  }

  // Add timestamps
  const baseDate = new Date('2024-01-01')
  enhancedUser.createdAt = new Date(baseDate.getTime() + (index * 24 * 60 * 60 * 1000))
  enhancedUser.updatedAt = new Date(enhancedUser.createdAt.getTime() + (Math.random() * 30 * 24 * 60 * 60 * 1000))
  enhancedUser.lastLoginAt = new Date(enhancedUser.updatedAt.getTime() - (Math.random() * 7 * 24 * 60 * 60 * 1000))

  return enhancedUser
})

export const mockUserCategories = [
  { id: 'admin', name: 'Administrators', count: 1, color: 'danger' },
  { id: 'moderator', name: 'Moderators', count: 2, color: 'warning' },
  { id: 'user', name: 'Regular Users', count: 7, color: 'primary' }
]

export const mockUserStatuses = [
  { id: 'active', name: 'Active', count: 6, color: 'success' },
  { id: 'pending', name: 'Pending', count: 1, color: 'warning' },
  { id: 'inactive', name: 'Inactive', count: 1, color: 'secondary' },
  { id: 'suspended', name: 'Suspended', count: 1, color: 'danger' }
]

export const mockUserActivity = [
  { userId: '1', action: 'login', timestamp: new Date(), ip: '192.168.1.100' },
  { userId: '2', action: 'profile_update', timestamp: new Date(), ip: '192.168.1.101' },
  { userId: '3', action: 'login', timestamp: new Date(), ip: '192.168.1.102' },
  { userId: '4', action: 'register', timestamp: new Date(), ip: '192.168.1.103' },
  { userId: '5', action: 'login', timestamp: new Date(), ip: '192.168.1.104' }
]
