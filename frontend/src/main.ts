
import {createApp, provide} from 'vue'
// @ts-ignore
import App from './App.vue'
import router from './router'
import axios from "axios";
import VueAxios from "vue-axios";

//bootstrap
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../scss/custom.css'
import 'primeicons/primeicons.css';

// import './assets/main.css'


//sweetalert2
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import SweetAlertCustom from "@/assets/ts/SweetAlertCustom";



const app = createApp(App)

app.use(VueAxios,axios);
app.use(router)
app.use(VueSweetalert2)
app.config.globalProperties.$swalCustom = SweetAlertCustom;



app.mount('#app')

import "bootstrap/dist/js/bootstrap.min";
import 'bootstrap/dist/js/bootstrap.bundle.min';



