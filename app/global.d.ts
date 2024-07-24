import { type Database as DB } from '@/lib/database.types'

declare global {
  type Database = DB
  
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }

  type GetFoldersAndNotebooksFunction = DB['public']['Functions']['get_folders_and_notebooks']['Returns'][0]
  type GetFolderFunction = DB['public']['Functions']['get_folders']['Returns'][0]
  type User = DB['public']['Tables']['users']['Row']
  type Folder = DB['public']['Tables']['folders']['Row']
  type FolderInsert = DB['public']['Tables']['folders']['Insert']
  type Notebook = DB['public']['Tables']['notebooks']['Row']
  type PDFDocuments = DB['public']['Tables']['pdf_documents']['Row']
  type NotebookInfo = Notebook & {pdf_document: PDFDocuments}

  type ViewType = 'grid' | 'list' | 'detail' | 'verticalGrid' | 'squareGrid';
  interface ViewProps {
    items: GetFoldersAndNotebooksFunction[];
    onItemClick: (item: GetFoldersAndNotebooksFunction) => void;
  }

}
