'use server'
import { supabase } from '@/lib/supabase'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { unstable_noStore as noStore } from 'next/cache'


export async function getUser () {
    const supabase = await createSupabaseServerClient()
    return await supabase.auth.getUser()
  }