<template>
  <div class="p-10 mx-20" v-if="post">
    <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>
    <div class="flex gap-4">
      <p>
        <strong>Auteur: </strong>
        <span v-if="post.user">{{ post.user.username }}</span>
        <span v-else> Inconnu </span>
      </p>
      <p>
        <em>Posté le </em> {{ formatDate(post.created_at) }} <em> à </em>
        {{ formatTime(post.created_at) }}
      </p>
    </div>
    <!-- Contenu de l'article avec des styles adaptés pour les images -->
    <div
      class="my-4 p-4 text-justify post-content"
      v-html="sanitizedContent"
    ></div>
    <span class="block h-px bg-black mt-6"></span>

    <!-- Comment Section -->
    <CommentSection :comments="post.comments" :user="user" :postId="post.id" />
  </div>
  <div v-else class="p-20">
    <p>Chargement...</p>
  </div>
</template>

<script>
import { fetchPostById } from "@/api/postService";
import CommentSection from "@/components/CommentSection.vue";
import { supabase } from "@/supabase";
import DOMPurify from "dompurify";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

export default {
  components: {
    CommentSection,
  },
  setup() {
    const route = useRoute();
    const post = ref(null);
    const user = ref(null);

    const getPost = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        user.value = data.user;
        post.value = await fetchPostById(route.params.id);
        console.log("Post data:", post.value);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'article :", error);
      }
    };

    const sanitizedContent = computed(() => {
      if (!post.value) return "";
      return DOMPurify.sanitize(
        post.value.content
          .split("\n\n")
          .map((paragraph) =>
            paragraph
              .split("\n")
              .map((line) => (line.trim() ? `<p>${line}</p>` : "<br>"))
              .join("")
          )
          .join("<br>")
      );
    });

    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(dateString).toLocaleDateString("fr-FR", options);
    };

    const formatTime = (dateString) => {
      const options = { hour: "2-digit", minute: "2-digit" };
      return new Date(dateString).toLocaleTimeString("fr-FR", options);
    };

    onMounted(getPost);

    return {
      post,
      user,
      formatDate,
      formatTime,
      sanitizedContent,
    };
  },
};
</script>

<style>
/* Ajoute un style spécifique pour les images dans le contenu de l'article */
.post-content img {
  max-width: 20%;
  height: auto;
  margin: 30px 0; /* Ajoute de la marge autour des images */
  border-radius: 8px; /* Optionnel : Ajoute un léger arrondi aux images */
  display: block;
  margin-left: auto;
  margin-right: auto; /* Centre les images horizontalement */
}

/* Ajuste la taille maximale des images */
.post-content p {
  max-width: 100%;
  line-height: 1.8;
}

.post-content p {
  margin-bottom: 1rem; /* Ajoute un espacement entre les paragraphes */
}
</style>
