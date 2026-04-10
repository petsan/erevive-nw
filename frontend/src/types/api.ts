export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
}

export interface ItemResponse {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string | null;
  brand: string | null;
  model_name: string | null;
  condition: string | null;
  ai_provider: string | null;
  ai_confidence: number | null;
  status: string;
  pickup_id: string | null;
  created_at: string;
}

export interface PickupResponse {
  id: string;
  status: string;
  scheduled_date: string;
  time_window: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  zip_code: string;
  special_instructions: string | null;
  created_at: string;
}

export interface IdentificationResult {
  title: string;
  description: string;
  category: string | null;
  brand: string | null;
  model_name: string | null;
  condition: string | null;
  confidence: number;
  provider: string;
}
