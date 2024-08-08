<template>
   <div class="p-10 ml-20">
      <h1 class="text-3xl font-bold mb-4">Prévisualisation de l'article</h1>
      <div v-if="post">
         <h2 class="text-2xl font-bold mb-4">{{ post.title }}</h2>
         <p class="mb-4">{{ post.content }}</p>
         <button
            @click="editPost(post.id)"
            class="bg-blue-500 text-white px-4 py-2 rounded"
         >
            Modifier
         </button>
      </div>
      <div v-else>
         <p>Chargement de l'article...</p>
      </div>
   </div>
</template>

<script>
import { fetchPostById } from "@/api/postService";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
   setup() {
      const route = useRoute();
      const router = useRouter();
      const post = ref(null);
      const error = ref(null);

      const fetchPost = async () => {
         try {
            post.value = await fetchPostById(route.params.id);
         } catch (err) {
            error.value = "Erreur lors de la récupération de l'article.";
            console.error("Erreur lors de la récupération de l'article :", err);
         }
      };

      const editPost = (postId) => {
         router.push(`/edit/${postId}`);
      };

      onMounted(fetchPost);

      return {
         post,
         error,
         editPost,
      };
   },
};
</script>
