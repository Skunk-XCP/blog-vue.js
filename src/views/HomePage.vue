<template>
   <div class="mx-20">
      <div class="flex justify-center p-10">
         <input
            type="text"
            v-model="searchQuery"
            placeholder="Rechercher des articles..."
            class="border p-2 w-72 mb-6"
         />
      </div>
      <div v-if="filteredPosts.length === 0">
         <p>Aucun article ne correspond à votre recherche.</p>
      </div>

      <div v-else>
         <div v-for="post in filteredPosts" :key="post.id" class="mb-20">
            <h2 class="text-3xl">
               <strong>{{ post.title }}</strong>
            </h2>
            <div class="flex gap-4">
               <p>
                  <strong>Auteur: </strong>
                  <span v-if="post.user">
                     {{ post.user.username }}
                  </span>
                  <span v-else> Inconnu </span>
               </p>
               <p>
                  <em>Posté le </em>
                  {{ formatDate(post.created_at) }}
                  <em> à </em>
                  {{ formatTime(post.created_at) }}
               </p>
            </div>
            <div class="my-4" v-html="formatExcerpt(post.content)"></div>

            <router-link :to="'/post/' + post.id" class="text-blue-500"
               >Lire l'article</router-link
            >
            <span class="block h-px bg-black mt-6"></span>
         </div>
      </div>
   </div>
</template>

<script>
import { fetchPosts } from "@/api/postService";
import { computed, onMounted, ref } from "vue";

export default {
   setup() {
      const posts = ref([]);
      const loading = ref(true);
      const searchQuery = ref("");

      const getPosts = async () => {
         try {
            posts.value = await fetchPosts();
         } catch (error) {
            console.error(
               "Erreur lors de la récupération des articles :",
               error
            );
         }
      };

      const filteredPosts = computed(() => {
         if (searchQuery.value.length < 3) {
            return posts.value;
         }
         return posts.value.filter((post) => {
            return post.title
               .toLowerCase()
               .includes(searchQuery.value.toLowerCase());
         });
      });

      const formatExcerpt = (content) => {
         const maxLength = 150;
         let excerpt = content.substring(0, maxLength);
         // Vérifier si le contenu original est plus long que l'extrait
         if (content.length > maxLength) {
            excerpt += "...";
         }
         return excerpt
            .split("\n")
            .map((line) => (line.trim() ? `<p>${line}</p>` : "<br>"))
            .join("");
      };

      const formatDate = (dateString) => {
         const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
         };
         return new Date(dateString).toLocaleDateString("fr-FR", options);
      };

      const formatTime = (dateString) => {
         const options = {
            hour: "2-digit",
            minute: "2-digit",
         };
         return new Date(dateString).toLocaleTimeString("fr-FR", options);
      };

      onMounted(getPosts);

      return {
         posts,
         searchQuery,
         filteredPosts,
         loading,
         formatDate,
         formatTime,
         formatExcerpt,
      };
   },
};
</script>
