<template>
  <div>
    <h1 class="h1 text-primary fw-bold">Usuarios</h1>

    <div class="d-md-flex justify-content-between w-100 mb-3">
      <div class="">
        <label class="h4 fw-bold">Buscar Usuario</label>
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Buscar usuario" aria-label="Buscar usuario"
                 v-model="search">
          <span class="input-group-text bg-primary text-secondary" readonly><i class="pi pi-search"></i></span>
        </div>
      </div>
      <div class="d-flex align-items-end justify-content-end mt-2 mt-md-0">
        <!-- <button class="btn btn-primary text-secondary w-100" type="button" data-bs-toggle="modal"
                        data-bs-target="#addUserModal">
                  Agregar usuario
                </button>-->
      </div>
    </div>

    <SkeletonCards :loading="loading"/>
    <div v-if="!loading && paginatedCards.length == 0">
      <NotFoundElements/>
    </div>
    <div v-else>
      <main class="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-2 g-lg-3">
        <div v-for="card in paginatedCards " :key="(card.id as number)">
          <div class="col">
            <div class="card itemList" @click="setItemSelected(card)" data-bs-toggle="modal"
                 data-bs-target="#updateProviderModal">
              <div class="">
                <div class="p-2 position-absolute top-0 end-0 m-0">
                  <i class="pi pi-ellipsis-v"></i>
                </div>
              </div>
              <div class="card-body" style="font-size: 1.1rem; width: 100%;">
                <div class="d-flex justify-content-center">
                  <img src="@/assets/images/user.png" class="img-fluid px-4" alt="..." width="210">
                </div>
                <p class="card-text fw-bold mt-1 m-0  text-uppercase mb-1">{{ card.username }}</p>
                <span class="card-text mt-2 fw-medium ">Role: </span>
                <p class="card-text m-0 p-0 text-truncate"
                   :class="card.rolesId == 1? 'text-primary fw-bold':'text-black'">{{ card.role.name }}</p>
                <div class="d-flex justify-content-start mt-2">
                  <span class="badge" :class="card.status ? 'bg-success' : 'bg-danger'">{{
                      card.status ? "Activo" : "Inactivo"
                    }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
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
<!--    <modal-add-user @getUsers="getUsers"/>-->
        <modal-update-user v-if="itemSelected" :itemSelected="itemSelected" @reload-users="getUsers"/>

  </div>
</template>

<script setup lang="ts">
//pagination with mock data
import {computed, onMounted, ref} from "vue";
import api from "@/config/http-client.gateway"
import SkeletonCards from "@/components/SkeletonCards.vue";
import NotFoundElements from "@/components/NotFoundElements.vue";
import ModalUpdateUser from "@/views/admin/users/ModalUpdateUser.vue";
import ModalAddUser from "@/views/admin/users/ModalAddUser.vue";
import {type UserDto} from "@/modules/user/dto/UserDto";

//  general data
const loading = ref(false);
const itemSelected = ref<UserDto>({
  id: 0,
  username: '',
  password: '',
  status: false,
  rolesId: 0,
  staffId: 0,
  role: {
    id: 0,
    name: '',
    description: ''
  }
});

const setItemSelected = (item: UserDto) => itemSelected.value = item

onMounted(() => getUsers())

const getUsers = async () => {
  try {
    loading.value = true;
    const response = await api.doGet('pageable/user')
    items.value = response.data.data as UserDto[];
    items.value = items.value.reverse()
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false;
  }
}

const items = ref<UserDto[]>([]);

const paginator = ref({
  currentPage: 1,
  itemsPerPage: 12,
})

const search = ref('');

const filterItem = computed(() => {
  return items.value.filter((item) => {
    return item.username.toLowerCase().includes(search.value.toLowerCase());
  });
});

const totalPages = computed(() => {
  return Math.ceil(filterItem.value.length / paginator.value.itemsPerPage);
});

const paginatedCards = computed(() => {
  const start = (paginator.value.currentPage - 1) * paginator.value.itemsPerPage;
  const end = start + paginator.value.itemsPerPage;
  return filterItem.value.slice(start, end) as UserDto[];
});

const goToPage = (page: number) => {
  paginator.value.currentPage = page;
  window.scrollTo({top: 0, behavior: 'smooth'});
}
</script>

<style scoped>
.itemList {
  transition: all 0.3s ease; /* Ajusta la duración según tus necesidades */
  /*  height: 300px; !* Alto de la tarjeta *!
    object-fit: cover; !* Asegura que el contenido de la tarjeta se ajuste correctamente *!*/
}

.itemList:hover {
  cursor: pointer;
  transform: scale(1.05);
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
}
</style>