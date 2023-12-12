<script setup lang="ts">
import { onMounted, ref, inject, computed, type PropType } from "vue";
import api from "../../../config/http-client.gateway";
import type { Client } from "@/modules/client/Client.Dto";
import 'vue-loading-overlay/dist/css/index.css';
import Loading from 'vue-loading-overlay';
const Swal = inject("$swal");

const props = defineProps({
  clients: {
    type: Object as PropType<Client>,
    required: true,
  },
});
const isLoading = ref(false);
const areAllFieldsFilled = () => {
  return (
    props.clients.phoneNumber &&
    props.clients.email &&
    props.clients.person.name &&
    props.clients.person.lastname &&
    props.clients.person.surname 
  );
};
const capitalizeFirstLetter =(inputString: string) => {
  let letter = inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
  return letter
}
const updateClient = async () => {
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
                isLoading.value=true;
                const res = await api.doPut("/clients", {
                    id: props.clients.id,
                    person: {
                        id:props.clients.person.id,
                        name: capitalizeFirstLetter(props.clients.person.name),
                        surname: capitalizeFirstLetter(props.clients.person.surname),
                        lastname: capitalizeFirstLetter(props.clients.person.lastname),
                    },
                    email: props.clients.email,
                    phoneNumber: props.clients.phoneNumber
                });
                isLoading.value=false;
                if (res.data.data) {
                    Swal.fire({
                        icon: "success",
                        title: "Acción realizada correctamente",
                        confirmButtonText: "Aceptar",
                    });
                }
                //se obtiene el boton oculto por DOM
                const btnCloseModal = document.getElementById("closeUpdateClient");
                //se verifica que se encontro el elemento
                if (btnCloseModal) {
                    //cerramos el modal con el boton oculto
                    btnCloseModal.click();
                 
                }
            }
        });
    } catch (error) {
        isLoading.value=false;
        console.log(error);
    }
};

onMounted(() => {

    console.log("Se ejecuto el modal");
});
</script>

<template>
    <div class="modal fade" id="ModalUpdateClient" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
        ref="saveClientModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">
                        Modificar cliente
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <loading v-model:active="isLoading" :can-cancel="true" />
                <div class="modal-body">
                    <form>
                        <label for="clientName" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="clientName" v-model="props.clients.person.name" />
                        <label for="clientLastname" class="form-label mt-3">Apellido paterno</label>
                        <input class="form-control" id="categoryDescription" rows="3" v-model="props.clients.person.lastname">
                        <label for="clientSurname" class="form-label mt-3">Apellido materno</label>
                        <input class="form-control" id="categoryDescription" rows="3" v-model="props.clients.person.surname">
                        <label for="clientSurname" class="form-label mt-3">Numero de telefono</label>
                        <input class="form-control" id="categoryDescription" rows="3" v-model="props.clients.phoneNumber">
                        <label for="clientSurname" class="form-label mt-3">Email</label>
                        <input class="form-control" id="categoryDescription" rows="3" v-model="props.clients.email">
                    </form>
                </div>
                <div class="modal-footer">
                    <button style="visibility: hidden" type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                        id="closeUpdateClient" @click="$emit('reloadClients')">
                        cerrar
                    </button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Cancelar
                    </button>

                    <button type="button" class="btn btn-primary" @click="updateClient" :disabled="!areAllFieldsFilled()">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
  

<style></style>
  