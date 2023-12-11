<script setup lang="ts">
import type {TransactionHistory} from "@/modules/dashboard/dto/TransactionHistory";
import type {PropType} from "vue";

const props = defineProps({
  item: {
    type: Object as PropType<TransactionHistory>,
    required: true,
  },
});

</script>

<template>
  <div class="modal fade" id="historyProduct" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Lista de productos</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body">
          <div v-if="props.item?.products.length > 0">
            <div class="row">
              <div class="col-12">
                <div class="table-responsive">
                  <table class="table table-hover table-bordered">
                    <thead class="table-hover">
                    <tr>
                      <th scope="col">Nombre</th>
                      <th scope="col">Cantidad</th>
                      <th scope="col">Precio</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="product in props.item?.products" :key="product.id">
                      <td>{{ product.name }}</td>
                      <td>{{ product.quantitySold }}</td>
                      <td>{{ product.unitPrice }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>