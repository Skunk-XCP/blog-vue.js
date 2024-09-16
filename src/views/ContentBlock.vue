<template>
  <div>
    <!-- Bloc de texte -->
    <div v-if="type === 'text'" class="border p-4">
      <p>{{ content }}</p>
    </div>

    <!-- Bloc d'image -->
    <div v-else-if="type === 'image'" class="border p-4">
      <img :src="content" alt="Image" class="w-full h-auto" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    content: String,
  },
};
</script>
