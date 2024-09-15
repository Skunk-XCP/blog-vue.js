<template>
  <div class="p-10 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-4">Login</h1>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label for="email" class="block font-bold">Email:</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          class="border p-2 w-full"
        />
      </div>
      <div>
        <label for="password" class="block font-bold">Password:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          class="border p-2 w-full"
        />
      </div>
      <div class="flex justify-between">
        <button type="submit" class="bg-blue-500 text-white p-2 rounded">
          Login
        </button>
        <div class="mt-4">
          <router-link
            to="/reset-password"
            class="text-blue-500 hover:underline"
          >
            Mot de passe oublié ?
          </router-link>
        </div>
      </div>
    </form>

    <div v-if="error" class="mt-4 p-2 bg-red-200 text-red-800 rounded">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {};
</script>
