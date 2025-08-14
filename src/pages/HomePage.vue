<template>
  <div class="home-page">
    <!-- Hero Section -->
    <div class="hero-container mb-16">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            Vue 3 + TypeScript + Vuestic UI
            <span class="hero-subtitle">Enterprise Template</span>
          </h1>
          <p class="hero-description">
            A production-ready, modular template built with Domain-Driven Design principles, 
            layered architecture, and modern Vue 3 patterns. Perfect for building scalable applications.
          </p>
          <div class="hero-actions">
            <va-button
              size="large"
              color="primary"
              @click="scrollToFeatures"
              class="mr-6 hero-btn primary"
            >
              Explore Features
            </va-button>
            <va-button
              size="large"
              variant="outlined"
              @click="scrollToArchitecture"
              class="hero-btn secondary"
            >
              View Architecture
            </va-button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-icon-container">
            <va-icon
              name="code"
              size="x-large"
              color="primary"
              class="hero-icon"
            />
          </div>
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
          </div>
        </va-card-content>
      </va-card>
    </div>

    <!-- Features Grid -->
    <div class="features-section mb-16" ref="featuresSection">
      <div class="section-header mb-12">
        <h2 class="section-title">Template Features</h2>
        <p class="section-subtitle">Discover what makes this template powerful and production-ready</p>
      </div>
      <div class="features-grid">
        <va-card
          v-for="feature in features"
          :key="feature.title"
          class="feature-card"
          @click="navigateTo(feature.path)"
        >
          <va-card-content class="feature-content">
            <div class="feature-icon mb-4">
              <div class="icon-background" :style="{ backgroundColor: 'var(--va-primary)' + '15' }">
                <va-icon
                  :name="feature.icon"
                  size="large"
                  color="primary"
                />
              </div>
            </div>
            <h3 class="feature-title mb-3">{{ feature.title }}</h3>
            <p class="feature-description mb-4">
              {{ feature.description }}
            </p>
            <div class="feature-tags">
              <va-chip
                v-for="tag in feature.tags"
                :key="tag"
                size="small"
                class="mr-2 mb-2"
              >
                {{ tag }}
              </va-chip>
            </div>
          </va-card-content>
        </va-card>
      </div>
    </div>

    <!-- Architecture Section -->
    <div class="architecture-section mb-16" ref="architectureSection">
      <div class="section-header mb-12">
        <h2 class="section-title">Architecture Overview</h2>
        <p class="section-subtitle">Clean, scalable architecture following Domain-Driven Design principles</p>
      </div>
      <va-card class="architecture-card">
        <va-card-content class="architecture-content p-8">
          <div class="architecture-grid">
            <div class="arch-layer" v-for="layer in architectureLayers" :key="layer.name">
              <div class="layer-header mb-4">
                <div class="layer-icon">
                  <va-icon :name="layer.icon" :color="layer.color" />
                </div>
                <h3 class="layer-name">{{ layer.name }}</h3>
              </div>
              <p class="layer-description mb-4">{{ layer.description }}</p>
              <div class="layer-components">
                <div class="component" v-for="component in layer.components" :key="component">
                  {{ component }}
                </div>
              </div>
            </div>
          </div>
        </va-card-content>
      </va-card>
    </div>

    <!-- Technology Stack -->
    <va-card class="tech-stack-card mb-16">
      <va-card-title class="tech-stack-title p-6">
        <div class="title-content">
          <div class="title-icon">
            <va-icon name="build" />
          </div>
          <h2>Technology Stack</h2>
        </div>
      </va-card-title>
      <va-card-content class="tech-stack-content p-6">
        <div class="tech-grid">
          <div class="tech-category" v-for="category in techStack" :key="category.name">
            <h4 class="category-name mb-4">{{ category.name }}</h4>
            <div class="tech-items">
              <div class="tech-item" v-for="tech in category.items" :key="tech.name">
                <div class="tech-icon">
                  <va-icon :name="tech.icon" :color="tech.color" />
                </div>
                <span class="tech-name">{{ tech.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </va-card-content>
    </va-card>

    <!-- Getting Started -->
    <va-card class="getting-started-card mb-16">
      <va-card-title class="getting-started-title p-6">
        <div class="title-content">
          <div class="title-icon">
            <va-icon name="rocket_launch" />
          </div>
          <h2>Getting Started</h2>
        </div>
      </va-card-title>
      <va-card-content class="getting-started-content p-6">
        <div class="steps-grid">
          <div class="step" v-for="(step, index) in gettingStartedSteps" :key="index">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <h4 class="step-title mb-2">{{ step.title }}</h4>
              <p class="step-description mb-4">{{ step.description }}</p>
              <va-button
                v-if="step.action"
                :color="step.action.color"
                variant="outlined"
                size="small"
                @click="step.action.handler"
                class="step-action"
              >
                {{ step.action.label }}
              </va-button>
            </div>
          </div>
        </div>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const featuresSection = ref<HTMLElement>()
const architectureSection = ref<HTMLElement>()

const quickStats = [
  { label: 'Domain Entities', value: '2+', icon: 'entity', color: 'primary' },
  { label: 'Repository Layers', value: '2+', icon: 'storage', color: 'success' },
  { label: 'Service Layers', value: '2+', icon: 'settings', color: 'warning' },
  { label: 'UI Components', value: '50+', icon: 'widgets', color: 'info' }
]

const features = [
  {
    title: 'Components',
    description: 'Explore UI components and their usage patterns',
    icon: 'widgets',
    path: '/components',
    tags: ['UI', 'Components', 'Examples']
  },
  {
    title: 'Forms',
    description: 'Learn form handling with validation and error handling',
    icon: 'edit',
    path: '/forms',
    tags: ['Forms', 'Validation', 'UX']
  },
  {
    title: 'Data Management',
    description: 'See data management patterns and state handling',
    icon: 'data_usage',
    path: '/data',
    tags: ['Data', 'State', 'Management']
  }
]

const architectureLayers = [
  {
    name: 'Domain Layer',
    description: 'Core business logic, entities, and value objects',
    icon: 'business',
    color: 'primary',
    components: ['Entities', 'Value Objects', 'Domain Services', 'Interfaces']
  },
  {
    name: 'Application Layer',
    description: 'Application services and use cases',
    icon: 'apps',
    color: 'success',
    components: ['Services', 'Use Cases', 'DTOs', 'Validators']
  },
  {
    name: 'Infrastructure Layer',
    description: 'External concerns and technical implementations',
    icon: 'build',
    color: 'warning',
    components: ['Repositories', 'External APIs', 'Database', 'Caching']
  },
  {
    name: 'Presentation Layer',
    description: 'User interface and user experience',
    icon: 'desktop_windows',
    color: 'info',
    components: ['Components', 'Pages', 'Composables', 'Stores']
  }
]

const techStack = [
  {
    name: 'Frontend',
    items: [
      { name: 'Vue 3', icon: 'code', color: 'primary' },
      { name: 'TypeScript', icon: 'language', color: 'success' },
      { name: 'Vuestic UI', icon: 'widgets', color: 'info' },
      { name: 'Vue Router', icon: 'directions_walk', color: 'warning' },
      { name: 'Pinia', icon: 'shopping_cart', color: 'primary' }
    ]
  },
  {
    name: 'Backend',
    items: [
      { name: 'Node.js', icon: 'terminal', color: 'success' },
      { name: 'Express.js', icon: 'web', color: 'info' },
      { name: 'TypeORM', icon: 'database', color: 'primary' },
      { name: 'PostgreSQL', icon: 'cloud_sync', color: 'success' },
      { name: 'Redis', icon: 'lightbulb_outline', color: 'warning' }
    ]
  },
  {
    name: 'DevOps',
    items: [
      { name: 'Docker', icon: 'docker', color: 'info' },
      { name: 'Nginx', icon: 'web_asset', color: 'success' },
      { name: 'CI/CD', icon: 'cloud_sync', color: 'primary' },
      { name: 'AWS', icon: 'cloud', color: 'warning' },
      { name: 'Vercel', icon: 'cloud_done', color: 'success' }
    ]
  }
]

const gettingStartedSteps = [
  {
    title: 'Clone the Repository',
    description: 'Clone the template repository to your local machine.',
    action: {
      label: 'Clone Repository',
      color: 'primary',
      handler: () => {
        window.open('https://github.com/mrl-barua/Vuestic-Template', '_blank')
      }
    }
  },
  {
    title: 'Install Dependencies',
    description: 'Navigate to the project directory and install dependencies.',
    action: {
      label: 'Install Dependencies',
      color: 'success',
      handler: () => {
        window.open('https://github.com/your-repo/template/blob/main/README.md#installation', '_blank')
      }
    }
  },
  {
    title: 'Run the Development Server',
    description: 'Start the development server to see the application in action.',
    action: {
      label: 'Start Server',
      color: 'info',
      handler: () => {
        window.open('https://github.com/your-repo/template/blob/main/README.md#development', '_blank')
      }
    }
  },
  {
    title: 'Explore Features',
    description: 'Navigate to the features page to learn about available components and patterns.',
    action: {
      label: 'Explore Features',
      color: 'primary',
      handler: () => {
        navigateTo('/components')
      }
    }
  }
]

const navigateTo = (path: string) => {
  router.push(path)
}

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToArchitecture = () => {
  architectureSection.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
/* HomePage Styles - Material Design Principles */
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-8) var(--spacing-4);
}

/* Hero Section */
.hero-container {
  background: linear-gradient(135deg, var(--va-primary) 0%, var(--va-primary-600) 100%);
  border-radius: var(--radius-6);
  padding: var(--spacing-16) var(--spacing-8);
  margin-bottom: var(--spacing-16);
  box-shadow: var(--shadow-5);
  position: relative;
  overflow: hidden;
}

.hero-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.hero-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-12);
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-text {
  color: white;
}

.hero-title {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  margin-bottom: var(--spacing-6);
  letter-spacing: -0.025em;
}

.hero-subtitle {
  display: block;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-medium);
  opacity: 0.9;
  margin-top: var(--spacing-2);
}

.hero-description {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-8);
  opacity: 0.95;
  max-width: 600px;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-4);
  flex-wrap: wrap;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.hero-icon {
  font-size: 8rem;
  opacity: 0.3;
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
}

/* Hero Buttons */
.hero-btn {
  padding: var(--spacing-3) var(--spacing-6);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-3);
  transition: all var(--transition-normal);
  font-size: var(--font-size-base);
}

.hero-btn.primary {
  background-color: white;
  color: var(--va-primary);
  border-color: white;
}

.hero-btn.primary:hover {
  background-color: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
  box-shadow: var(--shadow-4);
}

.hero-btn.secondary {
  background-color: transparent;
  color: white;
  border-color: white;
}

.hero-btn.secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: var(--shadow-3);
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

/* Features Grid */
.features-section {
  margin-bottom: var(--spacing-16);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-6);
}

.feature-card {
  cursor: pointer;
  transition: all var(--transition-normal);
  border-radius: var(--radius-4);
  overflow: hidden;
  box-shadow: var(--shadow-2);
  border: 1px solid var(--va-background-secondary);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-4);
}

.feature-content {
  padding: var(--spacing-6);
}

.feature-icon {
  margin-bottom: var(--spacing-4);
}

.feature-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--va-text-primary);
  margin-bottom: var(--spacing-3);
}

.feature-description {
  color: var(--va-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-4);
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

/* Architecture Section */
.architecture-section {
  margin-bottom: var(--spacing-16);
}

.architecture-card {
  border-radius: var(--radius-4);
  overflow: hidden;
  box-shadow: var(--shadow-2);
}

.architecture-content {
  padding: var(--spacing-8);
}

.architecture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-8);
}

.arch-layer {
  padding: var(--spacing-6);
  border-radius: var(--radius-3);
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-tertiary);
}

.layer-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.layer-icon {
  margin-right: var(--spacing-3);
  font-size: 1.5rem;
}

.layer-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--va-text-primary);
}

.layer-description {
  color: var(--va-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-4);
}

.layer-components {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.component {
  background: var(--va-background-tertiary);
  color: var(--va-text-secondary);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

/* Technology Stack */
.tech-stack-card {
  border-radius: var(--radius-4);
  overflow: hidden;
  box-shadow: var(--shadow-2);
  margin-bottom: var(--spacing-16);
}

.tech-stack-title {
  background: var(--va-background-secondary);
  border-bottom: 1px solid var(--va-background-tertiary);
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

.tech-stack-content {
  padding: var(--spacing-6);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-8);
}

.tech-category {
  margin-bottom: var(--spacing-6);
}

.category-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--va-text-primary);
  margin-bottom: var(--spacing-4);
  padding-bottom: var(--spacing-2);
  border-bottom: 2px solid var(--va-background-tertiary);
}

.tech-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.tech-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-2);
  border-radius: var(--radius-2);
  transition: all var(--transition-normal);
}

.tech-item:hover {
  background: var(--va-background-secondary);
}

.tech-icon {
  color: var(--va-primary);
  font-size: 1.25rem;
}

.tech-name {
  font-weight: var(--font-weight-medium);
  color: var(--va-text-primary);
}

/* Getting Started */
.getting-started-card {
  border-radius: var(--radius-4);
  overflow: hidden;
  box-shadow: var(--shadow-2);
  margin-bottom: var(--spacing-16);
}

.getting-started-title {
  background: var(--va-background-secondary);
  border-bottom: 1px solid var(--va-background-tertiary);
}

.getting-started-content {
  padding: var(--spacing-6);
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-6);
}

.step {
  display: flex;
  gap: var(--spacing-4);
  padding: var(--spacing-4);
  border-radius: var(--radius-3);
  background: var(--va-background-secondary);
  border: 1px solid var(--va-background-tertiary);
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--va-primary);
  color: white;
  border-radius: 50%;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--va-text-primary);
  margin-bottom: var(--spacing-2);
}

.step-description {
  color: var(--va-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-4);
}

.step-action {
  font-weight: var(--font-weight-medium);
}

/* Responsive Design */
@media (max-width: 768px) {
  .home-page {
    padding: var(--spacing-6) var(--spacing-3);
  }
  
  .hero-container {
    padding: var(--spacing-12) var(--spacing-6);
    margin-bottom: var(--spacing-12);
  }
  
  .hero-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-8);
    text-align: center;
  }
  
  .hero-title {
    font-size: var(--font-size-4xl);
  }
  
  .hero-subtitle {
    font-size: var(--font-size-xl);
  }
  
  .hero-description {
    font-size: var(--font-size-base);
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
  
  .architecture-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }
  
  .tech-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }
  
  .steps-grid {
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
  .hero-container {
    padding: var(--spacing-8) var(--spacing-4);
  }
  
  .hero-title {
    font-size: var(--font-size-3xl);
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-btn {
    width: 100%;
    max-width: 280px;
  }
  
  .stat-content {
    padding: var(--spacing-4);
  }
  
  .feature-content {
    padding: var(--spacing-4);
  }
  
  .architecture-content {
    padding: var(--spacing-6);
  }
  
  .tech-stack-content,
  .getting-started-content {
    padding: var(--spacing-4);
  }
}
</style>
