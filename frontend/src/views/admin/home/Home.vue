<template>
  <div class="row row-cols-2 mb-4">
    <div class="col-12 col-md">
      <h1 class="h1 text-primary fw-bold">Historial</h1>
      <div class="w-auto">
        <label class="h4 fw-bold">Buscar Transacción</label>
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Buscar.." aria-label="Transacción"
                 v-model="search">
          <button class="btn btn-primary text-secondary" type="button">Buscar</button>
        </div>
      </div>
    </div>
    <div class="col-12 col-md">
      <div class="d-flex justify-content-end  pt-3">
        <div class="card">
          <div class="card-body fw-bold">
            <div class="card-text"> Ventas del {{ formatDate((dateEarns as Date)) }} hasta {{formatDate((new Date))}}</div>
            <div class="card-text text-primary" v-if="loadingAmountSold">Calculando...</div>
            <div class="card-text text-primary" v-else>${{ amoutEarns }} pesos</div>
            <div class="card-text">
              <button data-bs-target="#amountEarnModal" type="button" data-bs-toggle="modal"
                      class="btn bg-transparent p-0 text-decoration-underline">Cambiar fecha
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--  Modal for dashboard config-->
  <div class="modal fade" id="amountEarnModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Ventas</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit="onSubmit">
          <div class="modal-body">
            <p>Selecciona la fecha maxima para saber tus ganancias</p>
            <p>Fecha en consulta {{ formatDate((dateEarns as Date)) }}</p>
            <div class="">
              <label class="form-label" for="inputGroupSelect01">Ingresa el tipo</label>
              <select class="form-select" id="inputGroupSelect01"
                      :class="{ 'is-invalid': tMeta.touched && !tMeta.valid, 'is-valid': tMeta.valid }"
                      v-model="typeDate" @blur="tBlur">
                >
                <option selected disabled>Selecciona...</option>
                <option value="days">Dia</option>
                <option value="weeks">Semana</option>
                <option value="months">Mes</option>
                <option value="years">Año</option>
              </select>
              <div v-if="!tMeta.valid" class="invalid-feedback">{{ tError }}</div>
            </div>
            <div class=" mt-3">
              <label class="form-label" for="inputGroupSelect01">Ingresa la cantidad</label>
              <input type="number" min=0 class="form-control" placeholder="Ingresa la cantidad"
                     :class="{ 'is-invalid': qMeta.touched && !qMeta.valid, 'is-valid': qMeta.valid }"
                     v-model="quantity" @blur="qBlur">
              <div v-if="!qMeta.valid" class="invalid-feedback">{{ qError }}</div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="submit" class="btn btn-primary text-secondary" :disabled="isDisabled">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="my-2 table-responsive">
    <SkeletonTable :headersTable="headersTable" :quantity-rows="7" :loading="loadingTable"/>
    <table class="table table-hover" v-if="!loadingTable">
      <thead>
      <tr>
        <th scope="col" v-for="header in headersTable" :key="header.key">{{ header.value }}</th>
      </tr>
      </thead>
      <tbody v-if="paginatedCards.length == 0">
      <tr>
        <td colspan="7">
          <NotFoundElements/>
        </td>
      </tr>
      </tbody>
      <tbody v-else>
      <tr v-for="card in paginatedCards " :key="card.id">
        <th scope="row">{{ card.index }}</th>
        <td>{{ card.id }}</td>
        <td>{{ card.sellerName }}</td>
        <td>{{ card.buyerName }}</td>
        <td>{{ card.totalAmount }}</td>
        <td>{{ card.createdAt }}</td>
        <td>
          <button class="btn btn-primary text-secondary" type="button" data-bs-toggle="modal"
                  data-bs-target="#historyProduct" @click="setItem(card)">Ver productos
          </button>
          <HistoryProduct v-if="iteamSelected" :item="iteamSelected"/>
        </td>
      </tr>
      </tbody>
    </table>
  </div>

  <footer>
    <nav aria-label="pagination" class="d-flex justify-content-md-end justify-content-center mt-3 ">
      <ul class="pagination">
        <li class="page-item" :class="{ 'disabled': paginator.currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="goToPage(paginator.currentPage-1)">Anterior</a>
        </li>
        <li class="page-item" v-for="number in totalPages" :key="number"
            :class="{ 'active': number === paginator.currentPage }">
          <a class="page-link" href="#" @click.prevent="goToPage(number)">{{ number }}</a>
        </li>
        <li class="page-item" :class="{ 'disabled': paginator.currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="goToPage(paginator.currentPage+1)">Siguiente</a>
        </li>
      </ul>
    </nav>
  </footer>
</template>

<script setup lang="ts">
import {computed, getCurrentInstance,  onMounted, ref} from "vue";
import {useForm, useField} from "vee-validate";
import * as yup from "yup";
import api from "@/config/http-client.gateway";
import type {TransactionHistory} from "@/modules/dashboard/dto/TransactionHistory";
import HistoryProduct from "@/views/admin/home/historyProduct.vue";
import NotFoundElements from "@/components/NotFoundElements.vue";
import SkeletonTable from "@/components/SkeletonTable.vue";
// @ts-ignore
import {formatDate} from '@/assets/ts/functions';

/** Element generals **/

//alerts
const app = getCurrentInstance();
const Swal = app?.appContext.config.globalProperties.$swalCustom;

const loadingTable = ref(false);
const loadingAmountSold = ref(false);

const headersTable = [
  {value: '#', key: 'index'},
  {value: 'Transacción', key: 'id'},
  {value: 'Vendedor', key: 'sellerName'},
  {value: 'Cliente', key: 'buyerName'},
  {value: 'Precio Total', key: 'totalAmount'},
  {value: 'Fecha de venta', key: 'createdAt'},
  {value: 'Acciones', key: 'actions'},
] as { value: string, key: string }[];



/** * @description * get earns * */
const amoutEarns = ref(0);
const dateEarns = ref(new Date());

const getAmountEarns = async () => {
  try {
    loadingAmountSold.value = true;
    const response = await api.doPost('dashboard/', {
      intervalType: null,
      interval: null,
    })
    if (response.status === 200) {
      amoutEarns.value = Math.round(response.data.data);
    }
  } catch (e) {
    console.log(e)
  }finally {
    loadingAmountSold.value = false;
  }
}


// Define validation schema
const schema = yup.object({
  typeDate: yup.string().required('Ingresa el tipo'),
  quantity: yup.number().required('Ingresa la cantidad').min(0, 'Ingresa un numero mayor a 0').max(100, 'Ingresa un numero menor a 100').typeError('Ingresa un numero').positive('Ingresa un numero positivo').integer('Ingresa un numero entero')
});

// Use the schema in your component
let {handleSubmit, resetForm} = useForm({validationSchema: schema,});

let {value: typeDate, errorMessage: tError, handleBlur: tBlur, meta: tMeta} = useField("typeDate");
let {value: quantity, errorMessage: qError, handleBlur: qBlur, meta: qMeta} = useField("quantity");

let onSubmit = handleSubmit(async values => {
  dateEarns.value = new Date();
  Swal.loading();
  try {
    const response = await api.doPost('dashboard/', {
      intervalType: values.typeDate,
      interval: values.quantity
    })

    if (response.status === 200) {
      Swal.close();
      console.log(response.data.data)
      if (values.typeDate === 'days') {
        dateEarns.value.setDate(dateEarns.value.getDate() - values.quantity)
      } else if (values.typeDate === 'weeks') {
        dateEarns.value.setDate(dateEarns.value.getDate() - (values.quantity * 7))
      } else if (values.typeDate === 'months') {
        dateEarns.value.setMonth(dateEarns.value.getMonth() - values.quantity)
      } else if (values.typeDate === 'years') {
        dateEarns.value.setFullYear(dateEarns.value.getFullYear() - values.quantity)
      }

      amoutEarns.value = Math.round(response.data.data);
      hideModalAmoutDate();
      resetForm();
    }


  } catch (e) {
    console.log(e)
  }
});

//disabled button
let isDisabled = computed(() => {
  return !tMeta.valid || !qMeta.valid;
});

//close modal
const hideModalAmoutDate = () => {
  const closeButton: HTMLElement | null = document.querySelector('[data-bs-dismiss="modal"]');
  if (closeButton) {
    closeButton.click();
  }
}

const getTransactions = async () => {
  try {
    loadingTable.value = true;
    const response = await api.doGet('/transactions-history')
    let index = 1;
    for (const transaction of response.data.data) {
      items.value.push({
        index: index,
        id: transaction.id,
        sellerName: transaction.sellerName,
        buyerName: transaction.buyerName,
        totalAmount: transaction.totalAmount,
        createdAt: transaction.creationDate,
        products: transaction.products
      } as TransactionHistory);
      index++;
    }
  } catch (e) {
    console.log(e)
  } finally {
    loadingTable.value = false;
  }
}

const items = ref<TransactionHistory[]>([]);
const iteamSelected = ref<TransactionHistory>({
  index: 0,
  id: 0,
  sellerName: '',
  buyerName: '',
  totalAmount: 0,
  paymentMethod: '',
  transactionType: '',
  createdAt: '',
  products: []
});

// set item selected for modal
const setItem = (item: TransactionHistory) => iteamSelected.value = item;

/**   paginator  **/

const paginator = ref({
  currentPage: 1,
  itemsPerPage: 10,
})
const search = ref('');

const filterItem = computed(() => {
  return items.value.filter((item) => {
    return item.sellerName.toLowerCase().includes(search.value.toLowerCase());
  });
});

const totalPages = computed(() => {
  return Math.ceil(filterItem.value.length / paginator.value.itemsPerPage);
});

const paginatedCards = computed(() => {
  const start = (paginator.value.currentPage - 1) * paginator.value.itemsPerPage;
  const end = start + paginator.value.itemsPerPage;
  return filterItem.value.slice(start, end);
});

const goToPage = (page: number) => {
  paginator.value.currentPage = page;
  window.scrollTo({top: 0, behavior: 'smooth'});
}

/** mounted element **/
onMounted(() => {
  getTransactions()
  getAmountEarns()
})

</script>
<style scoped></style>