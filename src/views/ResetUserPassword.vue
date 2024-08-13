<template>
   <div class="p-10 max-w-md mx-auto">
      <h1 class="text-3xl font-bold mb-6">Réinitialiser le mot de passe</h1>
      <form @submit.prevent="handleResetPassword" class="space-y-4">
         <div>
            <label for="email" class="block font-bold">Adresse Email:</label>
            <input
               type="email"
               id="email"
               v-model="email"
               required
               class="border p-2 w-full"
            />
         </div>
         <button type="submit" class="bg-blue-500 text-white p-2 rounded">
            Envoyer le lien de réinitialisation
         </button>
      </form>
      <div v-if="error" class="mt-4 p-2 bg-red-200 text-red-800 rounded">
         {{ error }}
      </div>
      <div v-if="message" class="mt-4 p-2 bg-green-200 text-green-800 rounded">
         {{ message }}
      </div>
   </div>
</template>

<script>
import { supabase } from "@/supabase";
import { ref } from "vue";

export default {
   setup() {
      const email = ref("");
      const error = ref(null);
      const message = ref(null);

      const handleResetPassword = async () => {
         error.value = null;
         message.value = null;

         try {
            const { error: resetError } =
               await supabase.auth.resetPasswordForEmail(email.value, {
                  redirectTo: "http://localhost:8080/config-new-password",
               });

            if (resetError) {
               error.value =
                  "Erreur lors de l'envoi de l'email de réinitialisation.";
               return;
            }

            message.value =
               "Lien de réinitialisation envoyé! Vérifiez votre boîte de réception.";
         } catch (err) {
            error.value = "Erreur lors de la réinitialisation du mot de passe.";
         }
      };

      return {
         email,
         error,
         message,
         handleResetPassword,
      };
   },
};
</script>
