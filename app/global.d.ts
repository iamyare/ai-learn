import { type Database as DB } from '@/lib/database.types'

declare global {
  type Database = DB
  
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }

  type Folder = DB['public']['Tables']['folders']['Row']
  type FolderInsert = DB['public']['Tables']['folders']['Insert']
  type Notebook = DB['public']['Tables']['notebooks']['Row']
  type PDFDocuments = DB['public']['Tables']['pdf_documents']['Row']
  type NotebookInfo = Notebook & {pdf_document: PDFDocuments}

}
