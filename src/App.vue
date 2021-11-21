<template>
  <div id="app">
     <!-- <HomePage /> -->
     <!-- <LoginPage/> -->
     <router-view></router-view>
  </div>
</template>

<script>
import HomePage from './pages/HomePage.vue'
import LoginPage from './pages/LoginPage.vue'

export default {
  name: 'App',
  components: {
    HomePage,
    LoginPage
  }
}
</script>

<style>
#app {

}
</style>
