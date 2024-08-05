<template>
   <div class="p-10 ml-20" v-if="post">
      <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>
      <div class="flex gap-4">
         <p>
            <strong>Auteur: </strong>
            <span v-if="post.user"
               >{{ post.user.firstname }} {{ post.user.lastname }}</span
            >
            <span v-else> Inconnu </span>
         </p>
         <p>
            <em>Posté le </em>
            {{ formatDate(post.created_at) }}
            <em> à </em>
            {{ formatTime(post.created_at) }}
         </p>
      </div>
      <div class="my-4 p-4 text-justify" v-html="sanitizedContent"></div>
      <span class="block h-px bg-black mt-6"></span>
      <h3 class="font-bold text-2xl mt-4 mb-10">Commentaires</h3>
      <ul>
         <li v-for="comment in post.comments" :key="comment.id">
            <div
               class="border p-2 mb-3"
               :style="{
                  boxShadow: editMode[comment.id]
                     ? '0 0 10px rgba(0,0,0,0.3)'
                     : 'none',
                  transform: editMode[comment.id] ? 'scale(1.02)' : 'scale(1)',
               }"
            >
               <div class="flex gap-4 border p-2">
                  <p>
                     <strong>Auteur: </strong>
                     <span v-if="comment.user"
                        >{{ comment.user.firstname }}
                        {{ comment.user.lastname }}</span
                     >
                     <span v-else> Inconnu </span>
                  </p>
                  <p>
                     <em>Posté le </em>
                     {{ formatDate(comment.created_at) }}
                     <em> à </em>
                     {{ formatTime(comment.created_at) }}
                  </p>
               </div>
               <div v-if="editMode[comment.id]">
                  <textarea
                     v-model="editContent[comment.id]"
                     class="w-full border p-2"
                  ></textarea>
                  <button
                     @click="saveEdit(comment.id)"
                     class="bg-green-500 text-white p-2 rounded mt-2 mr-2"
                  >
                     Valider
                  </button>
                  <button
                     @click="cancelEdit(comment.id)"
                     class="bg-gray-500 text-white p-2 rounded mt-2"
                  >
                     Annuler
                  </button>
               </div>
               <div v-else>
                  <div
                     class="my-4 ml-1"
                     v-html="formatCommentContent(comment.content)"
                  ></div>
                  <button
                     v-if="canEditComment(comment)"
                     @click="enableEdit(comment.id, comment.content)"
                     class="text-blue-500"
                  >
                     Editer
                  </button>
               </div>
            </div>
         </li>
      </ul>
   </div>
   <div v-else class="p-20">
      <p>Chargement...</p>
   </div>
</template>

<script>
import { fetchPostById, updateComment } from "@/api/postService";
import { supabase } from "@/supabase";
import DOMPurify from "dompurify";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

export default {
   setup() {
      const route = useRoute();
      const post = ref(null);
      const user = ref(null);
      const editMode = ref({});
      const editContent = ref({});

      const getPost = async () => {
         try {
            const { data } = await supabase.auth.getUser();
            user.value = data.user;
            post.value = await fetchPostById(route.params.id);
            if (post.value && post.value.comments) {
               post.value.comments.forEach((comment) => {
                  editContent.value[comment.id] = comment.content;
               });
            }
         } catch (error) {
            console.error(
               "Erreur lors de la récupération de l'article :",
               error
            );
         }
      };

      const sanitizedContent = computed(() => {
         if (!post.value) return "";
         return DOMPurify.sanitize(
            post.value.content
               .split("\n\n")
               .map((paragraph) => `<p>${paragraph}</p>`)
               .join("")
         );
      });

      const formatCommentContent = (content) => {
         return DOMPurify.sanitize(
            content
               .split("\n\n")
               .map((paragraph) => `<p>${paragraph}</p>`)
               .join("")
         );
      };

      const canEditComment = (comment) => {
         return user.value && comment.user.auth_id === user.value.id;
      };

      const enableEdit = (commentId, content) => {
         editMode.value = { ...editMode.value, [commentId]: true };
         editContent.value = { ...editContent.value, [commentId]: content };
      };

      const cancelEdit = (commentId) => {
         editMode.value = { ...editMode.value, [commentId]: false };
      };

      const saveEdit = async (commentId) => {
         try {
            await updateComment(commentId, {
               content: editContent.value[commentId],
            });
            const updatedComment = post.value.comments.find(
               (comment) => comment.id === commentId
            );
            updatedComment.content = editContent.value[commentId];
            cancelEdit(commentId);
         } catch (error) {
            console.error(
               "Erreur lors de la mise à jour du commentaire :",
               error
            );
         }
      };

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
         editMode,
         editContent,
         enableEdit,
         cancelEdit,
         saveEdit,
         canEditComment,
         formatDate,
         formatTime,
         sanitizedContent,
         formatCommentContent,
      };
   },
};
</script>
