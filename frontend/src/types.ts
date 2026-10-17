// Hand-written mirrors of the backend's Pydantic models (backend/models/*) — nothing infers
// across the Python/TypeScript boundary, so keep these in sync when a model changes.

export interface Service {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  category: string; // clinica | estetica | prevencao | emergencia
  price_from: number | null;
  price_note: string | null;
  duration_min: number;
  icon: string;
  image_url: string | null;
  features: string[];
  featured: boolean;
  order: number;
}

export interface Veterinarian {
  id: string;
  name: string;
  title: string;
  crmv: string;
  specialties: string[];
  bio: string;
  image_url: string | null;
  experience_years: number;
  shift: string;
  order: number;
}

export type AppointmentStatus = "pendente" | "confirmado" | "cancelado" | "concluido";

export interface Appointment {
  id: string;
  tutor_name: string;
  email: string;
  phone: string;
  service_id: string | null;
  service_name: string;
  vet_id: string | null;
  vet_name: string | null;
  date: string;
  time_slot: string;
  pet_name: string;
  pet_species: string;
  message: string | null;
  status: AppointmentStatus;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface AdminUser {
  username: string;
  name: string;
}
