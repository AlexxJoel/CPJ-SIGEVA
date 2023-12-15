<template>
  <div class="modal fade" id="ModalUpdateCategory" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <form @submit="onSubmit">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Actualizar Producto</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"
                    @click="resetForm()"></button>
          </div>
          <div class="modal-body">

            <div class="row">
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
                <label for="productQuantity" class="form-label">Descripción</label>
                <input type="text" class="form-control" id="productQuantity" placeholder="descripción"
                       :class="{ 'is-invalid': dMeta.touched && !dMeta.valid, 'is-valid': dMeta.valid }"
                       v-model="description" @blur="dBlur"/>
                <div v-if="!dMeta.valid" class="invalid-feedback">{{ dError }}</div>
              </div>
            </div>


            <div class="row">
              <div class="col">
                <label for="productUnitPrice" class="form-label">Precio por unidad</label>
                <input type="number" class="form-control" id="productUnitPrice" placeholder="$15,000" step="any"
                       :class="{ 'is-invalid': pMeta.touched && !pMeta.valid, 'is-valid': pMeta.valid }"
                       v-model="price" @blur="pBlur"/>
                <div v-if="!pMeta.valid" class="invalid-feedback">{{ pError }}</div>
              </div>
              <div class="col">
                <label for="productCategory" class="form-label">Categoría</label>
                <select class="form-control" id="productCategory" v-model="categoriesId"
                        :class="{ 'is-invalid': cMeta.touched && !cMeta.valid, 'is-valid': cMeta.valid }"
                        @blur="cBlur">
                  <option value="0" disabled selected>Seleccione una categoría
                  </option
                  >
                  <option v-for="category in items" :key="category.id" :value="category.id">{{
                      category.name
                    }}
                  </option>
                </select>
              </div>
            </div>


          </div>
          <div class="modal-footer">

            <button type="button" class="btn block me-auto"
                    :class="(!status?'btn-success':'btn-danger')"
                    @click="changeStatus(!status, props.itemSelected.id)"
            >
              {{ !status ? 'Activar' : 'Desactivar' }}
            </button>

            <div>
              <button type="button" id="closeModal" class="btn btn-danger me-2" data-bs-dismiss="modal">
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
import {inject, getCurrentInstance, computed, onMounted, watch, type PropType, ref} from "vue";
import * as yup from "yup";
import {useField, useForm} from "vee-validate";
import api from "../../../config/http-client.gateway";
import {ProductController} from "@/modules/products/product.controller";
import type {ProductDto} from "@/modules/products/dto/Product.dto";
import type {UpdateProductDto} from "@/modules/products/dto/UpdateProduct.dto";


const Swal = inject("$swal");
const app = getCurrentInstance();
const SwalCustom = app?.appContext.config.globalProperties.$swalCustom;

const props = defineProps({
  itemSelected: {
    type: Object as PropType<ProductDto>,
    required: true
  }
})
//define emits
const emits = defineEmits(['reloadProducts'])

const items = ref([])

watch(() => props.itemSelected, (newValue: ProductDto) => {
  if (newValue) {
    name.value = newValue.name
    description.value = newValue.description
    quantity.value = newValue.quantity
    price.value = newValue.price
    categoriesId.value = newValue.category.id
    status.value = newValue.status
  }
})

// Define validation schema
const schema = yup.object({
  name: yup.string().required(),
  description: yup.string().nullable(),
  quantity: yup.number().required(),
  price: yup.number().required().typeError('El precio debe ser un número'),
  categoriesId: yup.number().required(),
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
    const respQuestion = await SwalCustom.question('¿Segura que desea realizar la acción?', 'Se actualizará el producto', 'question', 'Actualizar')
    if (!respQuestion.isConfirmed) return;
    SwalCustom.loading('Actualizando producto', 'Espere un momento por favor')
    const res = await api.doPut("/product", {
      id: props.itemSelected.id,
      name: name.value,
      description: description.value,
      quantity: quantity.value,
      unitPrice: price.value,
      categoriesId: categoriesId.value,
    } )
    SwalCustom.close()
    if (res.data.data) {
      SwalCustom.successTime('Producto actualizado correctamente', '')

      const closeButton: HTMLElement | null = document.querySelector('#closeModal');
      if (closeButton) {
        closeButton.click();
        resetForm()
        emits('reloadProducts');

      }
    }

  } catch (error) {
    SwalCustom.close()
    SwalCustom.error('Error al actualizar el producto', 'Intente de nuevo')
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

let changeStatus = async (status: boolean, id: number) => {
  try {
    const respQuestion = await SwalCustom.question('¿Segura que desea realizar la acción?', `Se ${status ? 'activar' : 'desactivar'}a el producto`, 'warning', `${status ? 'Activar' : 'Desactivar'}`)
    if (!respQuestion.isConfirmed) return;
    SwalCustom.loading('Actualizando el producto', 'Espere un momento por favor')

    const res = await api.doDelete(`product/${id}`)
    SwalCustom.close()
    if (res.data.data) {
      SwalCustom.successTime('Producto actualizado correctamente', '')
      const closeButton: HTMLElement | null = document.querySelector('#closeModal');
      if (closeButton) {
        closeButton.click();
        resetForm()
        emits('reloadProducts');

      }
    } else {
      SwalCustom.close()
    }
  } catch (e) {
    await SwalCustom.error('Error al actualizar el producto', 'Intente de nuevo')
    console.log(e)
  } finally {
    setTimeout(() => {
      SwalCustom.close()
    }, 1000)
  }
}


onMounted(() => {
  getCategories()
});

</script>


<style scoped></style>