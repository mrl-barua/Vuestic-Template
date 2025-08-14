<template>
  <div id="app">
    <va-navbar class="mb-4">
      <template #left>
        <va-navbar-item>
          <h2 class="ma-0">Vue 3 Template</h2>
        </va-navbar-item>
      </template>
      <template #center>
        <va-navbar-item v-for="item in navItems" :key="item.path">
          <router-link :to="item.path" class="nav-link">
            {{ item.name }}
          </router-link>
        </va-navbar-item>
      </template>
      <template #right>
        <va-navbar-item>
          <va-button @click="toggleTheme" :icon="themeIcon" />
        </va-navbar-item>
      </template>
    </va-navbar>

    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useNavigation } from '@/composables/useNavigation'

const { isDark, toggleTheme } = useTheme()
const { navItems } = useNavigation()

const themeIcon = computed(() => isDark.value ? 'dark_mode' : 'light_mode')
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: var(--va-background-primary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.nav-link {
  text-decoration: none;
  color: inherit;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: var(--va-background-secondary);
}

.nav-link.router-link-active {
  background-color: var(--va-primary);
  color: white;
}
</style>
