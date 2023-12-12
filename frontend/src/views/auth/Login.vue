<template>
  <!-- Login with email and pswd-->
  <Navbar/>

  <div class="container">
    <div class="text-center">
      <div class="card shadow shadow-sm  mt-5 mt-md-5 m-md-auto px-4 " style="max-width: 45rem;">
        <form @submit="onSubmit">
          <img class="my-4" src="../../assets/images/cash-machine.png" height="100" alt="ICON_LOGIN"/>
          <h1 class="h3 fw-bold">Bienvenido</h1>

          <div class="text-start mb-5 mt-3">
            <div class="mb-3">
              <label for="userInput" class="form-label fw-bold">Usuario <sup class="text-danger">*</sup></label>
              <input :class="{ 'is-invalid': uMeta.touched && !uMeta.valid, 'is-valid': uMeta.valid }"
                     type="text" class="form-control " id="userInput" placeholder="alexx" v-model="user" @blur="eBlur">
              <div v-if="!uMeta.valid" class="invalid-feedback">{{ uError }}</div>

            </div>
            <div class="mb-3">
              <label for="passwordInput" class="form-label fw-bold">Contraseña <sup class="text-danger">*</sup></label>
              <input :class="{ 'is-invalid': pMeta.touched && !pMeta.valid, 'is-valid': pMeta.valid }"
                     type="password" class="form-control" id="passwordInput" placeholder="********" v-model="password"
                     @blur="pBlur">
              <div v-if="!pMeta.valid" class="invalid-feedback">{{ pError }}</div>
            </div>

            <div class="d-grid">
              <button type="submit" class="btn btn-primary btn-lg text-secondary" :disabled="isDisabled">Iniciar
                sesión
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  </div>

  <Loading :loading="false"/>


</template>

<script setup>
import {computed, getCurrentInstance, inject, onMounted,} from "vue";
import {useRouter} from "vue-router";
import {useForm, useField} from "vee-validate";
import * as yup from "yup";
import api from "@/config/http-client.gateway";
import Loading from "@/components/Loading.vue";
import Navbar from "@/components/Navbar.vue";


const app = getCurrentInstance();
const Swal = app?.appContext.config.globalProperties.$swalCustom;
const router = useRouter()


// Define validation schema
const schema = yup.object({
  user: yup.string().required('Ingresa tu usuario'),
  password: yup.string().required('Ingresa tu contraseña'),
});

// Use the schema in your component
let {handleSubmit, resetForm} = useForm({
  validationSchema: schema,
});

let {value: user, errorMessage: uError, handleBlur: eBlur, meta: uMeta} = useField("user");
let {value: password, errorMessage: pError, handleBlur: pBlur, meta: pMeta} = useField("password");

let onSubmit = handleSubmit(async values => {
  Swal.loading('Comprobando credenciales', 'Espere un momento por favor')
  const payload = {
    username: values.user,
    password: values.password
  };

  try {
    const response = await api.doPost('/auth/login', payload)
    Swal.close()
    if (response.status === 200) {
      const token = response.data.token;
      const user = JSON.stringify(response.data.data);
      const {role} = JSON.parse(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', user);
      localStorage.setItem('role', role);
      Swal.successTime('Inicio de sesión exitoso', 'Bienvenido')
      await sentTo();
    }

    console.log(response);
  } catch (e) {
    Swal.close()
    if (e.status === 404) Swal.errorTime('Oops...', 'Usuario o contraseña incorrectos')

    if (e.status === 403) Swal.errorTime('Oops...', 'Usuario deshabilitado')

    if (e.status === 500) Swal.errorTime('Oops...', 'Error en el servidor')

    console.log(e);
  } finally {
    resetForm();
  }
});

//disabled button
let isDisabled = computed(() => {
  return !uMeta.valid || !pMeta.valid;
});

onMounted(() => sentTo())

const sentTo = async () => {
  const token = localStorage.getItem('token')
  if (token === null) await router.push('/');
  const role = localStorage.getItem('role')
  console.log(role)
  if (role === 'Admin') {
    await router.push({name: 'homeAdmin'})
  } else if (role === 'Empleado') {
    await router.push({name: 'homeEmploy'})
  } else {
    await router.push('/');
  }
}
</script>

<style scoped>

</style>






