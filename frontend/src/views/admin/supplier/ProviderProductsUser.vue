<template>
  <div>
    <h1 class="h1 text-primary fw-bold">Proveedores</h1>

    <div class="d-md-flex justify-content-between w-100 mb-3">
      <div class="">
        <label class="h4 fw-bold">Buscar proveedor</label>
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Buscar proveedor" aria-label="Buscar proveedor"
                 v-model="search">
          <span class="input-group-text bg-primary text-secondary" readonly><i class="pi pi-search"></i></span>
        </div>
      </div>
      <div class="d-flex align-items-end justify-content-end mt-2 mt-md-0">
        <button class="btn btn-primary text-secondary w-100" type="button" data-bs-toggle="modal"
                data-bs-target="#addProviderModal">Agregar proveedor
        </button>
      </div>
    </div>

    <SkeletonCards :loading="loading"/>

    <div v-if="!loading && paginatedCards.length == 0">
      <NotFoundElements/>
    </div>
    <div v-else>
      <main class="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-2 g-lg-3">
        <div v-for="card in paginatedCards " :key="(card.id as number)">
          <div class="col">
            <div class="card itemList"  @click="setItemSelected(card)" data-bs-toggle="modal" data-bs-target="#updateProviderModal">
              <div class="">
                <div class="p-2 position-absolute top-0 end-0 m-0">
                  <i class="pi pi-ellipsis-v"></i>
                </div>
              </div>
              <div class="card-body" style="font-size: 1.1rem; width: 100%;">
                <div class="d-flex justify-content-center">
                  <img src="@/assets/images/supplier.png" class="img-fluid px-4" alt="..." width="210">
                </div>
                <p class="card-text fw-bold mt-1 m-0  text-uppercase">
                  {{ card.person.name + ' ' + (card.person.lastname ? card.person.lastname : '') }}</p>
                <hr>
                <span class="card-text mt-2 fw-medium ">Contacto: </span>
                <p class="card-text m-0 p-0 text-truncate">{{ card.contact }}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
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
    <AddProviderUser @getSuppliers="getSupplier" />
    <UpdateProviderUser v-if="itemSelected" :itemSelected="itemSelected" @reloadSupplier="getSupplier"/>

  </div>
</template>

<script setup lang="ts">
//pagination with mock data
import {computed, onMounted, ref} from "vue";
import AddProviderUser from "./addProviderUser.vue";
import api from "@/config/http-client.gateway"
import {type  SupplierDto} from "@/modules/supplier/dtos/SupplierDto";
import SkeletonCards from "@/components/SkeletonCards.vue";
import NotFoundElements from "@/components/NotFoundElements.vue";
import UpdateProviderUser from "@/views/admin/supplier/UpdateProviderUser.vue";

//  general data
const loading = ref(false);
const itemSelected = ref<SupplierDto>({
  id: 0,
  contact: '',
  peopleId: 0,
  person: {name: '', lastname: '', surname: ''}
});

const setItemSelected = (item: SupplierDto) => itemSelected.value = item

onMounted(() => getSupplier())

const getSupplier = async () => {
  try {
    loading.value = true;
    const response = await api.doGet('pageable/supplier')
    items.value = response.data.data as SupplierDto[];
    items.value = items.value.reverse()
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false;
  }
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