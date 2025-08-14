<template>
  <div class="home-page">
    <va-card class="mb-6">
      <va-card-title class="text-h4 mb-4">
        Welcome to Vue 3 + TypeScript + Vuestic UI Template
      </va-card-title>
      <va-card-content>
        <p class="text-body-1 mb-4">
          This is a modular, plug-and-play template designed for rapid development and easy extension.
          Built with modern Vue 3 Composition API, TypeScript, and Vuestic UI components.
        </p>
        <va-alert
          type="info"
          class="mb-4"
          :title="'Template Features'"
        >
          <ul class="ma-0 pa-0">
            <li>Modular component architecture</li>
            <li>TypeScript with strict type checking</li>
            <li>Vuestic UI component library</li>
            <li>Vue Router with lazy loading</li>
            <li>Pinia state management</li>
            <li>Theme switching (dark/light)</li>
            <li>Responsive design</li>
          </ul>
        </va-alert>
      </va-card-content>
    </va-card>

    <div class="features-grid">
      <va-card
        v-for="feature in features"
        :key="feature.title"
        class="feature-card"
        @click="navigateTo(feature.path)"
      >
        <va-card-content class="text-center">
          <va-icon
            :name="feature.icon"
            size="large"
            class="mb-3"
            color="primary"
          />
          <va-card-title class="text-h6 mb-2">
            {{ feature.title }}
          </va-card-title>
          <p class="text-body-2 text-medium-emphasis">
            {{ feature.description }}
          </p>
        </va-card-content>
      </va-card>
    </div>

    <va-card class="mt-6">
      <va-card-title class="text-h5 mb-3">
        Getting Started
      </va-card-title>
      <va-card-content>
        <p class="text-body-1 mb-3">
          To add new pages or components:
        </p>
        <ol class="ma-0 pa-0">
          <li>Create a new component in <code>src/components/</code> or page in <code>src/pages/</code></li>
          <li>Add the route to <code>src/router/index.ts</code></li>
          <li>Add navigation item in <code>src/composables/useNavigation.ts</code></li>
          <li>Import and use in your components</li>
        </ol>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const features = [
  {
    title: 'Components',
    description: 'Explore UI components and their usage',
    icon: 'widgets',
    path: '/components'
  },
  {
    title: 'Forms',
    description: 'Learn form handling and validation',
    icon: 'edit',
    path: '/forms'
  },
  {
    title: 'Data',
    description: 'See data management examples',
    icon: 'data_usage',
    path: '/data'
  }
]

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.home-page {
  padding: 1rem 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.feature-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

code {
  background: var(--va-background-secondary);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}
</style>
