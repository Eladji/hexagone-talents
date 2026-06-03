export const demoAccounts = [
  { username: "antoine.dev", label: "Antoine - Etudiant", role: "ETUDIANT" },
  { username: "maxime.dev", label: "Maxime - Etudiant", role: "ETUDIANT" },
  { username: "lucie.dev", label: "Lucie - Etudiant", role: "ETUDIANT" },
  { username: "nathalie.dev", label: "Nathalie - Etudiant", role: "ETUDIANT" },
  { username: "anais.dev", label: "Anais - Etudiant", role: "ETUDIANT" },
  { username: "sophie.dev", label: "Sophie - Etudiant", role: "ETUDIANT" },
  { username: "julien.dev", label: "Julien - Etudiant", role: "ETUDIANT" },
  { username: "clara.dev", label: "Clara - Etudiant", role: "ETUDIANT" },
  { username: "maya.dev", label: "Maya - Etudiant", role: "ETUDIANT" },
  { username: "hugo.dev", label: "Hugo - Etudiant", role: "ETUDIANT" },
  { username: "ines.dev", label: "Ines - Etudiant", role: "ETUDIANT" },
  { username: "karim.dev", label: "Karim - Etudiant", role: "ETUDIANT" },
  { username: "tech.solutions", label: "Tech Solutions - Entreprise", role: "ENTREPRISE" },
  { username: "innovate.labs", label: "Innovate Labs - Entreprise", role: "ENTREPRISE" },
  { username: "mobilio.team", label: "Mobilio - Entreprise", role: "ENTREPRISE" },
  { username: "data.hive", label: "DataHive - Entreprise", role: "ENTREPRISE" },
  { username: "creative.studio", label: "Creative Studio - Entreprise", role: "ENTREPRISE" },
  { username: "cloudworks", label: "CloudWorks - Entreprise", role: "ENTREPRISE" },
  { username: "greenops", label: "GreenOps - Entreprise", role: "ENTREPRISE" },
  { username: "finovia", label: "Finovia - Entreprise", role: "ENTREPRISE" },
  { username: "healthbridge", label: "HealthBridge - Entreprise", role: "ENTREPRISE" },
  { username: "studio.atlas", label: "Studio Atlas - Entreprise", role: "ENTREPRISE" },
  { username: "staff", label: "Staff - Ecole", role: "STAFF" },
];

export const seedSkills = [
  "React", "Node.js", "SQL", "Python", "Docker", "Vue.js", "Kubernetes", "UX/UI",
  "TypeScript", "FastAPI", "PostgreSQL", "CI/CD", "Tests", "Product Design", "Next.js", "Security",
].map((name, index) => ({ id: index + 1, name }));

export const seedOffers = [
  {
    id: 5,
    company_name: "Tech Solutions",
    title: "Developpeur Fullstack React/Node",
    description: "Alternance produit React et API Node.",
    status: "ACTIVE",
    required_skill_ids: [1, 2],
  },
  {
    id: 12,
    company_name: "Finovia",
    title: "Backend FastAPI Finance",
    description: "API Python, PostgreSQL et securite applicative.",
    status: "ACTIVE",
    required_skill_ids: [4, 10, 11, 16],
  },
  {
    id: 13,
    company_name: "HealthBridge",
    title: "Frontend accessibilite",
    description: "Interfaces React conformes et parcours patients.",
    status: "ACTIVE",
    required_skill_ids: [1, 8, 16],
  },
  {
    id: 14,
    company_name: "Studio Atlas",
    title: "Product Designer Web",
    description: "Design system, prototypes et integration UI.",
    status: "ACTIVE",
    required_skill_ids: [8, 14, 9],
  },
];

export const seedOfferHistory = [
  {
    id: 101,
    company_name: "Tech Solutions",
    title: "Stage QA Automatisation",
    description: "Ancienne campagne de tests automatises pour stabiliser les parcours critiques.",
    status: "ARCHIVED",
    created_at: "2026-02-12T09:30:00",
    closed_at: "2026-04-18T17:00:00",
    required_skill_ids: [4, 13],
  },
  {
    id: 102,
    company_name: "Tech Solutions",
    title: "Integrateur Web Junior",
    description: "Ancienne offre orientee integration responsive et correction UI.",
    status: "ARCHIVED",
    created_at: "2026-01-08T11:00:00",
    closed_at: "2026-03-21T16:30:00",
    required_skill_ids: [1, 8],
  },
];

export const seedCandidates = [
  {
    student_id: 36,
    firstname: "Maya",
    lastname: "Benali",
    avatar_url: "https://ui-avatars.com/api/?name=Maya+Benali&background=4969b2&color=ffffff",
    alignment_score: 92,
    skills: ["React (30pts)", "FastAPI (30pts)", "TypeScript (25pts)", "Tests (15pts)"],
    bio: "Fullstack orientee API et experience utilisateur.",
  },
  {
    student_id: 39,
    firstname: "Hugo",
    lastname: "Petit",
    avatar_url: "https://ui-avatars.com/api/?name=Hugo+Petit&background=4969b2&color=ffffff",
    alignment_score: 88,
    skills: ["Python (35pts)", "FastAPI (25pts)", "PostgreSQL (20pts)", "Tests (20pts)"],
    bio: "Backend Python, tests et industrialisation.",
  },
  {
    student_id: 42,
    firstname: "Ines",
    lastname: "Garnier",
    avatar_url: "https://ui-avatars.com/api/?name=Ines+Garnier&background=4969b2&color=ffffff",
    alignment_score: 81,
    skills: ["SQL (30pts)", "Product Design (25pts)", "UX/UI (25pts)", "Security (20pts)"],
    bio: "Produit data avec forte culture accessibilite.",
  },
];

export function normalizeSkills(skills) {
  return skills.map((skill) => ({ ...skill, id: skill.id || skill.skill_id }));
}
