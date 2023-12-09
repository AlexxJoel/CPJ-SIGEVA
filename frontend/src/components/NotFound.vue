<template>
<div class="container">
  <div class="mt-5">
    <div id="notfound">
      <div class="notfound">
        <div class="notfound-404">
          <h3>Oops! Página no encontrada</h3>
          <h1><span>4</span><span>0</span><span>4</span></h1>
        </div>
        <h2>¡Oh no! El enlace que buscas ha decidido tomar un café. ¡Prueba con otro!
        </h2>

        <div >
          <router-link to="/" class="btn btn-primary text-secondary d-block">Volver al inicio</router-link>
        </div>

      </div>
    </div>

  </div>
</div>
</template>

<script setup >

</script>

<style scoped>
* {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

body {
  padding: 0;
  margin: 0;
}


.notfound {
  margin: auto;
  max-width: 520px;
  width: 100%;
  line-height: 1.4;
  text-align: center;
}

.notfound .notfound-404 {
  position: relative;
  height: 240px;

}

.notfound .notfound-404 h1 {
  font-family: 'Montserrat', sans-serif;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  font-size: 252px;
  font-weight: 900;
  margin: 0px;
  color: #262626;
  text-transform: uppercase;
  letter-spacing: -40px;
  margin-left: -20px;
}

.notfound .notfound-404 h1>span {
  text-shadow: -8px 0px 0px #fff;
}

.notfound .notfound-404 h3 {
  font-family: 'Cabin', sans-serif;
  position: relative;
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  color: #262626;
  margin: 0px;
  letter-spacing: 3px;
  padding-left: 6px;
}

.notfound h2 {
  font-family: 'Cabin', sans-serif;
  font-size: 20px;
  font-weight: 400;
  text-transform: uppercase;
  color: #000;
  margin-top: 0px;
  margin-bottom: 25px;
}

@media only screen and (max-width: 767px) {
  .notfound .notfound-404 {
    height: 200px;
  }
  .notfound .notfound-404 h1 {
    font-size: 200px;
  }
}

@media only screen and (max-width: 480px) {
  .notfound .notfound-404 {
    height: 162px;
  }
  .notfound .notfound-404 h1 {
    font-size: 162px;
    height: 150px;
    line-height: 162px;
  }
  .notfound h2 {
    font-size: 16px;
  }
}

</style>