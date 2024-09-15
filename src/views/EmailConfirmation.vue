<template>
  <div class="p-10 max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Confirmation de l'Email</h1>
    <p v-if="loading">Vérification en cours...</p>
    <p v-else-if="error" class="text-red-500">{{ error }}</p>
    <p v-else class="text-green-500">Votre email a été confirmé avec succès!</p>
  </div>
</template>

<script>
import { supabase } from "@/supabase";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

export default {
  setup() {
    const loading = ref(true);
    const error = ref(null);
    const route = useRoute();

    const handleEmailConfirmation = async () => {
      try {
        const token = route.query.access_token;
        const type = route.query.type;

        if (type === "signup" && token) {
          const { error: confirmError } = await supabase.auth.verifyOTP({
            token,
            type: "signup",
          });

          if (confirmError) {
            error.value = `Erreur lors de la confirmation de l'email: ${confirmError.message}`;
          }
        } else {
          error.value = "Lien de confirmation invalide.";
        }
      } catch (err) {
        error.value = "Erreur lors de la confirmation de l'email.";
      } finally {
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
