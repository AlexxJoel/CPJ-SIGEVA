<template>
    <div class="modal fade" id="ModalSaveProduct" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
        ref="saveProductModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">
                        Registrar producto
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <label for="productName" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="productName" placeholder="Anillos de oro"
                            v-model="product.name" />
                        <label for="productDescription" class="form-label mt-3">Descripción</label>
                        <textarea class="form-control" id="productDescription" rows="3"
                            v-model="product.description"></textarea>

                        <div class="row">
                            <div class="col">
                                <label for="productQuantity" class="form-label">Cantidad</label>
                                <input type="number" class="form-control" id="productQuantity" placeholder="10"
                                    v-model="product.quantity" />
                            </div>
                            <div class="col">
                                <label for="productUnitPrice" class="form-label">Precio por unidad</label>
                                <input type="number" class="form-control" id="productUnitPrice" placeholder="$15,000"
                                    v-model="product.unitPrice" />
                            </div>
                            <div class="col">
                                <label for="productCategorie" class="form-label">Categoría</label>
                                <input type="number" class="form-control" id="productQuantity" placeholder="10"
                                    v-model="product.categoriesId" />
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button style="visibility: hidden" type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                        id="closeSaveProduct" @click="$emit('reloadProduc')">
                        cerrar
                    </button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Cancelar
                    </button>
                    <button type="button" class="btn btn-primary" @click="saveProduct">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
  

<script setup lang="ts">
import { onMounted, ref, inject } from "vue";
import api from "../../../config/http-client.gateway";
const Swal = inject("$swal");

const product = ref({
    name: "",
    description: "",
    quantity: 0,
    unitPrice: 0,
    categoriesId: 3
});
let showModal = ref(true);

const hideModal = () => {
    showModal.value = false;
};
const saveProduct = async () => {
    try {
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
                const res = await api.doPost("/product", {
                    name: product.value.name,
                    description: product.value.description,
                    quantity: product.value.quantity,
                    unitPrice: product.value.unitPrice,
                    categoriesId: product.value.categoriesId,
                });
                if (res.data.data) {
                    Swal.fire({
                        icon: "success",
                        title: "Acción realizada correctamente",
                        confirmButtonText: "Aceptar",
                    });
                }
                //se obtiene el boton oculto por DOM
                const btnCloseModal = document.getElementById("closeSaveProduct");
                //se verifica que se encontro el elemento
                if (btnCloseModal) {
                    //cerramos el modal con el boton oculto
                    btnCloseModal.click();
                    //se limpia la data
                    product.value.name = "";
                    product.value.description = "";
                    product.value.quantity = 0;
                    product.value.unitPrice = 0;
                    product.value.categoriesId = 0;
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
};

onMounted(() => {
    console.log("Se ejecuto el modal");
});
</script>
<style></style>
