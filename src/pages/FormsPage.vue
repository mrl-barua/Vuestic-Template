<template>
  <div class="forms-page">
    <va-card class="mb-6">
      <va-card-title class="text-h4 mb-4">
        Form Handling & Validation
      </va-card-title>
      <va-card-content>
        <p class="text-body-1">
          Learn how to handle forms with validation, error handling, and submission patterns.
        </p>
      </va-card-content>
    </va-card>

    <!-- User Registration Form -->
    <va-card class="mb-6">
      <va-card-title class="text-h5 mb-3">User Registration</va-card-title>
      <va-card-content>
        <form @submit.prevent="handleSubmit" class="registration-form">
          <div class="form-section">
            <h6 class="text-h6 mb-3">Personal Information</h6>
            <div class="form-row">
              <va-input
                v-model="form.firstName"
                label="First Name *"
                placeholder="Enter first name"
                :error="errors.firstName"
                class="ma-2"
                required
              />
              <va-input
                v-model="form.lastName"
                label="Last Name *"
                placeholder="Enter last name"
                :error="errors.lastName"
                class="ma-2"
                required
              />
            </div>
            
            <div class="form-row">
              <va-input
                v-model="form.email"
                label="Email *"
                type="email"
                placeholder="Enter email address"
                :error="errors.email"
                class="ma-2"
                required
              />
              <va-input
                v-model="form.phone"
                label="Phone"
                placeholder="Enter phone number"
                :error="errors.phone"
                class="ma-2"
              />
            </div>
          </div>

          <div class="form-section">
            <h6 class="text-h6 mb-3">Account Details</h6>
            <div class="form-row">
              <va-input
                v-model="form.username"
                label="Username *"
                placeholder="Choose username"
                :error="errors.username"
                class="ma-2"
                required
              />
              <va-input
                v-model="form.password"
                label="Password *"
                type="password"
                placeholder="Enter password"
                :error="errors.password"
                class="ma-2"
                required
              />
            </div>
            
            <div class="form-row">
              <va-input
                v-model="form.confirmPassword"
                label="Confirm Password *"
                type="password"
                placeholder="Confirm password"
                :error="errors.confirmPassword"
                class="ma-2"
                required
              />
            </div>
          </div>

          <div class="form-section">
            <h6 class="text-h6 mb-3">Preferences</h6>
            <div class="form-row">
              <va-select
                v-model="form.country"
                label="Country *"
                :options="countryOptions"
                :error="errors.country"
                class="ma-2"
                required
              />
              <va-select
                v-model="form.timezone"
                label="Timezone"
                :options="timezoneOptions"
                class="ma-2"
              />
            </div>
            
            <div class="form-row">
              <va-checkbox
                v-model="form.newsletter"
                label="Subscribe to newsletter"
                class="ma-2"
              />
              <va-checkbox
                v-model="form.terms"
                label="I agree to the terms and conditions *"
                :error="errors.terms"
                class="ma-2"
                required
              />
            </div>
          </div>

          <div class="form-actions">
            <va-button
              type="submit"
              :loading="isSubmitting"
              :disabled="!isFormValid"
              class="ma-2"
            >
              {{ isSubmitting ? 'Creating Account...' : 'Create Account' }}
            </va-button>
            <va-button
              variant="outlined"
              @click="resetForm"
              class="ma-2"
            >
              Reset Form
            </va-button>
          </div>
        </form>
      </va-card-content>
    </va-card>

    <!-- Form Preview -->
    <va-card v-if="showPreview">
      <va-card-title class="text-h5 mb-3">Form Data Preview</va-card-title>
      <va-card-content>
        <pre class="form-preview">{{ JSON.stringify(form, null, 2) }}</pre>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  username: string
  password: string
  confirmPassword: string
  country: string
  timezone: string
  newsletter: boolean
  terms: boolean
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  username?: string
  password?: string
  confirmPassword?: string
  country?: string
  terms?: string
}

const form = reactive<FormData>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  username: '',
  password: '',
  confirmPassword: '',
  country: '',
  timezone: '',
  newsletter: false,
  terms: false
})

const errors = reactive<FormErrors>({})
const isSubmitting = ref(false)
const showPreview = ref(false)

const countryOptions = [
  { text: 'United States', value: 'US' },
  { text: 'Canada', value: 'CA' },
  { text: 'United Kingdom', value: 'UK' },
  { text: 'Germany', value: 'DE' },
  { text: 'France', value: 'FR' },
  { text: 'Japan', value: 'JP' }
]

const timezoneOptions = [
  { text: 'UTC-8 (Pacific)', value: 'UTC-8' },
  { text: 'UTC-5 (Eastern)', value: 'UTC-5' },
  { text: 'UTC+0 (GMT)', value: 'UTC+0' },
  { text: 'UTC+1 (Central Europe)', value: 'UTC+1' },
  { text: 'UTC+8 (China)', value: 'UTC+8' },
  { text: 'UTC+9 (Japan)', value: 'UTC+9' }
]

const isFormValid = computed(() => {
  return form.firstName && 
         form.lastName && 
         form.email && 
         form.username && 
         form.password && 
         form.confirmPassword && 
         form.country && 
         form.terms
})

const validateForm = (): boolean => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    delete errors[key as keyof FormErrors]
  })

  let isValid = true

  // Required field validation
  if (!form.firstName) {
    errors.firstName = 'First name is required'
    isValid = false
  }

  if (!form.lastName) {
    errors.lastName = 'Last name is required'
    isValid = false
  }

  if (!form.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  if (!form.username) {
    errors.username = 'Username is required'
    isValid = false
  } else if (form.username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    isValid = false
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  if (!form.country) {
    errors.country = 'Please select a country'
    isValid = false
  }

  if (!form.terms) {
    errors.terms = 'You must agree to the terms and conditions'
    isValid = false
  }

  return isValid
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Show success and preview
    showPreview.value = true
    
    // In a real app, you would redirect or show success message
    console.log('Form submitted successfully:', form)
    
  } catch (error) {
    console.error('Form submission failed:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  Object.keys(form).forEach(key => {
    if (key === 'newsletter' || key === 'terms') {
      form[key as keyof FormData] = false as any
    } else {
      form[key as keyof FormData] = '' as any
    }
  })
  
  Object.keys(errors).forEach(key => {
    delete errors[key as keyof FormErrors]
  })
  
  showPreview.value = false
}
</script>

<style scoped>
.forms-page {
  padding: 1rem 0;
}

.registration-form {
  max-width: 800px;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid var(--va-background-secondary);
  border-radius: 8px;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-row > * {
  flex: 1;
  min-width: 250px;
}

.form-actions {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-top: 2rem;
}

.form-preview {
  background: var(--va-background-secondary);
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}
</style>
