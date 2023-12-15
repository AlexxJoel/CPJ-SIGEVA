<template>
  <div class="modal fade" id="addProviderModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
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
                <label for="productName" class="form-label">Contacto</label>
                <input type="text" class="form-control" id="productName" placeholder="Forma de contacto"
                       :class="{ 'is-invalid': cMeta.touched && !cMeta.valid, 'is-valid': cMeta.valid }"
                       v-model="contact" @blur="cBlur"/>
                <div v-if="!cMeta.valid" class="invalid-feedback">{{ cError }}</div>
              </div>
              <div class="col">
                <label for="productUnitPrice" class="form-label">Nombre</label>
                <input type="text" class="form-control" id="productUnitPrice" placeholder="Nombre(s)"
                       :class="{ 'is-invalid': nMeta.touched && !nMeta.valid, 'is-valid': nMeta.valid }"
                       v-model="name" @blur="nBlur"/>
                <div v-if="!nMeta.valid" class="invalid-feedback">{{ nError }}</div>
              </div>
            </div>

            <div class="row">
              <div class="col">
                <label for="productQuantity" class="form-label">Primer apellido</label>
                <input type="text" class="form-control" id="productQuantity" placeholder="Primer apellido"
                       :class="{ 'is-invalid': sMeta.touched && !sMeta.valid, 'is-valid': sMeta.valid }"
                       v-model="surname" @blur="sBlur"/>
                <div v-if="!sMeta.valid" class="invalid-feedback">{{ sError }}</div>
              </div>
              <div class="col">
                <label for="productUnitPrice" class="form-label">Segundo Apellido</label>
                <input type="text" class="form-control" id="productUnitPrice" placeholder="Segundo Apellido"
                       :class="{ 'is-invalid': lMeta.touched && !lMeta.valid, 'is-valid':  lMeta.touched &&  lMeta.valid }"
                       v-model="lastname" @blur="lBlur"/>
                <div v-if="!lMeta.valid" class="invalid-feedback">{{ lError }}</div>

              </div>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" id="closeSaveProduct" class="btn btn-danger" data-bs-dismiss="modal"
                    @click="resetForm()">
              Cerrar
            </button>
            <button type="submit" class="btn btn-primary text-secondary" :disabled="isDisabled">
              Guardar
            </button>
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


const Swal = inject("$swal");
const app = getCurrentInstance();
const SwalCustom = app?.appContext.config.globalProperties.$swalCustom;

//define emits
const emits = defineEmits(['getSuppliers',])


// Define validation schema
const schema = yup.object({
  contact: yup.number().required('Ingresa el contacto').typeError('Ingresa un número').integer('Ingresa un número').positive('Ingresa un número positivo'),
  name: yup.string().required('Ingresa el nombre').trim(),
  surname: yup.string().required('Ingresa el apellido paterno').trim(),
  lastname: yup.string().nullable(),
});

// Use the schema in your component
let {handleSubmit, resetForm} = useForm({validationSchema: schema});

let {value: contact, errorMessage: cError, handleBlur: cBlur, meta: cMeta} = useField("contact");
let {value: name, errorMessage: nError, handleBlur: nBlur, meta: nMeta} = useField("name");
let {value: surname, errorMessage: sError, handleBlur: sBlur, meta: sMeta} = useField("surname");
let {value: lastname, errorMessage: lError, handleBlur: lBlur, meta: lMeta} = useField("lastname");

const isDisabled = computed(() => !cMeta.valid || !nMeta.valid || !sMeta.valid || !lMeta.valid)


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
        emits('getSuppliers')

      }
    }


  } catch (error) {
    SwalCustom.close()
    SwalCustom.error('Error al agregar el proveedor', 'Intente de nuevo')
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