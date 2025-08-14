<template>
  <div class="components-page">
    <va-card class="mb-6">
      <va-card-title class="text-h4 mb-4">
        UI Components Showcase
      </va-card-title>
      <va-card-content>
        <p class="text-body-1">
          Explore the available Vuestic UI components and learn how to use them effectively.
        </p>
      </va-card-content>
    </va-card>

    <!-- Buttons Section -->
    <va-card class="mb-6">
      <va-card-title class="text-h5 mb-3">Buttons</va-card-title>
      <va-card-content>
        <div class="component-examples">
          <va-button class="ma-2">Default Button</va-button>
          <va-button color="primary" class="ma-2">Primary Button</va-button>
          <va-button color="secondary" class="ma-2">Secondary Button</va-button>
          <va-button color="success" class="ma-2">Success Button</va-button>
          <va-button color="warning" class="ma-2">Warning Button</va-button>
          <va-button color="danger" class="ma-2">Danger Button</va-button>
        </div>
        <div class="component-examples mt-4">
          <va-button variant="outlined" class="ma-2">Outlined</va-button>
          <va-button variant="text" class="ma-2">Text</va-button>
          <va-button size="small" class="ma-2">Small</va-button>
          <va-button size="large" class="ma-2">Large</va-button>
          <va-button :loading="loading" class="ma-2">Loading</va-button>
        </div>
      </va-card-content>
    </va-card>

    <!-- Form Controls Section -->
    <va-card class="mb-6">
      <va-card-title class="text-h5 mb-3">Form Controls</va-card-title>
      <va-card-content>
        <div class="form-row">
          <va-input
            v-model="formData.name"
            label="Name"
            placeholder="Enter your name"
            class="ma-2"
          />
          <va-input
            v-model="formData.email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            class="ma-2"
          />
        </div>
        <div class="form-row">
          <va-select
            v-model="formData.category"
            label="Category"
            :options="categoryOptions"
            class="ma-2"
          />
          <va-checkbox
            v-model="formData.agreed"
            label="I agree to the terms"
            class="ma-2"
          />
        </div>
        <div class="form-row">
          <va-radio
            v-model="formData.gender"
            :options="genderOptions"
            class="ma-2"
          />
        </div>
      </va-card-content>
    </va-card>

    <!-- Data Display Section -->
    <va-card class="mb-6">
      <va-card-title class="text-h5 mb-3">Data Display</va-card-title>
      <va-card-content>
        <va-chip
          v-for="tag in tags"
          :key="tag"
          class="ma-1"
          :color="getRandomColor()"
        >
          {{ tag }}
        </va-chip>
        
        <va-progress-linear
          :model-value="progress"
          class="mt-4"
          color="primary"
        />
        
        <va-badge
          :content="notificationCount"
          class="ma-4"
        >
          <va-button>Notifications</va-button>
        </va-badge>
      </va-card-content>
    </va-card>

    <!-- Feedback Section -->
    <va-card class="mb-6">
      <va-card-title class="text-h5 mb-3">Feedback & Alerts</va-card-title>
      <va-card-content>
        <va-alert
          type="success"
          class="mb-3"
          title="Success!"
        >
          This is a success message.
        </va-alert>
        
        <va-alert
          type="warning"
          class="mb-3"
          title="Warning!"
        >
          This is a warning message.
        </va-alert>
        
        <va-alert
          type="error"
          class="mb-3"
          title="Error!"
        >
          This is an error message.
        </va-alert>
        
        <va-button @click="showToast" class="ma-2">
          Show Toast
        </va-button>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const loading = ref(false)
const progress = ref(0)
const notificationCount = ref(5)

const formData = ref({
  name: '',
  email: '',
  category: '',
  agreed: false,
  gender: 'male'
})

const categoryOptions = [
  { text: 'Technology', value: 'tech' },
  { text: 'Design', value: 'design' },
  { text: 'Business', value: 'business' },
  { text: 'Education', value: 'education' }
]

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' }
]

const tags = ['Vue', 'TypeScript', 'Vuestic UI', 'Modern', 'Responsive']

const getRandomColor = () => {
  const colors = ['primary', 'secondary', 'success', 'warning', 'danger']
  return colors[Math.floor(Math.random() * colors.length)]
}

const showToast = () => {
  // This would typically use a toast notification system
  console.log('Toast notification clicked!')
}

onMounted(() => {
  // Simulate progress
  const interval = setInterval(() => {
    progress.value += 10
    if (progress.value >= 100) {
      progress.value = 0
    }
  }, 1000)

  return () => clearInterval(interval)
})
</script>

<style scoped>
.components-page {
  padding: 1rem 0;
}

.component-examples {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
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
</style>
