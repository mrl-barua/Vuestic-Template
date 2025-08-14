<template>
  <div class="data-page">
    <!-- Page Header -->
    <va-card class="page-header mb-6">
      <va-card-content class="header-content">
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
          >
            Refresh Data
          </va-button>
        </div>
      </va-card-content>
    </va-card>

    <!-- Statistics Overview -->
    <div class="stats-overview mb-6">
      <va-card class="stat-card" v-for="stat in statistics" :key="stat.label">
        <va-card-content class="stat-content">
          <div class="stat-icon-wrapper">
            <va-icon
              :name="stat.icon"
              size="large"
              :color="stat.color"
            />
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-change" v-if="stat.change">
              <va-icon
                :name="stat.change > 0 ? 'trending_up' : 'trending_down'"
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

    <!-- Data Controls -->
    <va-card class="controls-card mb-6">
      <va-card-title class="text-h5 mb-3">
        <va-icon name="tune" class="mr-2" />
        Data Controls & Filters
      </va-card-title>
      <va-card-content>
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
        </div>
      </va-card-content>
    </va-card>

    <!-- Data Table -->
    <va-card class="table-card mb-6">
      <va-card-title class="text-h5 mb-3">
        <va-icon name="table_chart" class="mr-2" />
        Users Management ({{ filteredUsers.length }} users)
      </va-card-title>
      <va-card-content>
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
    icon: 'people',
    color: 'primary',
    change: 12
  },
  {
    label: 'Active Users',
    value: users.value.filter(u => u.status.isActive()).length,
    icon: 'check_circle',
    color: 'success',
    change: 8
  },
  {
    label: 'Pending Users',
    value: users.value.filter(u => u.status.requiresApproval()).length,
    icon: 'pending',
    color: 'warning',
    change: -5
  },
  {
    label: 'Suspended Users',
    value: users.value.filter(u => u.status.isSuspended()).length,
    icon: 'block',
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
}

// Utility methods
const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'danger'
    case 'moderator': return 'warning'
    case 'user': return 'primary'
    default: return 'secondary'
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
    case 'active': return 'success'
    case 'pending': return 'warning'
    case 'inactive': return 'secondary'
    case 'suspended': return 'danger'
    default: return 'secondary'
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

.page-header {
  background: linear-gradient(135deg, var(--va-primary) 0%, var(--va-secondary) 100%);
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 1.5rem;
}

.stat-icon-wrapper {
  margin-right: 1rem;
}

.stat-number {
  font-size: 2rem;
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
