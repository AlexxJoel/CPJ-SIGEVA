<script setup lang="ts">

import AdminNavbar from "@/views/admin/component/AdminNavbar.vue";
</script>

<template>
  <div>
    <AdminNavbar/>
    <div class="mx-3 mx-md-5 mt-3">
      <router-view/>
    </div>
  </div>
</template>

<style scoped>

</style>