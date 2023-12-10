<script setup lang="ts">
//pagination with mock data
import {computed, ref} from "vue";
import AddProviderUser from "./addProviderUser.vue";

// let modalVisible = ref(false);
// function showModal() {modalVisible.value = true;}

const items = ref([{
  id: "1",
  name: "John",
  username: "john123",
  lastname: "Doe",
  description: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget fermentum " +
      "consectetur, ipsum nibh ultricies nunc, quis aliquam nisl nunc eu nisi. Sed vitae nisl euismod, " +
      "consectetur nisl id, aliquam nisl. Sed vitae nisl euismod, consectetur nisl id, aliquam nisl.",
  route: "Route A"
}, {
  id: "2",
  name: "Jane",
  username: "jane456",
  lastname: "Smith", description: "Brand B", route: "Route B"
}, {
  id: "3",
  name: "Mike",
  username: "mike789",
  lastname: "Johnson",
  description: "Brand C",
  route: "Route C"
}, {
  id: "4", name: "Sarah",
  username: "sarah321",
  lastname: "Williams",
  description: "Brand D",
  route: "Route D"
}, {
  id: "5",
  name: "David",
  username: "david654",
  lastname: "Brown",
  description: "Brand E",
  route: "Route E"
}, {
  id: "6",
  name: "Emily",
  username: "emily987",
  lastname: "Taylor",
  description: "Brand F " +
      "lore",
  route: "Route F"
},
  {
    id: "7",
    name: "Chris",
    username: "chris123",
    lastname: "Anderson",
    description: "Brand G",
    route: "Route G"
  },
  {
    id: "8",
    name: "Lisa",
    username: "lisa456",
    lastname: "Martinez",
    description: "Brand H",
    route: "Route H"
  },
  {
    id: "9",
    name: "Alex",
    username: "alex789",
    lastname: "Garcia",
    description: "Brand I",
    route: "Route I"
  },
  {
    id: "10",
    name: "Olivia",
    username: "olivia321",
    lastname: "Lee",
    description: "Brand J",
    route: "Route J"
  },
  {
    id: "11",
    name: "Daniel",
    username: "daniel654",
    lastname: "Harris",
    description: "Brand K",
    route: "Route K"
  },
  {
    id: "12",
    name: "Sophia",
    username: "sophia987",
    lastname: "Clark",
    description: "Brand L",
    route: "Route L"
  },
  {
    id: "13",
    name: "Andrew",
    username: "andrew123",
    lastname: "Lewis",
    description: "Brand M",
    route: "Route M"
  },
  {
    id: "14",
    name: "Mia",
    username: "mia456",
    lastname: "Young",
    description: "Brand N",
    route: "Route N"
  },
  {
    id: "15",
    name: "Ethan",
    username: "ethan789",
    lastname: "Walker",
    description: "Brand O",
    route: "Route O"
  },
  {
    id: "16",
    name: "Ava",
    username: "ava321",
    lastname: "Hall",
    description: "Brand P",
    route: "Route P"
  },
  {
    id: "17",
    name: "Matthew",
    username: "matthew654",
    lastname: "Allen",
    description: "Brand Q",
    route: "Route Q"
  },
  {
    id: "18",
    name: "Isabella",
    username: "isabella987",
    lastname: "King",
    description: "Brand R",
    route: "Route R"
  },
  {
    id: "19",
    name: "Ryan",
    username: "ryan123",
    lastname: "Wright",
    description: "Brand S",
    route: "Route S"
  },
  {
    id: "20",
    name: "Grace",
    username: "grace456",
    lastname: "Lopez",
    description: "Brand T",
    route: "Route T"
  },
  {
    id: "21",
    name: "Nathan",
    username: "nathan789",
    lastname: "Scott",
    description: "Brand U",
    route: "Route U"
  },
  {
    id: "22",
    name: "Chloe",
    username: "chloe321",
    lastname: "Green",
    description: "Brand V",
    route: "Route V"
  },
  {
    id: "23",
    name: "Samuel",
    username: "samuel654",
    lastname: "Baker",
    description: "Brand W",
    route: "Route W"
  },
  {
    id: "24",
    name: "Zoe",
    username: "zoe987",
    lastname: "Hill",
    description: "Brand X",
    route: "Route X"
  },
  {
    id: "25",
    name: "Christopher",
    username: "christopher123",
    lastname: "Adams",
    description: "Brand Y",
    route: "Route Y"
  },
  {
    id: "26",
    name: "Penelope",
    username: "penelope456",
    lastname: "Parker",
    description: "Brand Z",
    route: "Route Z"
  },
  {
    id: "27",
    name: "Hannah",
    username: "hannah789",
    lastname: "Morris",
    description: "Brand AA",
    route: "Route AA"
  },
  {
    id: "28",
    name: "Joseph",
    username: "joseph321",
    lastname: "Turner",
    description: "Brand BB",
    route: "Route BB"
  },
  {
    id: "29",
    name: "Victoria",
    username: "victoria654",
    lastname: "Roberts",
    description: "Brand CC",
    route: "Route CC"
  },
  {
    id: "30",
    name: "Anthony",
    username: "anthony987",
    lastname: "Carter",
    description: "Brand DD",
    route: "Route DD"
  }
])
const iteamsMange = [];

const paginator = ref({
  currentPage: 1,
  itemsPerPage: 12,
})

const search = ref('');

const filterItem = computed(() => {
  return items.value.filter((item) => {
    return item.name.toLowerCase().includes(search.value.toLowerCase());
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
</script>

<template>
  <div>
    <h1 class="h1 text-primary fw-bold">Proveedores</h1>

    <div class="d-md-flex justify-content-between w-100 mb-3">
      <div class="">
        <label class="h4 fw-bold">Buscar proveedor</label>
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Buscar proveedor" aria-label="Buscar proveedor"
                 v-model="search">
          <button class="btn btn-primary text-secondary" type="button" >Buscar</button>
        </div>
      </div>
      <div class="d-flex align-items-end justify-content-end mt-2 mt-md-0">
        <button class="btn btn-primary text-secondary w-100" type="button" data-bs-toggle="modal" data-bs-target="#addProviderModal" >Agregar proveedor</button>
      </div>
    </div>

    <div v-if="paginatedCards.length > 0">
      <main class="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-2 g-lg-3">
        <div v-for="card in paginatedCards" :key="card.id">
          <div class="col">
            <div class="card itemList">
              <div class="card-body">
                <div class="d-flex justify-content-center">
                  <img src="https://via.placeholder.com/120" class="img-fluid" alt="...">
                </div>
                <p class="card-text mt-1 m-0 fw-semibold" style="height: auto">{{ card.name + " " + card.lastname }}</p>
                <span class="card-text mt-2 fw-medium ">Descripción: </span>
                <p class="card-text m-0 p-0 text-truncate">{{ card.description }}</p>
                <div class="d-flex justify-content-center mt-2">
                  <button class="btn btn-primary text-secondary w-100" type="button">Ver proveedor</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--      <div v-for="i in 10" :key="i" class="col">
                <div class="card" aria-hidden="true">
                  <div class="card-body">
                    <div class="placeholder-glow d-flex justify-content-center">
                      <img class="placeholder img-fluid" width="120" height="120" alt=".." src="#"/>
                    </div>
                  </div>
                  <p class="card-text mt-1 ms-3 placeholder-glow">
                    <span class="placeholder col-8"></span>
                  </p>
                  <div class="d-flex justify-content-center m-3">
                    <button class="btn btn-primary text-secondary w-100 placeholder disabled" type="button"
                            aria-disabled="true"></button>
                  </div>
                </div>
              </div>-->
      </main>
    </div>
    <div v-else>
      <div class="text-center mt-5">
        <img src="@/assets/images/tite.png" alt="not found" class="img-fluid" width="150">
        <h3 class="text-primary fw-bold">No se encontraron resultados</h3>
      </div>
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

    <AddProviderUser/>

  </div>
</template>

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