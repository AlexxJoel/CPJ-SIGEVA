<script setup lang="ts">
import { onMounted, ref, inject, watch } from "vue";
import api from "../../../config/http-client.gateway";
import "vue-loading-overlay/dist/css/index.css";
import Loading from "vue-loading-overlay";
import type { ProductSold } from "../../../modules/product/dto/productSold.Dto";
import type { SelectedStaff } from "@/modules/satff/dtos/Staff.Dto";
import type { SelectedClient } from "../../../modules/client/Client.Dto";

const Swal = inject("$swal");

const isButtonDisabled = ref(true);
const isButtonDisabled2 = ref(true);
const isButtonDisabled3 = ref(true);
const items = ref<ProductSold[]>([]);
const clients = ref<SelectedClient[]>([]);
const staff = ref<SelectedStaff[]>([]);
const selectedClient = ref<SelectedClient>({} as SelectedClient);
const selectedEmploye = ref<SelectedStaff>({} as SelectedStaff);
const selectedProducts = ref<ProductSold[]>([]);
const subtotal = ref();
const total = ref(0);
const descount = ref(0);
const needRegistration = ref(false);
const needEmail = ref(false);
const selectClientRef = ref(null);
const isLoading = ref(false);

const getProducts = async () => {
  try {
    isLoading.value = true;
    const response = await api.doPost("/pageable/product", { name: "" });
    items.value = response.data.data.filter(
      (obj: ProductSold) => obj.quantity !== 0
    );
    items.value.map((element: ProductSold, index) => {
      element.index = index + 1;
      element.quantitySold = 0;
    });
    isLoading.value = false;
  } catch (error) {
    console.log(error);
  }
};

const getClients = async () => {
  try {
    isLoading.value = true;
    const response = await api.doGet("/clients");
    clients.value = response.data.data;
    console.log("clientes de ventas", clients.value);
    isLoading.value = false;
  } catch (error) {
    console.log(error);
  }
};

const getStaff = async () => {
  try {
    isLoading.value = true;
    const response = await api.doGet("/pageable/staff");
    staff.value = response.data.data;
    isLoading.value = false;
  } catch (error) {
    console.log(error);
  }
};

const calculatePercent = () => {
  if (selectedClient.value.purchasesCount > 3 && subtotal.value > 100000.0) {
    descount.value = 0.1;
  } else if (
    subtotal.value > 100000.0 ||
    selectedClient.value.purchasesCount > 3
  ) {
    descount.value = 0.05;
  } else {
    descount.value = 0;
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
    total.value = calculateTotalCost();
    calculatePercent();
    console.log(selectedClient.value);
  }
};

const onSelectedEmploye = (employeId: string) => {
  if (employeId === "0" && selectedEmploye.value) {
    selectedEmploye.value = {} as SelectedStaff;
    descount.value = 0;
    total.value = calculateTotalCost();
  } else {
    // const json = JSON.parse(JSON.stringify(clients.value))
    selectedEmploye.value = staff.value.find(
      (ele: SelectedStaff) => ele.id == parseInt(employeId)
    )!;
    descount.value = 0.01;
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
  calculatePercent();
};

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
  charge: [] as Array<ProductSold>,
  sendEmail: true,
};
const payloadForSaleEmploye = {
  totalAmount: 0.0,
  staffId: 0,
  staffInfo: {},
  charge: [] as Array<ProductSold>,
  sendEmail: true,
};

const saveSale = async () => {
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
        const res = await api.doPost("/sell", payloadForSale);
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
    console.log(error);
  }
};

const saveSaleNewClient = async () => {
  try {
    payloadForSale.totalAmount = total.value.toFixed(2);
    payloadForSale.staffId = 1;
    payloadForSale.clientInfo = dataUserForm.value;
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

        const res = await api.doPost("/sell", payloadForSale);
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
        subtotal.value = null;
        total.value = null;
        isLoading.value = false;
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const saveSaleStaff = async () => {
  try {
    payloadForSaleEmploye.totalAmount = total.value.toFixed(2);
    payloadForSaleEmploye.staffId = 1;
    payloadForSaleEmploye.staffInfo = selectedEmploye.value;
    payloadForSaleEmploye.charge = selectedProducts.value;
    payloadForSaleEmploye.sendEmail = needEmail.value;
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
        const res = await api.doPost("/sell", payloadForSaleEmploye);
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
    console.log(error);
  }
};

const selectedTab = ref("client");
const handleTabClient = () => {
  selectedTab.value = "client";
  selectedClient.value = {} as SelectedClient;
  selectedEmploye.value = {} as SelectedStaff;
  descount.value = 0;
  total.value = calculateTotalCost();
  calculatePercent();
};
const handleTabStaff = () => {
  selectedTab.value = "staff";
  selectedClient.value = {} as SelectedClient;
  selectedEmploye.value = {} as SelectedStaff;
  descount.value = 0;
  total.value = calculateTotalCost();
  calculatePercent();
};

onMounted(() => {
  // isLoading.value = true;
  getProducts();
  getClients();
  getStaff();
  // isLoading.value = false;
});

watch([() => selectedClient.value, () => selectedProducts.value], () => {
  // Verifica si tanto selectedClient como selectedProducts tienen valores
  isButtonDisabled.value =
    !selectedClient.value || selectedProducts.value.length === 0;
});
watch([() => selectedEmploye.value, () => selectedProducts.value], () => {
  // Verifica si tanto selectedClient como selectedProducts tienen valores
  isButtonDisabled3.value =
    !selectedEmploye.value || selectedProducts.value.length === 0;
});
watch([() => needRegistration.value], () => {
  selectedClient.value = {} as SelectedClient;
  calculatePercent();
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
    <loading v-model:active="isLoading" :can-cancel="true" />
    <h1 class="h1 text-primary fw-bold my-3">Ventas</h1>
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
              <tr v-for="product in items" :key="product.id">
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
          <div class="card-header">
            <ul class="nav nav-pills card-header-pills">
              <li class="nav-item" @click="handleTabClient">
                <a
                  class="nav-link btn"
                  :class="
                    selectedTab === 'client'
                      ? 'active bg-primary text-secondary'
                      : 'text-black'
                  "
                  >Cliente</a
                >
              </li>
              <li class="nav-item" @click="handleTabStaff">
                <a
                  class="nav-link btn"
                  :class="
                    selectedTab === 'staff'
                      ? 'active bg-primary text-secondary'
                      : 'text-black'
                  "
                  >Personal</a
                >
              </li>
            </ul>
          </div>
          <div class="card-body" v-if="selectedTab === 'client'">
            <h5 class="card-title">Datos del cliente</h5>
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
                    client.person.lastname +
                    " " +
                    `${
                      client.person.lastname !== null
                        ? client.person.lastname
                        : ""
                    }`
                  }}
                </option>
              </select>
              <div class="mt-3">
                <span
                  class="badge bg-primary"
                  v-if="selectedClient.purchasesCount > 3"
                  >Cliente frecuente</span
                >
              </div>
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

          <div class="card-body" v-if="selectedTab === 'staff'">
            <h5 class="card-title">Datos del empleado</h5>

            <div>
              <label for="exampleFormControlInput1" class="form-label"
                >Empleado</label
              >
              <select
                class="form-select"
                aria-label="Default select example"
                @input="onSelectedEmploye($event.target.value)"
                ref="selectClientRef"
              >
                <option selected value="0" key="0" disabled>
                  Selecciona un empleado
                </option>

                <option
                  v-for="employe in staff"
                  :value="employe.id"
                  :key="employe.id"
                >
                  <span class="font-weight-bold"></span>
                  {{
                    employe.person.name +
                    " " +
                    employe.person.surname +
                    " " +
                    `${
                      employe.person.lastname !== null
                        ? employe.person.lastname
                        : ""
                    }`
                  }}
                </option>
              </select>
              <div class="mt-2">
                <strong> Nombre:</strong>
                {{ selectedEmploye.person ? selectedEmploye.person.name : "" }}
              </div>
              <div>
                <strong>Apellido paterno:</strong>
                {{
                  selectedEmploye.person ? selectedEmploye.person.surname : ""
                }}
              </div>
              <div>
                <strong>Apellido materno:</strong>
                {{
                  selectedEmploye.person
                    ? selectedEmploye.person.lastname
                      ? selectedEmploye.person.lastname
                      : ""
                    : ""
                }}
              </div>
              <div>
                <strong>Correo:</strong>
                {{ selectedEmploye ? selectedEmploye.email : "" }}
              </div>
            </div>
          </div>
        </div>

        <div class="card ms-5 mt-2 shadow">
          <div class="card-body">
            <h5 class="card-title mb-4">Resumen de compra</h5>
            <div>
              <span
                class="badge bg-primary me-2"
                v-if="selectedClient.purchasesCount > 3"
                >5% de descuento</span
              >
              <span class="badge bg-primary me-2" v-if="subtotal > 100000.0"
                >5% de descuento</span
              >
              <span class="badge bg-primary" v-if="subtotal"
                >Descuento total: {{ descount * 100 }}%</span
              >
            </div>
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
                @click="saveSale()"
                :disabled="isButtonDisabled"
                v-if="!needRegistration && selectedTab !== 'staff'"
              >
                Confirmar compra
              </button>
              <button
                class="btn btn-primary text-secondary mt-3"
                @click="saveSaleNewClient()"
                :disabled="isButtonDisabled2"
                v-if="needRegistration && selectedTab !== 'staff'"
              >
                Confirmar compra
              </button>
              <button
                class="btn btn-primary text-secondary mt-3"
                @click="saveSaleStaff()"
                :disabled="isButtonDisabled3"
                v-if="selectedTab === 'staff'"
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
