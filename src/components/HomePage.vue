<template>
   <div class="p-20">
      <h1 class="text-2xl font-bold mb-4">Home Page</h1>
      <div v-if="posts.length === 0">
         <p>Chargement des articles...</p>
      </div>
      <div v-else>
         <div v-for="post in posts" :key="post.id" class="post">
            <h2>{{ post.title }}</h2>
            <p class="mb-20">{{ post.content.substring(0, 100) }}...</p>
            <router-link :to="'/post/' + post.id" class="text-blue-500"
               >Read more</router-link
            >
            <p>
               <strong>Auteur: </strong>
               <span v-if="post.user">
                  {{ post.user.firstname }} {{ post.user.lastname }}
               </span>
               <span v-else> Inconnu </span>
            </p>
            <p>
               <em>Posté le:</em>
               {{ new Date(post.created_at).toLocaleString() }}
            </p>
         </div>
      </div>
   </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { supabase } from "../supabase";

export default {
   setup() {
      const posts = ref([]);

      const fetchPosts = async () => {
         let { data, error } = await supabase.from("posts").select(`
          *,
          user: user_id (id, firstname, lastname)
        `);

         if (error) {
            console.error("Error fetching posts:", error);
         } else {
            console.log("Fetched posts:", data);
            posts.value = data;
         }
      };

      onMounted(fetchPosts);

      return {
         posts,
      };
   },
};
</script>
