export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published: boolean
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity: string | null
          entity_id: string | null
          id: string
          meta: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          meta?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          meta?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          amount: number | null
          budget: string | null
          company: string | null
          created_at: string
          currency: string
          email: string
          id: string
          message: string | null
          name: string
          notes: string | null
          phone: string | null
          preferred_date: string | null
          preferred_time: string | null
          reference: string | null
          reference_file: string | null
          service: string | null
          stage: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          budget?: string | null
          company?: string | null
          created_at?: string
          currency?: string
          email: string
          id?: string
          message?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          reference?: string | null
          reference_file?: string | null
          service?: string | null
          stage?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          budget?: string | null
          company?: string | null
          created_at?: string
          currency?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          reference?: string | null
          reference_file?: string | null
          service?: string | null
          stage?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      careers: {
        Row: {
          created_at: string
          department: string | null
          description: string | null
          employment_type: string | null
          id: string
          location: string | null
          published: boolean
          requirements: string | null
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          description?: string | null
          employment_type?: string | null
          id?: string
          location?: string | null
          published?: boolean
          requirements?: string | null
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          description?: string | null
          employment_type?: string | null
          id?: string
          location?: string | null
          published?: boolean
          requirements?: string | null
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_records: {
        Row: {
          brief_count: number
          company: string | null
          created_at: string
          email: string
          id: string
          industry: string | null
          instagram: string | null
          last_brief_at: string | null
          name: string | null
          notes: string | null
          phone: string | null
          role: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          brief_count?: number
          company?: string | null
          created_at?: string
          email: string
          id?: string
          industry?: string | null
          instagram?: string | null
          last_brief_at?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          brief_count?: number
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          industry?: string | null
          instagram?: string | null
          last_brief_at?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      deliverables: {
        Row: {
          booking_id: string
          created_at: string
          description: string | null
          id: string
          kind: string
          label: string
          released: boolean
          size_bytes: number | null
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          description?: string | null
          id?: string
          kind?: string
          label: string
          released?: boolean
          size_bytes?: number | null
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          description?: string | null
          id?: string
          kind?: string
          label?: string
          released?: boolean
          size_bytes?: number | null
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliverables_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string
          created_at: string
          id: string
          published: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string
          id?: string
          published?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          id?: string
          published?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      industries: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          published: boolean
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          published?: boolean
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          published?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          booking_id: string | null
          client_email: string
          client_name: string
          created_at: string
          currency: string
          description: string | null
          due_at: string | null
          id: string
          issued_at: string
          line_items: Json
          notes: string | null
          number: string
          paid_at: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number
          booking_id?: string | null
          client_email: string
          client_name: string
          created_at?: string
          currency?: string
          description?: string | null
          due_at?: string | null
          id?: string
          issued_at?: string
          line_items?: Json
          notes?: string | null
          number: string
          paid_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          client_email?: string
          client_name?: string
          created_at?: string
          currency?: string
          description?: string | null
          due_at?: string | null
          id?: string
          issued_at?: string
          line_items?: Json
          notes?: string | null
          number?: string
          paid_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          budget: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          notes: string | null
          phone: string | null
          service: string | null
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          budget?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          service?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          budget?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          service?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          created_at: string
          folder: string | null
          id: string
          mime_type: string | null
          name: string | null
          size_bytes: number | null
          tags: string[]
          url: string
        }
        Insert: {
          created_at?: string
          folder?: string | null
          id?: string
          mime_type?: string | null
          name?: string | null
          size_bytes?: number | null
          tags?: string[]
          url: string
        }
        Update: {
          created_at?: string
          folder?: string | null
          id?: string
          mime_type?: string | null
          name?: string | null
          size_bytes?: number | null
          tags?: string[]
          url?: string
        }
        Relationships: []
      }
      nav_links: {
        Row: {
          group_name: string | null
          href: string
          id: string
          label: string
          location: string
          published: boolean
          sort_order: number
        }
        Insert: {
          group_name?: string | null
          href: string
          id?: string
          label: string
          location?: string
          published?: boolean
          sort_order?: number
        }
        Update: {
          group_name?: string | null
          href?: string
          id?: string
          label?: string
          location?: string
          published?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      portfolio_images: {
        Row: {
          active: boolean
          blur_data: string | null
          category: string
          created_at: string
          featured: boolean
          focal_x: number
          focal_y: number
          height: number | null
          hero: boolean
          hero_order: number
          homepage: boolean
          id: string
          in_portfolio: boolean
          marketing_uses: string[]
          orientation: string
          original_filename: string | null
          priority: string
          project_id: string | null
          project_type: string
          quality_score: number
          sort_order: number
          tags: string[]
          thumb_url: string | null
          title: string
          updated_at: string
          url: string
          width: number | null
        }
        Insert: {
          active?: boolean
          blur_data?: string | null
          category?: string
          created_at?: string
          featured?: boolean
          focal_x?: number
          focal_y?: number
          height?: number | null
          hero?: boolean
          hero_order?: number
          homepage?: boolean
          id?: string
          in_portfolio?: boolean
          marketing_uses?: string[]
          orientation?: string
          original_filename?: string | null
          priority?: string
          project_id?: string | null
          project_type?: string
          quality_score?: number
          sort_order?: number
          tags?: string[]
          thumb_url?: string | null
          title?: string
          updated_at?: string
          url: string
          width?: number | null
        }
        Update: {
          active?: boolean
          blur_data?: string | null
          category?: string
          created_at?: string
          featured?: boolean
          focal_x?: number
          focal_y?: number
          height?: number | null
          hero?: boolean
          hero_order?: number
          homepage?: boolean
          id?: string
          in_portfolio?: boolean
          marketing_uses?: string[]
          orientation?: string
          original_filename?: string | null
          priority?: string
          project_id?: string | null
          project_type?: string
          quality_score?: number
          sort_order?: number
          tags?: string[]
          thumb_url?: string | null
          title?: string
          updated_at?: string
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      project_briefs: {
        Row: {
          brand: string | null
          budget: string | null
          capabilities: string[]
          category: string
          client_id: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          industry: string | null
          instagram: string | null
          internal_notes: string | null
          last_contacted_at: string | null
          location: string | null
          name: string
          objective: string | null
          phone: string | null
          production_date: string | null
          project_id: string
          project_types: string[]
          recommended: string[]
          reference_file: string | null
          role: string | null
          size: Database["public"]["Enums"]["project_size"]
          source: string | null
          stage: Database["public"]["Enums"]["project_stage"]
          summary: string | null
          timeline: string | null
          updated_at: string
          user_id: string | null
          website: string | null
          workflow: string
        }
        Insert: {
          brand?: string | null
          budget?: string | null
          capabilities?: string[]
          category?: string
          client_id?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          industry?: string | null
          instagram?: string | null
          internal_notes?: string | null
          last_contacted_at?: string | null
          location?: string | null
          name: string
          objective?: string | null
          phone?: string | null
          production_date?: string | null
          project_id: string
          project_types?: string[]
          recommended?: string[]
          reference_file?: string | null
          role?: string | null
          size?: Database["public"]["Enums"]["project_size"]
          source?: string | null
          stage?: Database["public"]["Enums"]["project_stage"]
          summary?: string | null
          timeline?: string | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
          workflow?: string
        }
        Update: {
          brand?: string | null
          budget?: string | null
          capabilities?: string[]
          category?: string
          client_id?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          industry?: string | null
          instagram?: string | null
          internal_notes?: string | null
          last_contacted_at?: string | null
          location?: string | null
          name?: string
          objective?: string | null
          phone?: string | null
          production_date?: string | null
          project_id?: string
          project_types?: string[]
          recommended?: string[]
          reference_file?: string | null
          role?: string | null
          size?: Database["public"]["Enums"]["project_size"]
          source?: string | null
          stage?: Database["public"]["Enums"]["project_stage"]
          summary?: string | null
          timeline?: string | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
          workflow?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_briefs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_records"
            referencedColumns: ["id"]
          },
        ]
      }
      project_media: {
        Row: {
          alt: string | null
          caption: string | null
          created_at: string
          filename: string | null
          id: string
          layout: string
          project_id: string
          provider: string | null
          sort_order: number
          type: string
          url: string
        }
        Insert: {
          alt?: string | null
          caption?: string | null
          created_at?: string
          filename?: string | null
          id?: string
          layout?: string
          project_id: string
          provider?: string | null
          sort_order?: number
          type?: string
          url: string
        }
        Update: {
          alt?: string | null
          caption?: string | null
          created_at?: string
          filename?: string | null
          id?: string
          layout?: string
          project_id?: string
          provider?: string | null
          sort_order?: number
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          approach: string | null
          behind_the_scenes: string[]
          categories: string[]
          category: string
          challenge: string | null
          client: string | null
          cover_image: string | null
          created_at: string
          credits: Json
          description: string | null
          featured: boolean
          featured_order: number
          hero_video: string | null
          id: string
          idea: string | null
          images: string[]
          industry: string | null
          location: string | null
          og_image: string | null
          outcome: string | null
          production: string | null
          project_date: string | null
          project_type: string | null
          published: boolean
          results: string | null
          sections: Json
          seo_description: string | null
          seo_title: string | null
          services: string[]
          slug: string
          solution: string | null
          sort_order: number
          title: string
          updated_at: string
          videos: string[]
          visibility: string
          year: number | null
        }
        Insert: {
          approach?: string | null
          behind_the_scenes?: string[]
          categories?: string[]
          category?: string
          challenge?: string | null
          client?: string | null
          cover_image?: string | null
          created_at?: string
          credits?: Json
          description?: string | null
          featured?: boolean
          featured_order?: number
          hero_video?: string | null
          id?: string
          idea?: string | null
          images?: string[]
          industry?: string | null
          location?: string | null
          og_image?: string | null
          outcome?: string | null
          production?: string | null
          project_date?: string | null
          project_type?: string | null
          published?: boolean
          results?: string | null
          sections?: Json
          seo_description?: string | null
          seo_title?: string | null
          services?: string[]
          slug: string
          solution?: string | null
          sort_order?: number
          title: string
          updated_at?: string
          videos?: string[]
          visibility?: string
          year?: number | null
        }
        Update: {
          approach?: string | null
          behind_the_scenes?: string[]
          categories?: string[]
          category?: string
          challenge?: string | null
          client?: string | null
          cover_image?: string | null
          created_at?: string
          credits?: Json
          description?: string | null
          featured?: boolean
          featured_order?: number
          hero_video?: string | null
          id?: string
          idea?: string | null
          images?: string[]
          industry?: string | null
          location?: string | null
          og_image?: string | null
          outcome?: string | null
          production?: string | null
          project_date?: string | null
          project_type?: string | null
          published?: boolean
          results?: string | null
          sections?: Json
          seo_description?: string | null
          seo_title?: string | null
          services?: string[]
          slug?: string
          solution?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          videos?: string[]
          visibility?: string
          year?: number | null
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          excerpt: string | null
          faqs: Json
          gallery: string[]
          hero_image: string | null
          icon: string | null
          id: string
          overview: string | null
          pricing: Json
          process: Json
          published: boolean
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          excerpt?: string | null
          faqs?: Json
          gallery?: string[]
          hero_image?: string | null
          icon?: string | null
          id?: string
          overview?: string | null
          pricing?: Json
          process?: Json
          published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          excerpt?: string | null
          faqs?: Json
          gallery?: string[]
          hero_image?: string | null
          icon?: string | null
          id?: string
          overview?: string | null
          pricing?: Json
          process?: Json
          published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      studio_spaces: {
        Row: {
          amenities: string[]
          created_at: string
          description: string | null
          id: string
          images: string[]
          name: string
          price: string | null
          published: boolean
          size: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          amenities?: string[]
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          name: string
          price?: string | null
          published?: boolean
          size?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          amenities?: string[]
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          name?: string
          price?: string | null
          published?: boolean
          size?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          status?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar: string | null
          company: string | null
          created_at: string
          featured: boolean
          id: string
          name: string
          published: boolean
          quote: string
          role: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          company?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          name: string
          published?: boolean
          quote: string
          role?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          company?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          name?: string
          published?: boolean
          quote?: string
          role?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visual_brief_service_state: {
        Row: {
          blocked: boolean
          id: string
          message: string
          status: number
          updated_at: string
        }
        Insert: {
          blocked?: boolean
          id: string
          message?: string
          status?: number
          updated_at?: string
        }
        Update: {
          blocked?: boolean
          id?: string
          message?: string
          status?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      search_site: {
        Args: { q: string }
        Returns: {
          excerpt: string
          image: string
          kind: string
          rank: number
          slug: string
          title: string
        }[]
      }
      submit_project_brief: { Args: { payload: Json }; Returns: string }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin"
        | "editor"
        | "marketing"
        | "writer"
        | "developer"
      project_size: "small" | "medium" | "large" | "enterprise"
      project_stage:
        | "new_brief"
        | "reviewing"
        | "qualified"
        | "discovery"
        | "proposal"
        | "approved"
        | "pre_production"
        | "production"
        | "post_production"
        | "client_review"
        | "delivered"
        | "completed"
        | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "admin",
        "editor",
        "marketing",
        "writer",
        "developer",
      ],
      project_size: ["small", "medium", "large", "enterprise"],
      project_stage: [
        "new_brief",
        "reviewing",
        "qualified",
        "discovery",
        "proposal",
        "approved",
        "pre_production",
        "production",
        "post_production",
        "client_review",
        "delivered",
        "completed",
        "archived",
      ],
    },
  },
} as const
