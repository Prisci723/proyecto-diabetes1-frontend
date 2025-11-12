<template>
  <div id="app">
    <router-view></router-view>
  </div>
  <!-- <Login/> -->
</template>

<script>
export default {
  name: 'App'
}
import Login from './components/Login.vue';
import PaginaInicio from './components/PaginaInicio.vue';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>