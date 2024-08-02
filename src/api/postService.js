import { supabase } from "@/supabase";

export const fetchPosts = async () => {
   const { data, error } = await supabase.from("posts").select(`
     *,
     user: user_id (auth_id, firstname, lastname),
     comments (id, content, user: user_id (firstname, lastname))
   `);

   if (error) {
      console.error("Erreur lors de la récupération des articles :", error);
      throw error;
   }

   console.log("Données récupérées :", data); // Ajoutez cette ligne pour voir les données récupérées
   return data;
};

export const fetchPostsByUserId = async (userId) => {
   const { data, error } = await supabase
      .from("posts")
      .select(
         `
       *,
       comments (id, content, user: user_id (firstname, lastname))
     `
      )
      .eq("user_id", userId);

   if (error) {
      console.error(
         "Erreur lors de la récupération des articles par utilisateur :",
         error
      );
      throw error;
   }

   return data;
};

export const fetchPostById = async (id) => {
   const { data, error } = await supabase
      .from("posts")
      .select(
         `
       *,
       user: user_id (auth_id, firstname, lastname),
       comments (id, content, user: user_id (firstname, lastname))
     `
      )
      .eq("id", id)
      .single();

   if (error) {
      console.error(
         "Erreur lors de la récupération de l'article par ID :",
         error
      );
      throw error;
   }

   return data;
};

export const updatePost = async (id, updates) => {
   const { data, error } = await supabase
      .from("posts")
      .update(updates)
      .eq("id", id);

   if (error) {
      console.error("Erreur lors de la mise à jour de l'article :", error);
      throw error;
   }

   return data;
};
