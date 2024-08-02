<template>
   <div class="p-10 max-w-6xl mx-auto h-screen">
      <h1 class="text-2xl font-bold mb-4">Créer un Nouvel Article</h1>
      <form @submit.prevent="handleSubmit" class="space-y-4">
         <div>
            <label for="title" class="block font-bold">Titre:</label>
            <input
               type="text"
               id="title"
               v-model="title"
               required
               class="border p-2 w-full"
            />
         </div>
         <div>
            <label for="content" class="block font-bold">Contenu:</label>
            <textarea
               id="content"
               v-model="content"
               required
               class="border p-2 w-full h-[70vh]"
            ></textarea>
         </div>
         <button type="submit" class="bg-blue-500 text-white p-2 rounded">
            Publier
         </button>
      </form>
      <div v-if="error" class="mt-4 p-2 bg-red-200 text-red-800 rounded">
         {{ error }}
      </div>
      <div v-if="success" class="mt-4 p-2 bg-green-200 text-green-800 rounded">
         Article créé avec succès !
      </div>
   </div>
</template>

<script>
import { createPost } from "@/api/postService";
import { supabase } from "@/supabase";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
   setup() {
      const title = ref("");
      const content = ref("");
      const error = ref(null);
      const success = ref(false);
      const router = useRouter();

      const handleSubmit = async () => {
         try {
            const {
               data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
               throw new Error("L'utilisateur n'est pas authentifié.");
            }

            const post = {
               title: title.value,
               content: content.value,
               user_id: user.id,
               created_at: new Date().toISOString(),
            };

            await createPost(post);
            success.value = true;
            router.push("/dashboard");
         } catch (error) {
            console.error("Erreur lors de la création de l'article :", error);
            error.value = "Erreur lors de la création de l'article.";
         }
      };

      return {
         title,
         content,
         error,
         success,
         handleSubmit,
      };
   },
};
</script>
