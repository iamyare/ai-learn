import { getNotebookInfo } from '@/actions'
import RenderView from './render'

export default async function Home(
  props: {
    params: Promise<{ notebook: string }>
  }
) {
  const params = await props.params;
  // const fileUrl = '/somefile.pdf'
  const { notebookInfo, errorNotebookInfo } = await getNotebookInfo({
    notebookId: params.notebook
  })

  if (errorNotebookInfo) {
    return <div>Error</div>
  }

  if (!notebookInfo) {
    return <div>No se eencontro nada</div>
  }

  return <RenderView initialNotebook={notebookInfo} />
}
