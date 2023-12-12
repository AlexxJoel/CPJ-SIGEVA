<template>
  <div class="modal fade" id="updateProviderModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <form @submit="onSubmit">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Actualizar proveedor</h5>
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
                       :class="{ 'is-invalid': lMeta.touched && !lMeta.valid, 'is-valid':   lMeta.valid }"
                       v-model="lastname" @blur="lBlur"/>
                <div v-if="!lMeta.valid" class="invalid-feedback">{{ lError }}</div>

              </div>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" id="closeModal" class="btn btn-danger" data-bs-dismiss="modal"
                    @click="hideModal">
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
import {inject, getCurrentInstance, computed, onMounted, watch, type PropType} from "vue";
import * as yup from "yup";
import {useField, useForm} from "vee-validate";
import api from "../../../config/http-client.gateway";
import {type SupplierDto} from "@/modules/supplier/dtos/SupplierDto";


const Swal = inject("$swal");
const app = getCurrentInstance();
const SwalCustom = app?.appContext.config.globalProperties.$swalCustom;

const props = defineProps({
  itemSelected: {
    type: Object as PropType<SupplierDto>,
    required: true
  }
})

//define emits
const emits = defineEmits([
   'reloadSupplier'
])

watch(() => props.itemSelected, (newValue) => {
  if (newValue) {
    contact.value = newValue.contact
    name.value = newValue.person.name
    surname.value = newValue.person.surname
    lastname.value = newValue.person.lastname
  }
})

// Define validation schema
const schema = yup.object({
  contact: yup.number().required('Ingresa el contacto').typeError('Ingresa un número').integer('Ingresa un número').positive('Ingresa un número positivo'),
  name: yup.string().required('Ingresa el nombre').trim(),
  surname: yup.string().required('Ingresa el apellido paterno').trim(),
  lastname: yup.string().nullable(),
});

// Use the schema in your component
let {handleSubmit, resetForm} = useForm({
  validationSchema: schema,
  initialValues: {
    contact: props.itemSelected?.contact,
    name: props.itemSelected?.person.name,
    surname: props.itemSelected?.person.surname,
    lastname: props.itemSelected?.person.lastname,
  }
});

let {value: contact, errorMessage: cError, handleBlur: cBlur, meta: cMeta} = useField("contact");
let {value: name, errorMessage: nError, handleBlur: nBlur, meta: nMeta} = useField("name");
let {value: surname, errorMessage: sError, handleBlur: sBlur, meta: sMeta} = useField("surname");
let {value: lastname, errorMessage: lError, handleBlur: lBlur, meta: lMeta} = useField("lastname");

const isDisabled = computed(() => !cMeta.valid || !nMeta.valid || !sMeta.valid || !lMeta.valid)

let onSubmit = handleSubmit(async values => {
  try {
    const respQuestion = await SwalCustom.question('¿Segura que desea realizar la acción?', 'Se actualizará el proveedor', 'question', 'Actualizar')
    if (!respQuestion.isConfirmed) return;
    SwalCustom.loading('Actualizando proveedor', 'Espere un momento por favor')
    const res = await api.doPut("/supplier", {
      id: props.itemSelected?.id,
      contact: values.contact,
      person: {
        id: props.itemSelected?.person.id,
        name: values.name,
        surname: values.surname,
        lastname: values.lastname,
      },
    })
    SwalCustom.close()
    if (res.data.data) {
      SwalCustom.successTime('Proveedor actualizado correctamente', '')
      const closeButton: HTMLElement | null = document.querySelector('#closeModal');

      if (closeButton) {
        closeButton.click();
        resetForm()
        emits('reloadSupplier');

      }
    }


  } catch (error) {
    SwalCustom.close()

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