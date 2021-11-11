<template>
  <div id="app">
     <HomePage />
  </div>
</template>

<script>
import HomePage from './pages/HomePage.vue'
const {remote} = window.require('electron')

export default {
  name: 'App',
  components: {
    HomePage
  }
}
</script>

<style>
#app {

}
</style>
