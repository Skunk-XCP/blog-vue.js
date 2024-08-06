<template>
   <div>
      <h3 class="font-bold text-2xl mt-4 mb-10">Commentaires</h3>

      <!-- Ajout de commentaire -->
      <div class="mb-4">
         <textarea
            v-if="user"
            v-model="newCommentContent"
            class="w-full border p-2"
            placeholder="Écrire un commentaire..."
         ></textarea>
         <p v-else class="text-gray-500 italic">
            Connectez-vous pour commenter
         </p>
         <button
            v-if="user"
            @click="submitComment"
            class="bg-blue-500 text-white p-2 rounded mt-2"
         >
            Publier
         </button>
      </div>

      <!-- Liste des commentaires -->
      <ul>
         <li v-for="comment in localComments" :key="comment.id">
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
                     <span v-if="comment.user">
                        {{ comment.user.firstname }} {{ comment.user.lastname }}
                     </span>
                     <span v-else> Inconnu </span>
                  </p>
                  <p>
                     <em>Posté le </em> {{ formatDate(comment.created_at) }}
                     <em> à </em> {{ formatTime(comment.created_at) }}
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
</template>

<script>
import { addComment, updateComment } from "@/api/postService";
import DOMPurify from "dompurify";
import { ref, watch } from "vue";

export default {
   props: {
      comments: {
         type: Array,
         required: true,
      },
      user: {
         type: Object,
         required: true,
      },
      postId: {
         type: String,
         required: true,
      },
   },
   setup(props) {
      const localComments = ref([...props.comments]);
      const editMode = ref({});
      const editContent = ref({});
      const newCommentContent = ref("");

      watch(
         () => props.comments,
         (newComments) => {
            localComments.value = [...newComments];
         }
      );

      const formatCommentContent = (content) => {
         return DOMPurify.sanitize(
            content
               .split("\n\n")
               .map((paragraph) =>
                  paragraph
                     .split("\n")
                     .map((line) => (line.trim() ? `<p>${line}</p>` : "<br>"))
                     .join("")
               )
               .join("<br>")
         );
      };

      const canEditComment = (comment) => {
         if (!props.user || !comment.user) {
            return false;
         }
         return comment.user.auth_id === props.user.id;
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
            const updatedComment = localComments.value.find(
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

      const submitComment = async () => {
         if (!newCommentContent.value.trim()) {
            alert("Le commentaire ne peut pas être vide.");
            return;
         }

         try {
            const newComment = await addComment({
               content: newCommentContent.value,
               postId: props.postId,
               userId: props.user.id,
            });
            console.log("Post ID reçu par le composant :", props.postId); // Debug

            localComments.value.push(newComment);
            newCommentContent.value = "";
         } catch (error) {
            console.error("Erreur lors de l'ajout du commentaire :", error);
            alert(
               `Erreur lors de l'ajout du commentaire : ${
                  error.message || error
               }`
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

      return {
         localComments,
         editMode,
         editContent,
         enableEdit,
         cancelEdit,
         saveEdit,
         canEditComment,
         formatCommentContent,
         formatDate,
         formatTime,
         newCommentContent,
         submitComment,
      };
   },
};
</script>
