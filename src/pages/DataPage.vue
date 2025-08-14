<template>
  <div class="data-page">
    <!-- Page Header -->
    <div class="page-header-container mb-16">
      <div class="page-header-content">
        <div class="page-header-text">
          <h1 class="page-title">Data Management</h1>
          <p class="page-subtitle">Manage and analyze your application data</p>
        </div>
        <div class="page-header-actions">
          <va-button
            color="primary"
            @click="refreshData"
            class="refresh-button"
          >
            <va-icon name="refresh" class="mr-2" />
            Refresh
          </va-button>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="stats-grid mb-16">
      <va-card class="stat-card" v-for="stat in quickStats" :key="stat.label">
        <va-card-content class="stat-content">
          <div class="stat-icon">
            <div class="icon-background" :style="{ backgroundColor: stat.color + '15' }">
              <va-icon
                :name="stat.icon"
                size="large"
                :color="stat.color"
              />
            </div>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-change" :class="stat.trend">
              <va-icon :name="stat.trend === 'up' ? 'arrow_upward' : 'arrow_downward'" />
              {{ stat.change }}%
            </div>
          </div>
        </va-card-content>
      </va-card>
    </div>

    <!-- Charts Section -->
    <div class="charts-section mb-16">
      <div class="section-header mb-12">
        <h2 class="section-title">Data Analytics</h2>
        <p class="section-subtitle">Visual insights and trends</p>
      </div>
      <div class="charts-grid">
        <va-card class="chart-card">
          <va-card-title class="chart-title">
            <div class="title-content">
              <div class="title-icon">
                <va-icon name="insert_chart" />
              </div>
              <h3>Monthly Trends</h3>
            </div>
          </va-card-title>
          <va-card-content class="chart-content p-6">
            <div class="chart-bars">
              <div
                v-for="(bar, index) in chartData"
                :key="index"
                class="chart-bar"
                :style="getChartBarStyle(bar.value, bar.color)"
              >
                <span class="bar-label">{{ bar.label }}</span>
                <span class="bar-value">{{ bar.value }}</span>
              </div>
            </div>
          </va-card-content>
        </va-card>

        <va-card class="chart-card">
          <va-card-title class="chart-title">
            <div class="title-content">
              <div class="title-icon">
                <va-icon name="pie_chart" />
              </div>
              <h3>Data Distribution</h3>
            </div>
          </va-card-title>
          <va-card-content class="chart-content p-6">
            <div class="pie-chart-placeholder">
              <va-icon name="pie_chart" size="x-large" color="primary" />
              <p>Pie chart visualization</p>
              <p class="text-caption">Data distribution analysis</p>
            </div>
          </va-card-content>
        </va-card>
      </div>
    </div>

    <!-- Data Summary -->
    <div class="summary-section mb-16">
      <div class="section-header mb-12">
        <h2 class="section-title">Data Summary</h2>
        <p class="section-subtitle">Key insights and overview</p>
      </div>
      <va-card class="summary-card">
        <va-card-content class="summary-content p-6">
          <div class="summary-grid">
            <div class="summary-item" v-for="item in summaryItems" :key="item.label">
              <div class="summary-icon">
                <va-icon :name="item.icon" :color="item.color" />
              </div>
              <div class="summary-details">
                <div class="summary-value">{{ item.value }}</div>
                <div class="summary-label">{{ item.label }}</div>
              </div>
            </div>
          </div>
        </va-card-content>
      </va-card>
    </div>

    <!-- Mock Data Table -->
    <div class="mock-data-section mb-16">
      <div class="section-header mb-12">
        <h2 class="section-title">Sample Data</h2>
        <p class="section-subtitle">Example data structure and format</p>
      </div>
      <va-card class="mock-data-card">
        <va-card-content class="mock-data-content p-6">
          <div class="table-container">
            <va-data-table
              :items="mockData"
              :columns="tableColumns"
              :loading="isLoading"
              class="data-table"
            >
              <template #cell(role)="{ item }">
                <va-chip :color="getRoleColor(item.role)" size="small">
                  {{ item.role }}
                </va-chip>
              </template>
              <template #cell(status)="{ item }">
                <va-chip :color="getStatusColor(item.status)" size="small">
                  {{ item.status }}
                </va-chip>
              </template>
              <template #cell(actions)="{ item }">
                <div class="action-buttons">
                  <va-button
                    size="small"
                    variant="outlined"
                    color="primary"
                    class="action-btn"
                    @click="viewItem(item)"
                  >
                    <va-icon name="visibility" />
                  </va-button>
                  <va-button
                    size="small"
                    variant="outlined"
                    color="warning"
                    class="action-btn"
                    @click="editItem(item)"
                  >
                    <va-icon name="edit" />
                  </va-button>
                  <va-button
                    size="small"
                    variant="outlined"
                    color="danger"
                    class="action-btn"
                    @click="deleteItem(item)"
                  >
                    <va-icon name="delete" />
                  </va-button>
                </div>
              </template>
            </va-data-table>
          </div>
        </va-card-content>
      </va-card>
    </div>

    <!-- Data Controls -->
    <div class="controls-section mb-16">
      <div class="section-header mb-12">
        <h2 class="section-title">Data Controls</h2>
        <p class="section-subtitle">Manage and manipulate data</p>
      </div>
      <va-card class="controls-card">
        <va-card-content class="controls-content p-6">
          <div class="controls-grid">
            <div class="control-group">
              <label class="control-label">Search</label>
              <va-input
                v-model="searchQuery"
                placeholder="Search data..."
                class="control-input"
              >
                <template #prepend>
                  <va-icon name="search" />
                </template>
              </va-input>
            </div>
            <div class="control-group">
              <label class="control-label">Filter by Status</label>
              <va-select
                v-model="statusFilter"
                :options="statusOptions"
                placeholder="Select status"
                class="control-select"
              />
            </div>
            <div class="control-group">
              <label class="control-label">Sort by</label>
              <va-select
                v-model="sortBy"
                :options="sortOptions"
                placeholder="Select field"
                class="control-select"
              />
            </div>
            <div class="control-group">
              <label class="control-label">Actions</label>
              <div class="control-actions">
                <va-button
                  color="primary"
                  variant="outlined"
                  size="small"
                  class="control-btn"
                  @click="exportData"
                >
                  <va-icon name="download" class="mr-2" />
                  Export
                </va-button>
                <va-button
                  color="success"
                  variant="outlined"
                  size="small"
                  class="control-btn"
                  @click="importData"
                >
                  <va-icon name="upload" class="mr-2" />
                  Import
                </va-button>
              </div>
            </div>
          </div>
        </va-card-content>
      </va-card>
    </div>

    <!-- Activity Log -->
    <div class="activity-section mb-16">
      <div class="section-header mb-12">
        <h2 class="section-title">Activity Log</h2>
        <p class="section-subtitle">Recent data operations and changes</p>
      </div>
      <va-card class="activity-card">
        <va-card-content class="activity-content p-6">
          <div class="activity-list">
            <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
              <div class="activity-icon">
                <va-icon :name="activity.icon" :color="activity.color" />
              </div>
              <div class="activity-details">
                <div class="activity-text">{{ activity.text }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
              <div class="activity-status" :class="activity.status">
                {{ activity.status }}
              </div>
            </div>
          </div>
        </va-card-content>
      </va-card>
    </div>
  </div>
</template>

<script setup lang="ts">
/*
 * DataPage.vue - User Management with Mock Data
 * 
 * This page demonstrates data management patterns using Domain-Driven Design principles.
 * 
 * MOCK DATA REPLACEMENT GUIDE:
 * 1. Replace MockUserRepositoryExtended with your real repository implementation
 * 2. Update the UserService to use your real backend services
 * 3. Replace mock data arrays (recentActivities, mockAvatars) with real API calls
 * 4. Update exportData() to create actual CSV/Excel files
 * 5. Replace mock chart display with real charting library (Chart.js, D3.js, etc.)
 * 6. Replace CSS-based charts with real charting components (Chart.js, D3.js, ApexCharts, etc.)
 * 7. Update icon names to match your icon library (Material Icons, Font Awesome, etc.)
 * 
 * ICON REPLACEMENT:
 * - Vuestic UI uses Material Design icons by default
 * - Common icons: 'person', 'group', 'settings', 'table', 'add', 'edit', 'delete'
 * - For custom icons, import your icon library and update icon names
 * 
 * The current implementation shows the structure and patterns for a real application.
 */

import { ref, computed, onMounted, watch } from 'vue'
import { MockUserRepositoryExtended } from '@/infrastructure/repositories/MockUserRepository'
import { UserService } from '@/application/services/UserService'
import type { User } from '@/domain/entities/User'

// Initialize services
const userRepository = new MockUserRepositoryExtended()
const userService = new UserService(userRepository)

// Reactive state
const users = ref<User[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const sortBy = ref('firstName')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showUserModal = ref(false)
const showUserDetailsModal = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const selectedUser = ref<User | null>(null)
const editingUserId = ref<string | null>(null)

// Form data
const userForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: 'user' as 'admin' | 'user' | 'moderator',
  bio: '',
  location: '',
  website: '',
  status: 'pending' as 'active' | 'inactive' | 'pending' | 'suspended'
})

// Options for filters
const roleOptions = [
  { text: 'Admin', value: 'admin' },
  { text: 'Moderator', value: 'moderator' },
  { text: 'User', value: 'user' }
]

const statusOptions = [
  { text: 'Active', value: 'active' },
  { text: 'Pending', value: 'pending' },
  { text: 'Inactive', value: 'inactive' },
  { text: 'Suspended', value: 'suspended' }
]

const sortOptions = [
  { text: 'First Name', value: 'firstName' },
  { text: 'Last Name', value: 'lastName' },
  { text: 'Email', value: 'email' },
  { text: 'Role', value: 'role' },
  { text: 'Status', value: 'status' },
  { text: 'Created Date', value: 'createdAt' }
]

// Mock recent activities data
const recentActivities = ref([
  {
    icon: 'add',
    color: 'success',
    text: 'New user Emma Wilson registered',
    time: '2 hours ago',
    status: 'Completed',
    statusColor: 'success'
  },
  {
    icon: 'shield',
    color: 'warning',
    text: 'User role changed from user to moderator',
    time: '4 hours ago',
    status: 'Pending',
    statusColor: 'warning'
  },
  {
    icon: 'block',
    color: 'danger',
    text: 'User account suspended due to policy violation',
    time: '1 day ago',
    status: 'Completed',
    statusColor: 'danger'
  },
  {
    icon: 'check_circle',
    color: 'success',
    text: 'User account activated successfully',
    time: '2 days ago',
    status: 'Completed',
    statusColor: 'success'
  },
  {
    icon: 'edit',
    color: 'info',
    text: 'User profile updated with new information',
    time: '3 days ago',
    status: 'Completed',
    statusColor: 'info'
  }
])

// Chart data for user activity overview
const chartData = computed(() => [
  {
    label: 'Active Users',
    value: users.value.filter((u: User) => u.status.isActive()).length,
    color: 'var(--va-primary)',
    height: 80
  },
  {
    label: 'Pending Users',
    value: users.value.filter((u: User) => u.status.requiresApproval()).length,
    color: 'var(--va-warning)',
    height: 60
  },
  {
    label: 'Inactive Users',
    value: users.value.filter((u: User) => u.status.value === 'inactive').length,
    color: 'var(--va-secondary)',
    height: 40
  },
  {
    label: 'Suspended Users',
    value: users.value.filter((u: User) => u.status.isSuspended()).length,
    color: 'var(--va-danger)',
    height: 20
  }
])

// Summary items for data insights
const summaryItems = computed(() => [
  {
    title: 'Total Users',
    description: `${users.value.length} registered users in the system`,
    icon: 'group',
    iconColor: 'var(--va-primary)'
  },
  {
    title: 'Administrators',
    description: `${users.value.filter((u: User) => u.role.value === 'admin').length} admin users`,
    icon: 'admin_panel_settings',
    iconColor: 'var(--va-danger)'
  },
  {
    title: 'Moderators',
    description: `${users.value.filter((u: User) => u.role.value === 'moderator').length} moderator users`,
    icon: 'security',
    iconColor: 'var(--va-warning)'
  },
  {
    title: 'Recent Activity',
    description: `${users.value.filter((u: User) => u.updatedAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} users updated this week`,
    icon: 'schedule',
    iconColor: 'var(--va-info)'
  }
])

// Mock user avatars for demonstration
const mockAvatars = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=4',
  'https://i.pravatar.cc/150?img=5',
  'https://i.pravatar.cc/150?img=6',
  'https://i.pravatar.cc/150?img=7',
  'https://i.pravatar.cc/150?img=8',
  'https://i.pravatar.cc/150?img=9',
  'https://i.pravatar.cc/150?img=10'
]

// Table columns
const tableColumns = [
  { key: 'profile', sortable: false, label: 'User Profile' },
  { key: 'role', sortable: true, label: 'Role' },
  { key: 'status', sortable: true, label: 'Status' },
  { key: 'permissions', sortable: false, label: 'Permissions' },
  { key: 'createdAt', sortable: true, label: 'Created' },
  { key: 'actions', sortable: false, label: 'Actions' }
]

// Computed properties
const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.profile.firstName.toLowerCase().includes(query) ||
      user.profile.lastName.toLowerCase().includes(query) ||
      user.email.value.toLowerCase().includes(query) ||
      user.profile.bio?.toLowerCase().includes(query) ||
      user.profile.location?.toLowerCase().includes(query)
    )
  }

  if (selectedRole.value) {
    filtered = filtered.filter(user => user.role.value === selectedRole.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(user => user.status.value === selectedStatus.value)
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aValue: any, bValue: any
    
    switch (sortBy.value) {
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
      default:
        aValue = a.profile.firstName
        bValue = b.profile.firstName
    }

    if (aValue < bValue) return -1
    if (aValue > bValue) return 1
    return 0
  })

  return filtered
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUsers.value.slice(start, end)
})

const statistics = computed(() => [
  {
    label: 'Total Users',
    value: users.value.length,
    color: 'primary',
    change: 12
  },
  {
    label: 'Active Users',
    value: users.value.filter((u: User) => u.status.isActive()).length,
    color: 'success',
    change: 8
  },
  {
    label: 'Pending Users',
    value: users.value.filter((u: User) => u.status.requiresApproval()).length,
    color: 'warning',
    change: -5
  },
  {
    label: 'Suspended Users',
    value: users.value.filter((u: User) => u.status.isSuspended()).length,
    color: 'danger',
    change: 2
  }
])

// Methods
const loadUsers = async () => {
  isLoading.value = true
  try {
    users.value = await userService.findAll()
  } catch (error) {
    console.error('Failed to load users:', error)
  } finally {
    isLoading.value = false
  }
}

const refreshData = () => {
  loadUsers()
}

const addRandomUser = () => {
  isEditing.value = false
  editingUserId.value = null
  resetUserForm()
  showUserModal.value = true
}

const editUser = (user: User) => {
  isEditing.value = true
  editingUserId.value = user.id.value
  userForm.value = {
    firstName: user.profile.firstName,
    lastName: user.profile.lastName,
    email: user.email.value,
    role: user.role.value,
    bio: user.profile.bio || '',
    location: user.profile.location || '',
    website: user.profile.website || '',
    status: user.status.value
  }
  showUserModal.value = true
}

const viewUser = (user: User) => {
  selectedUser.value = user
  showUserDetailsModal.value = true
}

const saveUser = async () => {
  isSaving.value = true
  
  try {
    if (isEditing.value && editingUserId.value) {
      // Update existing user
      await userService.updateUser({
        id: editingUserId.value,
        profile: {
          firstName: userForm.value.firstName,
          lastName: userForm.value.lastName,
          bio: userForm.value.bio,
          location: userForm.value.location,
          website: userForm.value.website
        }
      })
    } else {
      // Create new user
      await userService.createUser({
        email: userForm.value.email,
        firstName: userForm.value.firstName,
        lastName: userForm.value.lastName,
        role: userForm.value.role,
        password: 'temporary123', // In real app, this would be handled differently
        profile: {
          bio: userForm.value.bio,
          location: userForm.value.location,
          website: userForm.value.website
        }
      })
    }
    
    await loadUsers()
    closeUserModal()
  } catch (error) {
    console.error('Failed to save user:', error)
  } finally {
    isSaving.value = false
  }
}

const deleteUser = async (id: string) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await userService.deleteUser(id)
      await loadUsers()
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }
}

const closeUserModal = () => {
  showUserModal.value = false
  isEditing.value = false
  editingUserId.value = null
  resetUserForm()
}

const resetUserForm = () => {
  userForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    bio: '',
    location: '',
    website: '',
    status: 'pending'
  }
}

const exportData = () => {
  // In a real app, this would export to CSV/Excel
  console.log('Exporting data...')
  
  // Mock export functionality for demonstration
  const exportData = {
    users: users.value.map(user => ({
      id: user.id.value,
      name: `${user.profile.firstName} ${user.profile.lastName}`,
      email: user.email.value,
      role: user.role.value,
      status: user.status.value,
      created: user.createdAt.toISOString(),
      permissions: user.role.permissions
    })),
    exportDate: new Date().toISOString(),
    totalUsers: users.value.length
  }
  
  // In a real app, this would create and download a file
  console.log('Export data:', exportData)
  alert(`Exported ${exportData.totalUsers} users. Check console for data structure.`)
}

const generateReport = () => {
  // In a real app, this would generate a comprehensive report
  console.log('Generating report...')
  
  // Mock report data for demonstration
  const reportData = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalUsers: users.value.length,
      activeUsers: users.value.filter((u: User) => u.status.isActive()).length,
      pendingUsers: users.value.filter((u: User) => u.status.requiresApproval()).length,
      suspendedUsers: users.value.filter((u: User) => u.status.isSuspended()).length
    },
    userBreakdown: {
      byRole: {
        admin: users.value.filter((u: User) => u.role.value === 'admin').length,
        moderator: users.value.filter((u: User) => u.role.value === 'moderator').length,
        user: users.value.filter((u: User) => u.role.value === 'user').length
      },
      byStatus: {
        active: users.value.filter((u: User) => u.status.value === 'active').length,
        pending: users.value.filter((u: User) => u.status.value === 'pending').length,
        inactive: users.value.filter((u: User) => u.status.value === 'inactive').length,
        suspended: users.value.filter((u: User) => u.status.value === 'suspended').length
      }
    },
    recentActivity: recentActivities.value.slice(0, 5)
  }
  
  console.log('Generated Report:', reportData)
  alert(`Report generated successfully!\n\nTotal Users: ${reportData.summary.totalUsers}\nActive Users: ${reportData.summary.activeUsers}\nCheck console for full report data.`)
}

// Utility methods
const getStatIcon = (label: string) => {
  switch (label) {
    case 'Total Users': return 'group'
    case 'Active Users': return 'check_circle'
    case 'Pending Users': return 'schedule'
    case 'Suspended Users': return 'block'
    default: return 'person'
  }
}

const getStatColor = (label: string) => {
  switch (label) {
    case 'Total Users': return 'var(--va-primary)'
    case 'Active Users': return 'var(--va-success)'
    case 'Pending Users': return 'var(--va-warning)'
    case 'Suspended Users': return 'var(--va-danger)'
    default: return 'var(--va-primary)'
  }
}

const getChartBarStyle = (value: number, color: string) => {
  const height = value * 10; // Scale height based on value
  return {
    height: `${height}px`,
    background: `linear-gradient(135deg, ${color}, ${color}dd)`,
    borderRadius: '8px 8px 0 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '0.5rem',
    color: 'white',
    fontWeight: '600',
    minHeight: '60px',
    position: 'relative',
    transition: 'height 0.3s ease'
  }
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'var(--va-danger)'
    case 'moderator': return 'var(--va-warning)'
    case 'user': return 'var(--va-primary)'
    default: return 'var(--va-secondary)'
  }
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin': return 'admin_panel_settings'
    case 'moderator': return 'security'
    case 'user': return 'person'
    default: return 'person'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'var(--va-success)'
    case 'pending': return 'var(--va-warning)'
    case 'inactive': return 'var(--va-secondary)'
    case 'suspended': return 'var(--va-danger)'
    default: return 'var(--va-secondary)'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return 'check_circle'
    case 'pending': return 'pending'
    case 'inactive': return 'pause_circle'
    case 'suspended': return 'block'
    default: return 'help'
  }
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Watchers
watch([searchQuery, selectedRole, selectedStatus, sortBy], () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
/* DataPage Styles - Material Design Principles */
.data-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-8) var(--spacing-4);
}

/* Page Header */
.page-header-container {
  background: linear-gradient(135deg, var(--va-primary) 0%, var(--va-primary-600) 100%);
  border-radius: var(--radius-6);
  padding: var(--spacing-12) var(--spacing-8);
  margin-bottom: var(--spacing-16);
  box-shadow: var(--shadow-5);
  position: relative;
  overflow: hidden;
}

.page-header-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.page-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.page-header-text {
  color: white;
}

.page-title {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  margin-bottom: var(--spacing-2);
  letter-spacing: -0.025em;
}

.page-subtitle {
  font-size: var(--font-size-lg);
  opacity: 0.9;
  line-height: var(--line-height-relaxed);
}

.page-header-actions {
  display: flex;
  gap: var(--spacing-4);
}

.refresh-button {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(10px);
  transition: all var(--transition-normal);
}

.refresh-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: var(--shadow-4);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-16);
}

.stat-card {
  transition: all var(--transition-normal);
  border-radius: var(--radius-4);
  overflow: hidden;
  box-shadow: var(--shadow-2);
  border: 1px solid var(--va-background-secondary);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-4);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: var(--spacing-6);
}

.stat-icon {
  margin-right: var(--spacing-4);
}

.icon-background {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--va-background-secondary);
  transition: all var(--transition-normal);
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--va-text-primary);
  margin-bottom: var(--spacing-1);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--va-text-secondary);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-2);
}

.stat-change {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.stat-change.up {
  color: var(--va-success);
}

.stat-change.down {
  color: var(--va-danger);
}

/* Section Headers */
.section-header {
  text-align: center;
  margin-bottom: var(--spacing-12);
}

.section-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--va-text-primary);
  margin-bottom: var(--spacing-4);
  letter-spacing: -0.025em;
}

.section-subtitle {
  font-size: var(--font-size-lg);
  color: var(--va-text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: var(--line-height-relaxed);
}

/* Charts Section */
.charts-section {
  margin-bottom: var(--spacing-16);
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-6);
}

.chart-card {
  border-radius: var(--radius-4);
  overflow: hidden;
  box-shadow: var(--shadow-2);
  border: 1px solid var(--va-background-secondary);
}

.chart-title {
  background: var(--va-background-secondary);
  border-bottom: 1px solid var(--va-background-tertiary);
  padding: var(--spacing-4) var(--spacing-6);
}

.title-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.title-icon {
  color: var(--va-primary);
  font-size: 1.5rem;
}

.chart-content {
  padding: var(--spacing-6);
}

/* Chart Bars */
.chart-bars {
  display: flex;
  align-items: end;
  gap: var(--spacing-2);
  height: 200px;
  padding: var(--spacing-4) 0;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  min-height: 20px;
  position: relative;
  transition: all var(--transition-normal);
}

.chart-bar:hover {
  transform: scale(1.05);
}

.bar-label {
  position: absolute;
  bottom: -25px;
  font-size: var(--font-size-xs);
  color: var(--va-text-secondary);
  font-weight: var(--font-weight-medium);
}

.bar-value {
  position: absolute;
  top: -25px;
  font-size: var(--font-size-xs);
  color: var(--va-text-primary);
  font-weight: var(--font-weight-semibold);
}

/* Pie Chart Placeholder */
.pie-chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
  color: var(--va-text-secondary);
}

.pie-chart-placeholder p {
  margin: var(--spacing-2) 0;
}

.text-caption {
  font-size: var(--font-size-sm);
  opacity: 0.7;
}

/* Summary Section */
.summary-section {
  margin-bottom: var(--spacing-16);
}

.summary-card {
  border-radius: var(--radius-4);
  overflow: hidden;
  box-shadow: var(--shadow-2);
  border: 1px solid var(--va-background-secondary);
}

.summary-content {
  padding: var(--spacing-6);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-6);
}

.summary-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-4);
  border-radius: var(--radius-3);
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-tertiary);
}

.summary-icon {
  color: var(--va-primary);
  font-size: 1.5rem;
}

.summary-details {
  flex: 1;
}

.summary-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--va-text-primary);
  margin-bottom: var(--spacing-1);
}

.summary-label {
  font-size: var(--font-size-sm);
  color: var(--va-text-secondary);
  font-weight: var(--font-weight-medium);
}

/* Mock Data Section */
.mock-data-section {
  margin-bottom: var(--spacing-16);
}

.mock-data-card {
  border-radius: var(--radius-4);
  overflow: hidden;
  box-shadow: var(--shadow-2);
  border: 1px solid var(--va-background-secondary);
}

.mock-data-content {
  padding: var(--spacing-6);
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-2);
}

.action-btn {
  min-width: 32px;
  height: 32px;
  padding: 0;
}

/* Controls Section */
.controls-section {
  margin-bottom: var(--spacing-16);
}

.controls-card {
  border-radius: var(--radius-4);
  overflow: hidden;
  box-shadow: var(--shadow-2);
  border: 1px solid var(--va-background-secondary);
}

.controls-content {
  padding: var(--spacing-6);
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-6);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.control-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--va-text-primary);
}

.control-input,
.control-select {
  width: 100%;
}

.control-actions {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.control-btn {
  font-weight: var(--font-weight-medium);
}

/* Activity Section */
.activity-section {
  margin-bottom: var(--spacing-16);
}

.activity-card {
  border-radius: var(--radius-4);
  overflow: hidden;
  box-shadow: var(--shadow-2);
  border: 1px solid var(--va-background-secondary);
}

.activity-content {
  padding: var(--spacing-6);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.activity-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-4);
  border-radius: var(--radius-3);
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-tertiary);
  transition: all var(--transition-normal);
}

.activity-item:hover {
  background: var(--va-background-tertiary);
  transform: translateX(4px);
}

.activity-icon {
  color: var(--va-primary);
  font-size: 1.25rem;
  flex-shrink: 0;
}

.activity-details {
  flex: 1;
}

.activity-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--va-text-primary);
  margin-bottom: var(--spacing-1);
}

.activity-time {
  font-size: var(--font-size-xs);
  color: var(--va-text-secondary);
}

.activity-status {
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.activity-status.Completed {
  background: var(--va-success);
  color: white;
}

.activity-status.In-Progress {
  background: var(--va-warning);
  color: white;
}

.activity-status.Resolved {
  background: var(--va-info);
  color: white;
}

/* Utility Functions */
.getRoleColor {
  color: var(--va-primary);
}

.getStatusColor {
  color: var(--va-success);
}

/* Responsive Design */
@media (max-width: 768px) {
  .data-page {
    padding: var(--spacing-6) var(--spacing-3);
  }
  
  .page-header-container {
    padding: var(--spacing-8) var(--spacing-6);
    margin-bottom: var(--spacing-12);
  }
  
  .page-header-content {
    flex-direction: column;
    gap: var(--spacing-6);
    text-align: center;
  }
  
  .page-title {
    font-size: var(--font-size-4xl);
  }
  
  .page-subtitle {
    font-size: var(--font-size-base);
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
  
  .chart-bars {
    height: 150px;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
  
  .controls-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
  
  .section-header {
    margin-bottom: var(--spacing-8);
  }
  
  .section-title {
    font-size: var(--font-size-3xl);
  }
  
  .section-subtitle {
    font-size: var(--font-size-base);
  }
}

@media (max-width: 480px) {
  .page-header-container {
    padding: var(--spacing-6) var(--spacing-4);
  }
  
  .page-title {
    font-size: var(--font-size-3xl);
  }
  
  .stat-content {
    padding: var(--spacing-4);
  }
  
  .chart-content {
    padding: var(--spacing-4);
  }
  
  .summary-content {
    padding: var(--spacing-4);
  }
  
  .mock-data-content {
    padding: var(--spacing-4);
  }
  
  .controls-content {
    padding: var(--spacing-4);
  }
  
  .activity-content {
    padding: var(--spacing-4);
  }
  
  .chart-bars {
    height: 120px;
    gap: var(--spacing-1);
  }
  
  .bar-label,
  .bar-value {
    font-size: 10px;
  }
  
  .control-actions {
    flex-direction: column;
  }
  
  .control-btn {
    width: 100%;
  }
}
</style>
