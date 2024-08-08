<template>
   <div class="p-10 ml-20">
      <h1 class="text-3xl font-bold mb-4">Edit Post</h1>

      <form @submit.prevent="handleSubmit" class="space-y-4" v-if="post">
         <div>
            <label for="title" class="block font-bold">Title:</label>
            <input
               type="text"
               id="title"
               v-model="localPost.title"
               required
               class="border p-2 w-full"
            />
         </div>
         <div>
            <label for="content" class="block font-bold">Content:</label>
            <textarea
               id="content"
               v-model="localPost.content"
               required
               class="border p-2 w-full h-40"
            ></textarea>
         </div>
         <div class="flex space-x-4">
            <button type="submit" class="bg-blue-500 text-white p-2 rounded">
               Update Post
            </button>
            <button
               type="button"
               @click="cancelEdit"
               class="bg-gray-500 text-white p-2 rounded"
            >
               Annuler
            </button>
         </div>
      </form>
      <div v-else>
         <p>Loading post...</p>
      </div>

      <!-- Message de succès -->
      <div v-if="message" class="mt-4 p-2 bg-green-200 text-green-800 rounded">
         {{ message }}
      </div>

      <!-- Message d'erreur -->
      <div v-if="error" class="mt-4 p-2 bg-red-200 text-red-800 rounded">
         {{ error }}
      </div>
   </div>
</template>

<script>
import { fetchPostById, updatePost } from "@/api/postService";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
   setup() {
      const route = useRoute();
      const router = useRouter();
      const post = ref(null);
      const localPost = ref({ title: "", content: "" });
      const message = ref(null);
      const error = ref(null);

      const fetchPost = async () => {
         try {
            post.value = await fetchPostById(route.params.id);
            localPost.value = {
               title: post.value.title,
               content: post.value.content,
            };
         } catch (err) {
            error.value = "Error fetching post.";
            console.error("Error fetching post:", err);
         }
      };

      const handleSubmit = async () => {
         try {
            const updates = {
               title: localPost.value.title,
               content: localPost.value.content,
            };
            const response = await updatePost(route.params.id, updates);
            console.log("Update response:", response);
            message.value = "Post updated successfully!";
            setTimeout(() => {
               message.value = null;
               router.push("/");
            }, 2000);
         } catch (err) {
            error.value = "Error updating post.";
            console.error("Error updating post:", err);
         }
      };

      const cancelEdit = () => {
         router.push("/dashboard");
      };

      onMounted(fetchPost);

      return {
         post,
         localPost,
         message,
         error,
         handleSubmit,
         cancelEdit,
      };
   },
};
</script>
