<template>
   <header class="bg-blue-500 text-white p-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Vue Blog</h1>
      <nav>
         <ul class="flex space-x-4">
            <li>
               <router-link to="/" class="hover:underline">Home</router-link>
            </li>
            <li v-if="isLoggedIn">
               <router-link to="/dashboard" class="hover:underline"
                  >Dashboard</router-link
               >
            </li>
            <li v-else>
               <router-link to="/signin" class="hover:underline"
                  >Sign In</router-link
               >
            </li>
            <li v-if="isLoggedIn">
               <button @click="handleLogout" class="hover:underline">
                  Log Out
               </button>
            </li>
            <li v-else>
               <router-link to="/login" class="hover:underline"
                  >Log In</router-link
               >
            </li>
         </ul>
      </nav>
   </header>
</template>

<script>
import { supabase } from "@/supabase";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

export default {
   setup() {
      const router = useRouter();
      const isLoggedIn = ref(false);

      const checkUser = async () => {
         const {
            data: { user },
         } = await supabase.auth.getUser();
         isLoggedIn.value = user !== null;
      };

      const handleLogout = async () => {
         await supabase.auth.signOut();
         isLoggedIn.value = false;
         router.push("/login");
      };

      onMounted(checkUser);

      return {
         isLoggedIn,
         handleLogout,
      };
   },
};
</script>
