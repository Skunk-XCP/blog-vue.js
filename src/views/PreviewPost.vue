<template>
  <div class="p-10 ml-20">
    <h1 class="text-3xl font-bold mb-4">Prévisualisation de l'article</h1>
    <div v-if="post">
      <h2 class="text-2xl font-bold mb-4">{{ post.title }}</h2>
      <!-- Utilise v-html pour afficher le contenu avec des balises HTML -->
      <div class="post-content mb-4" v-html="post.content"></div>
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

<style>
/* Ajoute un style spécifique pour les images dans le contenu de l'article */
.post-content img {
  max-width: 20%;
  height: auto;
  margin: 30px 0;
  border-radius: 8px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

/* Ajuste la taille maximale des images */
.post-content p {
  max-width: 100%;
  line-height: 1.8;
}

.post-content p {
  margin-bottom: 1rem;
}
</style>
