<script setup lang="ts">
//pagination with mock data
import { computed, onMounted, ref, inject } from "vue";

import api from "../../../config/http-client.gateway.ts";
import ModalUpdateClient from "./modalUpdateClient.vue";
import ModalSaveClient from "./modalSaveClients.vue";
import type { Client } from "@/modules/client/Client.Dto";
import 'vue-loading-overlay/dist/css/index.css';
import Loading from 'vue-loading-overlay';
import SkeletonCards from "@/components/SkeletonCards.vue";
import NotFoundElements from "@/components/NotFoundElements.vue";

const Swal = inject("$swal");

let response;
const getClients = async () => {
  try {
    isLoading.value = true;
    response = await api.doGet("/clients");
    for (const client of response.data.data) {
      items.value.push({
        id: client.id,
        phoneNumber: client.phoneNumber,
        email: client.email,
        person:client.person
      } as Client);
    }
    isLoading.value=false
  } catch (error) {
    isLoading.value=false
    console.log(error);
  }
};
const items = ref<Client[]>([]);
const onSelectedC = ref<Client>({
  id:0,
  phoneNumber: 0,
  email: '',
  person: []
});

const onSelected = (card: Client) => {
  onSelectedC.value = card;
};

onMounted(getClients);

const isLoading = ref(false);


const paginator = ref({
  currentPage: 1,
  itemsPerPage: 9,
});

const search = ref("");

const filterItem = computed(() => {
  return items.value.filter((item) => {
    return item.person.name.toLowerCase().includes(search.value.toLowerCase());
  });
});

const totalPages = computed(() => {
  return Math.ceil(filterItem.value.length / paginator.value.itemsPerPage);
});

const paginatedCards = computed(() => {
  const start =
    (paginator.value.currentPage - 1) * paginator.value.itemsPerPage;
  const end = start + paginator.value.itemsPerPage;
  return filterItem.value.slice(start, end);
});

const goToPage = (page: number) => {
  paginator.value.currentPage = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
};



const reloadClients = async() => {
  console.log("valiko");
 await getClients();
};


</script>

<template>
  <div>
    <h1 class="h1 text-primary fw-bold">Clientes</h1>
  
    <div class="d-md-flex justify-content-between w-100 mb-3">
      <div class="">
        <label class="h4 fw-bold">Buscar Cliente</label>
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Buscar cliente" aria-label="Buscar cliente"
            v-model="search" />
          <span class="input-group-text bg-primary text-secondary" readonly><i class="pi pi-search"></i></span>

        </div>
      </div>
      <div class="d-flex align-items-end justify-content-end mt-2 mt-md-0">
        <button class="btn btn-primary text-secondary w-100" type="button" data-bs-toggle="modal"
          data-bs-target="#ModalSaveClient">
          Agregar Cliente
        </button>
      </div>
    </div>
    <SkeletonCards :loading="isLoading" :quantity-cards="10" :col-lg="5"/>

    <div v-if="!isLoading && paginatedCards.length == 0">
      <NotFoundElements/>
    </div>
    <div v-else>
      <main class="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-2 g-lg-3">
        <div v-for="card in paginatedCards" :key="card.id" class="col">
          <div class="card itemList position-relative h-100">
            <div class="dropdown dropstart">
              <button class="btn position-absolute top-0 end-0 m-0" type="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                <i class="pi pi-ellipsis-v"></i>
              </button>
              <!-- Menú de opciones -->
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" @click.prevent="() => onSelected(card)" data-bs-toggle="modal"
                    data-bs-target="#ModalUpdateClient">
                    Editar
                  </a>
                </li>
                <!-- Agrega más opciones según tus necesidades -->
              </ul>
            </div>
            <div class="card-body d-flex flex-column" style="font-size: 1.1rem; width: 100%;">
              <div class="d-flex justify-content-center">
                <img src="@/assets/images/perfil.png" class="img-fluid px-4" alt="..." width="210">
              </div>
              <p class="card-text mt-1 m-0 fw-semibold text-center" style="height: auto">
                {{ card.person.name }} {{ card.person.surname }} {{ card.person.lastname }}
              </p>
              <span class="card-text mt-2 fw-medium">Email: </span>
              <p class="card-text m-0 p-0 text-truncate">
                {{ card.email }}
              </p>
              <span class="card-text mt-2 fw-medium">Tel: </span>
              <p class="card-text m-0 p-0 text-truncate">
                {{ card.phoneNumber }}
              </p>
              <div class="d-flex justify-content-left mt-2">
                <!-- Contenido adicional si es necesario -->
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <footer>
      <nav aria-label="pagination" class="d-flex justify-content-md-end justify-content-center mt-3">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: paginator.currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="goToPage(paginator.currentPage - 1)">Anterior</a>
          </li>
          <li class="page-item" v-for="number in totalPages" :key="number"
            :class="{ active: number === paginator.currentPage }">
            <a class="page-link" href="#" @click.prevent="goToPage(number)">{{
              number
            }}</a>
          </li>
          <li class="page-item" :class="{ disabled: paginator.currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="goToPage(paginator.currentPage + 1)">Siguiente</a>
          </li>
        </ul>
      </nav>
    </footer>
    <ModalSaveClient @reloadCategories="reloadClients" />
    <ModalUpdateClient v-if="onSelectedC" @reloadClients="reloadClients" :clients="onSelectedC" />
  </div>
</template>

<style scoped>
.itemList {
  transition: all 0.3s ease;
  /* Ajusta la duración según tus necesidades */
  /*  height: 300px; !* Alto de la tarjeta *!
  object-fit: cover; !* Asegura que el contenido de la tarjeta se ajuste correctamente *!*/
}

.itemList:hover {
  cursor: pointer;
  transform: scale(1.05);
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
}
</style>
