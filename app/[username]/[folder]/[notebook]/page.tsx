import { getNotebookInfo } from "@/actions"
import RenderView from "./render"


export default async function Home({params}: {params: {notebook: string}}) {
  // const fileUrl = '/somefile.pdf'
  const {notebookInfo, errorNotebookInfo} = await getNotebookInfo({notebookId: params.notebook})



  if (errorNotebookInfo) {
    return <div>Error</div>
  }

  return (
    <RenderView fileUrl={notebookInfo?.pdf_documents.file_path ?? ''} />
  )
}
