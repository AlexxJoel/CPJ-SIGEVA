<script setup lang="ts">
import api from "../../../config/http-client.gateway.ts";
import { onMounted, ref, inject, watch } from "vue";
const Swal = inject("$swal");
const getProducts = async () => {
  try {
    const response = await api.doPost("/pageable/product", { name: "" });
    response.data.data.map((element) => {
      element.quantitySold = 0;
    });
    items.value = response.data.data.filter((obj) => obj.quantity !== 0);
    console.log(response.data.data);
  } catch (error) {
    console.log(error);
  }
};

const getSuppliers = async () => {
  try {
    const response = await api.doGet("/pageable/supplier");
    suppliers.value = response.data.data;
    console.log(response.data.data);
  } catch (error) {
    console.log(error);
  }
};

const getStaff = async () => {
  try {
    const response = await api.doGet("/pageable/staff");
    staff.value = response.data.data;
    console.log(response.data.data);
  } catch (error) {
    console.log(error);
  }
};

onMounted(getProducts);
onMounted(getSuppliers);
onMounted(getStaff);

const onSelectedClient = (clientId: number) => {
  if (clientId == "none" && selectedClient.value) {
    selectedClient.value = {};
    console.log("valor del cliente cuando no es nada", selectedClient.value);
  } else {
    // const json = JSON.parse(JSON.stringify(suppliers.value))
    selectedClient.value = suppliers.value.find(
      (ele) => ele.id == parseInt(clientId)
    );
  }
};


const addProducts = (productId: number, quantitySold: number) => {
  // console.log("holaaaa",productId, quantitySold);
  if (
    !selectedProducts.value.find((element) => element.id == parseInt(productId))
  ) {
    selectedProducts.value.push({
      ...items.value.find((element) => element.id == parseInt(productId)),
      quantitySold: quantitySold,
    });
  } else {
    const charge = selectedProducts.value.find(
      (element) => element.id == parseInt(productId)
    );
    charge.quantitySold = quantitySold;
    if (charge.quantitySold == 0) {
      selectedProducts.value = selectedProducts.value.filter(
        (obj) => obj.id !== parseInt(productId)
      );
    }
  }
};

const isButtonDisabled = ref(true);
const isButtonDisabled2 = ref(true);
const items = ref([]);
const suppliers = ref([]);
const staff = ref([]);
const selectedClient = ref({});
const selectedProducts = ref([]);
const total = ref();
const needRegistration = ref(false);
const selectClientRef = ref(null);

const dataUserForm = ref({
  phoneNumber: "",
  email: "",
  person: {
    name: "",
    lastname: "",
    surname: "",
  },
});
const payloadForSale = {
  totalAmount: 0.0,
  staffId: 0,
  clientInfo: {},
  charge: [],
  sendEmail: true,
};

const saveSale = async () => {
  try {
    payloadForSale.totalAmount = total.value.toFixed(2);
    payloadForSale.staffId = 1;
    payloadForSale.clientInfo = selectedClient.value;
    payloadForSale.charge = selectedProducts.value;
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
        const res = await api.doPost("/sell", payloadForSale);
        console.log("respuerta de la vent ", res);
        if (res.data.data) {
          Swal.fire({
            icon: "success",
            title: "Acción realizada correctamente",
            confirmButtonText: "Aceptar",
          });
        }
        getSuppliers();
        getProducts();
        selectedClient.value = {};
        selectedProducts.value = [];
        selectClientRef.value.selectedIndex = 0;
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const saveSaleNewClient = async () => {
  try {
    payloadForSale.totalAmount = total.value.toFixed(2);
    payloadForSale.staffId = 1;
    payloadForSale.clientInfo = dataUserForm.value;
    payloadForSale.charge = selectedProducts.value;

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
        const res = await api.doPost("/sell", payloadForSale);
        console.log("respuerta de la vent ", res);
        if (res.data.data) {
          Swal.fire({
            icon: "success",
            title: "Acción realizada correctamente",
            confirmButtonText: "Aceptar",
          });
        }
        getSuppliers();
        getProducts();
        dataUserForm.value = {
          phoneNumber: "",
          email: "",
          person: {
            name: "",
            lastname: "",
            surname: "",
          },
        };
        selectedProducts.value = [];
      }
    });
  } catch (error) {
    console.log(error);
  }
};

watch([() => selectedClient.value, () => selectedProducts.value], () => {
  // Verifica si tanto selectedClient como selectedProducts tienen valores
  isButtonDisabled.value =
    !selectedClient.value || selectedProducts.value.length === 0;
});
watch([() => needRegistration.value], () => {
  selectedClient.value = {};
});
watch(
  [
    () => dataUserForm.value.email,
    () => dataUserForm.value.phoneNumber,
    () => dataUserForm.value.person.name,
    () => dataUserForm.value.person.lastname,
    () => dataUserForm.value.person.surname,
    () => selectedProducts.value,
  ],
  () => {
    isButtonDisabled2.value =
      !dataUserForm.value.email ||
      !dataUserForm.value.phoneNumber ||
      !dataUserForm.value.person.name ||
      !dataUserForm.value.person.lastname ||
      !dataUserForm.value.person.surname ||
      selectedProducts.value.length === 0;
  }
);
</script>

<template>
  <div>
    <h1 class="h1 text-primary fw-bold">Ventas</h1>
  </div>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-7 shadow">
        <div class="table-container">
          <table class="table">
            <thead class="sticky-top">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Producto</th>
                <th scope="col">Unidades</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in items" :key="product.id">
                <th scope="row">1</th>
                <td>
                  <h5>{{ product.name }}</h5>
                  <span class="badge bg-primary">{{
                    product.category.name
                  }}</span>
                  <p>${{ product.uniPrice }}</p>
                  <p><strong>Stock: </strong>{{ product.quantity }}</p>
                  <p>{{ product.description }}</p>
                </td>
                <td>
                  <div class="mb-3 col-lg-6">
                    <label
                      for="exampleInputPassword1"
                      class="form-label"
                    ></label>
                    <input
                      type="number"
                      class="form-control"
                      id="exampleInputPassword1"
                      v-model="product.quantitySold"
                      @change="addProducts(product.id, product.quantitySold)"
                      min="0"
                      :max="product.quantity"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="col">
        <div class="card ms-5 shadow">
          <div class="card-body">
            <h5 class="card-title">Datos del proveedor</h5>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="needRegistration"
                id="flexCheckDefault"
              />
              <label class="form-check-label" for="flexCheckDefault">
                ¿Necesita registro?
              </label>
            </div>
            <div v-if="needRegistration">
              <div class="container mt-2">
                <h4 class="mb-4">Registro de cliente</h4>
                <form>
                  <div class="mb-3">
                    <label for="telefono" class="form-label"
                      >Número de Teléfono</label
                    >
                    <input
                      type="tel"
                      class="form-control"
                      id="telefono"
                      pattern="[0-9]+"
                      placeholder="Ingresa tu número de teléfono"
                      required
                      v-model="dataUserForm.phoneNumber"
                    />
                  </div>

                  <div class="mb-3">
                    <label for="correo" class="form-label"
                      >Correo Electrónico</label
                    >
                    <input
                      type="email"
                      class="form-control"
                      id="correo"
                      placeholder="Ingresa tu correo electrónico"
                      v-model="dataUserForm.email"
                    />
                  </div>

                  <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre</label>
                    <input
                      type="text"
                      class="form-control"
                      id="nombre"
                      placeholder="Ingresa tu nombre"
                      v-model="dataUserForm.person.name"
                    />
                  </div>

                  <div class="mb-3">
                    <label for="apellidoPaterno" class="form-label"
                      >Apellido Paterno</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="apellidoPaterno"
                      placeholder="Ingresa tu apellido paterno"
                      v-model="dataUserForm.person.lastname"
                    />
                  </div>

                  <div class="mb-3">
                    <label for="apellidoMaterno" class="form-label"
                      >Apellido Materno</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="apellidoMaterno"
                      placeholder="Ingresa tu apellido materno"
                      v-model="dataUserForm.person.surname"
                    />
                  </div>
                </form>
              </div>
            </div>

            <div v-if="!needRegistration">
              <label for="exampleFormControlInput1" class="form-label"
                >Proveedor</label
              >
              <select
                class="form-select"
                aria-label="Default select example"
                @input="onSelectedClient($event.target.value)"
                ref="selectClientRef"
              >
                <option selected value="none" key="none">
                  Selecciona un proveedor
                </option>

                <option
                  v-for="client in suppliers"
                  :value="client.id"
                  :key="client.name"
                >
                  <span class="font-weight-bold">Nombre:</span>
                  {{
                    client.person.name +
                    " " +
                    client.person.lastname +
                    " " +
                    client.person.surname
                  }}
                </option>
              </select>
              <div class="mt-2">
                <strong> Nombre:</strong>
                {{ selectedClient.person ? selectedClient.person.name : "" }}
              </div>
              <div>
                <strong>Apellido paterno:</strong>
                {{
                  selectedClient.person ? selectedClient.person.lastname : ""
                }}
              </div>
              <div>
                <strong>Apellido materno:</strong>
                {{ selectedClient.person ? selectedClient.person.surname : "" }}
              </div>
              <div>
                <strong>Contacto:</strong>
                {{ selectedClient ? selectedClient.contact : "" }}
              </div>
            </div>
          </div>
        </div>

        <div class="card ms-5 mt-2 shadow">
          <div class="card-body">
            <h5 class="card-title mb-4">Resumen de compra</h5>
            <div v-for="sProduct in selectedProducts" :key="sProduct.id">
              <strong>Producto: </strong>
              {{ sProduct ? sProduct.name : "" }}
              <strong>- Piezas: </strong>
              {{ sProduct ? sProduct.quantitySold : "" }}
            </div>
            <div class="text-center">
              <button
                class="btn btn-primary text-secondary mt-3"
                @click="saveSale()"
                :disabled="isButtonDisabled"
                v-if="!needRegistration && selectedTab !== 'staff'"
              >
                Confirmar re-stock
              </button>
              <button
                class="btn btn-primary text-secondary mt-3"
                @click="saveSaleNewClient()"
                :disabled="isButtonDisabled2"
                v-if="needRegistration && selectedTab !== 'staff'"
              >
                Confirmar re-stock2
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  max-height: 900px; /* Ajusta la altura máxima deseada para la tabla */
  overflow-y: auto; /* Agrega una barra de desplazamiento vertical si es necesario */
}

/* Estilos adicionales para la tabla si es necesario */
.table {
  width: 100%;
  border-collapse: collapse;
  /* ... Otros estilos de tabla si es necesario */
}
</style>
