<template>
   <div class="p-20" v-if="post">
      <h1 class="text-2xl font-bold mb-4">{{ post.title }}</h1>
      <p>{{ post.content }}</p>
      <p>
         <strong>Auteur: </strong>
         <span v-if="post.user">
            {{ post.user.firstname }} {{ post.user.lastname }}
         </span>
         <span v-else> Inconnu </span>
      </p>
      <p><em>Posté le:</em> {{ new Date(post.created_at).toLocaleString() }}</p>
      <h3>Commentaires</h3>
      <ul>
         <li v-for="comment in post.comments" :key="comment.id">
            <p>{{ comment.content }}</p>
            <p>
               <strong>Auteur:</strong>
               <span v-if="comment.user">
                  {{ comment.user.firstname }} {{ comment.user.lastname }}
               </span>
               <span v-else> Inconnu </span>
            </p>
            <p>
               <em>Posté le:</em>
               {{ new Date(comment.created_at).toLocaleString() }}
            </p>
         </li>
      </ul>
   </div>
   <div v-else class="p-20">
      <p>Chargement...</p>
   </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "../supabase";

export default {
   setup() {
      const route = useRoute();
      const post = ref(null);

      const fetchPost = async () => {
         const { data, error } = await supabase
            .from("posts")
            .select(
               `
            *,
            user: user_id (id, firstname, lastname),
            comments(*, user: user_id (id, firstname, lastname))
          `
            )
            .eq("id", route.params.id)
            .single();

         if (error) {
            console.error("Error fetching post:", error);
         } else {
            console.log("Fetched post:", data);
            post.value = data;
         }
      };

      onMounted(fetchPost);

      return {
         post,
      };
   },
};
</script>
