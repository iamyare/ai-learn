import { getUserSession } from '@/actions/auth'
import { useQuery } from '@tanstack/react-query'

export const useSession = () => {
  return useQuery({
    queryKey: ['session'],
    queryFn: getUserSession,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

export const SESSION_KEY = ['session'] as const
