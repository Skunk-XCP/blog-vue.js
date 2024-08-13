<template>
   <div class="p-10 max-w-md mx-auto">
      <h1 class="text-3xl font-bold mb-6">Mettre à jour le mot de passe</h1>
      <form @submit.prevent="handleResetPassword" class="space-y-4">
         <div>
            <label for="newPassword" class="block font-bold"
               >Nouveau mot de passe:</label
            >
            <input
               type="password"
               id="newPassword"
               v-model="newPassword"
               required
               class="border p-2 w-full"
            />
         </div>
         <div>
            <label for="confirmPassword" class="block font-bold"
               >Confirmer le nouveau mot de passe:</label
            >
            <input
               type="password"
               id="confirmPassword"
               v-model="confirmPassword"
               required
               class="border p-2 w-full"
            />
         </div>
         <button type="submit" class="bg-green-500 text-white p-2 rounded">
            Mettre à jour le mot de passe
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
import { useRouter } from "vue-router";

export default {
   setup() {
      const newPassword = ref("");
      const confirmPassword = ref("");
      const error = ref(null);
      const message = ref(null);
      const router = useRouter();

      const handleResetPassword = async () => {
         error.value = null;
         message.value = null;

         if (newPassword.value !== confirmPassword.value) {
            error.value = "Les mots de passe ne correspondent pas.";
            return;
         }

         try {
            // Réinitialiser le mot de passe de l'utilisateur
            const { error: updateError } = await supabase.auth.updateUser({
               password: newPassword.value,
            });

            if (updateError) {
               error.value = "Erreur lors de la mise à jour du mot de passe.";
               return;
            }

            message.value =
               "Mot de passe mis à jour avec succès ! Vous allez être déconnecté(e).";

            // Déconnecter l'utilisateur après la mise à jour du mot de passe
            setTimeout(async () => {
               await supabase.auth.signOut();
               router.push("/login");
            }, 2000);
         } catch (err) {
            error.value = "Erreur lors de la mise à jour du mot de passe.";
         }
      };

      return {
         newPassword,
         confirmPassword,
         error,
         message,
         handleResetPassword,
      };
   },
};
</script>
