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
          <li>

            <router-link class="nav-link px-0 px-md-2" active-class="text-primary fw-bold" :to="{ name: 'clientsEmploy'}">Clientes
            </router-link>
          </li>
          <li>
            <router-link class="nav-link px-0 px-md-2" active-class="text-primary fw-bold" :to="{ name: 'productsEmploy'}">Inventario
            </router-link>
          </li>
          <li>
            <router-link class="nav-link px-0 px-md-2" active-class="text-primary fw-bold" :to="{ name: 'categoriesEmploy'}">Categorias
            </router-link>
          </li>
          <li>
            <router-link class="nav-link px-0 px-md-2" active-class="text-primary fw-bold" :to="{ name: 'salesEmploy'}">
              Venta
            </router-link>
          </li>
          <li>
            <router-link class="nav-link px-0 px-md-2" active-class="text-primary fw-bold" :to="{ name: 'layawayEmploy'}">
              Apartados
            </router-link>
          </li>
        </ul>

        <!-- link to right-->
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <button class="nav-link"  @click="logout">Cerrar sesión</button>
          </li>
        </ul>

      </div>
    </div>
  </nav>
</template>

<script setup>
import {getCurrentInstance} from "vue";
import router from "@/router";

const app = getCurrentInstance();
const Swal = app?.appContext.config.globalProperties.$swalCustom;

const logout = () => {
  Swal.question('¿Está seguro que desea cerrar sesión?', 'Esta acción no se puede revertir', 'warning', 'Cerrar sesión')
      .then((result) => {
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