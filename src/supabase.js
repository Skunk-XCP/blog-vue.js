import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseKey = process.env.VUE_APP_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
   throw new Error("supabaseUrl and supabaseKey are required.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);