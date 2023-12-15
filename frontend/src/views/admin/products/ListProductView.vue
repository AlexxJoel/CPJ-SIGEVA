<script setup lang="ts">
import {computed, onMounted, ref, inject} from "vue";
import ModalUpdateProduct from "@/views/admin/products/ModalUpdateProduct.vue";
import ModalSaveProduct from "@/views/admin/products/ModalSaveProduct.vue";

import api from "../../../config/http-client.gateway.ts";
import NotFoundElements from "@/components/NotFoundElements.vue";
import SkeletonCards from "@/components/SkeletonCards.vue";

const Swal = inject("$swal");
const isLoading = ref(false);

const selectedProduct = ref(null);

const editProduct = (product) => {
  selectedProduct.value = {...product};
};

let response;
const getProducts = async () => {
  try {
    isLoading.value = true;
    response = await api.doPost(`/pageable/product?name=`);
    items.value = response.data.data;
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.log("Error al obtener productos", error);
  }
};

const onSelectedId = ref();

const onSelected = (cardId: number) => {
  console.log("card", cardId);
  onSelectedId.value = cardId;
};

onMounted(getProducts);

const items = ref([]);

const paginator = ref({
  currentPage: 1,
  itemsPerPage: 8,
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
  window.scrollTo({top: 0, behavior: "smooth"});
};

const reloadProduct = () => {
  getProducts();
};

const changeStatus = (productId: number) => {
  Swal.fire({
    title: "¿Seguro que desea realizar la acción?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      const res = await api.doDelete(`/product/${productId}`);
      if (res.data.data) {
        Swal.fire({
          icon: "success",
          title: "Acción realizada correctamente",
          confirmButtonText: "Aceptar",
        });
      }
    }

    getProducts();
  });
};
</script>

<template>
  <div>
    <h1 class="h1 text-primary fw-bold">Productos</h1>

    <div class="d-md-flex justify-content-between w-100 mb-3">
      <div class="">
        <label class="h4 fw-bold">Buscar producto</label>
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Buscar producto" aria-label="Buscar producto"
                 v-model="search"/>
          <span class="input-group-text bg-primary text-secondary" readonly><i class="pi pi-search"></i></span>

        </div>
      </div>
      <div class="d-flex align-items-end justify-content-end mt-2 mt-md-0">
        <button class="btn btn-primary text-secondary w-100" type="button" data-bs-toggle="modal"
                data-bs-target="#ModalSaveProduct">
          Agregar producto
        </button>
      </div>
    </div>

    <SkeletonCards :loading="isLoading" :quantity-cards="10" :col-lg="4"/>

    <div v-if="!isLoading && paginatedCards.length == 0">
      <NotFoundElements/>
    </div>
    <div v-else>
      <main class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-2 g-lg-3">
        <div v-for="card in paginatedCards" :key="card.id">
          <div class="col">
            <div class="card itemList position-relative">
              <div class="dropdown dropstart">
                <button class="btn position-absolute top-0 end-0 m-0" type="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="pi pi-ellipsis-v"></i>
                </button>
                <!-- Menú de opciones -->
                <ul class="dropdown-menu">
                  <li>
                    <a class="dropdown-item"
                        @click="editProduct(card)">
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

              <div class="card-body" style="font-size: 1.1rem; width: 100%;" @click="editProduct(card)" data-bs-target="#ModalUpdateCategory" data-bs-toggle="modal" >
                <div class="d-flex justify-content-center">
                  <img src="@/assets/images/cristal.png" class="img-fluid px-4" alt="..." width="210">
                </div>
                <div >
                  <p class="card-text mt-1 m-0 fw-semibold" style="height: auto; font-size: 1.2rem;">
                    {{ card.name }}
                  </p>
                  <span class="card-text mt-2 fw-semibold">Descripción: </span>
                  <p class="card-text m-0 p-0 text-truncate">
                    {{ card.description? card.description : 'Sin descripción' }}
                  </p>

                  <span class="card-text mt-2 fw-semibold">Categoria: </span>
                  <p class="card-text m-0 p-0 text-truncate">
                    {{ card.category.name }}
                  </p>
                  <div class="mt-2">
                    <p class="card-text m-0">
                      <span class="fw-semibold">Cantidad:</span> {{ card.quantity }}
                    </p>
                    <p class="card-text m-0">
                      <span class="fw-semibold">Precio por unidad:</span> {{
                        card.uniPrice | currencyFormat
                      }}
                    </p>
                    <div class="d-flex justify-content-start mt-2">
                       <span class="badge" :class="card.status ? 'bg-success' : 'bg-danger'">{{ card.status ? "Activo" : "Inactivo" }}</span>
                    </div>
                  </div>
                </div>
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
    <ModalSaveProduct @reloadProduct="reloadProduct" :onSelectedId="onSelectedId"/>
<!--    <ModalUpdateProduct @reloadProduct="reloadProduct"/>-->
  </div>
</template>

<style scoped>
.itemList {
  transition: all 0.3s ease;
}

.itemList:hover {
  cursor: pointer;
  transform: scale(1.05);
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
}
</style>
