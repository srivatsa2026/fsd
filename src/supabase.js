import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
console.log("tje api key is ", supabaseUrl);
if (!supabaseUrl || !supabaseKey) {
  throw new Error("supabaseUrl and supabaseKey are required.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
