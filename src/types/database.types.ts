/**
 * BarberíaOS — Database types
 *
 * Generado manualmente desde las migraciones 001-027.
 * Cuando tengas acceso a Supabase CLI puedes regenerar con:
 *   npx supabase gen types typescript --project-id eslygfjpxwrjnoimsrly > src/types/database.types.ts
 *
 * Estructura compatible con el helper oficial @supabase/supabase-js:
 *   createClient<Database>(url, key)
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // ── Perfiles de usuario ──────────────────────────────────
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          is_super_admin: boolean | null;
          platform_role: "super_admin" | "creator" | "admin" | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          is_super_admin?: boolean | null;
          platform_role?: "super_admin" | "creator" | "admin" | null;
          created_at?: string;
        };
        Update: {
          full_name?: string | null;
          email?: string | null;
          is_super_admin?: boolean | null;
          platform_role?: "super_admin" | "creator" | "admin" | null;
        };
        Relationships: [];
      };

      // ── Barberías ────────────────────────────────────────────
      barbershops: {
        Row: {
          id: string;
          owner_id: string | null;
          name: string;
          slug: string;
          phone: string | null;
          address: string | null;
          city: string | null;
          instagram_url: string | null;
          google_business_url: string | null;
          google_review_url: string | null;
          public_booking_enabled: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string | null;
          name: string;
          slug: string;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          instagram_url?: string | null;
          google_business_url?: string | null;
          google_review_url?: string | null;
          public_booking_enabled?: boolean;
          created_at?: string;
        };
        Update: {
          owner_id?: string | null;
          name?: string;
          slug?: string;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          instagram_url?: string | null;
          google_business_url?: string | null;
          google_review_url?: string | null;
          public_booking_enabled?: boolean;
        };
        Relationships: [];
      };

      // ── Miembros de barbería ─────────────────────────────────
      barbershop_members: {
        Row: {
          id: string;
          barbershop_id: string;
          user_id: string;
          role: "owner" | "admin" | "staff";
          created_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          user_id: string;
          role?: "owner" | "admin" | "staff";
          created_at?: string;
        };
        Update: {
          role?: "owner" | "admin" | "staff";
        };
        Relationships: [];
      };

      // ── Barberos ─────────────────────────────────────────────
      barbers: {
        Row: {
          id: string;
          barbershop_id: string;
          name: string;
          phone: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          name: string;
          phone?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          phone?: string | null;
          active?: boolean;
        };
        Relationships: [];
      };

      // ── Servicios ────────────────────────────────────────────
      services: {
        Row: {
          id: string;
          barbershop_id: string;
          name: string;
          description: string | null;
          price: number;
          duration_minutes: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          name: string;
          description?: string | null;
          price?: number;
          duration_minutes?: number;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          price?: number;
          duration_minutes?: number;
          active?: boolean;
        };
        Relationships: [];
      };

      // ── Clientes ─────────────────────────────────────────────
      clients: {
        Row: {
          id: string;
          barbershop_id: string;
          name: string;
          phone: string | null;
          email: string | null;
          notes: string | null;
          last_visit_at: string | null;
          preferences: string | null;
          favorite_barber_id: string | null;
          last_service_id: string | null;
          visit_count: number;
          next_recommended_visit_at: string | null;
          no_show_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          name: string;
          phone?: string | null;
          email?: string | null;
          notes?: string | null;
          last_visit_at?: string | null;
          preferences?: string | null;
          favorite_barber_id?: string | null;
          last_service_id?: string | null;
          visit_count?: number;
          next_recommended_visit_at?: string | null;
          no_show_count?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          phone?: string | null;
          email?: string | null;
          notes?: string | null;
          last_visit_at?: string | null;
          preferences?: string | null;
          favorite_barber_id?: string | null;
          last_service_id?: string | null;
          visit_count?: number;
          next_recommended_visit_at?: string | null;
          no_show_count?: number;
        };
        Relationships: [];
      };

      // ── Citas ────────────────────────────────────────────────
      appointments: {
        Row: {
          id: string;
          barbershop_id: string;
          client_id: string;
          barber_id: string | null;
          service_id: string;
          appointment_date: string;
          start_time: string;
          end_time: string;
          status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show";
          source: "dashboard" | "public_booking" | "qr" | "instagram" | "google" | "whatsapp" | "other";
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          client_id: string;
          barber_id?: string | null;
          service_id: string;
          appointment_date: string;
          start_time: string;
          end_time: string;
          status?: "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show";
          source?: "dashboard" | "public_booking" | "qr" | "instagram" | "google" | "whatsapp" | "other";
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          barber_id?: string | null;
          appointment_date?: string;
          start_time?: string;
          end_time?: string;
          status?: "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show";
          source?: "dashboard" | "public_booking" | "qr" | "instagram" | "google" | "whatsapp" | "other";
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_barber_id_fkey";
            columns: ["barber_id"];
            isOneToOne: false;
            referencedRelation: "barbers";
            referencedColumns: ["id"];
          }
        ];
      };

      // ── Pagos ────────────────────────────────────────────────
      payments: {
        Row: {
          id: string;
          barbershop_id: string;
          appointment_id: string | null;
          client_id: string | null;
          amount: number;
          method: "cash" | "card" | "bizum" | "transfer" | "other";
          status: "paid" | "pending" | "refunded" | "cancelled";
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          appointment_id?: string | null;
          client_id?: string | null;
          amount: number;
          method?: "cash" | "card" | "bizum" | "transfer" | "other";
          status?: "paid" | "pending" | "refunded" | "cancelled";
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          amount?: number;
          method?: "cash" | "card" | "bizum" | "transfer" | "other";
          status?: "paid" | "pending" | "refunded" | "cancelled";
        };
        Relationships: [];
      };

      // ── Suscripciones ────────────────────────────────────────
      subscriptions: {
        Row: {
          id: string;
          barbershop_id: string;
          plan_name: "free" | "starter" | "pro" | "growth" | "premium";
          amount_monthly: number;
          currency: string;
          billing_cycle: "monthly" | "annual";
          status: "trial" | "active" | "paused" | "cancelled";
          started_at: string | null;
          trial_ends_at: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancelled_at: string | null;
          notes: string | null;
          stripe_subscription_id: string | null;
          stripe_customer_id: string | null;
          stripe_price_id: string | null;
          stripe_status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          plan_name?: "free" | "starter" | "pro" | "growth" | "premium";
          amount_monthly?: number;
          currency?: string;
          billing_cycle?: "monthly" | "annual";
          status?: "trial" | "active" | "paused" | "cancelled";
          started_at?: string | null;
          trial_ends_at?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancelled_at?: string | null;
          notes?: string | null;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          stripe_price_id?: string | null;
          stripe_status?: string | null;
        };
        Update: {
          barbershop_id?: string;
          plan_name?: "free" | "starter" | "pro" | "growth" | "premium";
          amount_monthly?: number;
          currency?: string;
          billing_cycle?: "monthly" | "annual";
          status?: "trial" | "active" | "paused" | "cancelled";
          started_at?: string | null;
          trial_ends_at?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancelled_at?: string | null;
          notes?: string | null;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          stripe_price_id?: string | null;
          stripe_status?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_barbershop_id_fkey";
            columns: ["barbershop_id"];
            isOneToOne: false;
            referencedRelation: "barbershops";
            referencedColumns: ["id"];
          }
        ];
      };

      // ── Sesiones de caja ─────────────────────────────────────
      cash_sessions: {
        Row: {
          id: string;
          barbershop_id: string;
          opened_by: string | null;
          opened_at: string;
          closed_at: string | null;
          opening_amount: number;
          closing_amount: number | null;
          expected_cash_amount: number | null;
          difference_amount: number | null;
          status: "open" | "closed";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          opened_by?: string | null;
          opened_at?: string;
          closed_at?: string | null;
          opening_amount?: number;
          closing_amount?: number | null;
          expected_cash_amount?: number | null;
          difference_amount?: number | null;
          status?: "open" | "closed";
          notes?: string | null;
        };
        Update: {
          closed_at?: string | null;
          closing_amount?: number | null;
          expected_cash_amount?: number | null;
          difference_amount?: number | null;
          status?: "open" | "closed";
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      // ── Movimientos de caja ──────────────────────────────────
      cash_movements: {
        Row: {
          id: string;
          barbershop_id: string;
          cash_session_id: string;
          appointment_id: string | null;
          client_id: string | null;
          barber_id: string | null;
          service_id: string | null;
          amount: number;
          discount_amount: number;
          tip_amount: number;
          payment_method: "cash" | "card" | "bizum" | "transfer" | "other";
          movement_type: "payment" | "refund" | "expense" | "adjustment";
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          cash_session_id: string;
          appointment_id?: string | null;
          client_id?: string | null;
          barber_id?: string | null;
          service_id?: string | null;
          amount: number;
          discount_amount?: number;
          tip_amount?: number;
          payment_method?: "cash" | "card" | "bizum" | "transfer" | "other";
          movement_type?: "payment" | "refund" | "expense" | "adjustment";
          description?: string | null;
          created_at?: string;
        };
        Update: {
          description?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "cash_movements_appointment_id_fkey";
            columns: ["appointment_id"];
            isOneToOne: false;
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cash_movements_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cash_movements_barber_id_fkey";
            columns: ["barber_id"];
            isOneToOne: false;
            referencedRelation: "barbers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cash_movements_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          }
        ];
      };

      // ── Reseñas ──────────────────────────────────────────────
      reviews: {
        Row: {
          id: string;
          business_id: string;
          booking_id: string | null;
          customer_id: string | null;
          public_token: string;
          rating: number | null;
          comment: string | null;
          source: string;
          is_public: boolean;
          status: "pending" | "google_redirect_ready" | "private_feedback" | "archived";
          respuesta_sugerida: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          booking_id?: string | null;
          customer_id?: string | null;
          public_token?: string;
          rating?: number | null;
          comment?: string | null;
          source?: string;
          is_public?: boolean;
          status?: "pending" | "google_redirect_ready" | "private_feedback" | "archived";
          respuesta_sugerida?: string | null;
        };
        Update: {
          rating?: number | null;
          comment?: string | null;
          is_public?: boolean;
          status?: "pending" | "google_redirect_ready" | "private_feedback" | "archived";
          respuesta_sugerida?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "barbershops";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          }
        ];
      };

      // ── Perfil público de barbería (Marketplace) ─────────────
      barbershop_public_profiles: {
        Row: {
          id: string;
          barbershop_id: string;
          slug: string;
          public_name: string;
          city: string | null;
          neighborhood: string | null;
          address: string | null;
          phone: string | null;
          whatsapp: string | null;
          instagram: string | null;
          website_url: string | null;
          description: string | null;
          cover_image_url: string | null;
          logo_url: string | null;
          is_published: boolean;
          marketplace_enabled: boolean;
          featured: boolean;
          featured_until: string | null;
          priority_score: number;
          public_slug: string | null;
          latitude: number | null;
          longitude: number | null;
          google_maps_url: string | null;
          map_visible: boolean;
          short_description: string | null;
          is_featured: boolean;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          slug: string;
          public_name: string;
          city?: string | null;
          neighborhood?: string | null;
          address?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          instagram?: string | null;
          website_url?: string | null;
          description?: string | null;
          cover_image_url?: string | null;
          logo_url?: string | null;
          is_published?: boolean;
          marketplace_enabled?: boolean;
          featured?: boolean;
          featured_until?: string | null;
          priority_score?: number;
          public_slug?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          google_maps_url?: string | null;
          map_visible?: boolean;
          short_description?: string | null;
          is_featured?: boolean;
          is_verified?: boolean;
        };
        Update: {
          public_name?: string;
          city?: string | null;
          neighborhood?: string | null;
          address?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          instagram?: string | null;
          website_url?: string | null;
          description?: string | null;
          cover_image_url?: string | null;
          logo_url?: string | null;
          is_published?: boolean;
          marketplace_enabled?: boolean;
          featured?: boolean;
          featured_until?: string | null;
          priority_score?: number;
          public_slug?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          google_maps_url?: string | null;
          map_visible?: boolean;
          short_description?: string | null;
          is_featured?: boolean;
          is_verified?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };

      // ── Productos de inventario ──────────────────────────────
      inventory_products: {
        Row: {
          id: string;
          barbershop_id: string;
          name: string;
          category: string | null;
          product_type: "retail" | "internal";
          sku: string | null;
          supplier: string | null;
          current_stock: number;
          min_stock: number;
          purchase_price: number | null;
          sale_price: number | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          name: string;
          category?: string | null;
          product_type?: "retail" | "internal";
          sku?: string | null;
          supplier?: string | null;
          current_stock?: number;
          min_stock?: number;
          purchase_price?: number | null;
          sale_price?: number | null;
          notes?: string | null;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          category?: string | null;
          product_type?: "retail" | "internal";
          sku?: string | null;
          supplier?: string | null;
          current_stock?: number;
          min_stock?: number;
          purchase_price?: number | null;
          sale_price?: number | null;
          notes?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };

      // ── Reglas de automatización ─────────────────────────────
      automation_rules: {
        Row: {
          id: string;
          barbershop_id: string;
          type: string;
          name: string;
          description: string | null;
          channel: "whatsapp" | "email" | "internal";
          template: string | null;
          is_active: boolean;
          last_run_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          type: string;
          name: string;
          description?: string | null;
          channel?: "whatsapp" | "email" | "internal";
          template?: string | null;
          is_active?: boolean;
          last_run_at?: string | null;
        };
        Update: {
          name?: string;
          description?: string | null;
          channel?: "whatsapp" | "email" | "internal";
          template?: string | null;
          is_active?: boolean;
          last_run_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      // ── Solicitudes de IA ────────────────────────────────────
      ai_requests: {
        Row: {
          id: string;
          barbershop_id: string;
          user_id: string | null;
          question: string | null;
          response_summary: string | null;
          model: string | null;
          status: "completed" | "fallback" | "error";
          tokens_input: number | null;
          tokens_output: number | null;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          user_id?: string | null;
          question?: string | null;
          response_summary?: string | null;
          model?: string | null;
          status?: "completed" | "fallback" | "error";
          tokens_input?: number | null;
          tokens_output?: number | null;
          error_message?: string | null;
        };
        Update: {
          status?: "completed" | "fallback" | "error";
          response_summary?: string | null;
          error_message?: string | null;
        };
        Relationships: [];
      };

      // ── Stripe events (log de idempotencia) ─────────────────
      stripe_events: {
        Row: {
          id: string;
          type: string;
          payload: Json;
          created_at: string;
        };
        Insert: {
          id: string;
          type: string;
          payload: Json;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };

      // ── Growth Engine ────────────────────────────────────────
      growth_campaigns: {
        Row: {
          id: string;
          barbershop_id: string;
          name: string;
          type: string | null;
          objective: string | null;
          channel: string | null;
          keyword: string | null;
          cta: string | null;
          message: string | null;
          status: "draft" | "active" | "paused" | "completed";
          starts_at: string | null;
          ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          name: string;
          type?: string | null;
          objective?: string | null;
          channel?: string | null;
          keyword?: string | null;
          cta?: string | null;
          message?: string | null;
          status?: "draft" | "active" | "paused" | "completed";
          starts_at?: string | null;
          ends_at?: string | null;
        };
        Update: {
          name?: string;
          type?: string | null;
          objective?: string | null;
          channel?: string | null;
          keyword?: string | null;
          cta?: string | null;
          message?: string | null;
          status?: "draft" | "active" | "paused" | "completed";
          starts_at?: string | null;
          ends_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      // ── CRM del fundador (solo super_admin) ─────────────────
      crm_leads: {
        Row: {
          id: string;
          business_name: string;
          contact_name: string | null;
          phone: string | null;
          email: string | null;
          city: string | null;
          country: string | null;
          source: "directo" | "instagram" | "referido" | "google" | "linkedin" | "feria" | "otro" | null;
          status: "nuevo" | "contactado" | "demo_agendada" | "propuesta_enviada" | "trial_activo" | "ganado" | "perdido";
          potential_mrr: number | null;
          notes: string | null;
          last_contacted_at: string | null;
          next_action_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_name: string;
          contact_name?: string | null;
          phone?: string | null;
          email?: string | null;
          city?: string | null;
          country?: string | null;
          source?: "directo" | "instagram" | "referido" | "google" | "linkedin" | "feria" | "otro" | null;
          status?: "nuevo" | "contactado" | "demo_agendada" | "propuesta_enviada" | "trial_activo" | "ganado" | "perdido";
          potential_mrr?: number | null;
          notes?: string | null;
          last_contacted_at?: string | null;
          next_action_at?: string | null;
        };
        Update: {
          business_name?: string;
          contact_name?: string | null;
          phone?: string | null;
          email?: string | null;
          city?: string | null;
          country?: string | null;
          source?: "directo" | "instagram" | "referido" | "google" | "linkedin" | "feria" | "otro" | null;
          status?: "nuevo" | "contactado" | "demo_agendada" | "propuesta_enviada" | "trial_activo" | "ganado" | "perdido";
          potential_mrr?: number | null;
          notes?: string | null;
          last_contacted_at?: string | null;
          next_action_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      crm_deals: {
        Row: {
          id: string;
          lead_id: string | null;
          title: string;
          value: number | null;
          stage: "prospecting" | "qualification" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
          probability: number | null;
          expected_close_date: string | null;
          status: "open" | "won" | "lost";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lead_id?: string | null;
          title: string;
          value?: number | null;
          stage?: "prospecting" | "qualification" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
          probability?: number | null;
          expected_close_date?: string | null;
          status?: "open" | "won" | "lost";
          notes?: string | null;
        };
        Update: {
          lead_id?: string | null;
          title?: string;
          value?: number | null;
          stage?: "prospecting" | "qualification" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
          probability?: number | null;
          expected_close_date?: string | null;
          status?: "open" | "won" | "lost";
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      crm_tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          due_date: string | null;
          priority: "baja" | "media" | "alta" | "urgente";
          status: "pendiente" | "en_progreso" | "completada" | "cancelada";
          related_type: "lead" | "deal" | null;
          related_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          due_date?: string | null;
          priority?: "baja" | "media" | "alta" | "urgente";
          status?: "pendiente" | "en_progreso" | "completada" | "cancelada";
          related_type?: "lead" | "deal" | null;
          related_id?: string | null;
        };
        Update: {
          title?: string;
          description?: string | null;
          due_date?: string | null;
          priority?: "baja" | "media" | "alta" | "urgente";
          status?: "pendiente" | "en_progreso" | "completada" | "cancelada";
          related_type?: "lead" | "deal" | null;
          related_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      // ── Shield manual review ─────────────────────────────────
      shield_manual_review_requests: {
        Row: {
          id: string;
          barbershop_id: string;
          user_id: string;
          url: string;
          status: "pending" | "in_review" | "completed" | "cancelled";
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          user_id: string;
          url: string;
          status?: "pending" | "in_review" | "completed" | "cancelled";
          notes?: string | null;
        };
        Update: {
          status?: "pending" | "in_review" | "completed" | "cancelled";
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "shield_manual_review_requests_barbershop_id_fkey";
            columns: ["barbershop_id"];
            isOneToOne: false;
            referencedRelation: "barbershops";
            referencedColumns: ["id"];
          }
        ];
      };

      growth_leads: {
        Row: {
          id: string;
          barbershop_id: string;
          client_id: string | null;
          name: string | null;
          phone: string | null;
          email: string | null;
          instagram_username: string | null;
          source: string | null;
          keyword: string | null;
          campaign_id: string | null;
          status: "new" | "contacted" | "demo_sent" | "interested" | "booked" | "customer" | "lost";
          temperature: "cold" | "warm" | "hot";
          interest: string | null;
          notes: string | null;
          next_action: string | null;
          last_contact_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          client_id?: string | null;
          name?: string | null;
          phone?: string | null;
          email?: string | null;
          instagram_username?: string | null;
          source?: string | null;
          keyword?: string | null;
          campaign_id?: string | null;
          status?: "new" | "contacted" | "demo_sent" | "interested" | "booked" | "customer" | "lost";
          temperature?: "cold" | "warm" | "hot";
          interest?: string | null;
          notes?: string | null;
          next_action?: string | null;
          last_contact_at?: string | null;
        };
        Update: {
          status?: "new" | "contacted" | "demo_sent" | "interested" | "booked" | "customer" | "lost";
          temperature?: "cold" | "warm" | "hot";
          interest?: string | null;
          notes?: string | null;
          next_action?: string | null;
          last_contact_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      // ── Gastos ───────────────────────────────────────────────
      expenses: {
        Row: {
          id: string;
          barbershop_id: string;
          amount: number;
          category: "alquiler" | "productos" | "herramientas" | "marketing" | "nomina" | "otros";
          description: string | null;
          expense_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          amount: number;
          category: "alquiler" | "productos" | "herramientas" | "marketing" | "nomina" | "otros";
          description?: string | null;
          expense_date?: string;
          created_at?: string;
        };
        Update: {
          amount?: number;
          category?: "alquiler" | "productos" | "herramientas" | "marketing" | "nomina" | "otros";
          description?: string | null;
          expense_date?: string;
        };
        Relationships: [];
      };

      // ── Movimientos de inventario ────────────────────────────
      inventory_movements: {
        Row: {
          id: string;
          barbershop_id: string;
          product_id: string;
          movement_type: "in" | "out" | "adjustment" | "internal_use" | "manual_sale";
          quantity: number;
          previous_stock: number | null;
          new_stock: number | null;
          reason: string | null;
          source: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          product_id: string;
          movement_type: "in" | "out" | "adjustment" | "internal_use" | "manual_sale";
          quantity: number;
          previous_stock?: number | null;
          new_stock?: number | null;
          reason?: string | null;
          source?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          quantity?: number;
          reason?: string | null;
        };
        Relationships: [];
      };

      // ── Líneas de venta de inventario ────────────────────────
      inventory_sale_items: {
        Row: {
          id: string;
          barbershop_id: string;
          product_id: string;
          cash_session_id: string | null;
          sale_id: string | null;
          appointment_id: string | null;
          client_id: string | null;
          barber_id: string | null;
          quantity: number;
          unit_purchase_price: number | null;
          unit_sale_price: number;
          total_sale_price: number;
          estimated_profit: number | null;
          stock_before: number | null;
          stock_after: number | null;
          created_by: string | null;
          created_at: string;
          cancelled_at: string | null;
          cancellation_reason: string | null;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          product_id: string;
          cash_session_id?: string | null;
          sale_id?: string | null;
          appointment_id?: string | null;
          client_id?: string | null;
          barber_id?: string | null;
          quantity: number;
          unit_purchase_price?: number | null;
          unit_sale_price: number;
          total_sale_price: number;
          estimated_profit?: number | null;
          stock_before?: number | null;
          stock_after?: number | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
        };
        Relationships: [];
      };

      // ── Marketplace events (analytics) ──────────────────────
      marketplace_events: {
        Row: {
          id: string;
          barbershop_id: string;
          event_type: string;
          source: string | null;
          city: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          event_type: string;
          source?: string | null;
          city?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          metadata?: Json | null;
        };
        Relationships: [];
      };

      // ── Security audits (Shield) ─────────────────────────────
      security_audits: {
        Row: {
          id: string;
          barbershop_id: string;
          website_url: string;
          status: "pending" | "running" | "done" | "error";
          score: number | null;
          report: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          barbershop_id: string;
          website_url: string;
          status?: "pending" | "running" | "done" | "error";
          score?: number | null;
          report?: Json | null;
          created_at?: string;
        };
        Update: {
          status?: "pending" | "running" | "done" | "error";
          score?: number | null;
          report?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "security_audits_barbershop_id_fkey";
            columns: ["barbershop_id"];
            isOneToOne: false;
            referencedRelation: "barbershops";
            referencedColumns: ["id"];
          }
        ];
      };
    };

    Views: {
      [_ in never]: never;
    };

    Functions: {
      is_barbershop_member: {
        Args: { target_barbershop_id: string };
        Returns: boolean;
      };
      is_super_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      recalculate_client_crm: {
        Args: { p_client_id: string; p_barbershop_id: string };
        Returns: undefined;
      };
      sell_inventory_product: {
        Args: {
          p_barbershop_id: string;
          p_product_id: string;
          p_cash_session_id: string;
          p_quantity: number;
          p_unit_sale_price: number;
          p_payment_method?: string;
          p_client_id?: string | null;
          p_barber_id?: string | null;
          p_appointment_id?: string | null;
          p_note?: string | null;
        };
        Returns: string;
      };
      cancel_inventory_sale_item: {
        Args: {
          p_barbershop_id: string;
          p_sale_item_id: string;
          p_reason?: string | null;
        };
        Returns: undefined;
      };
      create_booking_safe: {
        Args: {
          p_slug: string;
          p_service_id: string;
          p_barber_id: string | null;
          p_client_name: string;
          p_client_phone: string;
          p_appointment_date: string;
          p_start_time: string;
          p_notes?: string | null;
        };
        Returns: string;
      };
    };

    Enums: {
      [_ in never]: never;
    };
  };
}

// ── Helpers de conveniencia ──────────────────────────────────────────────────

/** Tipo de fila para una tabla dada */
export type TableRow<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

/** Tipo de inserción para una tabla dada */
export type TableInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

/** Tipo de actualización para una tabla dada */
export type TableUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// ── Aliases de tipos más usados ──────────────────────────────────────────────

export type Barbershop       = TableRow<"barbershops">;
export type Barber           = TableRow<"barbers">;
export type Service          = TableRow<"services">;
export type Client           = TableRow<"clients">;
export type Appointment      = TableRow<"appointments">;
export type Payment          = TableRow<"payments">;
export type CashSession      = TableRow<"cash_sessions">;
export type CashMovement     = TableRow<"cash_movements">;
export type Subscription     = TableRow<"subscriptions">;
export type Review           = TableRow<"reviews">;
export type InventoryProduct = TableRow<"inventory_products">;
export type AutomationRule   = TableRow<"automation_rules">;
export type GrowthCampaign   = TableRow<"growth_campaigns">;
export type GrowthLead       = TableRow<"growth_leads">;

// ── Status unions (reutilizables sin importar la row entera) ─────────────────

export type AppointmentStatus  = Appointment["status"];
export type AppointmentSource  = Appointment["source"];
export type PaymentMethod      = Payment["method"];
export type PaymentStatus      = Payment["status"];
export type CashMovementType   = CashMovement["movement_type"];
export type PlanName           = Subscription["plan_name"];
export type SubscriptionStatus = Subscription["status"];
