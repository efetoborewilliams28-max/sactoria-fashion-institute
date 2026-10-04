export type CatalogueItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  whatsapp_message: string | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id: number;
  institute_name: string;
  tagline: string;
  logo_url: string | null;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  updated_at: string;
};
