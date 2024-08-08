<template>
   <div class="p-10 max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Tableau de Bord</h1>
      <button
         @click="createNewPost"
         class="mb-6 bg-green-500 text-white p-2 rounded"
      >
         Créer un nouvel article
      </button>
      <div v-if="posts.length === 0">
         <p>Aucun article disponible.</p>
      </div>
      <div v-else>
         <div v-for="post in posts" :key="post.id" class="mb-10">
            <h2 class="text-2xl font-bold">{{ post.title }}</h2>
            <p>{{ post.content.substring(0, 100) }}...</p>
            <div class="flex space-x-4 mt-2">
               <button
                  @click="previewPost(post.id)"
                  class="bg-gray-500 text-white px-4 py-2 rounded"
               >
                  Aperçu
               </button>
               <button
                  @click="editPost(post.id)"
                  class="bg-blue-500 text-white px-4 py-2 rounded"
               >
                  Modifier
               </button>
               <button
                  @click="showDeleteConfirmation(post.id)"
                  class="bg-red-500 text-white px-4 py-2 rounded"
               >
                  Supprimer
               </button>
            </div>
         </div>
      </div>
      <AppModal
         v-if="isModalVisible"
         :isVisible="isModalVisible"
         message="Êtes-vous sûr de vouloir supprimer cet article ?"
         @confirm="confirmDelete"
         @cancel="cancelDelete"
      />
   </div>
</template>

<script>
import { deletePost, fetchPostsByUserId } from "@/api/postService";
import AppModal from "@/components/AppModal.vue";
import { supabase } from "@/supabase";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

export default {
   components: {
      AppModal,
   },
   setup() {
      const posts = ref([]);
      const error = ref(null);
      const router = useRouter();
      const isModalVisible = ref(false);
      const postIdToDelete = ref(null);

      const fetchPosts = async () => {
         try {
            const {
               data: { user },
            } = await supabase.auth.getUser();
            if (user) {
               posts.value = await fetchPostsByUserId(user.id);
            } else {
               router.push("/login");
            }
         } catch (err) {
            error.value = "Erreur lors de la récupération des articles.";
            console.error("Erreur lors de la récupération des articles :", err);
         }
      };

      const editPost = (postId) => {
         router.push(`/edit/${postId}`);
      };

      const createNewPost = () => {
         router.push("/create");
      };

      const previewPost = (postId) => {
         router.push(`/preview/${postId}`);
      };

      const showDeleteConfirmation = (postId) => {
         postIdToDelete.value = postId;
         isModalVisible.value = true;
      };

      const confirmDelete = async () => {
         try {
            await deletePost(postIdToDelete.value);
            posts.value = posts.value.filter(
               (post) => post.id !== postIdToDelete.value
            );
            isModalVisible.value = false;
            postIdToDelete.value = null;
         } catch (err) {
            console.error("Erreur lors de la suppression de l'article :", err);
         }
      };

      const cancelDelete = () => {
         isModalVisible.value = false;
         postIdToDelete.value = null;
      };

      onMounted(fetchPosts);

      return {
         posts,
         editPost,
         createNewPost,
         showDeleteConfirmation,
         confirmDelete,
         cancelDelete,
         isModalVisible,
         previewPost,
      };
   },
};
</script>
