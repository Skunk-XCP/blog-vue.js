<template>
   <header class="bg-blue-500 text-white p-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Vue Blog</h1>
      <nav>
         <ul class="flex space-x-4">
            <li>
               <router-link to="/" class="hover:underline">Home</router-link>
            </li>
            <li>
               <router-link to="/dashboard" class="hover:underline"
                  >Dashboard</router-link
               >
            </li>
            <li v-if="isLoggedIn">
               <button @click="handleLogout" class="hover:underline">
                  Logout
               </button>
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
