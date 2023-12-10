<script setup lang="ts">
//pagination with mock data
import {computed, onMounted, ref} from "vue";
import AddProviderUser from "./addProviderUser.vue";
import api from "@/config/http-client.gateway"
import {SupplierDto} from "@/modules/supplier/dtos/SupplierDto";

onMounted( () => {
   getSupplier()
})

const getSupplier = async () => {
  const response = await api.doGet('pageable/supplier')
  items.value = response.data.data as SupplierDto[];
}

const items = ref<SupplierDto[]>([]);

const paginator = ref({
  currentPage: 1,
  itemsPerPage: 12,
})

const search = ref('');

const filterItem = computed(() => {
  return items.value.filter((item) => {
    return item.contact.toLowerCase().includes(search.value.toLowerCase());
  });
});

const totalPages = computed(() => {
  return Math.ceil(filterItem.value.length / paginator.value.itemsPerPage);
});

const paginatedCards = computed(() => {
  const start = (paginator.value.currentPage - 1) * paginator.value.itemsPerPage;
  const end = start + paginator.value.itemsPerPage;
  return filterItem.value.slice(start, end) as SupplierDto[];
});

const goToPage = (page: number) => {
  paginator.value.currentPage = page;
  window.scrollTo({top: 0, behavior: 'smooth'});
}
</script>

<template>
  <div>
    <h1 class="h1 text-primary fw-bold">Proveedores</h1>

    <div class="d-md-flex justify-content-between w-100 mb-3">
      <div class="">
        <label class="h4 fw-bold">Buscar proveedor</label>
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Buscar proveedor" aria-label="Buscar proveedor" v-model="search">
          <button class="btn btn-primary text-secondary" type="button" >Buscar</button>
        </div>
      </div>
      <div class="d-flex align-items-end justify-content-end mt-2 mt-md-0">
        <button class="btn btn-primary text-secondary w-100" type="button" data-bs-toggle="modal" data-bs-target="#addProviderModal" >Agregar proveedor</button>
      </div>
    </div>

    <div v-if="paginatedCards.length > 0">
      <main class="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-2 g-lg-3">
        <div v-for="card in paginatedCards " :key="card.id">
          <div class="col">
            <div class="card itemList">
              <div class="card-body">
                <div class="d-flex justify-content-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" class="img-fluid" alt="...">
                </div>
                <p class="card-text mt-1 m-0 fw-semibold" style="height: auto">{{ card.person.name +' '+(card.person.lastname ? card.person.lastname: '') }}</p>
                <span class="card-text mt-2 fw-medium ">Contacto: </span>
                <p class="card-text m-0 p-0 text-truncate">{{ card.contact }}</p>
                <div class="d-flex justify-content-center mt-2">
                  <button class="btn btn-primary text-secondary w-100" type="button">Ver proveedor</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    <div v-else>
      <div class="text-center mt-5">
        <img src="@/assets/images/tite.png" alt="not found" class="img-fluid" width="150">
        <h3 class="text-primary fw-bold">No se encontraron resultados</h3>
      </div>
    </div>

    <footer>
      <nav aria-label="pagination" class="d-flex justify-content-md-end justify-content-center mt-3 ">
        <ul class="pagination">
          <li class="page-item" :class="{ 'disabled': paginator.currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="goToPage(paginator.currentPage-1)">Anterior</a>
          </li>
          <li class="page-item" v-for="number in totalPages" :key="number"
              :class="{ 'active': number === paginator.currentPage }">
            <a class="page-link" href="#" @click.prevent="goToPage(number)">{{ number }}</a>
          </li>
          <li class="page-item" :class="{ 'disabled': paginator.currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="goToPage(paginator.currentPage+1)">Siguiente</a>
          </li>
        </ul>
      </nav>
    </footer>

    <AddProviderUser/>

  </div>
</template>

<style scoped>
.itemList {
  transition: all 0.3s ease; /* Ajusta la duración según tus necesidades */
/*  height: 300px; !* Alto de la tarjeta *!
  object-fit: cover; !* Asegura que el contenido de la tarjeta se ajuste correctamente *!*/

}

.itemList:hover {
  cursor: pointer;
  transform: scale(1.05);
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
}
</style>