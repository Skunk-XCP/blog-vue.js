<template>
   <header class="bg-blue-500 text-white p-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold ml-8">Vue Blog</h1>
      <nav>
         <ul class="flex space-x-4 mr-8">
            <li>
               <router-link to="/" class="hover:underline">Home</router-link>
            </li>
            <li>
               <router-link to="/dashboard" class="hover:underline"
                  >Dashboard</router-link
               >
            </li>
         </ul>
      </nav>
   </header>
</template>

<script>
export default {
   name: "AppHeader",
};
</script>
