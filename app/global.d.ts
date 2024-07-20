import { type Database as DB } from '@/lib/database.types'

declare global {
  type Database = DB
  
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }



}
