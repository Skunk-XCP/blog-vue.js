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
        <label for="username" class="block font-bold">Username</label>
        <input
          type="text"
          id="username"
          v-model="username"
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
import bcrypt from "bcryptjs"; // pour hasher les mots de passe
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    // Les champs d'inscription
    const firstName = ref("");
    const lastName = ref("");
    const username = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");

    // Gestion des messages d'erreur et de succès
    const error = ref(null);
    const message = ref(null);

    const router = useRouter();

    // Fonction qui gère l'inscription
    const handleSignUp = async () => {
      error.value = null;
      message.value = null;

      if (password.value !== confirmPassword.value) {
        error.value = "Les mots de passe ne correspondent pas.";
        return;
      }

      try {
        // Appelle Supabase pour l'inscription
        const { data, error: signUpError } = await supabase.auth.signUp(
          {
            email: email.value,
            password: password.value,
          },
          {
            redirectTo: "http://localhost:8080/confirm-email", // Redirection après confirmation
          }
        );

        if (signUpError) {
          error.value = `Erreur lors de l'inscription : ${signUpError.message}`;
          return;
        }

        // Récupère l'utilisateur nouvellement inscrit
        const user = data.user;

        if (!user) {
          throw new Error("L'utilisateur n'a pas pu être créé.");
        }

        // Montre un message pour que l'utilisateur vérifie son email
        message.value =
          "Un email de confirmation a été envoyé. Veuillez vérifier votre boîte de réception pour activer votre compte.";

        // Vérifie si l'email est confirmé toutes les 10 secondes
        const interval = setInterval(async () => {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.getSession();

          if (sessionError) {
            console.error(
              "Erreur lors de la récupération de la session :",
              sessionError
            );
            return;
          }

          if (sessionData?.session?.user?.email_confirmed_at) {
            // Insertion des données utilisateur dans la table 'users' après confirmation de l'email
            const hashedPassword = bcrypt.hashSync(password.value, 10);

            const { error: profileError } = await supabase
              .from("users")
              .insert([
                {
                  auth_id: user.id,
                  firstname: firstName.value,
                  lastname: lastName.value,
                  username: username.value,
                  email: email.value,
                  password: hashedPassword, // On stocke le mot de passe haché
                },
              ]);

            if (profileError) {
              console.error(
                "Erreur lors de l'insertion du profil :",
                profileError
              );
            } else {
              message.value = "Inscription et confirmation d'email réussies !";
              clearInterval(interval);
              setTimeout(() => {
                router.push("/login");
              }, 2000);
            }
          }
        }, 10000); // Vérification toutes les 10 secondes
      } catch (err) {
        error.value = `Erreur lors de l'inscription : ${err.message}`;
      }
    };

    return {
      firstName,
      lastName,
      username,
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
