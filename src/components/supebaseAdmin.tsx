import {createClient} from "@supabase/supabase-js";

const supabaseUrl = 'your-supabase-project-url';
const supabaseAnonKey = 'your-supabase-project-anonKey';

export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey);
