<template>
  <div v-if="loading">
    <div class="back">
      <div class="overlay">
        <div class="loader"></div>
      </div>
    </div>
  </div>

</template>

<script setup>


defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

</script>


<style scoped>

.back {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  top: 0;
  left: 0;
  position: absolute;

}
.overlay {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader {
  width: 70px;
  aspect-ratio: 1;
  position: absolute;
}


.loader:before,
.loader:after {
  content: "";
  position: absolute;
  border-radius: 50px;
  box-shadow: 0 0 0 3px inset var(--bs-primary);
  animation: l4 2.5s infinite;
}

.loader:after {
  animation-delay: -1.25s;
}

@keyframes l4 {
  0% {
    inset: 0 35px 35px 0;
  }
  12.5% {
    inset: 0 35px 0 0;
  }
  25% {
    inset: 35px 35px 0 0;
  }
  37.5% {
    inset: 35px 0 0 0;
  }
  50% {
    inset: 35px 0 0 35px;
  }
  62.5% {
    inset: 0 0 0 35px;
  }
  75% {
    inset: 0 0 35px 35px;
  }
  87.5% {
    inset: 0 0 35px 0;
  }
  100% {
    inset: 0 35px 35px 0;
  }
}
</style>

