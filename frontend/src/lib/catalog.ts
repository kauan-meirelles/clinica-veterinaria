import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { Service, Veterinarian } from "@/types";

// Built-in copy of the seeded catalog (backend/seed.py). Shown whenever the API is
// unreachable (backend restarting, or the preview served as a static bundle) so the
// public pages never render empty. Live API data always wins when available.

const VET_IMG = {
  carlos:
    "https://images.unsplash.com/photo-1770836037793-95bdbf190f71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHwzfHx2ZXRlcmluYXJpYW4lMjBleGFtaW5pbmclMjBkb2d8ZW58MHx8fHwxNzkwMjk0NDQzfDA&ixlib=rb-4.1.0&q=85",
  marina:
    "https://images.pexels.com/photos/28644631/pexels-photo-28644631.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  lucas:
    "https://images.unsplash.com/photo-1770836037816-4445dbd449fd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHw0fHx2ZXRlcmluYXJpYW4lMjBleGFtaW5pbmclMjBkb2d8ZW58MHx8fHwxNzkwMjk0NDQzfDA&ixlib=rb-4.1.0&q=85",
  camila:
    "https://images.pexels.com/photos/6234980/pexels-photo-6234980.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
};

export const FALLBACK_SERVICES: Service[] = [
  {
    id: "consulta-geral", slug: "consulta-geral", name: "Consulta Geral", category: "clinica",
    icon: "stethoscope", price_from: 180, price_note: null, duration_min: 30, featured: true, order: 1, image_url: null,
    short_description: "Atendimento clínico completo para cães, gatos e outros pets, com anamnese detalhada.",
    description: "Avaliação completa da saúde do seu pet, com plano de cuidados claro e encaminhamento a especialistas quando necessário.",
    features: ["Anamnese completa", "Clínico geral e especialistas", "Acompanhamento contínuo"],
  },
  {
    id: "banho-tosa", slug: "banho-tosa", name: "Banho & Tosa", category: "estetica",
    icon: "scissors", price_from: 90, price_note: null, duration_min: 60, featured: true, order: 2, image_url: null,
    short_description: "Higiene e estética com produtos hipoalergênicos, escolhidos para cada tipo de pele e pelagem.",
    description: "Ambiente tranquilo, secamento com temperatura controlada e tosa higiênica ou da raça.",
    features: ["Produtos hipoalergênicos", "Tosa higiênica e da raça", "Espaço exclusivo para felinos"],
  },
  {
    id: "vacinacao", slug: "vacinacao", name: "Vacinação & Imunização", category: "prevencao",
    icon: "syringe", price_from: 120, price_note: null, duration_min: 20, featured: true, order: 3, image_url: null,
    short_description: "Protocolos atualizados para cães e gatos, com carteira de vacinação digital.",
    description: "Vacinas nacionais e importadas, aplicadas somente após avaliação clínica.",
    features: ["Protocolos atualizados", "Vacinas nacionais e importadas", "Carteira de vacinação digital"],
  },
  {
    id: "emergencia-24h", slug: "emergencia-24h", name: "Emergência 24h", category: "emergencia",
    icon: "siren", price_from: null, price_note: "Plantão 24h · sob consulta", duration_min: 60, featured: true, order: 4, image_url: null,
    short_description: "Pronto atendimento dia e noite, com UTI veterinária e equipe de plantão.",
    description: "Plantão todos os dias do ano para urgências como acidentes, intoxicações e partos.",
    features: ["Pronto atendimento dia e noite", "UTI veterinária", "Equipe de plantão dedicada"],
  },
  {
    id: "cirurgia", slug: "cirurgia", name: "Cirurgia Veterinária", category: "clinica",
    icon: "heart-pulse", price_from: 650, price_note: null, duration_min: 120, featured: false, order: 5, image_url: null,
    short_description: "Centro cirúrgico próprio com anestesia monitorada e pós-operatório completo.",
    description: "De castrações a procedimentos ortopédicos, com avaliação pré-anestésica e monitorização.",
    features: ["Anestesia monitorada", "Centro cirúrgico próprio", "Pós-operatório completo"],
  },
  {
    id: "exames", slug: "exames", name: "Exames & Diagnóstico por Imagem", category: "prevencao",
    icon: "microscope", price_from: 220, price_note: null, duration_min: 40, featured: false, order: 6, image_url: null,
    short_description: "Laboratório interno, ultrassom e raio-X digitais com resultado em até 24h.",
    description: "Hemograma, bioquímicos, ultrassonografia e radiologia digital no mesmo endereço.",
    features: ["Hemograma e bioquímicos", "Ultrassom e raio-X digitais", "Resultado em até 24h"],
  },
];

export const FALLBACK_VETS: Veterinarian[] = [
  {
    id: "dr-carlos", name: "Dr. Carlos Eduardo Oliveira", title: "Cirurgião Veterinário · Ortopedia", crmv: "CRMV-SP 31245",
    specialties: ["Cirurgia geral", "Ortopedia", "Traumatologia"], image_url: VET_IMG.carlos, experience_years: 14,
    shift: "Seg–Sex · 08h–17h", order: 1,
    bio: "Com 14 anos de centro cirúrgico, o Dr. Carlos lidera as cirurgias do Instituto Vida Animal, com referência em ortopedia e traumatologia.",
  },
  {
    id: "dra-marina", name: "Dra. Marina Silva", title: "Clínica Geral · Medicina Felina", crmv: "CRMV-SP 29871",
    specialties: ["Medicina felina", "Prevenção", "Geriatria"], image_url: VET_IMG.marina, experience_years: 11,
    shift: "Seg–Sáb · 09h–18h", order: 2,
    bio: "A Dra. Marina conduz a área cat-friendly da clínica e acompanha pacientes geriátricos com planos individualizados.",
  },
  {
    id: "dr-lucas", name: "Dr. Lucas Mendes", title: "Odontologia · Clínico Geral", crmv: "CRMV-SP 33410",
    specialties: ["Odontologia", "Clínica geral", "Nutrição"], image_url: VET_IMG.lucas, experience_years: 9,
    shift: "Ter–Sáb · 10h–19h", order: 3,
    bio: "O Dr. Lucas cuida da saúde bucal dos pets e atende clínico geral com foco em nutrição.",
  },
  {
    id: "dra-camila", name: "Dra. Camila Ramos", title: "Dermatologia · Imunização", crmv: "CRMV-SP 30155",
    specialties: ["Dermatologia", "Alergias", "Vacinação"], image_url: VET_IMG.camila, experience_years: 12,
    shift: "Seg–Qui · 08h–16h", order: 4,
    bio: "Especialista em pele e alergias, a Dra. Camila comanda o calendário de vacinação da clínica.",
  },
];

// Retries ride out a backend restart; on final failure (or an empty DB) the built-in catalog shows.
export function useServices() {
  const query = useQuery({
    queryKey: ["services"],
    queryFn: () => apiGet<Service[]>("/services"),
    retry: 3,
  });
  const live = !query.isError && query.data && query.data.length > 0 ? query.data : null;
  return { services: live ?? (query.isPending ? [] : FALLBACK_SERVICES), isPending: query.isPending };
}

export function useVeterinarians() {
  const query = useQuery({
    queryKey: ["veterinarians"],
    queryFn: () => apiGet<Veterinarian[]>("/veterinarians"),
    retry: 3,
  });
  const live = !query.isError && query.data && query.data.length > 0 ? query.data : null;
  return { vets: live ?? (query.isPending ? [] : FALLBACK_VETS), isPending: query.isPending };
}
