<template>
  <div v-if="loading">
    <table class="table">
      <thead>
      <tr>
        <th scope="col" v-for="header in headersTable" :key="header.key">{{header.value}}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="index in quantityRows" :key="index">
        <td  v-for="tableCol in headersTable" :key="tableCol.key">
          <div class="placeholder-glow">
            <span class="placeholder col-8"></span>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  headersTable: {
    type: Array<{ key: string, value: string }>,
    required: true
  },
  quantityRows: {
    type: Number,
    default: 6
  }
})
</script>

<style scoped></style>