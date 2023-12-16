<template>
  <div>
    <loading v-model:active="isLoading" :can-cancel="true" />
    <h1 class="h1 text-primary fw-bold my-3">Reabastecimientos</h1>
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
                <th scope="col">Unidades a agregar</th>
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
                <h4 class="mb-4">Registro del proveedor</h4>
                <form>
                  <div class="mb-3">
                    <label for="contact" class="form-label">Contacto</label>
                    <input
                      type="text"
                      class="form-control"
                      id="contact"
                      placeholder="Ingresa el contacto"
                      required
                      v-model="dataSupplierForm.contact"
                    />
                  </div>

                  <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre</label>
                    <input
                      type="text"
                      class="form-control"
                      id="nombre"
                      placeholder="Ingresa tu nombre"
                      v-model="dataSupplierForm.person.name"
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
                      v-model="dataSupplierForm.person.lastname"
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
                      v-model="dataSupplierForm.person.surname"
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
                @input="onSelectedSupplier($event.target.value)"
                ref="selectedSupplierRef"
              >
                <option selected value="0" key="0" disabled>
                  Selecciona un proveedor
                </option>

                <option
                  v-for="supplier in suppliers"
                  :value="supplier.id"
                  :key="supplier.id"
                >
                  <span class="font-weight-bold">Nombre:</span>
                  {{
                    supplier.person.name +
                    " " +
                    supplier.person.surname +
                    " " +
                    `${
                      supplier.person.lastname !== null
                        ? supplier.person.lastname
                        : ""
                    }`
                  }}
                </option>
              </select>
              <div class="mt-2">
                <strong> Nombre:</strong>
                {{
                  selectedSupplier.person ? selectedSupplier.person.name : ""
                }}
              </div>
              <div>
                <strong>Apellido paterno:</strong>
                {{
                  selectedSupplier.person ? selectedSupplier.person.surname : ""
                }}
              </div>
              <div>
                <strong>Apellido materno:</strong>
                {{
                  selectedSupplier.person
                    ? selectedSupplier.person.lastname
                      ? selectedSupplier.person.lastname
                      : ""
                    : ""
                }}
              </div>
              <div>
                <strong>Contacto:</strong>
                {{ selectedSupplier ? selectedSupplier.contact : "" }}
              </div>
            </div>
          </div>
        </div>

        <div class="card ms-5 mt-2 shadow">
          <div class="card-body">
            <h5 class="card-title mb-4">Resumen de reabastecimiento</h5>
            <div v-for="sProduct in selectedProducts" :key="sProduct.id">
              <strong>Producto: </strong>
              {{ sProduct ? sProduct.name : "" }}
              <strong>- Piezas: </strong>
              {{ sProduct ? sProduct.quantitySold : "" }}
            </div>
            <div class="text-center">
              <button
                class="btn btn-primary text-secondary mt-3"
                @click="saveRestock()"
                :disabled="isButtonDisabled"
                v-if="!needRegistration"
              >
                Confirmar reabastecimiento
              </button>
              <button
                class="btn btn-primary text-secondary mt-3"
                @click="saveRestockNewSupplier()"
                :disabled="isButtonDisabled2"
                v-if="needRegistration"
              >
                Confirmar reabastecimiento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, inject, watch } from "vue";
import api from "../../../config/http-client.gateway";
import "vue-loading-overlay/dist/css/index.css";
import Loading from "vue-loading-overlay";
import type { SupplierDto } from "../../../modules/supplier/dtos/SupplierDto";
import type { ProductSold } from "../../../modules/product/dto/productSold.Dto";

const Swal = inject("$swal");

const isButtonDisabled = ref(true);
const isButtonDisabled2 = ref(true);
const items = ref<ProductSold[]>([]);
const suppliers = ref<SupplierDto[]>([]);
const selectedSupplier = ref<SupplierDto>({
  id: 0,
  contact: "",
  peopleId: 0,
  person: {
    id: 0,
    name: "",
    surname: "",
    lastname: "",
  },
});
const selectedProducts = ref<ProductSold[]>([]);
const total = ref();
const needRegistration = ref(false);
const selectedSupplierRef = ref(null);
const isLoading = ref(false);

const getProducts = async () => {
  try {
    isLoading.value = true;
    const response = await api.doPost("/pageable/product", { name: "" });
    items.value = response.data.data
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

const getSuppliers = async () => {
  try {
    isLoading.value = true;
    const response = await api.doGet("/pageable/supplier");
    suppliers.value = response.data.data;
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.log(error);
  }
};

const onSelectedSupplier = (supplierId: string) => {
  if (supplierId === "0" && selectedSupplier.value) {
    selectedSupplier.value = {
      id: 0,
      contact: "",
      peopleId: 0,
      person: {
        id: 0,
        name: "",
        surname: "",
        lastname: "",
      },
    };
  } else {
    // const json = JSON.parse(JSON.stringify(suppliers.value))
    selectedSupplier.value = suppliers.value.find(
      (ele: SupplierDto) => ele.id === parseInt(supplierId)
    )!;
  }
};

const addProducts = (productId: number, quantitySold: number) => {
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
    charge!.quantitySold = quantitySold;
    if (charge!.quantitySold == 0) {
      selectedProducts.value = selectedProducts.value.filter(
        (obj: ProductSold) => obj.id !== productId
      );
    }
  }
  total.value = calculateTotalCost();
};

const dataSupplierForm = ref({
  contact: "",
  person: {
    name: "",
    lastname: "",
    surname: "",
  },
});

const payloadRestock = {
  totalAmount: 0.0,
  staffId: 0,
  supplierInfo: {},
  charge: [] as Array<ProductSold>,
  sendEmail: false, //en este caso no se usa
};

const calculateTotalCost = () => {
  let totalToPay = selectedProducts.value.reduce(
    (total, item: ProductSold) => total + item.uniPrice * item.quantitySold,
    0
  );
  return totalToPay;
};

const saveRestock = () => {
  try {
    payloadRestock.totalAmount = total.value.toFixed(2);
    payloadRestock.staffId = 1; //tomar de la sesion
    payloadRestock.supplierInfo = selectedSupplier.value;
    payloadRestock.charge = selectedProducts.value;
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
      try{
        if (result.isConfirmed) {
          isLoading.value = true;
          const res = await api.doPost("/restock", payloadRestock);
          if (res.data.data) {
            Swal.fire({
              icon: "success",
              title: "Acción realizada correctamente",
              confirmButtonText: "Aceptar",
            });
          }
          getSuppliers();
          getProducts();
          selectedSupplier.value = {
            id: 0,
            contact: "",
            peopleId: 0,
            person: {
              id: 0,
              name: "",
              surname: "",
              lastname: "",
            },
          };
          selectedProducts.value = [];
          selectedSupplierRef.value!.selectedIndex = 0;
          isLoading.value = false;
        }
      }catch (e) {
        isLoading.value = false;
        Swal.fire({
          icon: "error",
          title: "Error al realizar la acción",
          confirmButtonText: "Aceptar",
        });
      }
    })

  } catch (error) {
    isLoading.value = false;
    console.log(error);
    Swal.fire({
      icon: "error",
      title: "Error al realizar la acción",
      confirmButtonText: "Aceptar",
    });
  }
};

const saveRestockNewSupplier = async () => {
  try {
    payloadRestock.totalAmount = total.value.toFixed(2);
    payloadRestock.staffId = 1;
    payloadRestock.supplierInfo = dataSupplierForm.value;
    payloadRestock.charge = selectedProducts.value;
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
        const res = await api.doPost("/restock", payloadRestock);
        if (res.data.data) {
          Swal.fire({
            icon: "success",
            title: "Acción realizada correctamente",
            confirmButtonText: "Aceptar",
          });
        }
        getSuppliers();
        getProducts();
        dataSupplierForm.value = {
          contact: "",
          person: {
            name: "",
            lastname: "",
            surname: "",
          },
        };
        selectedProducts.value = [];
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
  getSuppliers();
});

watch([() => selectedSupplier.value, () => selectedProducts.value], () => {
  // Verifica si tanto selectedClient como selectedProducts tienen valores
  isButtonDisabled.value =
    !selectedSupplier.value || selectedProducts.value.length === 0;
});
watch([() => needRegistration.value], () => {
  selectedSupplier.value = {
    id: 0,
    contact: "",
    peopleId: 0,
    person: {
      id: 0,
      name: "",
      surname: "",
      lastname: "",
    },
  };
});
watch(
  [
    () => dataSupplierForm.value.contact,
    () => dataSupplierForm.value.person.name,
    () => dataSupplierForm.value.person.lastname,
    () => dataSupplierForm.value.person.surname,
    () => selectedProducts.value,
  ],
  () => {
    isButtonDisabled2.value =
      !dataSupplierForm.value.contact ||
      !dataSupplierForm.value.person.name ||
      !dataSupplierForm.value.person.lastname ||
      !dataSupplierForm.value.person.surname ||
      selectedProducts.value.length === 0;
  }
);
</script>

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
