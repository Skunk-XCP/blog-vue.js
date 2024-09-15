import { supabase } from "@/supabase";

export const fetchPosts = async () => {
   const { data, error } = await supabase
      .from("posts")
      .select(
         `
     *,
     user: user_id (auth_id, username),
     comments (id, content, user: user_id (username))
   `
      )
      .order("created_at", { ascending: false });

   if (error) {
      console.error("Erreur lors de la récupération des articles :", error);
      throw error;
   }

   return data;
};

export const fetchPostsByUserId = async (userId) => {
   const { data, error } = await supabase
      .from("posts")
      .select(
         `
       *,
       comments (id, content, user: user_id (username))
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
         user: user_id (auth_id, username),
         comments (
            id,
            content,
            created_at,
            user: user_id (auth_id, username)
         )
      `
      )
      .eq("id", id)
      .order("created_at", { ascending: true })
      .single();

   if (error) {
      console.error(
         "Erreur lors de la récupération de l'article par ID :",
         error
      );
      throw error;
   }

   console.log("Data fetched by fetchPostById:", data); // Log des données
   return data;
};

export const createPost = async (post) => {
   const { data, error } = await supabase.from("posts").insert([post]);

   if (error) {
      console.error("Erreur lors de la création de l'article :", error);
      throw error;
   }

   return data;
};

export const updatePost = async (id, updates) => {
   const { data, error } = await supabase
      .from("posts")
      .update(updates)
      .eq("id", id)
      .select();

   if (error) {
      console.error("Erreur lors de la mise à jour de l'article :", error);
      throw error;
   }

   return data;
};

export const updateComment = async (commentId, updates) => {
   const { data, error } = await supabase
      .from("comments")
      .update(updates)
      .eq("id", commentId)
      .select();

   if (error) {
      throw error;
   }

   return data;
};

export const deletePost = async (postId) => {
   const { data, error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId)
      .select();

   if (error) {
      console.error("Erreur lors de la suppression de l'article :", error);
      throw error;
   }

   return data;
};

export const addComment = async ({ content, postId, userId }) => {
   try {
      const { data: insertData, error: insertError } = await supabase
         .from("comments")
         .insert([{ content, post_id: postId, user_id: userId }])
         .select();

      if (insertError) {
         console.error(
            "Erreur lors de l'insertion du commentaire :",
            insertError
         );
         throw insertError;
      }

      if (!insertData || insertData.length === 0) {
         throw new Error("Aucune donnée retournée après l'insertion.");
      }

      const commentId = insertData[0].id;

      const { data: commentData, error: fetchError } = await supabase
         .from("comments")
         .select(
            `
            id,
            content,
            created_at,
            user: user_id (auth_id, username)
         `
         )
         .eq("id", commentId)
         .single();

      if (fetchError) {
         console.error(
            "Erreur lors de la récupération du commentaire :",
            fetchError
         );
         throw fetchError;
      }

      return commentData;
   } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire :", error);
      throw error;
   }
};

export const deleteComment = async (commentId) => {
   const { data, error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

   if (error) {
      console.error("Erreur lors de la suppression du commentaire :", error);
      throw error;
   }

   return data;
};
