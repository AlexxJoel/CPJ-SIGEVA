<template>
  <div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
       ref="saveSupllierModal">
    <div class="modal-dialog">
      <form @submit="onSubmit">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Agregar proveedor</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"
                    @click="resetForm()"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col">


                <label for="productName" class="form-label">Usuario</label>
                <input type="text" class="form-control" id="productName" placeholder="Forma de contacto"
                       v-model="username" @blur="uBlur" disabled/>
                <div v-if="!uMeta.valid" class="invalid-feedback">{{ uError }}</div>
              </div>
              <div class="col">
                <label for="productUnitPrice" class="form-label">Role</label>
                <input type="text" class="form-control" id="productUnitPrice" placeholder="Nombre(s)"
                       v-model="role" @blur="rBlur" disabled/>
                <div v-if="!rMeta.valid" class="invalid-feedback">{{ rError }}</div>
              </div>
            </div>

          </div>
          <div class="modal-footer">

            <div>
              <button type="button" id="closeSaveProduct" class="btn btn-danger" data-bs-dismiss="modal"
                      @click="resetForm()">
                Cerrar
              </button>
              <button type="submit" class="btn btn-primary text-secondary" :disabled="isDisabled">
                Guardar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {inject, getCurrentInstance, computed} from "vue";
import * as yup from "yup";
import {useField, useForm} from "vee-validate";
import api from "../../../config/http-client.gateway";


const app = getCurrentInstance();
const SwalCustom = app?.appContext.config.globalProperties.$swalCustom;

//define emits
const emits = defineEmits(['getUsers',])


// Define validation schema
const schema = yup.object({
  username: yup.string(),
  role: yup.number(),
  status: yup.boolean()
});

// Use the schema in your component
let {handleSubmit, resetForm} = useForm({validationSchema: schema});

let {value: username, errorMessage: uError, handleBlur: uBlur, meta: uMeta} = useField("username");
let {value: role, errorMessage: rError, handleBlur: rBlur, meta: rMeta} = useField("role");
let {value: status, errorMessage: sError, handleBlur: sBlur, meta: sMeta} = useField("status");

const isDisabled = computed(() => !uMeta || !rMeta)


let onSubmit = handleSubmit(async values => {

  try {
    const respQuestion = await SwalCustom.question('¿Segura que desea realizar la acción?', 'Se agregará un nuevo proveedor', 'question', 'Guardar')
    if (!respQuestion.isConfirmed) return;
    SwalCustom.loading('Agregando proveedor', 'Espere un momento por favor')
    const res = await api.doPost("/supplier", {
      contact: values.contact,
      person: {
        name: values.name,
        surname: values.surname,
        lastname: values.lastname,
      },
    })
    SwalCustom.close()
    if (res.data.data) {
      SwalCustom.successTime('Proveedor agregado correctamente', '')
      const btnCloseModal = document.getElementById("closeSaveProduct");

      if (btnCloseModal) {
        btnCloseModal.click();
        resetForm()
        emits('getUsers')

      }
    }


  } catch (error) {
    SwalCustom.close()
    SwalCustom.error('Error al agregar proveedor', 'Intente de nuevo');
  }
})

const hideModal = () => {
  const closeButton: HTMLElement | null = document.querySelector('[data-bs-dismiss="modal"]');
  if (closeButton) {
    closeButton.click();
  }
}


</script>


<style scoped></style>