import { type Database as DB } from '@/lib/database.types'

declare global {
  type Database = DB
  
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }

  type GetFoldersAndNotebooksFunction = DB['public']['Functions']['get_folders_and_notebooks']['Returns'][0]
  type GetFolderFunction = DB['public']['Functions']['get_folders']['Returns'][0]
  type SearchByName = DB['public']['Functions']['search_by_name']['Returns'][0]
  type User = DB['public']['Tables']['users']['Row']
  type UserUpdate = DB['public']['Tables']['users']['Update']
  type Folder = DB['public']['Tables']['folders']['Row']
  type FolderInsert = DB['public']['Tables']['folders']['Insert']
  type Notebook = DB['public']['Tables']['notebooks']['Row']
  type NotebookInsert = DB['public']['Tables']['notebooks']['Insert']
  type NotebookUpdate = DB['public']['Tables']['notebooks']['Update']
  type PDFDocuments = DB['public']['Tables']['pdf_documents']['Row']
  type PDFDocumentsInsert = DB['public']['Tables']['pdf_documents']['Insert']
  type NotebookInfo = Notebook & {pdf_document: PDFDocuments}
  type ApiKeys = DB['public']['Tables']['api_keys']['Row']
  type ApiKeysInsert = DB['public']['Tables']['api_keys']['Insert']
  type ApiKeysUpdate = DB['public']['Tables']['api_keys']['Update']

  type ViewType = 'grid' | 'list' | 'detail' | 'verticalGrid' | 'squareGrid';
  interface ViewProps {
    items: GetFoldersAndNotebooksFunction[];
    onItemClick: (item: GetFoldersAndNotebooksFunction) => void;
  }

  type FolderItem = {
    id: string;
    name: string;
    type: 'folder' | 'notebook';
    children?: FolderItem[];
  };

}
