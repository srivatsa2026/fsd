import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://acemzouekdsjbyzsxftg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZW16b3Vla2RzamJ5enN4ZnRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NjU2NDYsImV4cCI6MjA1ODE0MTY0Nn0.v0RVfg4YP4QdBoCPx1EnkKIxMIwaVU05YgJVtbWHBTE";

if (!supabaseUrl || !supabaseKey) {
  throw new Error('supabaseUrl and supabaseKey are required.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;  // <-- This should be a default export
