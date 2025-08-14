<template>
  <div class="dashboard-page">
    <!-- Page Header -->
    <div class="page-header-container mb-16">
      <div class="page-header-content">
        <div class="page-header-text">
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Real-time overview of your application</p>
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

    <!-- Key Metrics -->
    <div class="metrics-grid mb-16">
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
            <div class="metric-number">{{ metric.value }}</div>
            <div class="metric-label">{{ metric.label }}</div>
            <div class="metric-change" :class="metric.trend">
              <va-icon :name="metric.trend === 'up' ? 'arrow_upward' : 'arrow_downward'" />
              {{ metric.change }}%
            </div>
          </div>
        </va-card-content>
      </va-card>
    </div>

    <!-- Charts Section -->
    <div class="charts-section mb-16">
      <div class="section-header mb-12">
        <h2 class="section-title">Analytics Overview</h2>
        <p class="section-subtitle">Performance metrics and trends</p>
      </div>
      <div class="charts-grid">
        <va-card class="chart-card">
          <va-card-title class="chart-title">
            <div class="title-content">
              <div class="title-icon">
                <va-icon name="insert_chart" />
              </div>
              <h3>User Activity</h3>
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
                <va-icon name="assessment" />
              </div>
              <h3>Performance Metrics</h3>
            </div>
          </va-card-title>
          <va-card-content class="chart-content p-6">
            <div class="performance-metrics">
              <div class="metric-item" v-for="metric in performanceMetrics" :key="metric.name">
                <div class="metric-header">
                  <span class="metric-name">{{ metric.name }}</span>
                  <span class="metric-value">{{ metric.value }}</span>
                </div>
                <div class="metric-bar">
                  <div class="metric-progress" :style="{ width: metric.percentage + '%', backgroundColor: metric.color }"></div>
                </div>
              </div>
            </div>
          </va-card-content>
        </va-card>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="activity-section mb-16">
      <div class="section-header mb-12">
        <h2 class="section-title">Recent Activity</h2>
        <p class="section-subtitle">Latest updates and actions</p>
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

    <!-- Quick Actions -->
    <div class="actions-section mb-16">
      <div class="section-header mb-12">
        <h2 class="section-title">Quick Actions</h2>
        <p class="section-subtitle">Common tasks and shortcuts</p>
      </div>
      <va-card class="actions-card">
        <va-card-content class="actions-content p-6">
          <div class="actions-grid">
            <va-button
              v-for="action in quickActions"
              :key="action.label"
              :color="action.color"
              variant="outlined"
              size="large"
              @click="action.handler"
              class="action-button"
            >
              <va-icon :name="action.icon" class="mr-3" />
              {{ action.label }}
            </va-button>
          </div>
        </va-card-content>
      </va-card>
    </div>
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
    change: 12,
    trend: 'up'
  },
  {
    label: 'Active Sessions',
    value: '89',
    icon: 'visibility',
    color: 'success',
    change: 8,
    trend: 'up'
  },
  {
    label: 'System Load',
    value: '67%',
    icon: 'speed',
    color: 'warning',
    change: -5,
    trend: 'down'
  },
  {
    label: 'Error Rate',
    value: '0.02%',
    icon: 'error',
    color: 'danger',
    change: -15,
    trend: 'down'
  }
])

const recentActivities = ref([
  {
    id: 1,
    text: 'New user registration completed',
    time: '5 minutes ago',
    icon: 'person_add',
    color: 'success',
    status: 'Completed'
  },
  {
    id: 2,
    text: 'Database backup initiated',
    time: '15 minutes ago',
    icon: 'backup',
    color: 'info',
    status: 'In Progress'
  },
  {
    id: 3,
    text: 'Security scan completed',
    time: '30 minutes ago',
    icon: 'security',
    color: 'success',
    status: 'Completed'
  },
  {
    id: 4,
    text: 'Performance optimization applied',
    time: '45 minutes ago',
    icon: 'tune',
    color: 'primary',
    status: 'Completed'
  },
  {
    id: 5,
    text: 'API rate limit exceeded',
    time: '1 hour ago',
    icon: 'warning',
    color: 'warning',
    status: 'Resolved'
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

const chartData = ref([
  { label: 'Jan', value: 120, color: 'primary' },
  { label: 'Feb', value: 150, color: 'success' },
  { label: 'Mar', value: 180, color: 'warning' },
  { label: 'Apr', value: 200, color: 'danger' },
  { label: 'May', value: 220, color: 'primary' },
  { label: 'Jun', value: 250, color: 'success' },
  { label: 'Jul', value: 280, color: 'warning' },
  { label: 'Aug', value: 300, color: 'danger' },
  { label: 'Sep', value: 320, color: 'primary' },
  { label: 'Oct', value: 350, color: 'success' },
  { label: 'Nov', value: 380, color: 'warning' },
  { label: 'Dec', value: 400, color: 'danger' }
])

const performanceMetrics = ref([
  { name: 'CPU Usage', value: '75%', percentage: 75, color: 'primary' },
  { name: 'Memory Usage', value: '85%', percentage: 85, color: 'success' },
  { name: 'Disk Space', value: '95%', percentage: 95, color: 'warning' },
  { name: 'Network Traffic', value: '60%', percentage: 60, color: 'info' }
])

// Methods
const refreshData = async () => {
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

const getChartBarStyle = (value: number, color: string) => {
  const percentage = (value / 400) * 100; // Assuming max value is 400
  return {
    height: `${percentage}%`,
    backgroundColor: color,
    borderRadius: '8px'
  };
};


// Lifecycle
onMounted(() => {
  console.log('Dashboard mounted')
})
</script>

<style scoped>
/* DashboardPage Styles - Material Design Principles */
.dashboard-page {
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

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-16);
}

.metric-card {
  transition: all var(--transition-normal);
  border-radius: var(--radius-4);
  overflow: hidden;
  box-shadow: var(--shadow-2);
  border: 1px solid var(--va-background-secondary);
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-4);
}

.metric-content {
  display: flex;
  align-items: center;
  padding: var(--spacing-6);
}

.metric-icon {
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

.metric-info {
  flex: 1;
}

.metric-number {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--va-text-primary);
  margin-bottom: var(--spacing-1);
}

.metric-label {
  font-size: var(--font-size-sm);
  color: var(--va-text-secondary);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-2);
}

.metric-change {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.metric-change.up {
  color: var(--va-success);
}

.metric-change.down {
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

/* Performance Metrics */
.performance-metrics {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.metric-item {
  padding: var(--spacing-3);
  border-radius: var(--radius-2);
  background: var(--va-background-secondary);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2);
}

.metric-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--va-text-primary);
}

.metric-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--va-text-secondary);
}

.metric-bar {
  height: 8px;
  background: var(--va-background-tertiary);
  border-radius: var(--radius-1);
  overflow: hidden;
}

.metric-progress {
  height: 100%;
  border-radius: var(--radius-1);
  transition: width var(--transition-normal);
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

/* Actions Section */
.actions-section {
  margin-bottom: var(--spacing-16);
}

.actions-card {
  border-radius: var(--radius-4);
  overflow: hidden;
  box-shadow: var(--shadow-2);
  border: 1px solid var(--va-background-secondary);
}

.actions-content {
  padding: var(--spacing-6);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-4);
}

.action-button {
  height: 56px;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
  border-radius: var(--radius-3);
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-page {
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
  
  .metrics-grid {
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
  
  .actions-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-3);
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
  
  .metric-content {
    padding: var(--spacing-4);
  }
  
  .chart-content {
    padding: var(--spacing-4);
  }
  
  .activity-content {
    padding: var(--spacing-4);
  }
  
  .actions-content {
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
}
</style>
