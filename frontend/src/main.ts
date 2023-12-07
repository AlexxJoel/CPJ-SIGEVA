
import { createApp } from 'vue'
// @ts-ignore
import App from './App.vue'
import router from './router'

//bootstrap
import 'bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
import '../scss/custom.css'
import './assets/main.css'


//sweetalert2
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';




const app = createApp(App)


app.use(router)
app.use(VueSweetalert2);


app.mount('#app')



