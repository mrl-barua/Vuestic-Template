# Vue 3 + TypeScript + Vuestic UI Template

A modern, modular Vue 3 template built with TypeScript and Vuestic UI, designed for rapid development and easy extension.

## ✨ Features

- **Vue 3** with Composition API
- **TypeScript** with strict type checking
- **Vuestic UI** component library
- **Vue Router 4** with lazy loading
- **Pinia** state management
- **Vite** build tool
- **Theme switching** (dark/light mode)
- **Modular architecture** for easy extension
- **Responsive design** with modern UI components
- **Form validation** utilities
- **ESLint** configuration
- **Path aliases** for clean imports

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or download** this template
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start development server:**
   ```bash
   npm run dev
   ```
4. **Open your browser** to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Route components
│   ├── HomePage.vue    # Welcome page
│   ├── ComponentsPage.vue  # UI components showcase
│   ├── FormsPage.vue   # Form handling examples
│   ├── DataPage.vue    # Data management examples
│   └── NotFoundPage.vue # 404 page
├── stores/             # Pinia stores
│   └── userStore.ts    # User management store
├── composables/        # Reusable composition functions
│   ├── useTheme.ts     # Theme management
│   └── useNavigation.ts # Navigation management
├── utils/              # Utility functions
│   └── validation.ts   # Form validation helpers
├── types/              # TypeScript type definitions
├── router/             # Vue Router configuration
├── App.vue             # Root component
└── main.ts             # Application entry point
```

## 🔧 Adding New Features

### Adding a New Page

1. **Create the page component** in `src/pages/`:
   ```vue
   <template>
     <div class="new-page">
       <va-card>
         <va-card-title>New Page</va-card-title>
         <va-card-content>
           Your content here
         </va-card-content>
       </va-card>
     </div>
   </template>

   <script setup lang="ts">
   // Your component logic
   </script>
   ```

2. **Add the route** in `src/router/index.ts`:
   ```typescript
   {
     path: '/new-page',
     name: 'NewPage',
     component: () => import('@/pages/NewPage.vue')
   }
   ```

3. **Add navigation item** in `src/composables/useNavigation.ts`:
   ```typescript
   {
     name: 'New Page',
     path: '/new-page',
     icon: 'new_page',
     description: 'Description of the new page'
   }
   ```

### Adding a New Component

1. **Create the component** in `src/components/`:
   ```vue
   <template>
     <div class="custom-component">
       <!-- Your component template -->
     </div>
   </template>

   <script setup lang="ts">
   interface Props {
     title?: string
   }

   defineProps<Props>()
   </script>
   ```

2. **Import and use** in your pages:
   ```vue
   <script setup lang="ts">
   import CustomComponent from '@/components/CustomComponent.vue'
   </script>
   ```

### Adding a New Store

1. **Create the store** in `src/stores/`:
   ```typescript
   import { defineStore } from 'pinia'
   import { ref, computed } from 'vue'

   export const useNewStore = defineStore('new', () => {
     const state = ref({})
     const getters = computed(() => ({}))
     const actions = {}
     
     return { state, getters, actions }
   })
   ```

2. **Use in components**:
   ```typescript
   import { useNewStore } from '@/stores/newStore'
   const store = useNewStore()
   ```

## 🎨 Customization

### Theme Configuration

The template includes a built-in theme system. Customize themes in `src/composables/useTheme.ts`.

### Styling

- Uses CSS custom properties for theming
- Responsive design with CSS Grid and Flexbox
- Vuestic UI utility classes available

### Component Library

Vuestic UI provides a comprehensive set of components. See the [Components page](/components) for examples and the [official documentation](https://vuestic.dev/) for full reference.

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🏗️ Architecture Patterns

### Composition API

All components use Vue 3's Composition API with `<script setup>` syntax for better TypeScript support and cleaner code.

### State Management

- **Local state**: Use `ref()` and `reactive()`
- **Global state**: Use Pinia stores
- **Form state**: Use `reactive()` with validation

### Type Safety

- Strict TypeScript configuration
- Interface definitions for all data structures
- Generic types for reusable components

### Performance

- Lazy-loaded routes
- Computed properties for derived state
- Efficient reactivity with proper dependency tracking

## 🔒 Security & Best Practices

- Input validation on all forms
- Type-safe API calls
- Secure routing with authentication guards
- XSS prevention through proper data binding

## 🌟 Extending the Template

### Adding Authentication

1. Create auth store in `src/stores/authStore.ts`
2. Add route guards in `src/router/index.ts`
3. Implement login/logout components

### Adding API Integration

1. Create API service files in `src/services/`
2. Use composables for API state management
3. Implement error handling and loading states

### Adding Testing

1. Install testing libraries (Vitest, Vue Test Utils)
2. Create test files alongside components
3. Set up testing configuration

## 🤝 Contributing

This template is designed to be easily extensible. Feel free to:

- Add new components and pages
- Improve existing functionality
- Add new features and utilities
- Enhance the documentation

## 📄 License

This template is provided as-is for educational and development purposes.

## 🆘 Support

For issues or questions:
- Check the [Vue 3 documentation](https://vuejs.org/)
- Review [Vuestic UI docs](https://vuestic.dev/)
- Check [TypeScript documentation](https://www.typescriptlang.org/)

---

**Happy coding! 🚀**
