<template>
   <div class="p-10 max-w-md mx-auto">
      <h1 class="text-3xl font-bold mb-6">Sign Up</h1>
      <form @submit.prevent="handleSignUp" class="space-y-4">
         <div>
            <label for="firstName" class="block font-bold">Prénom</label>
            <input
               type="text"
               id="firstName"
               v-model="firstName"
               required
               class="border p-2 w-full"
            />
         </div>
         <div>
            <label for="lastName" class="block font-bold">Nom</label>
            <input
               type="text"
               id="lastName"
               v-model="lastName"
               required
               class="border p-2 w-full"
            />
         </div>
         <div>
            <label for="email" class="block font-bold">Adresse Email:</label>
            <input
               type="email"
               id="email"
               v-model="email"
               required
               class="border p-2 w-full"
            />
         </div>
         <div>
            <label for="password" class="block font-bold">Mot de passe</label>
            <input
               type="password"
               id="password"
               v-model="password"
               required
               class="border p-2 w-full"
            />
         </div>
         <div>
            <label for="confirmPassword" class="block font-bold"
               >Confirmation du mot de passe:</label
            >
            <input
               type="password"
               id="confirmPassword"
               v-model="confirmPassword"
               required
               class="border p-2 w-full"
            />
         </div>
         <button type="submit" class="bg-green-500 text-white p-2 rounded">
            Sign Up
         </button>
      </form>
      <!-- Message d'erreur -->
      <div v-if="error" class="mt-4 p-2 bg-red-200 text-red-800 rounded">
         {{ error }}
      </div>
      <!-- Message de succès -->
      <div v-if="message" class="mt-4 p-2 bg-green-200 text-green-800 rounded">
         {{ message }}
      </div>
   </div>
</template>

<script>
import { supabase } from "@/supabase";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
   setup() {
      const firstName = ref("");
      const lastName = ref("");
      const email = ref("");
      const password = ref("");
      const confirmPassword = ref("");
      const error = ref(null);
      const message = ref(null);
      const router = useRouter();
      const bcrypt = require("bcryptjs");

      const handleSignUp = async () => {
         error.value = null;
         message.value = null;

         if (password.value !== confirmPassword.value) {
            error.value = "Passwords do not match.";
            return;
         }

         try {
            const { data, error: signUpError } = await supabase.auth.signUp(
               {
                  email: email.value,
                  password: password.value,
               },
               {
                  redirectTo: "http://localhost:8080/confirm-email",
               }
            );

            console.log("SignUp response:", data);

            if (signUpError) {
               if (signUpError.message.includes("Email rate limit exceeded")) {
                  error.value =
                     "Rate limit for email exceeded. Please try again later or use a different email address.";
               } else {
                  error.value = `Error signing up: ${signUpError.message}`;
               }
               throw signUpError;
            }

            const user = data.user;
            console.log("User signed up:", user);

            if (!user) {
               throw new Error("User is null after signUp.");
            }

            const hashedPassword = bcrypt.hashSync(password.value, 10); // Hachage du mot de passe

            const { error: profileError } = await supabase
               .from("users")
               .insert([
                  {
                     auth_id: user.id,
                     firstname: firstName.value,
                     lastname: lastName.value,
                     email: email.value,
                     password: hashedPassword, // Stockage du mot de passe haché
                  },
               ]);

            if (profileError) {
               console.error("Profile Error:", profileError);
               throw profileError;
            }

            message.value = "Sign up successful! Redirecting to login...";
            setTimeout(() => {
               router.push("/login");
            }, 2000);
         } catch (err) {
            console.error("SignUp Flow Error:", err);
            if (!error.value) {
               error.value = `Error signing up: ${err.message}`;
            }
         }
      };

      return {
         firstName,
         lastName,
         email,
         password,
         confirmPassword,
         error,
         message,
         handleSignUp,
      };
   },
};
</script>
