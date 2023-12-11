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
                        <label for="clientSurname" class="form-label mt-3">Contraseña</label>
                        <input class="form-control" id="categoryDescription" rows="3" v-model="staff.user.password">
                        <label for="clientSurname" class="form-label mt-3">Email</label>
                        <input class="form-control" id="categoryDescription" rows="3" v-model="staff.email">
                        <label for="clientSurname" class="form-label mt-3">Fecha de nacimiento</label>
                        <input class="form-control" type="date" id="categoryDescription" v-model="staff.birthday">
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

                    <button type="button" class="btn btn-primary" @click="updateStaff">
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

const props = defineProps(["staffs"]);

console.log("id por props", props.staffs);

const staff = ref({
    id: 0,
    birthday: "",
    email: "",
    person: {
        id: 0,
        name: "",
        surname: "",
        lastname: ""
    },
    user: {
        id: 0,
        username: "",
        password:"",
        rolesId:2
    }
});

const getOne = async (cardId: number) => {
    try {
        const res = await api.doGet(`/staff/${cardId}`);
        console.log("q trae?", res);
        staff.value.person.id = res.data.data.person.id
        staff.value.user.id = res.data.data.user.id
    } catch (error) {
        console.log(error);
    }
};

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
                await getOne(props.staffs)
                const res = await api.doPut("/staff", {
                    id: props.staffs,
                    person: {
                        id:staff.value.person.id,
                        name: staff.value.person.name,
                        surname: staff.value.person.surname,
                        lastname: staff.value.person.lastname,
                    },
                    email: staff.value.email,
                    birthday: staff.value.birthday,
                    user: {
                        id: staff.value.user.id,
                        username: staff.value.user.username,
                        password:staff.value.user.password,
                        rolesId: staff.value.user.rolesId
                    }
                });
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
        console.log(error);
    }
};

onMounted(() => {

    console.log("Se ejecuto el modal");
});
</script>
<style></style>
  