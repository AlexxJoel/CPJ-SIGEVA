<script setup lang="ts">
import {computed, ref} from "vue";

const items = ref([]);
const paginator = ref({
  currentPage: 1,
  itemsPerPage: 12,
})
const search = ref('');

const filterItem = computed(() => {
  return items.value.filter((item) => {
    return item.name.toLowerCase().includes(search.value.toLowerCase());
  });
});

const totalPages = computed(() => {
  return Math.ceil(filterItem.value.length / paginator.value.itemsPerPage);
});

const paginatedCards = computed(() => {
  const start = (paginator.value.currentPage - 1) * paginator.value.itemsPerPage;
  const end = start + paginator.value.itemsPerPage;
  return filterItem.value.slice(start, end);
});

const goToPage = (page: number) => {
  paginator.value.currentPage = page;
  window.scrollTo({top: 0, behavior: 'smooth'});
}

</script>

<template>
  <div>
    <h1 class="h1 text-primary fw-bold">Historial</h1>


    <div class="d-md-flex justify-content-between w-100 mb-3">
      <div class="">
        <label class="h4 fw-bold">Buscar Transacción</label>
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Buscar proveedor" aria-label="Transacción"
                 v-model="search">
          <button class="btn btn-primary text-secondary" type="button">Buscar</button>
        </div>
      </div>
    </div>


    <div class="my-2">
      <table class="table">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Transacción</th>
          <th scope="col">Vendedor</th>
          <th scope="col">Cliente</th>
          <th scope="col">Precio Total</th>
          <th scope="col">Fecha de venta</th>
          <th scope="col">Acciones</th>
        </tr>
        </thead>
        <tbody>


        <div v-if="paginatedCards.length > 0">
          <tr v-for="card in paginatedCards " :key="card.id">
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
        </div>
        <tr v-else>
          <td colspan="7" class="text-center p-3 h2">No hay transacciones</td>
        </tr>

        </tbody>
      </table>
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

  </div>
</template>


<style scoped>

</style>