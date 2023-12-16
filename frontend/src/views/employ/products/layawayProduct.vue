<script setup lang="ts">
import {onMounted, ref, inject, watch} from "vue";
import api from "../../../config/http-client.gateway";
import "vue-loading-overlay/dist/css/index.css";
import Loading from "vue-loading-overlay";
import type {ProductSold} from "../../../modules/product/dto/productSold.Dto";
import type {SelectedClient} from "../../../modules/client/Client.Dto";
import NotFoundElements from "@/components/NotFoundElements.vue";

const Swal = inject("$swal");

const isButtonDisabled = ref(true);
const items = ref<ProductSold[]>([]);
const clients = ref<SelectedClient[]>([]);
const selectedClient = ref<SelectedClient>({} as SelectedClient);
const selectedProducts = ref<ProductSold[]>([]);
const subtotal = ref();
const total = ref();
const descount = ref(0);
const needEmail = ref(false);
const selectClientRef = ref(null);
const isLoading = ref(false);

const getProducts = async () => {
  try {
    isLoading.value = true;
    const response = await api.doPost("/pageable/product", {name: ""});
    items.value = response.data.data.filter(
        (obj: ProductSold) => obj.quantity !== 0
    );
    items.value.map((element: ProductSold, index) => {
      element.index = index + 1;
      element.quantitySold = 0;
    });
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.log(error);
  }
};

const getClients = async () => {
  try {
    isLoading.value = true;
    const response = await api.doGet("/clients");
    clients.value = response.data.data.filter(
        (element: SelectedClient) => element.purchasesCount >= 3
    );
    console.log("clientes de ventas", clients.value);
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.log(error);
  }
};

const onSelectedClient = (clientId: string) => {
  if (clientId === "0" && selectedClient.value) {
    selectedClient.value = {} as SelectedClient;
    console.log("valor del cliente cuando no es nada", selectedClient.value);
    descount.value = 0;
    total.value = calculateTotalCost();
  } else {
    // const json = JSON.parse(JSON.stringify(clients.value))
    selectedClient.value = clients.value.find(
        (ele: SelectedClient) => ele.id == parseInt(clientId)
    )!;
    if (selectedClient.value.purchasesCount > 3) {
      descount.value = 0.05;
    } else {
      descount.value = 0;
    }
    total.value = calculateTotalCost();

    console.log(selectedClient.value);
  }
};

const calculateDescount = () => {
  let totalToPay = selectedProducts.value.reduce(
      (total, item: ProductSold) => total + item.uniPrice * item.quantitySold,
      0
  );
  let totalDescount = totalToPay * descount.value;
  return totalDescount;
};
const calculateSubtotalCost = () => {
  return selectedProducts.value.reduce(
      (total, item: ProductSold) => total + item.uniPrice * item.quantitySold,
      0
  );
};
const calculateTotalCost = () => {
  let totalToPay = selectedProducts.value.reduce(
      (total, item: ProductSold) => total + item.uniPrice * item.quantitySold,
      0
  );
  if (descount.value != 0) {
    totalToPay = totalToPay - totalToPay * descount.value;
  }
  return totalToPay;
};

const addProducts = (productId: number, quantitySold: number) => {
  // console.log("holaaaa",productId, quantitySold);
  if (
      !selectedProducts.value.find(
          (element: ProductSold) => element.id === productId
      )
  ) {
    selectedProducts.value.push({
      ...items.value.find((element) => element.id === productId),
      quantitySold: quantitySold,
    } as ProductSold);
  } else {
    const charge: ProductSold = selectedProducts.value.find(
        (element: ProductSold) => element.id === productId
    )!;
    charge.quantitySold = quantitySold;
    if (charge.quantitySold == 0) {
      selectedProducts.value = selectedProducts.value.filter(
          (obj: ProductSold) => obj.id !== productId
      );
    }
  }
  //   console.log("ya funka?",selectedProducts.value);
  subtotal.value = calculateSubtotalCost();
  total.value = calculateTotalCost();
};

const payloadForSale = {
  totalAmount: 0.0,
  staffId: 0,
  clientInfo: {},
  charge: [] as Array<ProductSold>,
  sendEmail: true,
};
const saveLayaway = async () => {
  try {
    payloadForSale.totalAmount = total.value.toFixed(2);
    payloadForSale.staffId = 1;
    payloadForSale.clientInfo = selectedClient.value;
    payloadForSale.charge = selectedProducts.value;
    payloadForSale.sendEmail = needEmail.value;
    Swal.fire({
      title: "¿Segura que desea realizar la acción?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        isLoading.value = true;
        const res = await api.doPost("/layaway", payloadForSale);
        console.log("respuerta de la vent ", res);
        if (res.data.data) {
          Swal.fire({
            icon: "success",
            title: "Acción realizada correctamente",
            confirmButtonText: "Aceptar",
          });
        }
        getClients();
        getProducts();
        selectedClient.value = {} as SelectedClient;
        selectedProducts.value = [];
        subtotal.value = null;
        total.value = null;
        selectClientRef.value.selectedIndex = 0;
        isLoading.value = false;
      }
    });
  } catch (error) {
    isLoading.value = false;
    console.log(error);
  }
};

onMounted(() => {
  getProducts();
  getClients();
});

watch([() => selectedClient.value, () => selectedProducts.value], () => {
  // Verifica si tanto selectedClient como selectedProducts tienen valores
  isButtonDisabled.value =
      !selectedClient.value || selectedProducts.value.length === 0;
});
</script>

<template>
  <div>
    <loading v-model:active="isLoading" :can-cancel="true"/>
    <h1 class="h1 text-primary fw-bold my-3">Apartados</h1>
  </div>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-7 shadow">
        <div
            class="table-container"
            style="max-height: 700px; overflow-y: auto"
        >
          <table class="table">
            <thead class="sticky-top">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Producto</th>
              <th scope="col">Unidades</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="items.length == 0">
              <td colspan="3" class="pt-3">
                <NotFoundElements message="No se encontraron productos para la venta"/>
              </td>
            </tr>
            <tr v-else v-for="product in items" :key="product.id">
              <th scope="row">{{ product.index }}</th>
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
            <h5 class="card-title">Clientes frecuentes</h5>
            <div>
              <label for="exampleFormControlInput1" class="form-label"
              >Cliente</label
              >
              <select
                  class="form-select"
                  aria-label="Default select example"
                  @input="onSelectedClient($event.target.value)"
                  ref="selectClientRef"
              >
                <option selected value="0" key="0" disabled>
                  Selecciona un cliente
                </option>

                <option
                    v-for="client in clients"
                    :value="client.id"
                    :key="client.person.name"
                >
                  <span class="font-weight-bold">Nombre:</span>
                  {{
                    client.person.name +
                    " " +
                    client.person.surname +
                    " " +
                    `${
                        client.person.lastname !== null
                            ? client.person.lastname
                            : ""
                    }`
                  }}
                </option>
              </select>
              <div class="mt-2">
                <strong> Nombre:</strong>
                {{ selectedClient.person ? selectedClient.person.name : "" }}
              </div>
              <div>
                <strong>Apellido paterno:</strong>
                {{ selectedClient.person ? selectedClient.person.surname : "" }}
              </div>
              <div>
                <strong>Apellido materno:</strong>
                {{
                  selectedClient.person
                      ? selectedClient.person.lastname
                          ? selectedClient.person.lastname
                          : ""
                      : ""
                }}
              </div>
              <div>
                <strong>Correo:</strong>
                {{ selectedClient ? selectedClient.email : "" }}
              </div>
              <div>
                <strong>Teléfono:</strong>
                {{ selectedClient ? selectedClient.phoneNumber : "" }}
              </div>
            </div>
          </div>
        </div>

        <div class="card ms-5 mt-2 shadow">
          <div class="card-body">
            <h5 class="card-title mb-4">Resumen de apartado</h5>
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
            <div class="mt-4" v-if="descount">
              <strong>Descuento: </strong>
              <div v-if="subtotal">
                ${{ calculateDescount().toFixed(2) }} MXN
              </div>
            </div>
            <div class="mt-4">
              <strong>Total: </strong>
              <div v-if="total">${{ total.toFixed(2) }} MXN</div>
            </div>
            <div class="form-check my-3">
              <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="needEmail"
                  id="confirmation"
              />
              <label class="form-check-label" for="confirmation">
                ¿Envíar confirmación?
              </label>
            </div>
            <div class="text-center">
              <button
                  class="btn btn-primary text-secondary mt-3"
                  @click="saveLayaway()"
                  :disabled="isButtonDisabled"
              >
                Confirmar apartado
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
