<template>
  <div class="dashboard-page">
    <!-- Page Header -->
    <div class="page-header-container mb-8">
      <div class="header-content">
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
            class="refresh-button"
          >
            Refresh
          </va-button>
        </div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="metrics-grid mb-8">
      <va-card class="metric-card" v-for="metric in keyMetrics" :key="metric.label">
        <va-card-content class="metric-content">
          <div class="metric-icon">
            <div class="icon-background" :style="{ backgroundColor: metric.color + '15' }">
              <va-icon
                :name="metric.icon"
                size="large"
                :color="metric.color"
              />
            </div>
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
    <div class="charts-section mb-8">
      <div class="charts-grid">
        <!-- User Activity Chart -->
        <va-card class="chart-card">
          <va-card-title class="chart-title">
            <div class="title-content">
              <div class="title-icon">
                <va-icon name="analytics" />
              </div>
              <h2>User Activity</h2>
            </div>
          </va-card-title>
          <va-card-content class="chart-content">
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
          <va-card-title class="chart-title">
            <div class="title-content">
              <div class="title-icon">
                <va-icon name="monitor_heart" />
              </div>
              <h2>System Health</h2>
            </div>
          </va-card-title>
          <va-card-content class="chart-content">
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

    <!-- Quick Actions -->
    <va-card class="actions-card mb-8">
      <va-card-title class="actions-title">
        <div class="title-content">
          <div class="title-icon">
            <va-icon name="flash_on" />
          </div>
          <h2>Quick Actions</h2>
        </div>
      </va-card-title>
      <va-card-content class="actions-content">
        <div class="actions-grid">
          <va-button
            v-for="action in quickActions"
            :key="action.label"
            :color="action.color"
            :icon="action.icon"
            variant="outlined"
            class="action-button"
            @click="action.handler"
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
    text: 'New user registration completed',
    time: '5 minutes ago',
    icon: 'person_add',
    color: 'success',
    status: 'Completed',
    statusColor: 'success'
  },
  {
    text: 'Database backup initiated',
    time: '15 minutes ago',
    icon: 'backup',
    color: 'info',
    status: 'In Progress',
    statusColor: 'warning'
  },
  {
    text: 'Security scan completed',
    time: '30 minutes ago',
    icon: 'security',
    color: 'success',
    status: 'Completed',
    statusColor: 'success'
  },
  {
    text: 'Performance optimization applied',
    time: '45 minutes ago',
    icon: 'tune',
    color: 'primary',
    status: 'Completed',
    statusColor: 'success'
  },
  {
    text: 'API rate limit exceeded',
    time: '1 hour ago',
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
    color: 'primary',
    handler: () => router.push('/data')
  },
  {
    label: 'View Reports',
    icon: 'assessment',
    color: 'success',
    handler: () => console.log('View Reports clicked')
  },
  {
    label: 'System Settings',
    icon: 'settings',
    color: 'warning',
    handler: () => console.log('System Settings clicked')
  },
  {
    label: 'Export Data',
    icon: 'download',
    color: 'info',
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



// Lifecycle
onMounted(() => {
  console.log('Dashboard mounted')
})
</script>

<style scoped>
.dashboard-page {
  padding: 1rem 0;
}

.page-header-container {
  background: linear-gradient(135deg, var(--va-primary) 0%, var(--va-secondary) 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.refresh-button {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border-color: white;
  transition: background-color 0.3s ease;
}

.refresh-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

.metric-content {
  display: flex;
  align-items: center;
  padding: 1.5rem;
}

.metric-icon {
  margin-right: 1rem;
}

.icon-background {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
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

.charts-section {
  padding: 0 1rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.chart-card {
  min-height: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.chart-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

.chart-title {
  background: linear-gradient(135deg, var(--va-primary) 0%, var(--va-secondary) 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px 12px 0 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0;
}

.title-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.title-icon {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-content {
  padding: 1.5rem;
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

.activity-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.activity-title {
  background: linear-gradient(135deg, var(--va-primary) 0%, var(--va-secondary) 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px 12px 0 0;
  margin-bottom: 0;
}

.activity-content {
  padding: 1.5rem;
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

.activity-time {
  font-size: 0.8rem;
  color: var(--va-text-secondary);
}

.activity-status {
  margin-top: 0.5rem;
}

.actions-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.actions-title {
  background: linear-gradient(135deg, var(--va-primary) 0%, var(--va-secondary) 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px 12px 0 0;
  margin-bottom: 0;
}

.actions-content {
  padding: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-button {
  height: 48px;
  border-radius: 8px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.action-button:hover {
  background-color: rgba(var(--va-primary-rgb), 0.1);
  border-color: var(--va-primary);
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
