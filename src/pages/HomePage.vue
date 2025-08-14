<template>
  <div class="home-page">
    <!-- Hero Section -->
    <div class="hero-container mb-8">
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
              class="mr-4 hero-btn primary"
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
    <div class="stats-grid mb-8">
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
    <div class="features-section mb-8" ref="featuresSection">
      <div class="section-header">
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
            <div class="feature-icon">
              <div class="icon-background" :style="{ backgroundColor: 'var(--va-primary)' + '15' }">
                <va-icon
                  :name="feature.icon"
                  size="large"
                  color="primary"
                />
              </div>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">
              {{ feature.description }}
            </p>
            <div class="feature-tags">
              <va-chip
                v-for="tag in feature.tags"
                :key="tag"
                size="small"
                class="mr-1 mb-1"
              >
                {{ tag }}
              </va-chip>
            </div>
          </va-card-content>
        </va-card>
      </div>
    </div>

    <!-- Architecture Section -->
    <div class="architecture-section mb-8" ref="architectureSection">
      <div class="section-header">
        <h2 class="section-title">Architecture Overview</h2>
        <p class="section-subtitle">Clean, scalable architecture following Domain-Driven Design principles</p>
      </div>
      <va-card class="architecture-card">
        <va-card-content class="architecture-content">
          <div class="architecture-grid">
            <div class="arch-layer" v-for="layer in architectureLayers" :key="layer.name">
              <div class="layer-header">
                <div class="layer-icon">
                  <va-icon :name="layer.icon" :color="layer.color" />
                </div>
                <h3 class="layer-name">{{ layer.name }}</h3>
              </div>
              <p class="layer-description">{{ layer.description }}</p>
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
    <va-card class="tech-stack-card mb-8">
      <va-card-title class="tech-stack-title">
        <div class="title-content">
          <div class="title-icon">
            <va-icon name="build" />
          </div>
          <h2>Technology Stack</h2>
        </div>
      </va-card-title>
      <va-card-content class="tech-stack-content">
        <div class="tech-grid">
          <div class="tech-category" v-for="category in techStack" :key="category.name">
            <h4 class="category-name">{{ category.name }}</h4>
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
    <va-card class="getting-started-card mb-8">
      <va-card-title class="getting-started-title">
        <div class="title-content">
          <div class="title-icon">
            <va-icon name="rocket_launch" />
          </div>
          <h2>Getting Started</h2>
        </div>
      </va-card-title>
      <va-card-content class="getting-started-content">
        <div class="steps-grid">
          <div class="step" v-for="(step, index) in gettingStartedSteps" :key="index">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <h4 class="step-title">{{ step.title }}</h4>
              <p class="step-description">{{ step.description }}</p>
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
.home-page {
  padding: 1rem 0;
}

.hero-container {
  background: linear-gradient(135deg, var(--va-primary) 0%, var(--va-secondary) 100%);
  color: white;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
}

.hero-content {
  display: flex;
  align-items: center;
  min-height: 300px;
  padding: 2rem;
}

.hero-text {
  flex: 2;
  z-index: 2;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-subtitle {
  display: block;
  font-size: 1.5rem;
  font-weight: 400;
  opacity: 0.9;
  margin-top: 0.5rem;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.95;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-visual {
  flex: 1;
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 1.5rem;
}

.stat-icon {
  margin-right: 1rem;
}

.icon-background {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--va-background-secondary);
}

.hero-btn {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.hero-btn.primary {
  background-color: white;
  color: var(--va-primary);
  border-color: white;
}

.hero-btn.primary:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.hero-btn.secondary {
  background-color: transparent;
  color: white;
  border-color: white;
}

.hero-btn.secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
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
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--va-text-primary);
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-size: 1rem;
  color: var(--va-text-secondary);
  margin-bottom: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid transparent;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
  border-color: var(--va-primary);
}

.feature-content {
  text-align: center;
  padding: 2rem;
}

.feature-icon {
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--va-text-primary);
}

.feature-description {
  color: var(--va-text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.architecture-card {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.architecture-content {
  padding: 2rem;
}

.architecture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.arch-layer {
  padding: 1.5rem;
  border: 1px solid var(--va-background-secondary);
  border-radius: 8px;
  background: var(--va-background-primary);
  transition: transform 0.2s, box-shadow 0.2s;
}

.arch-layer:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

.layer-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.layer-icon {
  margin-right: 0.75rem;
}

.layer-name {
  margin: 0;
  color: var(--va-text-primary);
}

.layer-description {
  color: var(--va-text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.layer-components {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.component {
  background: var(--va-background-secondary);
  color: var(--va-text-primary);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid var(--va-background-secondary);
  transition: background-color 0.2s, border-color 0.2s;
}

.component:hover {
  background: var(--va-primary-light);
  border-color: var(--va-primary);
}

.tech-stack-card {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.tech-stack-title {
  background: linear-gradient(135deg, var(--va-info) 0%, var(--va-warning) 100%);
  color: white;
  padding: 1.5rem 2rem;
  border-radius: 10px 10px 0 0;
  text-align: center;
}

.tech-stack-content {
  padding: 2rem;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.tech-category {
  text-align: center;
}

.category-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--va-text-primary);
  margin-bottom: 1rem;
}

.tech-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

.tech-item {
  display: flex;
  align-items: center;
  background: var(--va-background-secondary);
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--va-background-secondary);
  transition: background-color 0.2s, border-color 0.2s;
}

.tech-item:hover {
  background: var(--va-primary-light);
  border-color: var(--va-primary);
}

.tech-icon {
  margin-right: 0.75rem;
}

.tech-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--va-text-primary);
}

.getting-started-card {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.getting-started-title {
  background: linear-gradient(135deg, var(--va-success) 0%, var(--va-info) 100%);
  color: white;
  padding: 1.5rem 2rem;
  border-radius: 10px 10px 0 0;
  text-align: center;
}

.getting-started-content {
  padding: 2rem;
}

.steps-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 10px;
  background: var(--va-background-primary);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.step:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

.step-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--va-primary);
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--va-primary-light);
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--va-text-primary);
  margin-bottom: 0.5rem;
}

.step-description {
  color: var(--va-text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.step-action {
  font-weight: 500;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

code {
  background: var(--va-background-primary);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: var(--va-primary);
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .architecture-grid {
    grid-template-columns: 1fr;
  }
  
  .getting-started-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>
