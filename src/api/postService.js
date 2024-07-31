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
