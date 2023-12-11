<script setup lang="ts">
import api from "../../../config/http-client.gateway.ts";
import { onMounted, ref, inject } from "vue";
const Swal = inject("$swal");
const getProducts = async () => {
  try {
    const response = await api.doPost("/pageable/product", { name: "" });
    response.data.data.map((element) => {
      element.quantitySold = 0;
    });
    items.value = response.data.data;
    console.log(response.data.data);
  } catch (error) {
    console.log(error);
  }
};

const getClients = async () => {
  try {
    const response = await api.doGet("/clients");
    clients.value = response.data.data;
    console.log(response.data.data);
  } catch (error) {
    console.log(error);
  }
};

onMounted(getProducts);
onMounted(getClients);

const onSelectedClient = (clientId: number) => {
  // const json = JSON.parse(JSON.stringify(clients.value))
  selectedClient.value = clients.value.find(
    (ele) => ele.id == parseInt(clientId)
  );
  console.log(selectedClient.value);
};

const calculateSubtotalCost = () => {
  return selectedProducts.value.reduce(
    (total, item) => total + item.uniPrice * item.quantitySold,
    0
  );
};

const calculateTotalCost = () => {
  return selectedProducts.value.reduce(
    (total, item) => total + item.uniPrice * item.quantitySold,
    0
  );
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
  //   console.log("ya funka?",selectedProducts.value);
  subtotal.value = calculateSubtotalCost();
  total.value = calculateTotalCost();
};

const items = ref([]);
const clients = ref([]);
const selectedClient = ref({});
const selectedProducts = ref([]);
const subtotal = ref();
const total = ref();
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
        console.log("respuerta de la vent ",res);
        
      }
    });
  } catch (error) {
    console.log(error);
  }
};
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
                  <span class="badge text-bg-primary">{{
                    product.category.name
                  }}</span>
                  <p>${{ product.uniPrice }}</p>
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
            <h5 class="card-title">Datos del cliente</h5>
            <div class="form-check mb-3">
              <input
                class="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <label class="form-check-label" for="flexRadioDefault1">
                Registrar nuevo cliente
              </label>
            </div>
            <label for="exampleFormControlInput1" class="form-label"
              >Cliente</label
            >
            <select
              class="form-select"
              aria-label="Default select example"
              @input="onSelectedClient($event.target.value)"
            >
              <option selected>Selecciona un cliente</option>

              <option
                v-for="client in clients"
                :value="client.id"
                :key="client.name"
              >
                <span class="font-weight-bold">Nombre:</span>
                {{
                  client.person.name +
                  client.person.lastname +
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
              {{ selectedClient.person ? selectedClient.person.lastname : "" }}
            </div>
            <div>
              <strong>Apellido materno:</strong>
              {{ selectedClient.person ? selectedClient.person.surname : "" }}
            </div>
            <div>
              <strong>Correo:</strong>
              {{ selectedClient ? selectedClient.email : "" }}
            </div>
            <div>
              <strong>Teléfono:</strong>
              {{ selectedClient ? selectedClient.phoneNombre : "" }}
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
            <div class="mt-4">
              <strong>Subtotal: </strong>
              <div v-if="subtotal">${{ subtotal.toFixed(2) }} MXN</div>
            </div>
            <div class="mt-4">
              <strong>Total: </strong>
              <div v-if="total">${{ total.toFixed(2) }} MXN</div>
            </div>
            <div class="text-center">
              <button
                class="btn btn-primary text-secondary"
                @click="saveSale()"
              >
                Confirmar compra
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
