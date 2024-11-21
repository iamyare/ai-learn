import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteFolder } from '@/actions'
import { toast } from '@/components/ui/use-toast'

export function useFolderMutations() {
  const queryClient = useQueryClient()

  const deleteFolderMutation = useMutation({
    mutationFn: async (folderId: string) => {
      const { error } = await deleteFolder({ folderId })
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] })
      toast({
        title: 'Éxito',
        description: 'Carpeta eliminada correctamente'
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo eliminar la carpeta',
        variant: 'destructive'
      })
    }
  })

  return {
    deleteFolderMutation
  }
}