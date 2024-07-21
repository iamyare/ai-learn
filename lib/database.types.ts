export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          chat_id: string
          content: Json | null
          created_at: string
          message_id: string
          sender_type: string
        }
        Insert: {
          chat_id?: string
          content?: Json | null
          created_at?: string
          message_id?: string
          sender_type?: string
        }
        Update: {
          chat_id?: string
          content?: Json | null
          created_at?: string
          message_id?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["chat_id"]
          },
        ]
      }
      chats: {
        Row: {
          chat_id: string
          created_at: string
          notebook_id: string
          title: string | null
        }
        Insert: {
          chat_id?: string
          created_at?: string
          notebook_id: string
          title?: string | null
        }
        Update: {
          chat_id?: string
          created_at?: string
          notebook_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_notebook_id_fkey"
            columns: ["notebook_id"]
            isOneToOne: false
            referencedRelation: "notebooks"
            referencedColumns: ["notebook_id"]
          },
        ]
      }
      folders: {
        Row: {
          created_at: string
          folder_id: string
          folder_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          folder_id?: string
          folder_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          folder_id?: string
          folder_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "folders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      notebooks: {
        Row: {
          created_at: string
          folder_id: string
          notebook_id: string
          notebook_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          folder_id: string
          notebook_id?: string
          notebook_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          folder_id?: string
          notebook_id?: string
          notebook_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notebooks_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["folder_id"]
          },
        ]
      }
      pdf_documents: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: string
          notebook_id: string
          pdf_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size: string
          notebook_id: string
          pdf_id?: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: string
          notebook_id?: string
          pdf_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pdf_documents_notebook_id_fkey"
            columns: ["notebook_id"]
            isOneToOne: false
            referencedRelation: "notebooks"
            referencedColumns: ["notebook_id"]
          },
        ]
      }
      transcriptions: {
        Row: {
          content: Json
          created_at: string
          notebook_id: string
          transcription_id: string
        }
        Insert: {
          content: Json
          created_at?: string
          notebook_id: string
          transcription_id?: string
        }
        Update: {
          content?: Json
          created_at?: string
          notebook_id?: string
          transcription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transcriptions_notebook_id_fkey"
            columns: ["notebook_id"]
            isOneToOne: false
            referencedRelation: "notebooks"
            referencedColumns: ["notebook_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          updated_at?: string
          user_id?: string
          username: string
        }
        Update: {
          created_at?: string
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never