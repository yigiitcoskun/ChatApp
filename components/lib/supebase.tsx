import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jwkqxgpkaeephrfxgtpe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3a3F4Z3BrYWVlcGhyZnhndHBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MDYzNzksImV4cCI6MjA0NjI4MjM3OX0.YV6L7zELM-CmNKOH1WzrHjF63k2arDDcY4_dcCxNQlA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})
