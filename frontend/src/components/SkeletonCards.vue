<template>
  <div v-if="loading">
    <section class="row row-cols-2 row-cols-md-3  g-2 g-lg-30" :class="'row-cols-lg-'+ colLg">
      <div v-for="i in quantityCards" :key="i" class="col">
        <div class="card" aria-hidden="true">
          <div class="card-body">
            <div class="placeholder-glow d-flex justify-content-center">
              <img class="placeholder img-fluid" width="120" height="120" alt=".." src="#"/>
            </div>
          </div>
          <p class="card-text mt-1 ms-3 placeholder-glow mb-3">
            <span class="placeholder col-8"></span>
            <span class="placeholder col-11"></span>
          </p>
          <div v-if="showButton" class="d-flex justify-content-center m-3">
                      <button class="btn btn-primary text-secondary w-100 placeholder disabled" type="button"
                              aria-disabled="true"></button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">


defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  quantityCards: {
    type: Number,
    default: 12
  },
  quantityLines: {
    type: Number,
    default: 2
  },
  showButton: {
    type: Boolean,
    default: false
  },
  colLg: {
    type: Number,
    default: 6
  }
})

</script>

<style scoped>

</style>