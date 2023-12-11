<template>
  <div class="modal fade" id="addProviderModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
    ref="saveSupllierModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Agregar proveedor</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="row">
              <div class="col">
                <label for="productName" class="form-label">Contacto</label>
                <input type="text" class="form-control" id="productName" placeholder="Forma de contacto"
                  v-model="supplier.contact" />
              </div>
              <div class="col">
                <label for="productUnitPrice" class="form-label">Nombre</label>
                <input type="text" class="form-control" id="productUnitPrice" placeholder="Nombre(s)"
                  v-model="supplier.person.name" />
              </div>
            </div>

            <div class="row">
              <div class="col">
                <label for="productQuantity" class="form-label">Primer apellido</label>
                <input type="text" class="form-control" id="productQuantity" placeholder="Primer apellido"
                  v-model="supplier.person.surname" />
              </div>
              <div class="col">
                <label for="productUnitPrice" class="form-label">Segundo Apellido</label>
                <input type="text" class="form-control" id="productUnitPrice" placeholder="Segundo Apellido"
                  v-model="supplier.person.lastname" />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" id="closeSaveProduct" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-primary" @click="saveSupllier" :disabled="!areAllFieldsFilled()">
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

const supplier = ref({
  contact: '',
  person: {
    name: '',
    surname: '',
    lastname: '',
  },
});

const areAllFieldsFilled = () => {
  return (
    supplier.value.contact &&
    supplier.value.person.surname &&
    supplier.value.person.name &&
    supplier.value.person.lastname
  );
};
const saveSupllier = async () => {
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
        const res = await api.doPost("/supplier", {
          contact: supplier.value.contact,
          person: {
            name: supplier.value.person.name,
            surname: supplier.value.person.surname,
            lastname: supplier.value.person.lastname,
          },
        });
        if (res.data.data) {
          Swal.fire({
            icon: "success",
            title: "Acción realizada correctamente",
            confirmButtonText: "Aceptar",
          });
        }

        const btnCloseModal = document.getElementById("closeSaveProduct");

        if (btnCloseModal) {
          btnCloseModal.click();
          supplier.value.contact = '';
          supplier.value.person.name = '';
          supplier.value.person.surname = '';
          supplier.value.person.lastname = '';
        }


      }


    });
  } catch (error) {
    console.log(error);
  }
}

const items = ref([]);
let response;

const getCategories = async () => {
  try {
    response = await api.doGet("/pageable/category");
    items.value = response.data.data;
    console.log(items)
  } catch (error) {
    console.log("soy el erro", error);
  }
};
getCategories();
onMounted(() => {
  console.log("Se ejecuto el modal");
});
</script>


<style scoped></style>