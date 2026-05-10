export type ReservationStatus = "requested" | "confirmed" | "cancelled";

export type MenuItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_nok: number;
  category: string;
  image_path: string | null;
  image_alt: string | null;
  featured: boolean;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Reservation = {
  id: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  status: ReservationStatus;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id: "main";
  hero_headline: string;
  hero_subcopy: string;
  foodora_url: string;
  opening_hours: string;
  og_image_path: string | null;
  hero_image_path: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminUser = {
  user_id: string;
  email: string;
  active: boolean;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: AdminUser;
        Insert: Omit<AdminUser, "created_at"> & { created_at?: string };
        Update: Partial<Omit<AdminUser, "user_id">>;
        Relationships: [];
      };
      menu_items: {
        Row: MenuItem;
        Insert: Omit<MenuItem, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<MenuItem, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      reservations: {
        Row: Reservation;
        Insert: Omit<Reservation, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Reservation, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSettings;
        Insert: Omit<SiteSettings, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<SiteSettings, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type ActionState = {
  ok: boolean;
  message: string;
};
