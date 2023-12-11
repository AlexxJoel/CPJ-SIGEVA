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
                        id="closeUpdateClient" @click="$emit('reloadClients')">
                        cerrar
                    </button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Cancelar
                    </button>

                    <button type="button" class="btn btn-primary" @click="updateClient">
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

const props = defineProps(["clients"]);

console.log("id por props", props.clients);

const client = ref({
    id: 0,
    phoneNumber: "",
    email: "",
    person: {
        id:0 ,
        name: "",
        surname: "",
        lastname: ""
    }
});

const getOne = async (cardId: number) => {
    try {
        const res = await api.doGet(`/clients/${cardId}`);
        console.log("q trae?", res);
        client.value.person.id = res.data.data.person.id
    } catch (error) {
        console.log(error);
    }
};

const updateClient = async () => {
    try {
        console.log("id por props", props);
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
                await getOne(props.clients)
                const res = await api.doPut("/clients", {
                    id: props.clients,
                    person: {
                        id:client.value.person.id,
                        name: client.value.person.name,
                        surname: client.value.person.surname,
                        lastname: client.value.person.lastname,
                    },
                    email: client.value.email,
                    phoneNumber: client.value.phoneNumber
                });
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
        console.log(error);
    }
};

onMounted(() => {

    console.log("Se ejecuto el modal");
});
</script>
<style></style>
  