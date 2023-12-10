<script setup lang="ts">
import EmployNavbar from "@/views/employ/component/EmployNavbar.vue";

</script>

<template>
  <div>
    <EmployNavbar/>
    <div class="mx-3 mx-md-5 mt-3">
      <router-view/>
    </div>
  </div>
</template>

<style scoped>

</style>