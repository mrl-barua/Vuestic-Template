import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuestic } from 'vuestic-ui'
import 'vuestic-ui/css'
import './styles/global.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// Vuestic UI configuration
const vuesticConfig = {
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi: {
        // Material Design Icons configuration
        aliases: {
          // Common icon aliases for better compatibility
          'refresh': 'refresh',
          'group': 'group',
          'check_circle': 'check_circle',
          'schedule': 'schedule',
          'block': 'block',
          'arrow_upward': 'arrow_upward',
          'arrow_downward': 'arrow_downward',
          'insert_chart': 'insert_chart',
          'info': 'info',
          'admin_panel_settings': 'admin_panel_settings',
          'security': 'security',
          'data_usage': 'data_usage',
          'settings': 'settings',
          'history': 'history',
          'table': 'table',
          'person': 'person',
          'visibility': 'visibility',
          'edit': 'edit',
          'delete': 'delete',
          'search': 'search',
          'person_add': 'person_add',
          'download': 'download',
          'assessment': 'assessment',
          'analytics': 'analytics',
          'bar_chart': 'bar_chart',
          'monitor_heart': 'monitor_heart',
          'pie_chart': 'pie_chart',
          'flash_on': 'flash_on',
          'code': 'code',
          'business': 'business',
          'apps': 'apps',
          'build': 'build',
          'desktop_windows': 'desktop_windows',
          'rocket_launch': 'rocket_launch',
          'widgets': 'widgets',
          'directions_walk': 'directions_walk',
          'shopping_cart': 'shopping_cart',
          'terminal': 'terminal',
          'web': 'web',
          'database': 'database',
          'cloud_sync': 'cloud_sync',
          'lightbulb_outline': 'lightbulb_outline',
          'docker': 'docker',
          'web_asset': 'web_asset',
          'cloud': 'cloud',
          'cloud_done': 'cloud_done',
          'language': 'language'
        }
      }
    }
  }
}

// Plugins
app.use(createPinia())
app.use(router)
app.use(createVuestic(vuesticConfig))

app.mount('#app')
