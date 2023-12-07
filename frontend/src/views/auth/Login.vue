<template>
  <!-- Login with email and pswd-->
  <Navbar/>



  <div class="container">

    <div class="text-center">
      <div class="card shadow shadow-sm  mt-5 mt-md-5 m-md-auto px-4 " style="max-width: 45rem;">
        <form >
          <img class="my-4" src="../../assets/images/cash-machine.png" height="100" alt="ICON_LOGIN"/>
          <h1 class="h3 fw-bold">Bienvenido</h1>

         <div class="text-start mb-5 mt-3">
           <div class="mb-3">
             <label for="userInput" class="form-label fw-bold">Usuario <sup class="text-danger">*</sup></label>
             <input type="text" class="form-control " id="userInput" placeholder="alexx">
           </div>
           <div class="mb-3">
             <label for="passwordInput" class="form-label fw-bold">Contraseña <sup class="text-danger">*</sup></label>
             <input type="password" class="form-control" id="passwordInput" placeholder="********">
           </div>

            <div class="d-grid">
              <button type="button" class="btn btn-primary btn-lg text-secondary ">Iniciar sesión</button>
            </div>
         </div>

        </form>
      </div>
    </div>
  </div>

  <Loading :loading="false"/>


</template>

<script setup>
import {inject} from "vue";

import Loading from "@/components/Loading.vue";
import Navbar from "@/components/Navbar.vue";

// it to use it in the component, before it was this.$swal
const Swal = inject('$swal')

// Swal.fire({
//   title: 'Error!',
//   text: 'Do you want to continue',
//   icon: 'error',
//   confirmButtonText: 'Cool'
// })


</script>

<style scoped>

</style>