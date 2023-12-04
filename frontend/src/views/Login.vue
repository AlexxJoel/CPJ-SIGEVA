<template>
  <!-- Login with email and pswd-->
  <Navbar />
  <div class="container">
    <div class="row justify-content-center mt-4">
      <div class="col col-lg-6">
        <form>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Correo electrónico</label>
            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Contraseña</label>
            <input type="password" class="form-control" id="exampleInputPassword1">
          </div>
          <button type="submit" class="btn btn-primary">Iniciar sesión</button>
        </form>
      </div>
    </div>
  </div>


</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
</script>

<style scoped>

</style>