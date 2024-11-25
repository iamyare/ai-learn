'use client'
import { useUserStore } from "@/stores/useUserStore"

export function usePdfUploadEnable() {
  const { user, countPdf } = useUserStore()
  if (!user) return false


  return countPdf <= user.user_subscription.subscription.max_pdf_uploads  
}