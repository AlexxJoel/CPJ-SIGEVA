<template>
  <div class="modal fade" id="ModalUpdateCategory" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
       ref="updateCategoryModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Modificar categoría
          </h5>
          <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit="onSubmitted">
            <label for="categoryName" class="form-label">Nombre</label>
            <input type="text" class="form-control" id="categoryName" placeholder="Anillos de plata"
                   :class="{ 'is-invalid': nMeta.touched && !nMeta.valid, 'is-valid': nMeta.valid }"
                   v-model="name" @blur="nBlur"/>
            <div v-if="!nMeta.valid" class="invalid-feedback">{{ nError }}</div>

            <label for="categoryDescription" class="form-label mt-3">Descripción</label>
            <Field v-model="description" name="description" rules="required" v-slot="{ field }">
              <textarea v-bind="field" class="form-control" id="categoryDescription" rows="3"
                        :class="{ 'is-invalid': dMeta.touched && !dMeta.valid, 'is-valid': dMeta.valid }"
                        @blur="dBlur"></textarea>
              <div v-if="!dMeta.valid" class="invalid-feedback">{{ dError }}</div>
            </Field>
            <div class="modal-footer">
              <button type="button" class="btn block me-auto"
                      :class="(!props.itemSelected?.status ?'btn-success':'btn-danger')"
                      @click="changeStatus(!props.itemSelected?.status, props.itemSelected.id)"
              >{{ !props.itemSelected.status ? 'Activar' : 'Desactivar' }}
              </button>

              <div>
                <button type="button" id="closeModal" class="btn btn-danger me-2" data-bs-dismiss="modal">
                  Cerrar
                </button>
                <button type="submit" class="btn btn-primary text-secondary" :disabled="!isAvailable">
                  Guardar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, inject, computed, getCurrentInstance, type PropType, watch} from "vue";
import {CategoryController} from "@/modules/category/category.controller";
import type {Category} from "@/modules/category/dto/category.Dto";
import * as yup from "yup";

import {useField, useForm, Field} from "vee-validate";


const Swal = inject("$swal");
const app = getCurrentInstance();
const SwalCustom = app?.appContext.config.globalProperties.$swalCustom;


const props = defineProps({
  itemSelected: {
    type: Object as PropType<Category>,
    required: true
  }
})
const emits = defineEmits(['reloadCategories'])


//check changes
watch(() => props.itemSelected, (categorySelected) => {
  if (categorySelected) {
    name.value = categorySelected.name;
    description.value = categorySelected.description;
    status.value = categorySelected.status;
  }
})

//schema
const schema = yup.object({
  name: yup.string().required("El nombre es requerido"),
  description: yup.string().required("La descripción es requerida").max(30, "La descripción no debe ser mayor a 30 caracteres"),
  status: yup.boolean()
});

// Use the schema in your component
let {handleSubmit, resetForm} = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    description: '',
    status: false
  }
});

//define useField
const {value: name, errorMessage: nError, handleBlur: nBlur, meta: nMeta} = useField("name");
const {value: description, errorMessage: dError, handleBlur: dBlur, meta: dMeta} = useField("description");
const {value: status} = useField("status");
const isAvailable = () => nMeta.valid && dMeta.valid


let onSubmitted = handleSubmit(async (values) => {
  console.log('values: ', values)
  try {
    const respQ= await SwalCustom.question('¿Segura que desea realizar la acción?', `Se actualizará la categoria`, 'warning', 'Actualizar')
    if (!respQ.isConfirmed) return;
    SwalCustom.loading('Actualizando la categoria', 'Espere un momento por favor')
    const res = await CategoryController.updateCategory(props.itemSelected.id, {
      name: values.name,
      description: values.description,
      status: values.status
    } as Category)
    SwalCustom.close()
    if (res) {
      SwalCustom.successTime('Categoria actualizado correctamente', '')
      const closeButton: HTMLElement | null = document.querySelector('#closeModal');
      if (closeButton) {
        closeButton.click();
        resetForm()
        emits('reloadCategories');

      }
    } else SwalCustom.close()
  } catch (error) {
    SwalCustom.close()
    SwalCustom.error('Error al actualizar la categoria', 'Intente de nuevo')

  }
})


const changeStatus = async (status: boolean, id: number) => {
  try {
    const respQuestion = await SwalCustom.question('¿Segura que desea realizar la acción?', `Se ${status ? 'activar' : 'desactivar'}a la categoria`, 'warning', `${status ? 'Activar' : 'Desactivar'}`)
    if (!respQuestion.isConfirmed) return;
    SwalCustom.loading('Actualizando la categoria', 'Espere un momento por favor')
    const res = await CategoryController.changeStatus(id)
    SwalCustom.close()
    if (res) {
      SwalCustom.successTime('Categoria actualizado correctamente', '')
      const closeButton: HTMLElement | null = document.querySelector('#closeModal');
      if (closeButton) {
        closeButton.click();
        // resetForm()
        emits('reloadCategories');

      }
    } else SwalCustom.close()
  } catch (error) {
    SwalCustom.close()

  }
}
</script>
<style></style>
