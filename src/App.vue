<template>
   <div id="app">
      <!-- N'afficher le Header que si on n'est pas sur la page de configuration du mot de passe -->
      <AppHeader v-if="shouldShowHeader" :isLoggedIn="isLoggedIn" />
      <router-view />
   </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
import { supabase } from "./supabase";

export default {
   components: {
      AppHeader,
   },
   setup() {
      const route = useRoute();
      const isLoggedIn = ref(false);

      // Condition pour afficher ou non le Header
      const shouldShowHeader = computed(() => {
         // Si on est sur la route "config-new-password", ne pas afficher le Header
         return route.name !== "ConfigNewPassword";
      });

      const checkAuthStatus = async () => {
         const { data, error } = await supabase.auth.getSession();
         if (error) {
            console.error("Error checking auth status:", error);
            return;
         }

         isLoggedIn.value = !!data?.session?.user;
      };

      onMounted(() => {
         checkAuthStatus();

         supabase.auth.onAuthStateChange((_event, session) => {
            isLoggedIn.value = !!session?.user;
         });
      });

      return {
         shouldShowHeader,
         isLoggedIn,
      };
   },
};
</script>
