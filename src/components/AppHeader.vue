<template>
  <header class="bg-blue-500 text-white p-4 flex items-center justify-between">
    <h1 class="text-2xl font-bold">Vue Blog</h1>
    <nav>
      <ul class="flex space-x-4">
        <li>
          <router-link to="/" class="hover:underline">Home</router-link>
        </li>
        <li v-if="isLoggedIn">
          <router-link to="/dashboard" class="hover:underline"
            >Dashboard</router-link
          >
        </li>
        <li v-else>
          <router-link to="/signup" class="hover:underline"
            >Sign Up</router-link
          >
        </li>
        <li v-if="isLoggedIn">
          <button @click="handleLogout" class="hover:underline">Log Out</button>
        </li>
        <li v-else>
          <router-link to="/login" class="hover:underline">Log In</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { supabase } from "@/supabase";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

export default {
  props: {
    isLoggedIn: Boolean,
  },
  setup(props) {
    const router = useRouter();
    const localIsLoggedIn = ref(props.isLoggedIn);

    watch(
      () => props.isLoggedIn,
      (newValue) => {
        localIsLoggedIn.value = newValue;
      }
    );

    const handleLogout = async () => {
      await supabase.auth.signOut();
      localIsLoggedIn.value = false;
      router.push("/login");
    };

    return {
      localIsLoggedIn,
      handleLogout,
    };
  },
};
</script>
