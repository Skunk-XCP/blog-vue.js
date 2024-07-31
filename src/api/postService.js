import { supabase } from "@/supabase";

export const fetchPosts = async () => {
   const { data, error } = await supabase.from("posts").select(`
    *,
    user: user_id (id, firstname, lastname),
    comments(*, user: user_id (id, firstname, lastname))
  `);
   if (error) throw error;
   return data;
};

export const fetchPostById = async (id) => {
   const { data, error } = await supabase
      .from("posts")
      .select(
         `
      *,
      user: user_id (id, firstname, lastname),
      comments(*, user: user_id (id, firstname, lastname))
    `
      )
      .eq("id", id)
      .single();
   if (error) throw error;
   return data;
};

export const updatePost = async (id, updates) => {
   console.log("API updatePost:", id, updates);
   const { data, error } = await supabase
      .from("posts")
      .update(updates)
      .eq("id", id);
   if (error) {
      console.error("API updatePost error:", error);
      throw error;
   }
   console.log("API updatePost data:", data);
   return data;
};
