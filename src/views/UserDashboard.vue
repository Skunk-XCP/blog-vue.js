<template>
   <div class="p-10 ml-20">
      <h1 class="text-3xl font-bold mb-4">Tableau de Bord</h1>

      <button
         @click="navigateToCreate"
         class="bg-green-500 text-white p-2 rounded mb-4"
      >
         Créer un nouvel article
      </button>

      <div v-if="posts.length === 0">
         <p>Vous n'avez pas encore d'articles. Créez votre premier article !</p>
      </div>
      <div v-else>
         <div v-for="post in posts" :key="post.id" class="mb-20">
            <h2 class="text-3xl font-bold">{{ post.title }}</h2>
            <p>{{ post.content.substring(0, 100) }}...</p>
            <button
               @click="editPost(post.id)"
               class="bg-blue-500 text-white p-2 rounded mr-2"
            >
               Modifier
            </button>
            <button
               @click="deletePost(post.id)"
               class="bg-red-500 text-white p-2 rounded"
            >
               Supprimer
            </button>
         </div>
      </div>
   </div>
</template>

<script>
import { fetchPosts } from "@/api/postService";
import { onMounted, ref } from "vue";
// ajouter deletePost à l'import vue-router
import { useRouter } from "vue-router";

export default {
   setup() {
      const posts = ref([]);
      const router = useRouter();

      const loadPosts = async () => {
         try {
            posts.value = await fetchPosts();
         } catch (error) {
            console.error("Error fetching posts:", error);
         }
      };

      const editPost = (id) => {
         router.push(`/edit/${id}`);
      };

      const navigateToCreate = () => {
         router.push("/create");
      };

      const deletePost = async (id) => {
         try {
            await deletePost(id);
            posts.value = posts.value.filter((post) => post.id !== id);
         } catch (error) {
            console.error("Error deleting post:", error);
         }
      };

      onMounted(loadPosts);

      return {
         posts,
         editPost,
         navigateToCreate,
         deletePost,
      };
   },
};
</script>
