<template>
  <div class="not-found-page">
    <va-card class="text-center">
      <va-card-content>
        <va-icon
          name="error_outline"
          size="x-large"
          color="warning"
          class="mb-4"
        />
        <h1 class="text-h1 mb-4">404</h1>
        <h2 class="text-h4 mb-4">Page Not Found</h2>
        <p class="text-body-1 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div class="actions">
          <va-button
            @click="goHome"
            color="primary"
            class="ma-2"
          >
            Go Home
          </va-button>
          <va-button
            @click="goBack"
            variant="outlined"
            class="ma-2"
          >
            Go Back
          </va-button>
        </div>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found-page {
  padding: 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>
