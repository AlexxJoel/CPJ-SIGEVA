<template>
  <div class="modal fade" id="ModalSaveClient" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
    ref="saveClientModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Registrar cliente
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <loading v-model:active="isLoading" :can-cancel="true" />
        <div class="modal-body">
          <form>
            <label for="clientName" class="form-label">Nombre</label>
            <input type="text" class="form-control" id="clientName" v-model="client.person.name" />
            <label for="clientLastname" class="form-label mt-3">Apellido paterno</label>
            <input class="form-control" id="categoryDescription" rows="3" v-model="client.person.lastname">
            <label for="clientSurname" class="form-label mt-3">Apellido materno</label>
            <input class="form-control" id="categoryDescription" rows="3" v-model="client.person.surname">
            <label for="clientSurname" class="form-label mt-3">Numero de telefono</label>
            <input class="form-control" id="categoryDescription" rows="3" v-model="client.phoneNumber">
            <label for="clientSurname" class="form-label mt-3">Email</label>
            <input class="form-control" id="categoryDescription" rows="3" v-model="client.email">
          </form>
        </div>
        <div class="modal-footer">
          <button style="visibility: hidden" type="button" class="btn btn-secondary" data-bs-dismiss="modal"
            id="closeSaveClient" @click="$emit('reloadCategories')">
            cerrar
          </button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Cancelar
          </button>

          <button type="button" class="btn btn-primary" @click="saveClient" :disabled="!areAllFieldsFilled()">
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
import 'vue-loading-overlay/dist/css/index.css';
import Loading from 'vue-loading-overlay';
const Swal = inject("$swal");

const client = ref({
  phoneNumber: "",
  email: "",
  person: {
    name: "",
    surname: "",
    lastname: ""
  }
});
let showModal = ref(true);
const isLoading = ref(false);

const areAllFieldsFilled = () => {
  return (
    client.value.phoneNumber &&
    client.value.person.name &&
    client.value.person.lastname &&
    client.value.email
  );
};
const capitalizeFirstLetter = (inputString: string) => {
  let letter = inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
  return letter
}
const saveClient = async () => {
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
        isLoading.value = true;
        const res = await api.doPost("/clients", {
          person: {
            name: capitalizeFirstLetter(client.value.person.name),
            surname: capitalizeFirstLetter(client.value.person.surname),
            lastname: capitalizeFirstLetter(client.value.person.lastname),
          },
          email: client.value.email,
          phoneNumber: client.value.phoneNumber
        });
        isLoading.value = false
        if (res.data.data) {
          Swal.fire({
            icon: "success",
            title: "Acción realizada correctamente",
            confirmButtonText: "Aceptar",
          });
        }
        //se obtiene el boton oculto por DOM
        const btnCloseModal = document.getElementById("closeSaveClient");
        //se verifica que se encontro el elemento
        if (btnCloseModal) {
          //cerramos el modal con el boton oculto
          btnCloseModal.click();
          //se limpia la data

          client.value.person.name = "";
          client.value.person.lastname = "";
          client.value.person.surname = "";
          client.value.email = "";
        }
      }
    });
  } catch (error) {
    isLoading.value = false
    Swal.fire({
      icon: "error",
      title: "Error al realizar la acción",
      confirmButtonText: "Aceptar",
    });
  }
};

onMounted(() => {
  console.log("Se ejecuto el modal");
});
</script>
<style></style>
  