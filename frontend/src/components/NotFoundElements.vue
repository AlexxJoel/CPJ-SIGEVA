<template>
  <div class="text-center mt-5">
    <img src="@/assets/images/tite.png" alt="not found" class="img-fluid" width="150">
    <h3 class="text-primary fw-bold">{{ message }}</h3>
  </div>
</template>

<script setup lang="ts">
defineProps({
  message: {
    type: String,
    default: 'No se encontraron resultados'
  }
})
</script>


<style scoped>

</style>