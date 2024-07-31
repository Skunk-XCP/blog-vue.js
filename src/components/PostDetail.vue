<template>
   <div class="p-10 ml-20" v-if="post">
      <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>

      <div class="flex gap-4">
         <p>
            <strong>Auteur: </strong>
            <span v-if="post.user">
               {{ post.user.firstname }} {{ post.user.lastname }}
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

      <p class="my-4">{{ post.content }}</p>

      <span class="block h-px bg-black mt-6"></span>
      <h3 class="font-bold text-2xl mt-4 mb-10">Commentaires</h3>
      <ul>
         <li v-for="comment in post.comments" :key="comment.id">
            <div class="border p-2 mb-3">
               <div class="flex gap-4 border p-2">
                  <p>
                     <strong>Auteur: </strong>
                     <span v-if="comment.user">
                        {{ comment.user.firstname }} {{ comment.user.lastname }}
                     </span>
                     <span v-else> Inconnu </span>
                  </p>
                  <p>
                     <em>Posté le </em>
                     {{ formatDate(comment.created_at) }}
                     <em> à </em>
                     {{ formatTime(comment.created_at) }}
                  </p>
               </div>

               <p class="my-4 ml-1">{{ comment.content }}</p>
            </div>
         </li>
      </ul>
   </div>
   <div v-else class="p-20">
      <p>Chargement...</p>
   </div>
</template>

<script>
import { fetchPostById } from "@/api/postService";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

export default {
   setup() {
      const route = useRoute();
      const post = ref(null);

      const getPosts = async () => {
         try {
            post.value = await fetchPostById(route.params.id);
         } catch (error) {
            console.error(error);
         }
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
         post,
         formatDate,
         formatTime,
      };
   },
};
</script>
