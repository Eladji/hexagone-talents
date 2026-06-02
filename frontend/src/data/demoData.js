export const demoAccounts = [
  { username: "antoine.dev", label: "Antoine - Étudiant", role: "ETUDIANT" },
  { username: "maxime.dev", label: "Maxime - Étudiant", role: "ETUDIANT" },
  { username: "lucie.dev", label: "Lucie - Étudiant", role: "ETUDIANT" },
  { username: "nathalie.dev", label: "Nathalie - Étudiant", role: "ETUDIANT" },
  { username: "anais.dev", label: "Anaïs - Étudiant", role: "ETUDIANT" },
  { username: "sophie.dev", label: "Sophie - Étudiant", role: "ETUDIANT" },
  { username: "julien.dev", label: "Julien - Étudiant", role: "ETUDIANT" },
  { username: "clara.dev", label: "Clara - Étudiant", role: "ETUDIANT" },
  { username: "tech.solutions", label: "Tech Solutions - Entreprise", role: "ENTREPRISE" },
  { username: "innovate.labs", label: "Innovate Labs - Entreprise", role: "ENTREPRISE" },
  { username: "mobilio.team", label: "Mobilio - Entreprise", role: "ENTREPRISE" },
  { username: "data.hive", label: "DataHive - Entreprise", role: "ENTREPRISE" },
  { username: "creative.studio", label: "Creative Studio - Entreprise", role: "ENTREPRISE" },
  { username: "cloudworks", label: "CloudWorks - Entreprise", role: "ENTREPRISE" },
  { username: "staff", label: "Staff - École", role: "STAFF" },
];

export const seedSkills = [
  { id: 1, name: "React" },
  { id: 2, name: "Node.js" },
  { id: 3, name: "SQL" },
  { id: 4, name: "Python" },
  { id: 5, name: "Docker" },
];

export const seedOffers = [
  {
    id: 5,
    company_name: "Tech Solutions",
    title: "Developpeur Fullstack React/Node",
    description: "Recherche un alternant pour l'equipe produit.",
    required_skill_ids: [1, 2],
  },
];

export const seedCandidates = [
  {
    student_id: 12,
    firstname: "Antoine",
    lastname: "Dupont",
    avatar_url: "https://ui-avatars.com/api/?name=Antoine+Dupont&background=4969b2&color=ffffff",
    alignment_score: 70,
    skills: ["React (50pts)", "Node.js (30pts)", "SQL (20pts)"],
    bio: "Passionne par l'architecture logicielle.",
  },
  {
    student_id: 15,
    firstname: "Maxime",
    lastname: "Leroy",
    avatar_url: "https://ui-avatars.com/api/?name=Maxime+Leroy&background=4969b2&color=ffffff",
    alignment_score: 90,
    skills: ["React (80pts)", "Node.js (20pts)"],
    bio: "Etudiant en Master, disponible immediatement.",
  },
];

export function normalizeSkills(skills) {
  return skills.map((skill) => ({ ...skill, id: skill.id || skill.skill_id }));
}
