import { createApp } from 'vue'
import moment from 'moment'
import App from './App.vue'
import router from './router'
import store from './store'

import Navbar from './components/Navbar'
import Modal from './components/Modal'
import NavegacaoLateral from './components/NavegacaoLateral'
import Grafico from './components/Grafico'
import OffCanvas from './components/OffCanvas'
import Filtro from './components/Filtro'

const app = createApp(App)
app.config.globalProperties.moment = moment

app.component('navbar', Navbar)
app.component('Modal', Modal)
app.component('navegacao-lateral', NavegacaoLateral)
app.component('grafico', Grafico)
app.component('offcanvas', OffCanvas)
app.component('filtro', Filtro)

app.use(store)
.use(router)
.mount('#app')
