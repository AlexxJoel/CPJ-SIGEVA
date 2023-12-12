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
            <router-link class="nav-link px-0" active-class="text-primary fw-bold" :to="{ name: 'homeAdmin'}">
              Historial
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link px-0 px-md-2" active-class="text-primary fw-bold" :to="{ name: 'providersProductAdmin'}">
              Proveedores
            </router-link>
          </li>
          <li>
            <router-link class="nav-link px-0 px-md-2" active-class="text-primary fw-bold" :to="{ name: 'clients'}">
              Clientes
            </router-link>
          </li>
          <li>
            <router-link class="nav-link px-0 px-md-2" active-class="text-primary fw-bold" :to="{ name: 'staff'}">
              Empleados
            </router-link>
          </li>
          <li>
            <router-link class="nav-link px-0 px-md-2" active-class="text-primary fw-bold" :to="{ name: 'products'}">
              Inventario
            </router-link>
          </li>
          <li>
            <router-link class="nav-link px-0 px-md-2" active-class="text-primary fw-bold" :to="{ name: 'categories'}">
              Categorias
            </router-link>
          </li>
        </ul>

        <!-- link to right-->
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <button class="nav-link" active-class="text-primary fw-bold" @click="logout">Cerrar sesión</button>
          </li>
        </ul>

      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import router from '@/router';
import {getCurrentInstance} from "vue";

const app = getCurrentInstance();
const Swal = app?.appContext.config.globalProperties.$swalCustom;

const logout = () => {
  Swal.question('¿Está seguro que desea cerrar sesión?', 'Esta acción no se puede revertir', 'warning', 'Cerrar sesión')
      .then((result: any) => {
        if (result.isConfirmed) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          localStorage.removeItem("role")
          router.push({name: 'login'});
        }
      })
}
</script>

<style scoped>

</style>