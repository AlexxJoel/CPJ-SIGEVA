<script setup lang="ts">
//pagination with mock data
import { computed, onMounted, ref, inject } from "vue";

import ModalSaveCategory from "@/views/admin/categories/ModalSaveCategory.vue";
import ModalUpdateCategory from "@/views/admin/categories/ModalUpdateCategory.vue";

import api from "../../../config/http-client.gateway.ts";
import SkeletonCards from "@/components/SkeletonCards.vue";
import NotFoundElements from "@/components/NotFoundElements.vue";

const isLoading = ref(false);
const Swal = inject("$swal");

let response;
const getCategories = async () => {
  try {
    isLoading.value = true;
    response = await api.doGet("/pageable/category");
    items.value = response.data.data;
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.log("soy el erro", error);
  }
};

const onSelectedId = ref()


const onSelected = (cardId: number)=>onSelectedId.value = cardId;
onMounted(getCategories);

const items = ref([]);

const paginator = ref({
  currentPage: 1,
  itemsPerPage: 12,
});

const search = ref("");

const filterItem = computed(() => {
  return items.value.filter((item) => {
    return item.name.toLowerCase().includes(search.value.toLowerCase());
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

const reloadCategories = () => getCategories();;

const changeStatus = (cardId: number) => {

  Swal.fire({
    title: "¿Segura que desea realizar la acción?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      const res = await api.doDelete(`/category/${cardId}`);
      if (res.data.data) {
        Swal.fire({
          icon: "success",
          title: "Acción realizada correctamente",
          confirmButtonText: "Aceptar",
        });
      }
    }

    getCategories();
  });
};
</script>

<template>
  <div>
    <h1 class="h1 text-primary fw-bold">Categorias</h1>

    <div class="d-md-flex justify-content-between w-100 mb-3">
      <div class="">
        <label class="h4 fw-bold">Buscar categoría</label>
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            placeholder="Buscar categoría"
            aria-label="Buscar proveedor"
            v-model="search"
          />
          <button class="btn btn-primary text-secondary" type="button">
            Buscar
          </button>
        </div>
      </div>
      <div class="d-flex align-items-end justify-content-end mt-2 mt-md-0">
        <button
          class="btn btn-primary text-secondary w-100"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#ModalSaveCategory"
        >
          Agregar categoría
        </button>
      </div>
    </div>

    <SkeletonCards :loading="isLoading" :quantity-cards="10" :col-lg="5"/>

    <div v-if="!isLoading && paginatedCards.length == 0">
      <NotFoundElements/>
    </div>
    <div v-else>
      <main class="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-2 g-lg-3">
        <div v-for="card in paginatedCards" :key="card.id">
          <div class="col">
            <div class="card itemList position-relative">
              <div class="dropdown dropstart">
                <button
                  class="btn position-absolute top-0 end-0 m-0"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="pi pi-ellipsis-v"></i>
                </button>
                <!-- Menú de opciones -->
                <ul class="dropdown-menu">
                  <li>
                    <a
                      class="dropdown-item"
                      data-bs-target="#ModalUpdateCategory"
                      data-bs-toggle="modal"
                      @click.prevent="() => onSelected(card.id)"
                    >
                      Editar
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" @click="changeStatus(card.id)">
                      {{ card.status ? "Deshabilitar" : "Habilitar" }}
                    </a>
                  </li>
                  <!-- Agrega más opciones según tus necesidades -->
                </ul>
              </div>
              <div class="card-body">
                <div class="d-flex justify-content-center">
                  <img src="@/assets/images/menu.png" class="img-fluid px-4" alt="...">
                </div>
                <p class="card-text mt-1 m-0 fw-semibold" style="height: auto">
                  {{ card.name }}
                </p>
                <span class="card-text mt-2 fw-medium">Descripción: </span>
                <p class="card-text m-0 p-0 text-truncate">
                  {{ card.description }}
                </p>
                <div class="d-flex justify-content-left mt-2">
                  <span
                    class="badge"
                    :class="card.status ? 'bg-success' : 'bg-danger'"
                    >{{ card.status ? "Activo" : "Inactivo" }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>


    <footer>
      <nav
        aria-label="pagination"
        class="d-flex justify-content-md-end justify-content-center mt-3"
      >
        <ul class="pagination">
          <li
            class="page-item"
            :class="{ disabled: paginator.currentPage === 1 }"
          >
            <a
              class="page-link"
              href="#"
              @click.prevent="goToPage(paginator.currentPage - 1)"
              >Anterior</a
            >
          </li>
          <li
            class="page-item"
            v-for="number in totalPages"
            :key="number"
            :class="{ active: number === paginator.currentPage }"
          >
            <a class="page-link" href="#" @click.prevent="goToPage(number)">{{
              number
            }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: paginator.currentPage === totalPages }"
          >
            <a
              class="page-link"
              href="#"
              @click.prevent="goToPage(paginator.currentPage + 1)"
              >Siguiente</a
            >
          </li>
        </ul>
      </nav>
    </footer>
    <ModalSaveCategory @reloadCategories="reloadCategories" :onSelectedId="onSelectedId"/>
    <ModalUpdateCategory @reloadCategories="reloadCategories"  :onSelectedId="onSelectedId"/>
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
