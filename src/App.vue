<template>
   <div id="app">
      <AppHeader />
      <router-view />
   </div>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";

export default {
   components: {
      AppHeader,
   },
};
</script>

<style>
/* Ajoute ton style global ici si nécessaire */
</style>
