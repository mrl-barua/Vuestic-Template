<template>
  <div class="home-page">
    <!-- Hero Section -->
    <va-card class="hero-card mb-6">
      <va-card-content class="hero-content">
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
              class="mr-4"
            >
              Explore Features
            </va-button>
            <va-button
              size="large"
              variant="outlined"
              @click="scrollToArchitecture"
            >
              View Architecture
            </va-button>
          </div>
        </div>
        <div class="hero-visual">
          <va-icon
            name="code"
            size="x-large"
            color="primary"
            class="hero-icon"
          />
        </div>
      </va-card-content>
    </va-card>

    <!-- Quick Stats -->
    <div class="stats-grid mb-6">
      <va-card class="stat-card" v-for="stat in quickStats" :key="stat.label">
        <va-card-content class="stat-content">
          <va-icon
            :name="stat.icon"
            size="large"
            :color="stat.color"
            class="stat-icon"
          />
          <div class="stat-info">
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </va-card-content>
      </va-card>
    </div>

    <!-- Features Grid -->
    <div class="features-section mb-6" ref="featuresSection">
      <h2 class="section-title mb-4">Template Features</h2>
      <div class="features-grid">
        <va-card
          v-for="feature in features"
          :key="feature.title"
          class="feature-card"
          @click="navigateTo(feature.path)"
        >
          <va-card-content class="feature-content">
            <div class="feature-icon">
              <va-icon
                :name="feature.icon"
                size="large"
                color="primary"
              />
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
    <div class="architecture-section mb-6" ref="architectureSection">
      <h2 class="section-title mb-4">Architecture Overview</h2>
      <va-card>
        <va-card-content>
          <div class="architecture-grid">
            <div class="arch-layer" v-for="layer in architectureLayers" :key="layer.name">
              <div class="arch-layer-header">
                <va-icon :name="layer.icon" color="primary" class="mr-2" />
                <h4>{{ layer.name }}</h4>
              </div>
              <p class="arch-layer-description">{{ layer.description }}</p>
              <div class="arch-layer-components">
                <va-chip
                  v-for="component in layer.components"
                  :key="component"
                  size="small"
                  variant="outlined"
                  class="mr-1 mb-1"
                >
                  {{ component }}
                </va-chip>
              </div>
            </div>
          </div>
        </va-card-content>
      </va-card>
    </div>

    <!-- Getting Started -->
    <va-card class="getting-started-card">
      <va-card-title class="text-h5 mb-3">
        <va-icon name="rocket_launch" class="mr-2" />
        Getting Started
      </va-card-title>
      <va-card-content>
        <div class="getting-started-content">
          <div class="getting-started-text">
            <p class="text-body-1 mb-3">
              To add new features to this template:
            </p>
            <ol class="getting-started-steps">
              <li>Create domain entities in <code>src/domain/entities/</code></li>
              <li>Define repository interfaces in <code>src/domain/repositories/</code></li>
              <li>Create service interfaces in <code>src/domain/services/</code></li>
              <li>Implement repositories in <code>src/infrastructure/repositories/</code></li>
              <li>Implement services in <code>src/application/services/</code></li>
              <li>Add routes in <code>src/router/index.ts</code></li>
              <li>Create page components in <code>src/pages/</code></li>
            </ol>
          </div>
          <div class="getting-started-visual">
            <va-icon
              name="architecture"
              size="x-large"
              color="success"
            />
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
    components: ['Entities', 'Value Objects', 'Domain Services', 'Interfaces']
  },
  {
    name: 'Application Layer',
    description: 'Application services and use cases',
    icon: 'apps',
    components: ['Services', 'Use Cases', 'DTOs', 'Validators']
  },
  {
    name: 'Infrastructure Layer',
    description: 'External concerns and technical implementations',
    icon: 'build',
    components: ['Repositories', 'External APIs', 'Database', 'Caching']
  },
  {
    name: 'Presentation Layer',
    description: 'User interface and user experience',
    icon: 'desktop_windows',
    components: ['Components', 'Pages', 'Composables', 'Stores']
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

.hero-card {
  background: linear-gradient(135deg, var(--va-primary) 0%, var(--va-secondary) 100%);
  color: white;
  overflow: hidden;
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

.stat-icon {
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
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--va-text-primary);
  text-align: center;
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
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
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
}

.arch-layer-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.arch-layer-header h4 {
  margin: 0;
  color: var(--va-text-primary);
}

.arch-layer-description {
  color: var(--va-text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.arch-layer-components {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.getting-started-card {
  background: var(--va-background-secondary);
}

.getting-started-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.getting-started-text {
  flex: 2;
}

.getting-started-steps {
  margin: 0;
  padding-left: 1.5rem;
  line-height: 1.8;
}

.getting-started-steps li {
  margin-bottom: 0.5rem;
  color: var(--va-text-secondary);
}

.getting-started-visual {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
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
