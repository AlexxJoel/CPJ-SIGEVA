<script setup lang="ts">
import { onMounted, ref, inject, computed, type PropType } from "vue";
import api from "../../../config/http-client.gateway";
import type { Staff } from "@/modules/satff/dtos/Staff.Dto";
import 'vue-loading-overlay/dist/css/index.css';
import Loading from 'vue-loading-overlay';
const Swal = inject("$swal");

const props = defineProps({
  staffs: {
    type: Object as PropType<Staff>,
    required: true,
  },
});
console.log("id por props", props.staffs);
const isLoading = ref(false);



const areAllFieldsFilled = () => {
  return (
    props.staffs.birthday &&
    props.staffs.user.username &&
    props.staffs.person.name &&
    props.staffs.person.lastname &&
    props.staffs.person.surname &&
    props.staffs.email
  );
};
const capitalizeFirstLetter =(inputString: string) => {
  let letter = inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
  console.log(letter);
  
  return letter
}
const updateStaff = async () => {
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
                isLoading.value=true;
                const res = await api.doPut("/staff", {
                    id: props.staffs.id,
                    person: {
                        id:props.staffs.person.id,
                        name: capitalizeFirstLetter(props.staffs.person.name),
                        surname: capitalizeFirstLetter(props.staffs.person.surname),
                        lastname: capitalizeFirstLetter(props.staffs.person.lastname),
                    },
                    email: props.staffs.email,
                    birthday: props.staffs.birthday,
                    user: {
                        id: props.staffs.user.id,
                        username: props.staffs.user.username,
                        password:props.staffs.user.password,
                        rolesId: props.staffs.user.rolesId
                    }
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
                const btnCloseModal = document.getElementById("closeUpdateStaff");
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
    <div class="modal fade" id="ModalUpdateStaff" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
        ref="saveStaffModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">
                        Modificar Empleado
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <loading v-model:active="isLoading" :can-cancel="true" />
                <div class="modal-body">
                    <form>
                        <label for="clientName" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="clientName" v-model="props.staffs.person.name" />
                        <label for="clientLastname" class="form-label mt-3">Apellido paterno</label>
                        <input class="form-control" id="categoryDescription" rows="3" v-model="props.staffs.person.lastname">
                        <label for="clientSurname" class="form-label mt-3">Apellido materno</label>
                        <input class="form-control" id="categoryDescription" rows="3" v-model="props.staffs.person.surname">
                        <label for="clientSurname" class="form-label mt-3">Nombre de usuario</label>
                        <input class="form-control" id="categoryDescription" rows="3" v-model="props.staffs.user.username">
                        <label for="clientSurname" class="form-label mt-3">Contraseña</label>
                        <input type="password" class="form-control" id="categoryDescription" rows="3" v-model="props.staffs.user.password">
                        <label for="clientSurname" class="form-label mt-3">Email</label>
                        <input class="form-control" id="categoryDescription" rows="3" v-model="props.staffs.email">
                        <label for="clientSurname" class="form-label mt-3">Fecha de nacimiento</label>
                        <input class="form-control" type="date" id="categoryDescription" v-model="props.staffs.birthday">
                    </form>
                </div>

                <div class="modal-footer">
                    <button style="visibility: hidden" type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                        id="closeUpdateStaff" @click="$emit('reloadStaff')">
                        cerrar
                    </button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Cancelar
                    </button>

                    <button type="button" class="btn btn-primary" @click="updateStaff" :disabled="!areAllFieldsFilled()">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
  

<style></style>
  