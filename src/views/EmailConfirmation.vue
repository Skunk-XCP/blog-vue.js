<template>
   <div class="p-10 max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Confirmation de l'Email</h1>
      <p v-if="loading">Vérification en cours...</p>
      <p v-else-if="error" class="text-red-500">{{ error }}</p>
      <p v-else class="text-green-500">
         Votre email a été confirmé avec succès!
      </p>
   </div>
</template>

<script>
import { supabase } from "@/supabase";
import { onMounted, ref } from "vue";

export default {
   setup() {
      const loading = ref(true);
      const error = ref(null);

      const handleEmailConfirmation = async () => {
         try {
            const { data: session, error: getSessionError } =
               await supabase.auth.getSession();
            if (getSessionError || !session) {
               error.value =
                  "Erreur lors de la récupération de la session utilisateur.";
               console.error("Error getting session:", getSessionError);
               loading.value = false;
               return;
            }

            const user = session.user;

            // Vérifiez si l'utilisateur existe dans la table `users`
            const { data, error: profileError } = await supabase
               .from("users")
               .select("*")
               .eq("auth_id", user.id)
               .single();

            if (profileError) {
               console.error("User profile not found:", profileError);

               // Insérez le profil utilisateur si non trouvé
               const { error: insertError } = await supabase
                  .from("users")
                  .insert([
                     {
                        auth_id: user.id,
                        first_name: user.user_metadata.first_name,
                        last_name: user.user_metadata.last_name,
                     },
                  ]);

               if (insertError) {
                  console.error("Error inserting user profile:", insertError);
                  error.value =
                     "Erreur lors de la création du profil utilisateur.";
               } else {
                  console.log("User profile created successfully.");
               }
            } else {
               console.log("User profile found:", data);
            }

            loading.value = false;
         } catch (err) {
            console.error("Erreur lors de la confirmation de l'email :", err);
            error.value = "Erreur lors de la confirmation de l'email.";
            loading.value = false;
         }
      };

      onMounted(() => {
         handleEmailConfirmation();
      });

      return {
         loading,
         error,
      };
   },
};
</script>
