<template>
  <div class="data-page">
    <!-- Page Header -->
    <div class="page-header-container mb-8">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Data Management & State</h1>
          <p class="page-subtitle">
            Explore data management patterns, tables, and state management with Domain-Driven Design principles.
          </p>
        </div>
        <div class="header-actions">
          <va-button
            @click="refreshData"
            variant="outlined"
            icon="refresh"
            :loading="isLoading"
            class="refresh-button"
          >
            Refresh Data
          </va-button>
        </div>
      </div>
    </div>

    <!-- Statistics Overview -->
    <div class="stats-overview mb-8">
      <va-card class="stat-card" v-for="stat in statistics" :key="stat.label">
        <va-card-content class="stat-content">
          <div class="stat-icon-wrapper">
            <div class="stat-icon-background" :style="{ backgroundColor: getStatColor(stat.label) + '15' }">
              <va-icon
                :name="getStatIcon(stat.label)"
                size="large"
                :color="getStatColor(stat.label)"
              />
            </div>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-change" v-if="stat.change">
              <va-icon
                :name="stat.change > 0 ? 'arrow_upward' : 'arrow_downward'"
                size="small"
                :color="stat.change > 0 ? 'success' : 'danger'"
              />
              <span :class="stat.change > 0 ? 'text-success' : 'text-danger'">
                {{ Math.abs(stat.change) }}%
              </span>
            </div>
          </div>
        </va-card-content>
      </va-card>
    </div>

    <!-- Mock Chart Data Display -->
    <va-card class="chart-card mb-8">
      <va-card-title class="chart-title">
        <div class="title-content">
          <div class="title-icon">
            <va-icon name="insert_chart" />
          </div>
          <h2>User Activity Overview</h2>
        </div>
      </va-card-title>
      <va-card-content class="chart-content">
        <div class="chart-grid">
          <div class="chart-item" v-for="(item, index) in chartData" :key="index">
            <div class="chart-bar" :style="getChartBarStyle(item)">
              <div class="chart-label">{{ item.label }}</div>
              <div class="chart-value">{{ item.value }}</div>
            </div>
          </div>
        </div>
        
        <!-- Chart Legend -->
        <div class="chart-legend">
          <div class="legend-item" v-for="(item, index) in chartData" :key="index">
            <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </va-card-content>
    </va-card>

    <!-- Mock Data Summary -->
    <va-card class="summary-card mb-8">
      <va-card-title class="summary-title">
        <div class="title-content">
          <div class="title-icon">
            <va-icon name="info" />
          </div>
          <h2>Data Summary & Insights</h2>
        </div>
      </va-card-title>
      <va-card-content class="summary-content">
        <div class="summary-grid">
          <div class="summary-item" v-for="(item, index) in summaryItems" :key="index">
            <div class="summary-icon">
              <div class="icon-background" :style="{ backgroundColor: item.iconColor + '15' }">
                <va-icon :name="item.icon" size="large" :color="item.iconColor" />
              </div>
            </div>
            <div class="summary-content">
              <h6>{{ item.title }}</h6>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </div>
      </va-card-content>
    </va-card>

    <!-- Mock Data Sample Display -->
    <va-card class="mock-data-card mb-8">
      <va-card-title class="mock-data-title">
        <div class="title-content">
          <div class="title-icon">
            <va-icon name="data_usage" />
          </div>
          <h2>Sample Data Structure</h2>
        </div>
      </va-card-title>
      <va-card-content class="mock-data-content">
        <div class="mock-data-grid">
          <div class="mock-data-item">
            <h6>User Counts by Role</h6>
            <div class="mock-data-chart">
              <div class="mock-bar" style="height: 60px; background: var(--va-danger);">
                <span>Admin: {{ users.filter((u: User) => u.role.value === 'admin').length }}</span>
              </div>
              <div class="mock-bar" style="height: 40px; background: var(--va-warning);">
                <span>Moderator: {{ users.filter((u: User) => u.role.value === 'moderator').length }}</span>
              </div>
              <div class="mock-bar" style="height: 80px; background: var(--va-primary);">
                <span>User: {{ users.filter((u: User) => u.role.value === 'user').length }}</span>
              </div>
            </div>
          </div>
          <div class="mock-data-item">
            <h6>Recent User Activity</h6>
            <div class="mock-activity-list">
              <div class="mock-activity" v-for="(user, index) in users.slice(0, 3)" :key="index">
                <va-icon name="person" size="small" class="mr-2" />
                <span>{{ user.profile.firstName }} {{ user.profile.lastName }}</span>
                <va-chip size="small" :color="getStatusColor(user.status.value)">
                  {{ user.status.value }}
                </va-chip>
              </div>
            </div>
          </div>
        </div>
      </va-card-content>
    </va-card>

    <!-- Data Controls -->
    <va-card class="controls-card mb-8">
      <va-card-title class="controls-title">
        <div class="title-content">
          <div class="title-icon">
            <va-icon name="settings" />
          </div>
          <h2>Data Controls & Filters</h2>
        </div>
      </va-card-title>
      <va-card-content class="controls-content">
        <div class="controls-grid">
          <va-input
            v-model="searchQuery"
            placeholder="Search users..."
            class="search-input"
            prepend-icon="search"
            clearable
          />
          <va-select
            v-model="selectedRole"
            :options="roleOptions"
            placeholder="Filter by role"
            class="filter-select"
            clearable
          />
          <va-select
            v-model="selectedStatus"
            :options="statusOptions"
            placeholder="Filter by status"
            class="filter-select"
            clearable
          />
          <va-select
            v-model="sortBy"
            :options="sortOptions"
            placeholder="Sort by"
            class="filter-select"
          />
          <va-button
            @click="addRandomUser"
            color="success"
            icon="person_add"
            class="action-button"
          >
            Add User
          </va-button>
          <va-button
            @click="exportData"
            variant="outlined"
            icon="download"
            class="action-button"
          >
            Export
          </va-button>
          <va-button
            @click="generateReport"
            variant="outlined"
            icon="assessment"
            class="action-button"
            color="info"
          >
            Generate Report
          </va-button>
        </div>
      </va-card-content>
    </va-card>

    <!-- Recent Activity Mock Data -->
    <va-card class="activity-card mb-8">
      <va-card-title class="activity-title">
        <div class="title-content">
          <div class="title-icon">
            <va-icon name="history" />
          </div>
          <h2>Recent Activity</h2>
        </div>
      </va-card-title>
      <va-card-content class="activity-content">
        <div class="activity-list">
          <div class="activity-item" v-for="(activity, index) in recentActivities" :key="index">
            <div class="activity-icon">
              <div class="icon-background" :style="{ backgroundColor: activity.color + '15' }">
                <va-icon :name="activity.icon" :color="activity.color" size="small" />
              </div>
            </div>
            <div class="activity-content">
              <div class="activity-text">{{ activity.text }}</div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
            <div class="activity-status">
              <va-chip :color="activity.statusColor" size="small">
                {{ activity.status }}
              </va-chip>
            </div>
          </div>
        </div>
      </va-card-content>
    </va-card>

    <!-- Data Table -->
    <va-card class="table-card mb-8">
      <va-card-title class="table-title">
        <div class="title-content">
          <div class="title-icon">
            <va-icon name="table" />
          </div>
          <h2>Users Management ({{ filteredUsers.length }} users)</h2>
        </div>
      </va-card-title>
      <va-card-content class="table-content">
        <va-data-table
          :items="paginatedUsers"
          :columns="tableColumns"
          :loading="isLoading"
          :items-per-page="itemsPerPage"
          :current-page="currentPage"
          :total="filteredUsers.length"
          @update:current-page="currentPage = $event"
          @update:items-per-page="itemsPerPage = $event"
          class="data-table"
        >
          <!-- Custom cell templates -->
          <template #cell(profile)="{ item }">
            <div class="user-profile">
              <va-avatar
                :src="item.profile.avatar"
                :alt="`${item.profile.firstName} ${item.profile.lastName}`"
                size="small"
                class="mr-2"
              />
              <div class="user-info">
                <div class="user-name">{{ item.profile.firstName }} {{ item.profile.lastName }}</div>
                <div class="user-email">{{ item.email.value }}</div>
              </div>
            </div>
          </template>

          <template #cell(role)="{ item }">
            <va-chip
              :color="getRoleColor(item.role.value)"
              size="small"
              class="role-chip"
            >
              <va-icon :name="getRoleIcon(item.role.value)" size="small" class="mr-1" />
              {{ item.role.value }}
            </va-chip>
          </template>

          <template #cell(status)="{ item }">
            <va-chip
              :color="getStatusColor(item.status.value)"
              size="small"
              class="status-chip"
            >
              <va-icon :name="getStatusIcon(item.status.value)" size="small" class="mr-1" />
              {{ item.status.value }}
            </va-chip>
          </template>

          <template #cell(permissions)="{ item }">
            <div class="permissions-list">
              <va-chip
                v-for="permission in item.role.permissions.slice(0, 3)"
                :key="permission"
                size="small"
                variant="outlined"
                class="mr-1 mb-1"
              >
                {{ permission }}
              </va-chip>
              <va-chip
                v-if="item.role.permissions.length > 3"
                size="small"
                variant="outlined"
                color="secondary"
              >
                +{{ item.role.permissions.length - 3 }}
              </va-chip>
            </div>
          </template>

          <template #cell(actions)="{ item }">
            <div class="action-buttons">
              <va-button
                size="small"
                variant="text"
                icon="visibility"
                @click="viewUser(item)"
                class="action-btn"
                color="info"
              />
              <va-button
                size="small"
                variant="text"
                icon="edit"
                @click="editUser(item)"
                class="action-btn"
                color="warning"
              />
              <va-button
                size="small"
                variant="text"
                icon="delete"
                @click="deleteUser(item.id.value)"
                class="action-btn"
                color="danger"
              />
            </div>
          </template>
        </va-data-table>

        <!-- Pagination Info -->
        <div class="pagination-info">
          <span class="text-body-2">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to 
            {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} of 
            {{ filteredUsers.length }} users
          </span>
        </div>
      </va-card-content>
    </va-card>

    <!-- User Form Modal -->
    <va-modal
      v-model="showUserModal"
      :title="isEditing ? 'Edit User' : 'Add New User'"
      size="large"
      class="user-modal"
    >
      <div class="user-form">
        <div class="form-section">
          <h6 class="form-section-title">Personal Information</h6>
          <div class="form-row">
            <va-input
              v-model="userForm.firstName"
              label="First Name *"
              placeholder="Enter first name"
              class="form-input"
              required
            />
            <va-input
              v-model="userForm.lastName"
              label="Last Name *"
              placeholder="Enter last name"
              class="form-input"
              required
            />
          </div>
          <div class="form-row">
            <va-input
              v-model="userForm.email"
              label="Email *"
              type="email"
              placeholder="Enter email address"
              class="form-input"
              required
            />
            <va-select
              v-model="userForm.role"
              label="Role *"
              :options="roleOptions"
              class="form-input"
              required
            />
          </div>
        </div>

        <div class="form-section">
          <h6 class="form-section-title">Profile Details</h6>
          <div class="form-row">
            <va-input
              v-model="userForm.bio"
              label="Bio"
              placeholder="Enter bio"
              class="form-input"
              type="textarea"
              rows="3"
            />
            <va-input
              v-model="userForm.location"
              label="Location"
              placeholder="Enter location"
              class="form-input"
            />
          </div>
          <div class="form-row">
            <va-input
              v-model="userForm.website"
              label="Website"
              placeholder="Enter website URL"
              class="form-input"
            />
            <va-select
              v-model="userForm.status"
              label="Status *"
              :options="statusOptions"
              class="form-input"
              required
            />
          </div>
        </div>

        <div class="form-actions">
          <va-button
            @click="saveUser"
            :loading="isSaving"
            color="primary"
            class="mr-2"
          >
            {{ isEditing ? 'Update User' : 'Create User' }}
          </va-button>
          <va-button
            variant="outlined"
            @click="closeUserModal"
          >
            Cancel
          </va-button>
        </div>
      </div>
    </va-modal>

    <!-- User Details Modal -->
    <va-modal
      v-model="showUserDetailsModal"
      title="User Details"
      size="large"
      class="user-details-modal"
    >
      <div v-if="selectedUser" class="user-details">
        <div class="user-header">
          <va-avatar
            :src="selectedUser.profile.avatar"
            :alt="`${selectedUser.profile.firstName} ${selectedUser.profile.lastName}`"
            size="large"
            class="mr-3"
          />
          <div class="user-header-info">
            <h3>{{ selectedUser.profile.firstName }} {{ selectedUser.profile.lastName }}</h3>
            <p class="user-email">{{ selectedUser.email.value }}</p>
            <div class="user-badges">
              <va-chip :color="getRoleColor(selectedUser.role.value)" class="mr-2">
                {{ selectedUser.role.value }}
              </va-chip>
              <va-chip :color="getStatusColor(selectedUser.status.value)">
                {{ selectedUser.status.value }}
              </va-chip>
            </div>
          </div>
        </div>

        <div class="user-details-grid">
          <div class="detail-section">
            <h6>Profile Information</h6>
            <div class="detail-item">
              <span class="detail-label">Bio:</span>
              <span class="detail-value">{{ selectedUser.profile.bio || 'No bio provided' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Location:</span>
              <span class="detail-value">{{ selectedUser.profile.location || 'Not specified' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Website:</span>
              <span class="detail-value">
                <a v-if="selectedUser.profile.website" :href="selectedUser.profile.website" target="_blank">
                  {{ selectedUser.profile.website }}
                </a>
                <span v-else>Not specified</span>
              </span>
            </div>
          </div>

          <div class="detail-section">
            <h6>Account Information</h6>
            <div class="detail-item">
              <span class="detail-label">Created:</span>
              <span class="detail-value">{{ formatDate(selectedUser.createdAt) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Last Updated:</span>
              <span class="detail-value">{{ formatDate(selectedUser.updatedAt) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Last Login:</span>
              <span class="detail-value">
                {{ selectedUser.lastLoginAt ? formatDate(selectedUser.lastLoginAt) : 'Never' }}
              </span>
            </div>
          </div>

          <div class="detail-section">
            <h6>Permissions</h6>
            <div class="permissions-grid">
              <va-chip
                v-for="permission in selectedUser.role.permissions"
                :key="permission"
                size="small"
                variant="outlined"
                class="mr-1 mb-1"
              >
                {{ permission }}
              </va-chip>
            </div>
          </div>
        </div>
      </div>
    </va-modal>
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

const getChartBarStyle = (item: any) => {
  return {
    height: `${item.height}px`,
    background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
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
.data-page {
  padding: 1rem 0;
}

.page-header-container {
  background: linear-gradient(135deg, var(--va-primary) 0%, var(--va-secondary) 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: white;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
}

.refresh-button {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border-color: white;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.refresh-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: white;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: var(--va-background-primary);
  border: 1px solid var(--va-background-secondary);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  gap: 1rem;
}

.stat-icon-wrapper {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background-color: var(--va-background-secondary);
}

.stat-icon-background {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: var(--va-background-primary);
}

.stat-number {
  font-size: 2.2rem;
  font-weight: bold;
  color: var(--va-primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  color: var(--va-text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
}

.chart-card {
  background: var(--va-background-primary);
  border: 1px solid var(--va-background-secondary);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.chart-title {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--va-background-secondary);
}

.title-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.title-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: var(--va-background-secondary);
}

.chart-content {
  padding: 1.5rem;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.25rem;
  align-items: end;
}

.chart-item {
  text-align: center;
}

.chart-bar {
  border-radius: 8px 8px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 0.5rem;
  color: white;
  font-weight: 600;
  min-height: 60px;
  position: relative;
  transition: height 0.3s ease;
}

.chart-bar:hover {
  height: 70px; /* Slightly taller on hover */
}

.chart-label {
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
  text-align: center;
  color: var(--va-text-secondary);
}

.chart-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--va-primary);
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding: 0 1.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 2px solid var(--va-background-secondary);
}

.mock-data-card {
  background: var(--va-background-primary);
  border: 1px solid var(--va-background-secondary);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.mock-data-title {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--va-background-secondary);
}

.mock-data-content {
  padding: 1.5rem;
}

.mock-data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.mock-data-item h6 {
  margin: 0 0 1rem 0;
  color: var(--va-text-primary);
  font-weight: 600;
}

.mock-data-chart {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mock-bar {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  color: white;
  font-weight: 500;
  border-radius: 4px;
  min-height: 40px;
}

.mock-activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mock-activity {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid var(--va-background-secondary);
  border-radius: 6px;
  background: var(--va-background-primary);
}

.summary-card {
  background: var(--va-background-primary);
  border: 1px solid var(--va-background-secondary);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.summary-title {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--va-background-secondary);
}

.summary-content {
  padding: 1.5rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.summary-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border: 1px solid var(--va-background-secondary);
  border-radius: 8px;
  background: var(--va-background-primary);
  transition: transform 0.2s, box-shadow 0.2s;
}

.summary-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.summary-icon {
  margin-right: 1rem;
  flex-shrink: 0;
}

.icon-background {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: var(--va-background-secondary);
}

.summary-content h6 {
  margin: 0 0 0.5rem 0;
  color: var(--va-text-primary);
  font-weight: 600;
}

.summary-content p {
  margin: 0;
  color: var(--va-text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
}

.activity-card {
  background: var(--va-background-primary);
  border: 1px solid var(--va-background-secondary);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.activity-title {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--va-background-secondary);
}

.activity-content {
  padding: 1.5rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--va-background-secondary);
  border-radius: 8px;
  background: var(--va-background-primary);
  transition: transform 0.2s, box-shadow 0.2s;
}

.activity-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.activity-icon {
  margin-right: 1rem;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-weight: 500;
  color: var(--va-text-primary);
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.8rem;
  color: var(--va-text-secondary);
}

.activity-status {
  flex-shrink: 0;
}

.controls-card {
  background: var(--va-background-primary);
  border: 1px solid var(--va-background-secondary);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.controls-title {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--va-background-secondary);
}

.controls-content {
  padding: 1.5rem;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: end;
}

.search-input {
  grid-column: span 2;
}

.filter-select {
  min-width: 150px;
}

.action-button {
  min-width: 120px;
  background-color: var(--va-primary);
  color: white;
  border-color: var(--va-primary);
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.action-button:hover {
  background-color: var(--va-primary-dark);
  border-color: var(--va-primary-dark);
}

.data-table {
  margin-bottom: 1rem;
}

.user-profile {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: var(--va-text-primary);
}

.user-email {
  font-size: 0.8rem;
  color: var(--va-text-secondary);
}

.role-chip,
.status-chip {
  font-weight: 500;
}

.permissions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  min-width: auto;
  background-color: var(--va-info);
  color: white;
  border-color: var(--va-info);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.action-btn:hover {
  background-color: var(--va-info-dark);
  border-color: var(--va-info-dark);
}

.pagination-info {
  text-align: center;
  margin-top: 1rem;
  color: var(--va-text-secondary);
}

.user-form {
  padding: 1rem 0;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid var(--va-background-secondary);
  border-radius: 8px;
  background: var(--va-background-primary);
}

.form-section-title {
  margin: 0 0 1rem 0;
  color: var(--va-text-primary);
  font-weight: 600;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-input {
  width: 100%;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.user-details {
  padding: 1rem 0;
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--va-background-secondary);
}

.user-header-info h3 {
  margin: 0 0 0.5rem 0;
  color: var(--va-text-primary);
}

.user-email {
  color: var(--va-text-secondary);
  margin: 0 0 1rem 0;
}

.user-badges {
  display: flex;
  gap: 0.5rem;
}

.user-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.detail-section h6 {
  margin: 0 0 1rem 0;
  color: var(--va-text-primary);
  font-weight: 600;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--va-background-secondary);
}

.detail-label {
  font-weight: 500;
  color: var(--va-text-secondary);
}

.detail-value {
  color: var(--va-text-primary);
  text-align: right;
}

.detail-value a {
  color: var(--va-primary);
  text-decoration: none;
}

.detail-value a:hover {
  text-decoration: underline;
}

.permissions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .page-header-container {
    padding: 1.5rem;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .controls-grid {
    grid-template-columns: 1fr;
  }
  
  .search-input {
    grid-column: span 1;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .user-details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
