import {createClient} from "@supabase/supabase-js";

const supabaseUrl = 'your-supabase-project-url';
const supabaseAnonKey = 'your-supabase-anonKey';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
