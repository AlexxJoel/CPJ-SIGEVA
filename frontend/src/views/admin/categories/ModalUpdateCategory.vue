<template>
  <div
    class="modal fade"
    id="ModalUpdateCategory"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="saveCategoryModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Modificar categoría
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form>
            <label for="categoryName" class="form-label">Nombre</label>
            <input
              type="text"
              class="form-control"
              id="categoryName"
              placeholder="Anillos de plata"
              v-model="category.name"
            />
            <label for="categoryDescription" class="form-label mt-3"
              >Descripción</label
            >
            <textarea
              class="form-control"
              id="categoryDescription"
              rows="3"
              v-model="category.description"
            ></textarea>
          </form>
        </div>
        <div class="modal-footer">
          <button
            style="visibility: hidden"
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            id="closeSaveCategory"
            @click="$emit('reloadCategories')"
          >
            cerrar
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancelar
          </button>

          <button type="button" class="btn btn-primary" @click="saveCategory">
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, inject, computed } from "vue";
import api from "../../../config/http-client.gateway";
const Swal = inject("$swal");

const props = defineProps(["onSelectedId"])

console.log("id por props",props.onSelectedId);


const category = ref({
  name: "",
  description: "",
});
let showModal = ref(true);

const getOne = async (cardId: number) => {
  try {
    const res = await api.doGet(`/category/${cardId}`);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

const saveCategory = async () => {
  try {
  console.log("id por props",props.onSelectedId);

    // console.log('nombre: ', category.value.name, " descripción: " , category.value.description);
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
        const res = await api.doPost("/category", {
          name: category.value.name,
          description: category.value.description,
        });
        if (res.data.data) {
          Swal.fire({
            icon: "success",
            title: "Acción realizada correctamente",
            confirmButtonText: "Aceptar",
          });
        }
        //se obtiene el boton oculto por DOM
        const btnCloseModal = document.getElementById("closeSaveCategory");
        //se verifica que se encontro el elemento
        if (btnCloseModal) {
          //cerramos el modal con el boton oculto
          btnCloseModal.click();
          //se limpia la data
          category.value.name = "";
          category.value.description = "";
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