<template>
  <div class="p-10 ml-20">
    <h1 class="text-3xl font-bold mb-4">Editer l'article</h1>

    <!-- Formulaire d'édition -->
    <form @submit.prevent="handleSubmit" class="space-y-4" v-if="post">
      <!-- Titre -->
      <div>
        <label for="title" class="block font-bold">Titre:</label>
        <input
          type="text"
          id="title"
          v-model="localPost.title"
          required
          class="border p-2 w-full"
        />
      </div>

      <!-- Zone de Contenu avec drag-and-drop pour modifier les blocs -->
      <draggable
        v-model="localPost.blocks"
        class="space-y-4"
        :key="localPost.blocks.length"
      >
        <template #item="{ element, index }">
          <div :key="element.id">
            <!-- Texte -->
            <div v-if="element.type === 'text'" class="block">
              <textarea
                v-model="element.content"
                placeholder="Modifier le texte..."
                class="border p-2 w-full"
              ></textarea>
              <button
                @click="removeBlock(index)"
                type="button"
                class="bg-red-500 text-white p-2 rounded mt-2"
              >
                Supprimer le texte
              </button>
            </div>

            <!-- Image -->
            <div v-else-if="element.type === 'image'" class="block relative">
              <input
                type="text"
                v-model="element.url"
                placeholder="URL de l'image"
                class="border p-2 w-full"
                @mouseover="hoveredImage = element.url"
                @mouseleave="hoveredImage = ''"
              />
              <button
                @click="removeBlock(index)"
                type="button"
                class="bg-red-500 text-white p-2 rounded mt-2"
              >
                Supprimer l'image
              </button>

              <!-- Preview de l'image au hover -->
              <div
                v-if="hoveredImage === element.url"
                class="absolute mt-2 p-1 border bg-white shadow-lg z-10"
              >
                <img
                  :src="element.url"
                  alt="Aperçu de l'image"
                  class="max-w-xs max-h-64"
                />
              </div>
            </div>
          </div>
        </template>
      </draggable>

      <!-- Bouton d'ajout de texte ou d'image -->
      <div class="flex justify-center mt-4">
        <button
          type="button"
          @click="showPopup = true"
          class="bg-gray-300 text-black p-2 rounded"
        >
          +
        </button>
      </div>

      <!-- Popup d'ajout d'élément -->
      <div
        v-if="showPopup"
        class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center"
      >
        <div class="bg-white p-4 rounded shadow-lg space-y-4">
          <h2>Ajouter un élément</h2>
          <button
            @click="addTextBlock"
            class="bg-blue-500 text-white p-2 rounded"
          >
            Ajouter du texte
          </button>
          <button
            @click="addImageBlock"
            class="bg-green-500 text-white p-2 rounded"
          >
            Ajouter une image
          </button>
          <button
            @click="showPopup = false"
            class="bg-gray-500 text-white p-2 rounded"
          >
            Fermer
          </button>
        </div>
      </div>

      <!-- Boutons de soumission et annulation -->
      <div class="flex space-x-4">
        <button type="submit" class="bg-blue-500 text-white p-2 rounded">
          Mettre à jour
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
      <p>Chargement de l'article...</p>
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
import draggable from "vuedraggable";

export default {
  components: { draggable },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const post = ref(null);
    const localPost = ref({ title: "", blocks: [] });
    const message = ref(null);
    const error = ref(null);
    const showPopup = ref(false);
    const hoveredImage = ref("");

    const fetchPost = async () => {
      try {
        post.value = await fetchPostById(route.params.id);
        localPost.value = {
          title: post.value.title,
          blocks: parseContent(post.value.content),
        };
      } catch (err) {
        error.value = "Erreur lors de la récupération de l'article.";
        console.error("Erreur lors de la récupération de l'article :", err);
      }
    };

    const handleSubmit = async () => {
      try {
        const postContent = localPost.value.blocks
          .map((block) => {
            if (block.type === "text") {
              return block.content;
            } else if (block.type === "image") {
              return `<img src="${block.url}" alt="Image">`;
            }
          })
          .join("\n");

        const updates = {
          title: localPost.value.title,
          content: postContent,
        };

        await updatePost(route.params.id, updates);
        message.value = "Article mis à jour avec succès !";
        setTimeout(() => {
          message.value = null;
          router.push("/");
        }, 2000);
      } catch (err) {
        error.value = "Erreur lors de la mise à jour de l'article.";
        console.error("Erreur lors de la mise à jour de l'article :", err);
      }
    };

    const cancelEdit = () => {
      router.push("/dashboard");
    };

    const addTextBlock = () => {
      localPost.value.blocks.push({
        id: Date.now(),
        type: "text",
        content: "",
      });
      showPopup.value = false;
    };

    const addImageBlock = () => {
      localPost.value.blocks.push({ id: Date.now(), type: "image", url: "" });
      showPopup.value = false;
    };

    const removeBlock = (index) => {
      localPost.value.blocks.splice(index, 1);
    };

    const parseContent = (content) => {
      const blocks = [];
      const parts = content.split("\n");
      parts.forEach((part) => {
        if (part.startsWith("<img")) {
          const url = part.match(/src="([^"]+)"/)[1];
          blocks.push({ id: Date.now(), type: "image", url });
        } else {
          blocks.push({ id: Date.now(), type: "text", content: part });
        }
      });
      return blocks;
    };

    onMounted(fetchPost);

    return {
      post,
      localPost,
      message,
      error,
      showPopup,
      hoveredImage,
      handleSubmit,
      cancelEdit,
      addTextBlock,
      addImageBlock,
      removeBlock,
    };
  },
};
</script>
