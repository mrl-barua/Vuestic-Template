<template>
  <div class="data-page">
    <va-card class="mb-6">
      <va-card-title class="text-h4 mb-4">
        Data Management & State
      </va-card-title>
      <va-card-content>
        <p class="text-body-1">
          Explore data management patterns, tables, and state management with Pinia.
        </p>
      </va-card-content>
    </va-card>

    <!-- Data Controls -->
    <va-card class="mb-6">
      <va-card-title class="text-h5 mb-3">Data Controls</va-card-title>
      <va-card-content>
        <div class="controls-row">
          <va-input
            v-model="searchQuery"
            placeholder="Search users..."
            class="ma-2"
            prepend-icon="search"
          />
          <va-select
            v-model="selectedStatus"
            :options="statusOptions"
            placeholder="Filter by status"
            class="ma-2"
          />
          <va-button
            @click="addRandomUser"
            color="success"
            class="ma-2"
          >
            Add Random User
          </va-button>
          <va-button
            @click="refreshData"
            variant="outlined"
            class="ma-2"
          >
            Refresh
          </va-button>
        </div>
      </va-card-content>
    </va-card>

    <!-- Data Table -->
    <va-card class="mb-6">
      <va-card-title class="text-h5 mb-3">
        Users Table ({{ filteredUsers.length }} users)
      </va-card-title>
      <va-card-content>
        <va-data-table
          :items="filteredUsers"
          :columns="tableColumns"
          :loading="isLoading"
          :items-per-page="10"
          :sort-by="sortBy"
          :sort-desc="sortDesc"
          @update:sort-by="sortBy = $event"
          @update:sort-desc="sortDesc = $event"
        >
          <template #cell(status)="{ item }">
            <va-chip
              :color="getStatusColor(item.status)"
              size="small"
            >
              {{ item.status }}
            </va-chip>
          </template>
          
          <template #cell(actions)="{ item }">
            <div class="action-buttons">
              <va-button
                size="small"
                variant="text"
                icon="edit"
                @click="editUser(item)"
                class="ma-1"
              />
              <va-button
                size="small"
                variant="text"
                icon="delete"
                color="danger"
                @click="deleteUser(item.id)"
                class="ma-1"
              />
            </div>
          </template>
        </va-data-table>
      </va-card-content>
    </va-card>

    <!-- User Form Modal -->
    <va-modal
      v-model="showUserModal"
      :title="isEditing ? 'Edit User' : 'Add New User'"
      size="large"
    >
      <div class="user-form">
        <div class="form-row">
          <va-input
            v-model="userForm.name"
            label="Name"
            placeholder="Enter full name"
            class="ma-2"
          />
          <va-input
            v-model="userForm.email"
            label="Email"
            type="email"
            placeholder="Enter email"
            class="ma-2"
          />
        </div>
        
        <div class="form-row">
          <va-input
            v-model="userForm.phone"
            label="Phone"
            placeholder="Enter phone number"
            class="ma-2"
          />
          <va-select
            v-model="userForm.status"
            label="Status"
            :options="statusOptions"
            class="ma-2"
          />
        </div>
        
        <div class="form-row">
          <va-input
            v-model="userForm.department"
            label="Department"
            placeholder="Enter department"
            class="ma-2"
          />
          <va-input
            v-model="userForm.position"
            label="Position"
            placeholder="Enter job position"
            class="ma-2"
          />
        </div>
        
        <div class="form-actions">
          <va-button
            @click="saveUser"
            :loading="isSaving"
            class="ma-2"
          >
            {{ isEditing ? 'Update User' : 'Create User' }}
          </va-button>
          <va-button
            variant="outlined"
            @click="closeUserModal"
            class="ma-2"
          >
            Cancel
          </va-button>
        </div>
      </div>
    </va-modal>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <va-card class="stat-card">
        <va-card-content class="text-center">
          <va-icon name="people" size="large" color="primary" class="mb-2" />
          <div class="stat-number">{{ users.length }}</div>
          <div class="stat-label">Total Users</div>
        </va-card-content>
      </va-card>
      
      <va-card class="stat-card">
        <va-card-content class="text-center">
          <va-icon name="check_circle" size="large" color="success" class="mb-2" />
          <div class="stat-number">{{ activeUsersCount }}</div>
          <div class="stat-label">Active Users</div>
        </va-card-content>
      </va-card>
      
      <va-card class="stat-card">
        <va-card-content class="text-center">
          <va-icon name="pending" size="large" color="warning" class="mb-2" />
          <div class="stat-number">{{ pendingUsersCount }}</div>
          <div class="stat-label">Pending Users</div>
        </va-card-content>
      </va-card>
      
      <va-card class="stat-card">
        <va-card-content class="text-center">
          <va-icon name="block" size="large" color="danger" class="mb-2" />
          <div class="stat-number">{{ inactiveUsersCount }}</div>
          <div class="stat-label">Inactive Users</div>
        </va-card-content>
      </va-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface User {
  id: number
  name: string
  email: string
  phone: string
  status: string
  department: string
  position: string
  createdAt: string
}

interface UserForm {
  name: string
  email: string
  phone: string
  status: string
  department: string
  position: string
}

const users = ref<User[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('')
const sortBy = ref('name')
const sortDesc = ref(false)
const showUserModal = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const editingUserId = ref<number | null>(null)

const userForm = ref<UserForm>({
  name: '',
  email: '',
  phone: '',
  status: 'active',
  department: '',
  position: ''
})

const statusOptions = [
  { text: 'Active', value: 'active' },
  { text: 'Pending', value: 'pending' },
  { text: 'Inactive', value: 'inactive' }
]

const tableColumns = [
  { key: 'name', sortable: true, label: 'Name' },
  { key: 'email', sortable: true, label: 'Email' },
  { key: 'phone', sortable: false, label: 'Phone' },
  { key: 'status', sortable: true, label: 'Status' },
  { key: 'department', sortable: true, label: 'Department' },
  { key: 'position', sortable: true, label: 'Position' },
  { key: 'createdAt', sortable: true, label: 'Created' },
  { key: 'actions', sortable: false, label: 'Actions' }
]

const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.department.toLowerCase().includes(query)
    )
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(user => user.status === selectedStatus.value)
  }

  return filtered
})

const activeUsersCount = computed(() => 
  users.value.filter(user => user.status === 'active').length
)

const pendingUsersCount = computed(() => 
  users.value.filter(user => user.status === 'pending').length
)

const inactiveUsersCount = computed(() => 
  users.value.filter(user => user.status === 'inactive').length
)

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'pending': return 'warning'
    case 'inactive': return 'danger'
    default: return 'secondary'
  }
}

const generateRandomUser = (): User => {
  const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson']
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance']
  const positions = ['Developer', 'Manager', 'Analyst', 'Coordinator', 'Director']
  
  return {
    id: Date.now() + Math.random(),
    name: names[Math.floor(Math.random() * names.length)],
    email: `user${Date.now()}@example.com`,
    phone: `+1-555-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    status: statusOptions[Math.floor(Math.random() * statusOptions.length)].value,
    department: departments[Math.floor(Math.random() * departments.length)],
    position: positions[Math.floor(Math.random() * positions.length)],
    createdAt: new Date().toLocaleDateString()
  }
}

const loadUsers = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate sample data
    const sampleUsers: User[] = []
    for (let i = 0; i < 25; i++) {
      sampleUsers.push(generateRandomUser())
    }
    users.value = sampleUsers
  } catch (error) {
    console.error('Failed to load users:', error)
  } finally {
    isLoading.value = false
  }
}

const addRandomUser = () => {
  users.value.unshift(generateRandomUser())
}

const refreshData = () => {
  loadUsers()
}

const editUser = (user: User) => {
  isEditing.value = true
  editingUserId.value = user.id
  userForm.value = { ...user }
  showUserModal.value = true
}

const saveUser = async () => {
  isSaving.value = true
  
  try {
    if (isEditing.value && editingUserId.value) {
      // Update existing user
      const index = users.value.findIndex(u => u.id === editingUserId.value)
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...userForm.value }
      }
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now() + Math.random(),
        ...userForm.value,
        createdAt: new Date().toLocaleDateString()
      }
      users.value.unshift(newUser)
    }
    
    closeUserModal()
  } catch (error) {
    console.error('Failed to save user:', error)
  } finally {
    isSaving.value = false
  }
}

const deleteUser = (id: number) => {
  if (confirm('Are you sure you want to delete this user?')) {
    users.value = users.value.filter(user => user.id !== id)
  }
}

const closeUserModal = () => {
  showUserModal.value = false
  isEditing.value = false
  editingUserId.value = null
  userForm.value = {
    name: '',
    email: '',
    phone: '',
    status: 'active',
    department: '',
    position: ''
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.data-page {
  padding: 1rem 0;
}

.controls-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.controls-row > * {
  flex: 1;
  min-width: 200px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.user-form {
  padding: 1rem 0;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-row > * {
  flex: 1;
  min-width: 200px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.stat-card {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: var(--va-primary);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--va-text-secondary);
  font-size: 0.9rem;
}
</style>
