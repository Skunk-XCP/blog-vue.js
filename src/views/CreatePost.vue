<template>
  <div class="p-10 max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Créer un Nouvel Article</h1>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Titre -->
      <div>
        <label for="title" class="block font-bold">Titre:</label>
        <input
          type="text"
          id="title"
          v-model="title"
          required
          class="border p-2 w-full"
        />
      </div>

      <!-- Zone de Contenu avec drag-and-drop -->
      <draggable v-model="blocks" class="space-y-4" :key="blocks.length">
        <template #item="{ element, index }">
          <div :key="element.id">
            <!-- Texte -->
            <div v-if="element.type === 'text'" class="block">
              <textarea
                v-model="element.content"
                placeholder="Ajouter du texte..."
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
            <div v-else-if="element.type === 'image'" class="flex flex-col">
              <input
                type="text"
                v-model="element.url"
                placeholder="URL de l'image"
                class="border p-2 w-1/4 mb-2"
                @mouseover="hoveredImage = element.url"
                @mouseleave="hoveredImage = ''"
              />
              <input
                type="file"
                @change="handleFileUpload($event, index)"
                accept="image/*"
                class="border p-2 w-1/4"
              />
              <button
                @click="removeBlock(index)"
                type="button"
                class="bg-red-500 text-white w-1/4 p-2 rounded mt-2"
              >
                Supprimer l'image
              </button>

              <!-- Aperçu de l'image au hover -->
              <div
                v-if="hoveredImage === element.url"
                class="absolute mt-2 p-1 border bg-white shadow-lg z-10"
                style="right: 45%"
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

      <!-- Bouton d'ajout -->
      <div class="flex justify-center mt-4">
        <button
          type="button"
          @click="showPopup = true"
          class="border-gray-300 bg-gray-100 border-4 text-gray-300 font-bold p-2 rounded w-12 h-12"
        >
          +
        </button>
      </div>

      <!-- Popup d'ajout -->
      <div
        v-if="showPopup"
        class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center"
      >
        <div class="bg-white p-4 rounded shadow-lg space-x-4 space-y-4">
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
            class="bg-red-500 text-white p-2 rounded"
          >
            Fermer
          </button>
        </div>
      </div>

      <!-- Bouton de soumission -->
      <button type="submit" class="bg-blue-500 text-white p-2 rounded mt-4">
        Publier
      </button>
    </form>

    <!-- Message d'erreur -->
    <div v-if="error" class="mt-4 p-2 bg-red-200 text-red-800 rounded">
      {{ error }}
    </div>

    <!-- Message de succès -->
    <div v-if="success" class="mt-4 p-2 bg-green-200 text-green-800 rounded">
      Article créé avec succès !
    </div>
  </div>
</template>

<script>
import { createPost } from "@/api/postService";
import { supabase } from "@/supabase";
import { ref } from "vue";
import { useRouter } from "vue-router";
import draggable from "vuedraggable";

export default {
  components: { draggable },
  setup() {
    const title = ref("");
    const blocks = ref([]);
    const showPopup = ref(false);
    const error = ref(null);
    const success = ref(false);
    const router = useRouter();
    const hoveredImage = ref(""); // Nouvelle variable pour le hover

    const addTextBlock = () => {
      blocks.value.push({ id: Date.now(), type: "text", content: "" });
      showPopup.value = false;
    };

    const addImageBlock = () => {
      blocks.value.push({ id: Date.now(), type: "image", url: "", file: null });
      showPopup.value = false;
    };

    const removeBlock = (index) => {
      blocks.value.splice(index, 1);
    };

    const handleFileUpload = (event, index) => {
      const file = event.target.files[0];
      if (file) {
        blocks.value[index].file = file;
      }
    };

    const handleSubmit = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Utilisateur non authentifié.");

        // Upload images to Supabase and get URLs
        for (let block of blocks.value) {
          if (block.type === "image" && block.file) {
            const { data, error: uploadError } = await supabase.storage
              .from("post-images")
              .upload(
                `public/${user.id}/${Date.now()}_${block.file.name}`,
                block.file
              );

            if (uploadError) {
              throw uploadError;
            }

            block.url = supabase.storage
              .from("post-images")
              .getPublicUrl(data.path).publicUrl;
          }
        }

        const postContent = blocks.value
          .map((block) => {
            if (block.type === "text") {
              return block.content;
            } else if (block.type === "image") {
              return `<img src="${block.url}" alt="Image">`;
            }
          })
          .join("\n");

        const post = {
          title: title.value,
          content: postContent,
          user_id: user.id,
          created_at: new Date().toISOString(),
        };

        await createPost(post);
        success.value = true;
        router.push("/dashboard");
      } catch (err) {
        error.value = "Erreur lors de la création de l'article.";
        console.error(err);
      }
    };

    return {
      title,
      blocks,
      showPopup,
      error,
      success,
      hoveredImage,
      addTextBlock,
      addImageBlock,
      removeBlock,
      handleSubmit,
      handleFileUpload,
    };
  },
};
</script>
