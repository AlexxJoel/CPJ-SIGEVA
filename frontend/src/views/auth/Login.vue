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
import {computed, inject,} from "vue";
import {useRouter} from "vue-router";
import {useForm, useField} from "vee-validate";
import * as yup from "yup";
import api from "@/config/http-client.gateway";
import Loading from "@/components/Loading.vue";
import Navbar from "@/components/Navbar.vue";


// it to use it in the component, before it was this.$swal
const Swal = inject('$swal')
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
  const payload = {
    username: values.user,
    password: values.password
  };

  try {
    const response = await api.doPost('/auth/login', payload)

    if (response.status === 200) {
      const token = response.data.token;
      // const decoded: any = jwtDecode(token);
      // const user = decoded.user;
      // const role = decoded.role;
      localStorage.setItem('token', token);
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: 'Has iniciado sesión correctamente',
        showConfirmButton: false,
        timer: 2000
      })
      await router.push({name: 'providersProductAdmin'})
      // setTimeout(() => {
      //   if (role === 'ADMIN') {
      //     router.push({name: 'providersProductAdmin'})
      //   } else {
      //     router.push({name: 'providersProductUser'})
      //   }
      // }, 1500)
    }

    console.log(response);
  } catch (e) {

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Usuario y/o contraseña incorrectos',
      showConfirmButton: false,
      timer: 2000
    })

    console.log(e);
  } finally {
    resetForm();
  }
});

//disabled button
let isDisabled = computed(() => {
  return !uMeta.valid || !pMeta.valid;
});

</script>

<style scoped>

</style>






