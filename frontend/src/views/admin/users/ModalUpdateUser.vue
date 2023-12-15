<template>
  <div class="modal fade" id="updateProviderModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <form>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Detalles usuario</h5>
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

            <div class="row mt-2">
              <div class="col">
                <label class="form-label">Estado</label>
                <input type="text" class="form-control" id="productQuantity"
                       v-model="statusDescription" @blur="sBlur" disabled/>
                <div v-if="!sMeta.valid" class="invalid-feedback">{{ sError }}</div>
              </div>
            </div>

          </div>
          <div class="modal-footer">

            <button v-if='props.itemSelected?.rolesId != 1' type="button" class="btn block me-auto"
                    :class="(!status?'btn-success':'btn-danger')"
                    @click="changeStatus(!status, props.itemSelected.id)"
            >
              {{ !status ? 'Activar' : 'Desactivar' }}
            </button>
            <div>
              <button type="button" id="closeModal" class="btn btn-outline-danger me-2" data-bs-dismiss="modal"
                      @click="hideModal">Cerrar
              </button>
              <!--              <button type="submit" class="btn btn-primary text-secondary" :disabled="isDisabled">Guardar</button>-->
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {inject, getCurrentInstance, computed, watch, type PropType, ref} from "vue";
import * as yup from "yup";
import {useField, useForm} from "vee-validate";
import api from "../../../config/http-client.gateway";
import type {UserDto} from "@/modules/user/dto/UserDto";


const Swal = inject("$swal");
const app = getCurrentInstance();
const SwalCustom = app?.appContext.config.globalProperties.$swalCustom;

const props = defineProps({
  itemSelected: {
    type: Object as PropType<UserDto>,
    required: true
  }
})

//define emits
const emits = defineEmits([
  'reloadUsers'
])

const statusDescription = computed(() => props.itemSelected?.status ? 'Activo' : 'Inactivo')

watch(() => props.itemSelected, (newValue: UserDto) => {
  if (newValue) {
    username.value = newValue.username
    role.value = newValue.role.name
    status.value = newValue.status
  }
})

// Define validation schema
const schema = yup.object({
  username: yup.string(),
  role: yup.number(),
  status: yup.boolean()
});

// Use the schema in your component
let {handleSubmit, resetForm} = useForm({
  validationSchema: schema,
  initialValues: {
    username: '',
    role: '',
    status: false
  }
});

let {value: username, errorMessage: uError, handleBlur: uBlur, meta: uMeta} = useField("username");
let {value: role, errorMessage: rError, handleBlur: rBlur, meta: rMeta} = useField("role");
let {value: status, errorMessage: sError, handleBlur: sBlur, meta: sMeta} = useField("status");

const isDisabled = computed(() => !uMeta || !rMeta || !sMeta)
let changeStatus = async (status: boolean, id: number) => {
  try {
    const respQuestion = await SwalCustom.question('¿Segura que desea realizar la acción?', `Se ${status ? 'activar' : 'desactivar'}a el usuario`, 'warning', `${status ? 'Activar' : 'Desactivar'}`)
    if (!respQuestion.isConfirmed) return;
    SwalCustom.loading('Actualizando el usuario', 'Espere un momento por favor')

    const res = await api.doDelete(`user/${id}`)
    SwalCustom.close()
    if (res.data.data) {
      SwalCustom.successTime('Usuario actualizado correctamente', '')
      const closeButton: HTMLElement | null = document.querySelector('#closeModal');

      if (closeButton) {
        closeButton.click();
        resetForm()
        emits('reloadUsers');

      }
    } else {
      SwalCustom.close()
    }
  } catch (e) {
    SwalCustom.close()
    await SwalCustom.error('Error al actualizar el proveedor', 'Intente de nuevo')
    console.log(e)
  }
}
const hideModal = () => {
  const closeButton: HTMLElement | null = document.querySelector('[data-bs-dismiss="modal"]');
  if (closeButton) {
    closeButton.click();
    resetForm()
  }
}


</script>


<style scoped></style>