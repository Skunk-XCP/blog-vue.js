<template>
   <div class="hello">
      <h1>Je suis le component HelloWorld</h1>
   </div>
</template>

<script>
export default {
   name: "HelloWorld",
   props: {
      msg: String,
   },
};
</script>

<style scoped></style>
