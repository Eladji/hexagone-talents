STUDENTS = [
    (12, "Antoine", "Dupont", "Passionne par l'architecture logicielle.", "antoine@example.com", "0600000012"),
    (15, "Maxime", "Leroy", "Etudiant en Master, disponible immediatement.", "maxime@example.com", "0600000015"),
    (18, "Lucie", "Martin", "Interessee par DevOps et l'architecture cloud.", "lucie@example.com", "0600000018"),
    (21, "Nathalie", "Moreau", "Developpeuse mobile et design system.", "nathalie@example.com", "0600000021"),
    (24, "Anais", "Bernard", "Fascinee par l'analyse de donnees et l'UX.", "anais@example.com", "0600000024"),
    (27, "Sophie", "Riviere", "Creatrice de produits numeriques et interfaces intuitives.", "sophie@example.com", "0600000027"),
    (30, "Julien", "Faure", "Passionne par le backend et les microservices.", "julien@example.com", "0600000030"),
    (33, "Clara", "Nguyen", "Specialiste front-end avec une sensibilite design.", "clara@example.com", "0600000033"),
    (36, "Maya", "Benali", "Fullstack orientee API et experience utilisateur.", "maya@example.com", "0600000036"),
    (39, "Hugo", "Petit", "Backend Python, tests et industrialisation.", "hugo@example.com", "0600000039"),
    (42, "Ines", "Garnier", "Produit data avec forte culture accessibilite.", "ines@example.com", "0600000042"),
    (45, "Karim", "Diallo", "Infrastructure cloud, securite et CI/CD.", "karim@example.com", "0600000045"),
]

COMPANIES = [
    (201, "Tech Solutions", "recrutement@techsolutions.com", "0123456789"),
    (202, "Innovate Labs", "jobs@innovatelabs.com", "0123456790"),
    (203, "Mobilio", "contact@mobilio.com", "0123456791"),
    (204, "DataHive", "hello@datahive.com", "0123456792"),
    (205, "Creative Studio", "recrutement@creative.studio", "0123456793"),
    (206, "CloudWorks", "contact@cloudworks.com", "0123456794"),
    (207, "GreenOps", "jobs@greenops.fr", "0123456795"),
    (208, "Finovia", "talents@finovia.fr", "0123456796"),
    (209, "HealthBridge", "recrutement@healthbridge.fr", "0123456797"),
    (210, "Studio Atlas", "hello@studio-atlas.fr", "0123456798"),
]

STAFF = [(1, "Admin", "Staff", "staff@school.com", "0123456789")]

SKILLS = [
    (1, "React", "APPROVED", None), (2, "Node.js", "APPROVED", None), (3, "SQL", "APPROVED", None),
    (4, "Python", "APPROVED", None), (5, "Docker", "APPROVED", None), (6, "Vue.js", "APPROVED", None),
    (7, "Kubernetes", "APPROVED", None), (8, "UX/UI", "APPROVED", None), (9, "TypeScript", "APPROVED", None),
    (10, "FastAPI", "APPROVED", None), (11, "PostgreSQL", "APPROVED", None), (12, "CI/CD", "APPROVED", None),
    (13, "Tests", "APPROVED", None), (14, "Product Design", "APPROVED", None), (15, "Next.js", "APPROVED", None),
    (16, "Security", "APPROVED", None), (17, "Figma", "PENDING", 21), (18, "GraphQL", "PENDING", 18),
    (19, "Terraform", "PENDING", 45), (20, "Rust", "PENDING", 39),
]

STUDENT_SKILLS = [
    (12, 1, 50), (12, 2, 30), (12, 3, 20), (15, 1, 55), (15, 9, 30), (15, 13, 15),
    (18, 4, 35), (18, 5, 30), (18, 7, 20), (18, 12, 15), (21, 1, 20), (21, 8, 35),
    (21, 14, 30), (21, 9, 15), (24, 3, 35), (24, 8, 25), (24, 11, 25), (24, 1, 15),
    (27, 6, 35), (27, 8, 25), (27, 14, 25), (27, 1, 15), (30, 2, 30), (30, 5, 25),
    (30, 4, 25), (30, 10, 20), (33, 6, 35), (33, 8, 25), (33, 9, 25), (33, 15, 15),
    (36, 1, 30), (36, 10, 30), (36, 9, 25), (36, 13, 15), (39, 4, 35), (39, 10, 25),
    (39, 11, 20), (39, 13, 20), (42, 3, 30), (42, 14, 25), (42, 8, 25), (42, 16, 20),
    (45, 5, 30), (45, 7, 30), (45, 12, 25), (45, 16, 15),
]

PROJECTS = [
    (12, "Application E-Commerce", "API et frontend React pour une boutique en ligne.", [1, 2]),
    (18, "Plateforme DevOps interne", "Automatisation CI/CD avec Docker et Kubernetes.", [4, 5, 7, 12]),
    (21, "Application Mobile UX", "Prototype produit et design system responsive.", [1, 8, 14]),
    (24, "Dashboard Analytics", "Visualisation de donnees metiers avec parcours UX.", [3, 8, 11]),
    (30, "API microservices", "Architecture REST scalable pour la gestion de commandes.", [2, 4, 5, 10]),
    (33, "UI component library", "Bibliotheque de composants web reutilisables.", [6, 8, 9]),
    (36, "Portail SaaS RH", "Frontend React et API FastAPI pour le suivi candidats.", [1, 9, 10]),
    (39, "Qualite API bancaire", "Suite de tests et monitoring pour APIs Python.", [4, 10, 13]),
    (42, "Audit parcours inclusif", "Refonte UX orientee accessibilite et data produit.", [3, 8, 14, 16]),
    (45, "Cluster staging securise", "Deploiement Docker/Kubernetes avec pipelines CI.", [5, 7, 12, 16]),
]

OFFERS = [
    (5, 201, "Tech Solutions", "Developpeur Fullstack React/Node", "Alternance produit React et API Node.", "recrutement@techsolutions.com", "0123456789", "ACTIVE", "2026-06-01T09:00:00", "", [1, 2]),
    (6, 202, "Innovate Labs", "Ingenieur DevOps", "Automatisation cloud, pipelines et conteneurs.", "jobs@innovatelabs.com", "0123456790", "ACTIVE", "2026-06-01T10:00:00", "", [4, 5, 7]),
    (7, 203, "Mobilio", "Designer / Developpeur Mobile", "Produit mobile avec forte sensibilite design.", "contact@mobilio.com", "0123456791", "ACTIVE", "2026-06-01T11:00:00", "", [1, 8]),
    (8, 204, "DataHive", "Analyste Data / SQL", "Extraction et transformation de tables SQL.", "hello@datahive.com", "0123456792", "ACTIVE", "2026-06-01T12:00:00", "", [3, 11]),
    (9, 205, "Creative Studio", "Designer Produit / UX", "Interfaces engageantes et design produit.", "recrutement@creative.studio", "0123456793", "ACTIVE", "2026-06-01T13:00:00", "", [8, 14]),
    (10, 206, "CloudWorks", "Ingenieur Infrastructure Cloud", "Applications cloud et deploiement conteneurise.", "contact@cloudworks.com", "0123456794", "ACTIVE", "2026-06-01T14:00:00", "", [5, 7, 12]),
    (11, 207, "GreenOps", "Developpeur Green IT", "Optimisation applicative et suivi d'impact.", "jobs@greenops.fr", "0123456795", "ACTIVE", "2026-06-02T09:00:00", "", [4, 12, 13]),
    (12, 208, "Finovia", "Backend FastAPI Finance", "API Python, PostgreSQL et securite applicative.", "talents@finovia.fr", "0123456796", "ACTIVE", "2026-06-02T10:00:00", "", [4, 10, 11, 16]),
    (13, 209, "HealthBridge", "Frontend accessibilite", "Interfaces React conformes et parcours patients.", "recrutement@healthbridge.fr", "0123456797", "ACTIVE", "2026-06-02T11:00:00", "", [1, 8, 16]),
    (14, 210, "Studio Atlas", "Product Designer Web", "Design system, prototypes et integration UI.", "hello@studio-atlas.fr", "0123456798", "ACTIVE", "2026-06-02T12:00:00", "", [8, 14, 9]),
    (101, 201, "Tech Solutions", "Stage QA Automatisation", "Ancienne campagne de tests automatises.", "recrutement@techsolutions.com", "0123456789", "ARCHIVED", "2026-02-12T09:30:00", "2026-04-18T17:00:00", [4, 13]),
    (102, 201, "Tech Solutions", "Integrateur Web Junior", "Ancienne offre integration responsive.", "recrutement@techsolutions.com", "0123456789", "ARCHIVED", "2026-01-08T11:00:00", "2026-03-21T16:30:00", [1, 8]),
]

USER_ACCOUNTS = [
    (12, "antoine.dev", "ETUDIANT", 12), (15, "maxime.dev", "ETUDIANT", 15), (18, "lucie.dev", "ETUDIANT", 18),
    (21, "nathalie.dev", "ETUDIANT", 21), (24, "anais.dev", "ETUDIANT", 24), (27, "sophie.dev", "ETUDIANT", 27),
    (30, "julien.dev", "ETUDIANT", 30), (33, "clara.dev", "ETUDIANT", 33), (36, "maya.dev", "ETUDIANT", 36),
    (39, "hugo.dev", "ETUDIANT", 39), (42, "ines.dev", "ETUDIANT", 42), (45, "karim.dev", "ETUDIANT", 45),
    (201, "tech.solutions", "ENTREPRISE", 201), (202, "innovate.labs", "ENTREPRISE", 202), (203, "mobilio.team", "ENTREPRISE", 203),
    (204, "data.hive", "ENTREPRISE", 204), (205, "creative.studio", "ENTREPRISE", 205), (206, "cloudworks", "ENTREPRISE", 206),
    (207, "greenops", "ENTREPRISE", 207), (208, "finovia", "ENTREPRISE", 208), (209, "healthbridge", "ENTREPRISE", 209),
    (210, "studio.atlas", "ENTREPRISE", 210), (1, "staff", "STAFF", 1),
]

APPLICATION_MATCHES = [
    (1, 5, 12, "LIKE", "LIKE", 1), (2, 6, 18, "LIKE", "LIKE", 1), (3, 7, 15, "LIKE", "DISLIKE", 0),
    (4, 8, 24, "LIKE", "LIKE", 1), (5, 9, 27, "LIKE", "LIKE", 1), (6, 5, 21, "DISLIKE", "LIKE", 0),
    (7, 10, 30, "LIKE", None, 0), (8, 6, 33, "LIKE", "LIKE", 1), (9, 12, 39, "LIKE", None, 0),
    (10, 13, 42, "LIKE", None, 0), (11, 14, 21, "LIKE", None, 0), (12, 11, 45, "LIKE", "LIKE", 1),
    (13, 12, 36, "LIKE", "LIKE", 1), (14, 13, 33, "LIKE", "DISLIKE", 0),
]

MESSAGES = [
    (1, "ETUDIANT", "Bonjour, merci pour le match !"), (1, "ENTREPRISE", "Bonjour Antoine, ravi de vous compter dans notre pipeline."),
    (2, "ETUDIANT", "Je suis disponible pour parler de l'offre DevOps."), (2, "ENTREPRISE", "Super, nous organiserons un entretien cette semaine."),
    (4, "ETUDIANT", "Bonjour DataHive, je suis interesse par votre mission SQL."), (4, "ENTREPRISE", "Merci Anais, pouvez-vous partager un lien portfolio ?"),
    (5, "ETUDIANT", "Bonjour, je serais ravie de rejoindre votre equipe design."), (5, "ENTREPRISE", "Nous avons hate de discuter de votre travail UX/UI."),
    (8, "ETUDIANT", "Bonjour, j'ai une experience en Vue.js et design system."), (8, "ENTREPRISE", "Parfait, nous allons planifier un entretien demain."),
    (12, "ETUDIANT", "Bonjour GreenOps, votre sujet CI/CD m'interesse."), (12, "ENTREPRISE", "Merci Karim, parlons de votre cluster staging."),
    (13, "ENTREPRISE", "Bonjour Maya, votre profil FastAPI correspond bien."), (13, "ETUDIANT", "Merci, je peux presenter mon portail SaaS RH."),
]
