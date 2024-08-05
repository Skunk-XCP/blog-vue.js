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
               class="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
               Annuler
            </button>
            <button
               @click="$emit('confirm')"
               class="bg-red-500 text-white px-4 py-2 rounded"
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
