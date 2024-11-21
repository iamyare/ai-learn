import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateNotebook, deleteNotebook } from '@/actions'
import { toast } from '@/components/ui/use-toast'

export function useNotebookMutations() {
  const queryClient = useQueryClient()

  const updateNotebookMutation = useMutation({
    mutationFn: async ({ notebookData, notebookId }: {
      notebookData: Partial<Notebook>,
      notebookId: string
    }) => {
      const { notebook, errorNotebook } = await updateNotebook({
        notebookData,
        notebookId
      })
      if (errorNotebook) throw new Error(errorNotebook.message)
      return notebook
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo actualizar el notebook',
        variant: 'destructive'
      })
    }
  })

  const deleteNotebookMutation = useMutation({
    mutationFn: async (notebookId: string) => {
      const { error } = await deleteNotebook({ notebookId })
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] })
      toast({
        title: 'Éxito',
        description: 'Notebook eliminado correctamente'
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo eliminar el notebook',
        variant: 'destructive'
      })
    }
  })

  return {
    updateNotebookMutation,
    deleteNotebookMutation
  }
}