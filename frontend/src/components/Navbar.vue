<template>
  <!--navbar with boostrap 5-->
  <nav class="shadow-sm navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <!--  Icon -->
      <router-link to="/">
        <img src="@/assets/images/shop.png" alt="LOGO" height="34" class="d-inline-block align-text-top">
      </router-link>
        <span class=" navbar-brand fw-bold text-uppercase ms-2">sigeva</span>


      <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">

        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link px-0" active-class="text-primary fw-bold" to="/contact">Contacto</router-link>
          </li>
        </ul>

<!--        link to right-->
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" active-class="text-primary fw-bold" to="/">Iniciar sesión</router-link>
          </li>
        </ul>

      </div>
    </div>
  </nav>
</template>

<script setup>
</script>

<style scoped>

</style>