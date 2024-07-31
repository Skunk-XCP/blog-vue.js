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
            <em>Posté le</em>
            {{
               new Date(post.created_at).toLocaleString("fr-FR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
               })
            }}
            <em> à </em>
            {{
               new Date(post.created_at).toLocaleString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
               })
            }}
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
                     {{
                        new Date(post.created_at).toLocaleString("fr-FR", {
                           year: "numeric",
                           month: "2-digit",
                           day: "2-digit",
                        })
                     }}
                     <em> à </em>
                     {{
                        new Date(post.created_at).toLocaleString("fr-FR", {
                           hour: "2-digit",
                           minute: "2-digit",
                        })
                     }}
                  </p>
               </div>

               <p class="my-4">{{ comment.content }}</p>
            </div>
         </li>
      </ul>
   </div>
   <div v-else class="p-20">
      <p>Chargement...</p>
   </div>
</template>

<script>
import { onMounted, ref } from "vue";
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
