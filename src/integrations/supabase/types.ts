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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      abandoned_checkouts: {
        Row: {
          cart_items: Json
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          delivery_address: string | null
          delivery_charge: number
          delivery_type: string | null
          district_id: string | null
          id: string
          is_converted: boolean
          order_note: string | null
          session_id: string
          subtotal: number
          total_amount: number
          upazila_id: string | null
          updated_at: string
        }
        Insert: {
          cart_items?: Json
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          delivery_charge?: number
          delivery_type?: string | null
          district_id?: string | null
          id?: string
          is_converted?: boolean
          order_note?: string | null
          session_id: string
          subtotal?: number
          total_amount?: number
          upazila_id?: string | null
          updated_at?: string
        }
        Update: {
          cart_items?: Json
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          delivery_charge?: number
          delivery_type?: string | null
          district_id?: string | null
          id?: string
          is_converted?: boolean
          order_note?: string | null
          session_id?: string
          subtotal?: number
          total_amount?: number
          upazila_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "abandoned_checkouts_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "abandoned_checkouts_upazila_id_fkey"
            columns: ["upazila_id"]
            isOneToOne: false
            referencedRelation: "upazilas"
            referencedColumns: ["id"]
          },
        ]
      }
      banners: {
        Row: {
          button_text: string | null
          created_at: string
          id: string
          image_url: string
          is_active: boolean
          link_url: string | null
          sort_order: number
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          button_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean
          link_url?: string | null
          sort_order?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          button_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean
          link_url?: string | null
          sort_order?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          name: string
          name_bn: string | null
          parent_id: string | null
          slug: string
          status: Database["public"]["Enums"]["category_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          name_bn?: string | null
          parent_id?: string | null
          slug: string
          status?: Database["public"]["Enums"]["category_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          name_bn?: string | null
          parent_id?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["category_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      courier_notes: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          message: string
          order_id: string
          source: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          message: string
          order_id: string
          source?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          message?: string
          order_id?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "courier_notes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      courier_settings: {
        Row: {
          access_token: string | null
          api_key: string | null
          api_secret: string | null
          courier_name: string
          created_at: string
          default_weight: number
          display_name: string
          id: string
          is_default: boolean
          is_enabled: boolean
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          api_key?: string | null
          api_secret?: string | null
          courier_name: string
          created_at?: string
          default_weight?: number
          display_name: string
          id?: string
          is_default?: boolean
          is_enabled?: boolean
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          api_key?: string | null
          api_secret?: string | null
          courier_name?: string
          created_at?: string
          default_weight?: number
          display_name?: string
          id?: string
          is_default?: boolean
          is_enabled?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      daily_analytics: {
        Row: {
          created_at: string
          date: string
          id: string
          total_orders: number
          total_sales: number
          total_visits: number
          unique_visitors: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          total_orders?: number
          total_sales?: number
          total_visits?: number
          unique_visitors?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          total_orders?: number
          total_sales?: number
          total_visits?: number
          unique_visitors?: number
          updated_at?: string
        }
        Relationships: []
      }
      delivery_settings: {
        Row: {
          charge: number
          created_at: string
          delivery_type: Database["public"]["Enums"]["delivery_type"]
          id: string
          status: boolean
          updated_at: string
        }
        Insert: {
          charge?: number
          created_at?: string
          delivery_type: Database["public"]["Enums"]["delivery_type"]
          id?: string
          status?: boolean
          updated_at?: string
        }
        Update: {
          charge?: number
          created_at?: string
          delivery_type?: Database["public"]["Enums"]["delivery_type"]
          id?: string
          status?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      districts: {
        Row: {
          created_at: string
          division: string | null
          id: string
          name: string
          name_bn: string
        }
        Insert: {
          created_at?: string
          division?: string | null
          id?: string
          name: string
          name_bn: string
        }
        Update: {
          created_at?: string
          division?: string | null
          id?: string
          name?: string
          name_bn?: string
        }
        Relationships: []
      }
      home_sections: {
        Row: {
          created_at: string
          id: string
          is_visible: boolean
          section_key: string
          settings: Json
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_visible?: boolean
          section_key: string
          settings?: Json
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_visible?: boolean
          section_key?: string
          settings?: Json
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          menu_location: string
          parent_id: string | null
          sort_order: number
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          menu_location?: string
          parent_id?: string | null
          sort_order?: number
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          menu_location?: string
          parent_id?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
          variation_attributes: Json | null
          variation_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          quantity?: number
          total_price: number
          unit_price: number
          variation_attributes?: Json | null
          variation_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          total_price?: number
          unit_price?: number
          variation_attributes?: Json | null
          variation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variation_id_fkey"
            columns: ["variation_id"]
            isOneToOne: false
            referencedRelation: "product_variations"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          courier_name: string | null
          courier_tracking_link: string | null
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          delivery_address: string
          delivery_charge: number
          delivery_type: Database["public"]["Enums"]["delivery_type"]
          district_id: string | null
          id: string
          order_note: string | null
          order_number: string
          order_status: Database["public"]["Enums"]["order_status"]
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          subtotal: number
          total_amount: number
          tracking_number: string | null
          upazila_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          courier_name?: string | null
          courier_tracking_link?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          delivery_address: string
          delivery_charge?: number
          delivery_type: Database["public"]["Enums"]["delivery_type"]
          district_id?: string | null
          id?: string
          order_note?: string | null
          order_number: string
          order_status?: Database["public"]["Enums"]["order_status"]
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          subtotal?: number
          total_amount?: number
          tracking_number?: string | null
          upazila_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          courier_name?: string | null
          courier_tracking_link?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          delivery_address?: string
          delivery_charge?: number
          delivery_type?: Database["public"]["Enums"]["delivery_type"]
          district_id?: string | null
          id?: string
          order_note?: string | null
          order_number?: string
          order_status?: Database["public"]["Enums"]["order_status"]
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          subtotal?: number
          total_amount?: number
          tracking_number?: string | null
          upazila_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_upazila_id_fkey"
            columns: ["upazila_id"]
            isOneToOne: false
            referencedRelation: "upazilas"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content: string | null
          created_at: string
          id: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_main: boolean
          product_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_main?: boolean
          product_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_main?: boolean
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variations: {
        Row: {
          attributes: Json
          created_at: string
          id: string
          image_url: string | null
          price: number
          product_id: string
          sale_price: number | null
          sku: string | null
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          attributes?: Json
          created_at?: string
          id?: string
          image_url?: string | null
          price?: number
          product_id: string
          sale_price?: number | null
          sku?: string | null
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          attributes?: Json
          created_at?: string
          id?: string
          image_url?: string | null
          price?: number
          product_id?: string
          sale_price?: number | null
          sku?: string | null
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          price: number
          product_type: Database["public"]["Enums"]["product_type"]
          sale_price: number | null
          seo_description: string | null
          seo_slug: string
          seo_title: string | null
          status: Database["public"]["Enums"]["product_status"]
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price?: number
          product_type?: Database["public"]["Enums"]["product_type"]
          sale_price?: number | null
          seo_description?: string | null
          seo_slug: string
          seo_title?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price?: number
          product_type?: Database["public"]["Enums"]["product_type"]
          sale_price?: number | null
          seo_description?: string | null
          seo_slug?: string
          seo_title?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          setting_group: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_group?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_group?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      upazilas: {
        Row: {
          created_at: string
          district_id: string
          id: string
          name: string
          name_bn: string
        }
        Insert: {
          created_at?: string
          district_id: string
          id?: string
          name: string
          name_bn: string
        }
        Update: {
          created_at?: string
          district_id?: string
          id?: string
          name?: string
          name_bn?: string
        }
        Relationships: [
          {
            foreignKeyName: "upazilas_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
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
          role?: Database["public"]["Enums"]["app_role"]
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
      visitors: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          device_type: string | null
          id: string
          ip_address: string | null
          os: string | null
          referrer: string | null
          session_id: string
          user_agent: string | null
          visit_time: string
          visited_page: string
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          os?: string | null
          referrer?: string | null
          session_id: string
          user_agent?: string | null
          visit_time?: string
          visited_page: string
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          os?: string | null
          referrer?: string | null
          session_id?: string
          user_agent?: string | null
          visit_time?: string
          visited_page?: string
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "customer"
      category_status: "active" | "inactive"
      delivery_type: "inside_dhaka" | "outside_dhaka"
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
      payment_method: "cod"
      payment_status: "pending" | "paid"
      product_status: "active" | "inactive"
      product_type: "simple" | "variable"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "customer"],
      category_status: ["active", "inactive"],
      delivery_type: ["inside_dhaka", "outside_dhaka"],
      order_status: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      payment_method: ["cod"],
      payment_status: ["pending", "paid"],
      product_status: ["active", "inactive"],
      product_type: ["simple", "variable"],
    },
  },
} as const
