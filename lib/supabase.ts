import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type ApiKey = {
  id: string
  name: string
  key: string
  created_at: string
  last_used?: string
  is_active: boolean
  usage: number
  monthly_limit: number
  user_id?: string
} 