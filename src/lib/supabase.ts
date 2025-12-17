import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          plan: 'trial' | 'free' | 'pro' | 'enterprise'
          trial_ends_at: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          plan?: 'trial' | 'free' | 'pro' | 'enterprise'
          trial_ends_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          plan?: 'trial' | 'free' | 'pro' | 'enterprise'
          trial_ends_at?: string | null
          created_at?: string
        }
      }
      workflows: {
        Row: {
          id: string
          user_id: string
          name: string
          config: any
          n8n_webhook_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          config: any
          n8n_webhook_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          config?: any
          n8n_webhook_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      api_connections: {
        Row: {
          id: string
          user_id: string
          api_name: string
          auth_data: any
          is_valid: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          api_name: string
          auth_data: any
          is_valid?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          api_name?: string
          auth_data?: any
          is_valid?: boolean
          created_at?: string
        }
      }
    }
  }
}
