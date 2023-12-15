<template>
  <div class="modal fade" id="ModalSaveProduct" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <form @submit="onSubmit">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Registrar Producto</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"
                    @click="resetForm()"></button>
          </div>
          <div class="modal-body">

            <div class="row">
              <div class="col">
                <label for="productUnitPrice" class="form-label">Nombre</label>
                <input type="text" class="form-control" id="productUnitPrice" placeholder="Nombre(s)"
                       :class="{ 'is-invalid': nMeta.touched && !nMeta.valid, 'is-valid': nMeta.dirty && nMeta.valid }"
                       v-model="name" @blur="nBlur"/>
                <div v-if="!nMeta.valid" class="invalid-feedback">{{ nError }}</div>
              </div>
            </div>

            <div class="row">
              <div class="col">
                <label for="productQuantity" class="form-label">Descripción</label>
                <input type="text" class="form-control" id="productQuantity" placeholder="descripción"
                       :class="{ 'is-invalid': dMeta.touched && !dMeta.valid, 'is-valid': dMeta.touched && dMeta.valid }"
                       v-model="description" @blur="dBlur"/>
                <div v-if="!dMeta.valid" class="invalid-feedback">{{ dError }}</div>
              </div>
            </div>


            <div class="row">
              <div class="col">
                <label for="productUnitPrice" class="form-label">Cantidas</label>
                <input type="number" class="form-control" id="productUnitPrice" placeholder="$15,000" step="any"
                       :class="{ 'is-invalid': qMeta.touched && !qMeta.valid, 'is-valid': qMeta.touched && qMeta.valid }"
                       v-model="quantity" @blur="qBlur"/>
                <div v-if="!qMeta.valid" class="invalid-feedback">{{ qError }}</div>
              </div>
              <div class="col">
                <label for="productUnitPrice" class="form-label">Precio por unidad</label>
                <input type="number" class="form-control" id="productUnitPrice" placeholder="$15,000" step="any"
                       :class="{ 'is-invalid': pMeta.touched && !pMeta.valid, 'is-valid': pMeta.touched && pMeta.valid }"
                       v-model="price" @blur="pBlur"/>
                <div v-if="!pMeta.valid" class="invalid-feedback">{{ pError }}</div>
              </div>
              <div class="col">
                <label for="productCategory" class="form-label">Categoría</label>
                <select class="form-control" id="productCategory" v-model="categoriesId"
                        :class="{ 'is-invalid': cMeta.touched && !cMeta.valid, 'is-valid':  cMeta.touched && cMeta.valid }"
                        @blur="cBlur">
                  <option value="0" disabled selected>Seleccione una categoría
                  </option
                  >
                  <option v-for="category in items" :key="category.id" :value="category.id">{{
                      category.name
                    }}
                  </option>
                </select>
                <div v-if="!cMeta.valid" class="invalid-feedback">{{ cError }}</div>

              </div>
            </div>


          </div>
          <div class="modal-footer">
              <button type="button" id="closeModal" class="btn btn-danger me-2" data-bs-dismiss="modal">
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
import { getCurrentInstance, computed, onMounted, ref} from "vue";
import * as yup from "yup";
import {useField, useForm} from "vee-validate";
import api from "../../../config/http-client.gateway";
import {ProductController} from "@/modules/products/product.controller";

const app = getCurrentInstance();
const SwalCustom = app?.appContext.config.globalProperties.$swalCustom;

//define emits
const emits = defineEmits(['reloadProducts'])

const items = ref([])

// Define validation schema
const schema = yup.object({
  name: yup.string().required().min(7, 'El nombre debe tener al menos 7 caracteres').max(26, 'El nombre debe tener máximo 26 caracteres'),
  description: yup.string().nullable(),
  quantity: yup.number().required().min(1, 'La cantidad debe ser mayor a 0').typeError('La cantidad debe ser un número'),
  price: yup.number().required().typeError('El precio debe ser un número').min(1, 'El precio debe ser mayor a 0'),
  categoriesId: yup.number().required().min(1, 'Seleccione una categoría'),
  status: yup.boolean()
});

// Use the schema in your component
let {handleSubmit, resetForm} = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    description: '',
    quantity: 0,
    price: 0,
    categoriesId: 0,
    status: false
  }
});

let {value: name, errorMessage: nError, handleBlur: nBlur, meta: nMeta} = useField("name");
let {value: description, errorMessage: dError, handleBlur: dBlur, meta: dMeta} = useField("description");
let {value: quantity, errorMessage: qError, handleBlur: qBlur, meta: qMeta} = useField("quantity");
let {value: price, errorMessage: pError, handleBlur: pBlur, meta: pMeta} = useField("price");
let {value: categoriesId, errorMessage: cError, handleBlur: cBlur, meta: cMeta} = useField("categoriesId");
let {value: status, errorMessage: sError, handleBlur: sBlur, meta: sMeta} = useField("status");


const isDisabled = computed(() => !nMeta.valid || !dMeta.valid || !qMeta.valid || !pMeta.valid || !cMeta.valid)

let onSubmit = handleSubmit(async values => {
  try {
    const respQuestion = await SwalCustom.question('¿Segura que desea realizar la acción?', 'Se registrará el producto', 'question', 'Agregar')
    if (!respQuestion.isConfirmed) return;
    SwalCustom.loading('Registrando producto', 'Espere un momento por favor')

    const payload = {
      name: name.value,
      description: description.value,
      quantity: quantity.value,
      unitPrice: price.value,
      categoriesId: categoriesId.value,
    }

    console.log(payload)

    const res = await api.doPost("/product", payload)
    SwalCustom.close()
    if (res.data.data) {
      SwalCustom.successTime('Producto registrado correctamente', '')

      const closeButton: HTMLElement | null = document.querySelector('#closeModal');
      if (closeButton) {
        closeButton.click();
        resetForm()
        emits('reloadProducts');

      }
    }

  } catch (error) {
    SwalCustom.close()

  }
})

const getCategories = async () => {
  try {
    const response = await ProductController.getAllCategories()
    items.value = response
  } catch (error) {
    console.log("Error al obtener categorias", error);
  }
};

onMounted(() => {
  getCategories()
});

</script>


<style scoped></style>