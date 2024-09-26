<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white p-4 rounded shadow-lg">
      <p>{{ message }}</p>
      <div class="flex justify-end mt-4">
        <button
          @click="$emit('cancel')"
          class="text-black px-4 py-2 mr-2 font-bold"
        >
          Annuler
        </button>
        <button
          @click="$emit('confirm')"
          class="text-red-500 px-4 py-2 font-bold"
        >
          Confirmer
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
};
</script>
