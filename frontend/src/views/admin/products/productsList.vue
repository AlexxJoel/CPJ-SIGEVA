<script setup lang="ts">
import { computed, onMounted, ref, inject } from "vue";
import ModalUpdateProduct from "@/views/admin/products/ModalUpdateProduct.vue";
import ModalSaveProduct from "@/views/admin/products/ModalSaveProduct.vue";

import api from "../../../config/http-client.gateway.ts";

const Swal = inject("$swal");

const selectedProduct = ref(null);

const editProduct = (product) => {
    selectedProduct.value = { ...product };
};

let response;
const getProducts = async () => {
    try {
        response = await api.doPost(`/pageable/product?name=`);
        items.value = response.data.data;
    } catch (error) {
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
                        v-model="search" />
                    <button class="btn btn-primary text-secondary" type="button">
                        Buscar
                    </button>
                </div>
            </div>
            <div class="d-flex align-items-end justify-content-end mt-2 mt-md-0">
                <button class="btn btn-primary text-secondary w-100" type="button" data-bs-toggle="modal"
                    data-bs-target="#ModalSaveProduct">
                    Agregar producto
                </button>
            </div>
        </div>

        <div v-if="paginatedCards.length > 0">
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
                                        <a class="dropdown-item" data-bs-target="#ModalUpdateCategory"
                                            data-bs-toggle="modal" @click="editProduct(card)">
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

                            <div class="card-body" style="font-size: 1.1rem; width: 100%;">
                                <div class="d-flex justify-content-center">
                                    <i class="pi pi-th-large my-3" style="font-size: 6rem;"></i>
                                </div>
                                <div class="text-center">
                                    <p class="card-text mt-1 m-0 fw-semibold" style="height: auto; font-size: 1.2rem;">
                                        {{ card.name }}
                                    </p>
                                    <span class="card-text mt-2 fw-medium">Descripción: </span>
                                    <p class="card-text m-0 p-0 text-truncate">
                                        {{ card.description }}
                                    </p>

                                    <span class="card-text mt-2 fw-medium">Categoria: </span>
                                    <p class="card-text m-0 p-0 text-truncate">
                                        {{ card.category.name }}
                                    </p>
                                    <div class="mt-2">
                                        <p class="card-text m-0">
                                            <span class="fw-medium">Cantidad:</span> {{ card.quantity }}
                                        </p>
                                        <p class="card-text m-0">
                                            <span class="fw-medium">Precio por unidad:</span> {{ card.uniPrice |
                                                currencyFormat }}
                                        </p>
                                        <div class="d-flex justify-content-center mt-2">
                                            <span class="badge" :class="card.status ? 'bg-success' : 'bg-danger'">
                                                {{ card.status ? "Activo" : "Inactivo" }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>



                        </div>
                    </div>
                </div>
            </main>
        </div>
        <div v-else>
            <div class="text-center mt-5">
                <img src="@/assets/images/tite.png" alt="not found" class="img-fluid" width="150" />
                <h3 class="text-primary fw-bold">No se encontraron resultados</h3>
            </div>
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
        <ModalSaveProduct @reloadProduct="reloadProduct" :onSelectedId="onSelectedId" />
        <ModalUpdateProduct @reloadProduct="reloadProduct" />
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
