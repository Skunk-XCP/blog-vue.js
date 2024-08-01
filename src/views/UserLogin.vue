<template>
   <div class="p-10 max-w-md mx-auto">
      <h1 class="text-2xl font-bold mb-4">Login</h1>
      <form @submit.prevent="handleLogin" class="space-y-4">
         <div>
            <label for="email" class="block font-bold">Email:</label>
            <input
               type="email"
               id="email"
               v-model="email"
               required
               class="border p-2 w-full"
            />
         </div>
         <div>
            <label for="password" class="block font-bold">Password:</label>
            <input
               type="password"
               id="password"
               v-model="password"
               required
               class="border p-2 w-full"
            />
         </div>
         <button type="submit" class="bg-blue-500 text-white p-2 rounded">
            Login
         </button>
      </form>
      <div v-if="error" class="mt-4 p-2 bg-red-200 text-red-800 rounded">
         {{ error }}
      </div>
   </div>
</template>

<script>
import { loginUser } from "@/api/authService"; // Import du service d'authentification
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
   setup() {
      const email = ref("");
      const password = ref("");
      const error = ref(null);
      const router = useRouter();

      const handleLogin = async () => {
         try {
            await loginUser(email.value, password.value); // Utilisation du service
            error.value = null;
            router.push("/dashboard");
         } catch (signInError) {
            error.value = "Échec de la connexion : " + signInError.message;
            console.error("Échec de la connexion :", signInError);
         }
      };

      return {
         email,
         password,
         error,
         handleLogin,
      };
   },
};
</script>
