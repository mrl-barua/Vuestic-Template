<template>
  <div class="dashboard-page">
    <!-- Page Header -->
    <va-card class="page-header mb-6">
      <va-card-content class="header-content">
        <div class="header-text">
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">
            Real-time overview of your application with Domain-Driven Design architecture
          </p>
        </div>
        <div class="header-actions">
          <va-button
            @click="refreshDashboard"
            variant="outlined"
            icon="refresh"
            :loading="isLoading"
          >
            Refresh
          </va-button>
        </div>
      </va-card-content>
    </va-card>

    <!-- Key Metrics -->
    <div class="metrics-grid mb-6">
      <va-card class="metric-card" v-for="metric in keyMetrics" :key="metric.label">
        <va-card-content class="metric-content">
          <div class="metric-icon">
            <va-icon
              :name="metric.icon"
              size="large"
              :color="metric.color"
            />
          </div>
          <div class="metric-info">
            <div class="metric-value">{{ metric.value }}</div>
            <div class="metric-label">{{ metric.label }}</div>
            <div class="metric-change" v-if="metric.change !== undefined">
              <va-icon
                :name="metric.change >= 0 ? 'trending_up' : 'trending_down'"
                size="small"
                :color="metric.change >= 0 ? 'success' : 'danger'"
              />
              <span :class="metric.change >= 0 ? 'text-success' : 'text-danger'">
                {{ Math.abs(metric.change) }}%
              </span>
              <span class="metric-period">vs last month</span>
            </div>
          </div>
        </va-card-content>
      </va-card>
    </div>

    <!-- Charts Section -->
    <div class="charts-section mb-6">
      <div class="charts-grid">
        <!-- User Activity Chart -->
        <va-card class="chart-card">
          <va-card-title class="text-h6 mb-3">
            <va-icon name="analytics" class="mr-2" />
            User Activity
          </va-card-title>
          <va-card-content>
            <div class="chart-container">
              <div class="chart-placeholder">
                <va-icon name="bar_chart" size="x-large" color="primary" />
                <p>User activity chart would be displayed here</p>
                <p class="text-caption">Using Chart.js or similar library</p>
              </div>
            </div>
          </va-card-content>
        </va-card>

        <!-- System Health Chart -->
        <va-card class="chart-card">
          <va-card-title class="text-h6 mb-3">
            <va-icon name="monitor_heart" class="mr-2" />
            System Health
          </va-card-title>
          <va-card-content>
            <div class="chart-container">
              <div class="chart-placeholder">
                <va-icon name="pie_chart" size="x-large" color="success" />
                <p>System health metrics would be displayed here</p>
                <p class="text-caption">Real-time monitoring data</p>
              </div>
            </div>
          </va-card-content>
        </va-card>
      </div>
    </div>

    <!-- Recent Activity -->
    <va-card class="activity-card mb-6">
      <va-card-title class="text-h6 mb-3">
        <va-icon name="history" class="mr-2" />
        Recent Activity
      </va-card-title>
      <va-card-content>
        <div class="activity-list">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="activity-item"
          >
            <div class="activity-icon">
              <va-icon
                :name="activity.icon"
                :color="activity.color"
                size="small"
              />
            </div>
            <div class="activity-content">
              <div class="activity-text">{{ activity.text }}</div>
              <div class="activity-meta">
                <span class="activity-user">{{ activity.user }}</span>
                <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
              </div>
            </div>
            <div class="activity-status">
              <va-chip
                :color="activity.statusColor"
                size="small"
              >
                {{ activity.status }}
              </va-chip>
            </div>
          </div>
        </div>
      </va-card-content>
    </va-card>

    <!-- Quick Actions -->
    <va-card class="actions-card">
      <va-card-title class="text-h6 mb-3">
        <va-icon name="flash_on" class="mr-2" />
        Quick Actions
      </va-card-title>
      <va-card-content>
        <div class="actions-grid">
          <va-button
            v-for="action in quickActions"
            :key="action.label"
            :color="action.color"
            :variant="action.variant"
            :icon="action.icon"
            @click="action.handler"
            class="action-button"
          >
            {{ action.label }}
          </va-button>
        </div>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)

// Mock data for demonstration
const keyMetrics = ref([
  {
    label: 'Total Users',
    value: '1,247',
    icon: 'people',
    color: 'primary',
    change: 12
  },
  {
    label: 'Active Sessions',
    value: '89',
    icon: 'visibility',
    color: 'success',
    change: 8
  },
  {
    label: 'System Load',
    value: '67%',
    icon: 'speed',
    color: 'warning',
    change: -5
  },
  {
    label: 'Error Rate',
    value: '0.02%',
    icon: 'error',
    color: 'danger',
    change: -15
  }
])

const recentActivities = ref([
  {
    id: 1,
    text: 'New user registration completed',
    user: 'john.doe@example.com',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    icon: 'person_add',
    color: 'success',
    status: 'Completed',
    statusColor: 'success'
  },
  {
    id: 2,
    text: 'Database backup initiated',
    user: 'System',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    icon: 'backup',
    color: 'info',
    status: 'In Progress',
    statusColor: 'warning'
  },
  {
    id: 3,
    text: 'Security scan completed',
    user: 'Security Bot',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    icon: 'security',
    color: 'success',
    status: 'Completed',
    statusColor: 'success'
  },
  {
    id: 4,
    text: 'Performance optimization applied',
    user: 'DevOps Team',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    icon: 'tune',
    color: 'primary',
    status: 'Completed',
    statusColor: 'success'
  },
  {
    id: 5,
    text: 'API rate limit exceeded',
    user: 'api.gateway',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    icon: 'warning',
    color: 'warning',
    status: 'Resolved',
    statusColor: 'info'
  }
])

const quickActions = ref([
  {
    label: 'Add User',
    icon: 'person_add',
    color: 'success',
    variant: 'default',
    handler: () => router.push('/data')
  },
  {
    label: 'View Reports',
    icon: 'assessment',
    color: 'primary',
    variant: 'outlined',
    handler: () => console.log('View Reports clicked')
  },
  {
    label: 'System Settings',
    icon: 'settings',
    color: 'secondary',
    variant: 'outlined',
    handler: () => console.log('System Settings clicked')
  },
  {
    label: 'Export Data',
    icon: 'download',
    color: 'info',
    variant: 'outlined',
    handler: () => console.log('Export Data clicked')
  }
])

// Methods
const refreshDashboard = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Dashboard refreshed')
  } catch (error) {
    console.error('Failed to refresh dashboard:', error)
  } finally {
    isLoading.value = false
  }
}

const formatTime = (timestamp: Date) => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

// Lifecycle
onMounted(() => {
  console.log('Dashboard mounted')
})
</script>

<style scoped>
.dashboard-page {
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

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.metric-content {
  display: flex;
  align-items: center;
  padding: 1.5rem;
}

.metric-icon {
  margin-right: 1rem;
}

.metric-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--va-text-primary);
  margin-bottom: 0.25rem;
}

.metric-label {
  color: var(--va-text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.metric-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
}

.metric-period {
  color: var(--va-text-secondary);
  margin-left: 0.5rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.chart-card {
  min-height: 300px;
}

.chart-container {
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
  color: var(--va-text-secondary);
}

.chart-placeholder p {
  margin: 0.5rem 0;
}

.activity-list {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--va-background-secondary);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  margin-right: 1rem;
  width: 40px;
  text-align: center;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-weight: 500;
  color: var(--va-text-primary);
  margin-bottom: 0.25rem;
}

.activity-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--va-text-secondary);
}

.activity-user {
  font-weight: 500;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-button {
  height: 48px;
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
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
