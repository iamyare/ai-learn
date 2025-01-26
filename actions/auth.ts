'use server'

import { supabase } from "@/lib/supabase"
import { createClient } from "@/lib/supabase/server"


export async function getUser() {
    const supabase = await createClient()
    return await supabase.auth.getUser()
  }
  
  export async function getUserSession() {
    const { data, error } = await getUser()
  
    if (error) {
      return { user: null, error }
    }
  
    const { data: user, error: errorUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single()

    return { data:user , error: errorUser }
  }