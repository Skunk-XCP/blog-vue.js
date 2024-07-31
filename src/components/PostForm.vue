<template>
   <form @submit.prevent="handleSubmit" class="space-y-4">
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
      <button type="submit" class="bg-blue-500 text-white p-2 rounded">
         {{ isEditMode ? "Update" : "Create" }} Post
      </button>
   </form>
</template>

<script>
import { updatePost } from "@/api/postService";
import { ref } from "vue";

export default {
   props: {
      post: {
         type: Object,
         default: () => ({ title: "", content: "" }),
      },
      isEditMode: {
         type: Boolean,
         default: false,
      },
   },
   emits: ["success", "error"],
   setup(props, { emit }) {
      const localPost = ref({ ...props.post });

      const handleSubmit = async () => {
         try {
            if (props.isEditMode) {
               await updatePost(props.post.id, localPost.value);
            }
            emit("success");
         } catch (err) {
            emit("error", err);
         }
      };

      return {
         localPost,
         handleSubmit,
      };
   },
};
</script>

<style scoped>
/* Ajoute des styles personnalisés ici si nécessaire */
</style>
