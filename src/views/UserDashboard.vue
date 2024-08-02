<template>
   <div class="p-10 max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Tableau de Bord</h1>
      <button
         @click="createNewPost"
         class="mb-6 bg-green-500 text-white p-2 rounded"
      >
         Créer un nouvel article
      </button>
      <div v-if="posts.length === 0">
         <p>No posts available.</p>
      </div>
      <div v-else>
         <div v-for="post in posts" :key="post.id" class="mb-10">
            <h2 class="text-2xl font-bold">{{ post.title }}</h2>
            <p>{{ post.content.substring(0, 100) }}...</p>
            <div class="flex space-x-4 mt-2">
               <button
                  @click="editPost(post.id)"
                  class="bg-blue-500 text-white px-4 py-2 rounded"
               >
                  Modifier
               </button>
               <button
                  @click="deletePost(post.id)"
                  class="bg-red-500 text-white px-4 py-2 rounded"
               >
                  Supprimer
               </button>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import { fetchPostsByUserId } from "@/api/postService";
import { supabase } from "@/supabase";
import { onMounted, ref } from "vue";
// ajouter deletePost à l'import vue-router
import { useRouter } from "vue-router";

export default {
   setup() {
      const posts = ref([]);
      const error = ref(null);
      const router = useRouter();

      const fetchPosts = async () => {
         try {
            const {
               data: { user },
            } = await supabase.auth.getUser();
            if (user) {
               console.log("Utilisateur connecté :", user);
               posts.value = await fetchPostsByUserId(user.id);
               console.log("Articles récupérés :", posts.value);
            } else {
               router.push("/login");
            }
         } catch (err) {
            error.value = "Erreur lors de la récupération des articles.";
            console.error("Erreur lors de la récupération des articles :", err);
         }
      };

      const editPost = (postId) => {
         router.push(`/edit/${postId}`);
      };

      onMounted(fetchPosts);

      return {
         posts,
         editPost,
      };
   },
};
</script>
