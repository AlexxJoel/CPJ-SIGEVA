<template>
    <div class="modal fade" id="ModalSaveStaff" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
        ref="saveStafftModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">
                        Registrar Empleado
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <loading v-model:active="isLoading" :can-cancel="true" />
                <div class="modal-body">
                    <form>
                        <label for="clientName" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="clientName" v-model="staff.person.name" />
                        <label for="clientLastname" class="form-label mt-3">Apellido paterno</label>
                        <input class="form-control" id="categoryDescription" rows="3" v-model="staff.person.lastname">
                        <label for="clientSurname" class="form-label mt-3">Apellido materno</label>
                        <input class="form-control" id="categoryDescription" rows="3" v-model="staff.person.surname">
                        <label for="clientSurname" class="form-label mt-3">Nombre de usuario</label>
                        <input class="form-control" id="categoryDescription" rows="3" v-model="staff.user.username">
                        <label for="clientSurname" class="form-label mt-3">Email</label>
                        <input class="form-control" id="categoryDescription" rows="3" v-model="staff.email">
                        <label for="clientSurname" class="form-label mt-3">Fecha de nacimiento</label>
                        <input class="form-control" type="date" id="categoryDescription" v-model="staff.birthday">
                    </form>
                </div>


                <div class="modal-footer">
                    <button style="visibility: hidden" type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                        id="closeSaveStaff" @click="$emit('reloadStaff')">
                        cerrar
                    </button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Cancelar
                    </button>

                    <button type="button" class="btn btn-primary" @click="saveStaff"   :disabled="!areAllFieldsFilled()">
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

const staff = ref({
    birthday: "",
    email: "",
    person: {
        id: 0,
        name: "",
        surname: "",
        lastname: ""
    },
    user: {
        username: "",
        rolesId: 2
    }
});
const isLoading = ref(false);


const areAllFieldsFilled = () => {
  return (
    staff.value.birthday &&
    staff.value.user.username &&
    staff.value.person.name &&
    staff.value.person.lastname &&
    staff.value.email
  );
};
const capitalizeFirstLetter =(inputString: string) => {
  let letter = inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
  return letter
}
const saveStaff = async () => {
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
                const res = await api.doPost("/staff", {
                    person: {
                        name: capitalizeFirstLetter(staff.value.person.name),
                        surname: capitalizeFirstLetter(staff.value.person.surname),
                        lastname: capitalizeFirstLetter(staff.value.person.lastname),
                    },
                    email: staff.value.email,
                    birthday: staff.value.birthday,
                    user: {
                        username: staff.value.user.username,
                        rolesId: staff.value.user.rolesId
                    }
                });
                isLoading.value=false
                if (res.data.data) {
                    Swal.fire({
                        icon: "success",
                        title: "Acción realizada correctamente",
                        confirmButtonText: "Aceptar",
                    });
                }
                //se obtiene el boton oculto por DOM
                const btnCloseModal = document.getElementById("closeSaveStaff");
                //se verifica que se encontro el elemento
                if (btnCloseModal) {
                    //cerramos el modal con el boton oculto
                    btnCloseModal.click();
                    //se limpia la data
                    staff.value.birthday = "";
                    staff.value.user.username = "";
                    staff.value.person.name = "";
                    staff.value.person.lastname = "";
                    staff.value.person.surname = "";
                    staff.value.email = "";
                }
            }
        });
    } catch (error) {
        isLoading.value=false
        console.log(error);
    }
};

onMounted(() => {
    console.log("Se ejecuto el modal");
});
</script>
<style></style>
  