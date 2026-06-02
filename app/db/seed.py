from __future__ import annotations

import sqlite3

from app.core.security import hash_password


DEFAULT_PASSWORD = "password123"


def seed_database(conn: sqlite3.Connection) -> None:
    has_users = conn.execute("SELECT COUNT(*) AS count FROM users").fetchone()["count"]
    if has_users:
        return

    conn.executemany(
        "INSERT INTO student(id, firstname, lastname, bio, email, phone, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
            (
                12,
                "Antoine",
                "Dupont",
                "Passionne par l'architecture logicielle.",
                "antoine@example.com",
                "0600000012",
                "https://ui-avatars.com/api/?name=Antoine+Dupont&background=4969b2&color=ffffff",
            ),
            (
                15,
                "Maxime",
                "Leroy",
                "Etudiant en Master, disponible immediatement.",
                "maxime@example.com",
                "0600000015",
                "https://ui-avatars.com/api/?name=Maxime+Leroy&background=4969b2&color=ffffff",
            ),
            (
                18,
                "Lucie",
                "Martin",
                "Intéressée par DevOps et l'architecture cloud.",
                "lucie@example.com",
                "0600000018",
                "https://ui-avatars.com/api/?name=Lucie+Martin&background=4969b2&color=ffffff",
            ),
            (
                21,
                "Nathalie",
                "Moreau",
                "Développeuse mobile et design system.",
                "nathalie@example.com",
                "0600000021",
                "https://ui-avatars.com/api/?name=Nathalie+Moreau&background=4969b2&color=ffffff",
            ),
            (
                24,
                "Anaïs",
                "Bernard",
                "Fascinée par l'analyse de données et l'UX.",
                "anais@example.com",
                "0600000024",
                "https://ui-avatars.com/api/?name=Ana%C3%AFs+Bernard&background=4969b2&color=ffffff",
            ),
            (
                27,
                "Sophie",
                "Riviere",
                "Créatrice de produits numériques et interfaces intuitives.",
                "sophie@example.com",
                "0600000027",
                "https://ui-avatars.com/api/?name=Sophie+Riviere&background=4969b2&color=ffffff",
            ),
            (
                30,
                "Julien",
                "Faure",
                "Passionné par le backend et l'architecture microservices.",
                "julien@example.com",
                "0600000030",
                "https://ui-avatars.com/api/?name=Julien+Faure&background=4969b2&color=ffffff",
            ),
            (
                33,
                "Clara",
                "Nguyen",
                "Spécialiste front-end avec une sensibilité design.",
                "clara@example.com",
                "0600000033",
                "https://ui-avatars.com/api/?name=Clara+Nguyen&background=4969b2&color=ffffff",
            ),
        ],
    )

    conn.executemany(
        "INSERT INTO company(id, name, email, phone) VALUES (?, ?, ?, ?)",
        [
            (201, "Tech Solutions", "recrutement@techsolutions.com", "0123456789"),
            (202, "Innovate Labs", "jobs@innovatelabs.com", "0123456790"),
            (203, "Mobilio", "contact@mobilio.com", "0123456791"),
            (204, "DataHive", "hello@datahive.com", "0123456792"),
            (205, "Creative Studio", "recrutement@creative.studio", "0123456793"),
            (206, "CloudWorks", "contact@cloudworks.com", "0123456794"),
        ],
    )

    conn.execute(
        "INSERT INTO staff(id, firstname, lastname, email, phone) VALUES (?, ?, ?, ?, ?)",
        (1, "Admin", "Staff", "staff@school.com", "0123456789"),
    )

    conn.executemany(
        "INSERT INTO skill(id, name, status, suggested_by) VALUES (?, ?, ?, ?)",
        [
            (1, "React", "APPROVED", None),
            (2, "Node.js", "APPROVED", None),
            (3, "SQL", "APPROVED", None),
            (4, "Python", "APPROVED", None),
            (5, "Docker", "APPROVED", None),
            (6, "Vue.js", "APPROVED", None),
            (7, "Kubernetes", "APPROVED", None),
            (8, "UX/UI", "APPROVED", None),
            (9, "Figma", "PENDING", 21),
            (10, "TypeScript", "PENDING", 15),
            (11, "GraphQL", "PENDING", 18),
        ],
    )

    conn.executemany(
        "INSERT INTO student_skill(student_id, skill_id, weight) VALUES (?, ?, ?)",
        [
            (12, 1, 50),
            (12, 2, 30),
            (12, 3, 20),
            (15, 1, 80),
            (15, 2, 20),
            (18, 4, 50),
            (18, 5, 50),
            (21, 1, 20),
            (21, 8, 40),
            (21, 3, 40),
            (24, 3, 40),
            (24, 8, 30),
            (24, 1, 30),
            (27, 6, 40),
            (27, 8, 30),
            (27, 1, 30),
            (30, 2, 40),
            (30, 5, 30),
            (30, 4, 30),
            (33, 6, 50),
            (33, 8, 50),
        ],
    )

    conn.execute(
        "INSERT INTO project(student_id, title, description) VALUES (?, ?, ?)",
        (12, "Application E-Commerce", "API et frontend React pour une boutique en ligne."),
    )
    project_id = conn.execute("SELECT last_insert_rowid() AS id").fetchone()["id"]
    conn.executemany(
        "INSERT INTO project_skill(project_id, skill_id) VALUES (?, ?)",
        [(project_id, 1), (project_id, 2)],
    )

    conn.execute(
        "INSERT INTO project(student_id, title, description) VALUES (?, ?, ?)",
        (18, "Plateforme DevOps interne", "Automatisation CI/CD avec Docker et Kubernetes."),
    )
    project_id = conn.execute("SELECT last_insert_rowid() AS id").fetchone()["id"]
    conn.executemany(
        "INSERT INTO project_skill(project_id, skill_id) VALUES (?, ?)",
        [(project_id, 4), (project_id, 5), (project_id, 7)],
    )

    conn.execute(
        "INSERT INTO project(student_id, title, description) VALUES (?, ?, ?)",
        (21, "Application Mobile UX", "Conception d'une app mobile cross-platform avec un design system."),
    )
    project_id = conn.execute("SELECT last_insert_rowid() AS id").fetchone()["id"]
    conn.executemany(
        "INSERT INTO project_skill(project_id, skill_id) VALUES (?, ?)",
        [(project_id, 1), (project_id, 8)],
    )

    conn.execute(
        "INSERT INTO project(student_id, title, description) VALUES (?, ?, ?)",
        (24, "Dashboard Analytics", "Outil de visualisation de données métiers avec focus UX."),
    )
    project_id = conn.execute("SELECT last_insert_rowid() AS id").fetchone()["id"]
    conn.executemany(
        "INSERT INTO project_skill(project_id, skill_id) VALUES (?, ?)",
        [(project_id, 3), (project_id, 8)],
    )

    conn.execute(
        "INSERT INTO project(student_id, title, description) VALUES (?, ?, ?)",
        (30, "API microservices", "Architecture REST scalable pour la gestion de commandes."),
    )
    project_id = conn.execute("SELECT last_insert_rowid() AS id").fetchone()["id"]
    conn.executemany(
        "INSERT INTO project_skill(project_id, skill_id) VALUES (?, ?)",
        [(project_id, 2), (project_id, 4), (project_id, 5)],
    )

    conn.execute(
        "INSERT INTO project(student_id, title, description) VALUES (?, ?, ?)",
        (33, "UI component library", "Création d'une bibliothèque de composants réutilisables pour apps web."),
    )
    project_id = conn.execute("SELECT last_insert_rowid() AS id").fetchone()["id"]
    conn.executemany(
        "INSERT INTO project_skill(project_id, skill_id) VALUES (?, ?)",
        [(project_id, 6), (project_id, 8)],
    )

    conn.execute(
        """
        INSERT INTO offer(id, company_name, title, description, contact_email, contact_phone)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            5,
            "Tech Solutions",
            "Developpeur Fullstack React/Node",
            "Recherche un alternant pour l'equipe produit.",
            "recrutement@techsolutions.com",
            "0123456789",
        ),
    )
    conn.executemany("INSERT INTO offer_skill(offer_id, skill_id) VALUES (?, ?)", [(5, 1), (5, 2)])

    conn.execute(
        """
        INSERT INTO offer(id, company_name, title, description, contact_email, contact_phone)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            6,
            "Innovate Labs",
            "Ingénieur DevOps",
            "Recherche un profil DevOps pour automatisation cloud et pipelines.",
            "jobs@innovatelabs.com",
            "0123456790",
        ),
    )
    conn.executemany("INSERT INTO offer_skill(offer_id, skill_id) VALUES (?, ?)", [(6, 4), (6, 5), (6, 7)])

    conn.execute(
        """
        INSERT INTO offer(id, company_name, title, description, contact_email, contact_phone)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            7,
            "Mobilio",
            "Designer / Développeur Mobile",
            "Recherche un profil mobile avec sens du design pour app native.",
            "contact@mobilio.com",
            "0123456791",
        ),
    )
    conn.executemany("INSERT INTO offer_skill(offer_id, skill_id) VALUES (?, ?)", [(7, 1), (7, 8)])

    conn.execute(
        """
        INSERT INTO offer(id, company_name, title, description, contact_email, contact_phone)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            8,
            "DataHive",
            "Analyste Data / SQL",
            "Recherche un profil data capable d'extraire et transformer de grandes tables SQL.",
            "hello@datahive.com",
            "0123456792",
        ),
    )
    conn.executemany("INSERT INTO offer_skill(offer_id, skill_id) VALUES (?, ?)", [(8, 3), (8, 4)])

    conn.execute(
        """
        INSERT INTO offer(id, company_name, title, description, contact_email, contact_phone)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            9,
            "Creative Studio",
            "Designer Produit / UX",
            "Recherche un designer produit capable de construire des interfaces utilisateur engageantes.",
            "recrutement@creative.studio",
            "0123456793",
        ),
    )
    conn.executemany("INSERT INTO offer_skill(offer_id, skill_id) VALUES (?, ?)", [(9, 8), (9, 1)])

    conn.execute(
        """
        INSERT INTO offer(id, company_name, title, description, contact_email, contact_phone)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            10,
            "CloudWorks",
            "Ingénieur Infrastructure Cloud",
            "Développement d'applications cloud avec déploiement conteneurisé.",
            "contact@cloudworks.com",
            "0123456794",
        ),
    )
    conn.executemany("INSERT INTO offer_skill(offer_id, skill_id) VALUES (?, ?)", [(10, 5), (10, 7), (10, 4)])

    conn.executemany(
        "INSERT INTO users(id, username, password, role, linked_id) VALUES (?, ?, ?, ?, ?)",
        [
            (12, "antoine.dev", hash_password(DEFAULT_PASSWORD), "ETUDIANT", 12),
            (15, "maxime.dev", hash_password(DEFAULT_PASSWORD), "ETUDIANT", 15),
            (18, "lucie.dev", hash_password(DEFAULT_PASSWORD), "ETUDIANT", 18),
            (21, "nathalie.dev", hash_password(DEFAULT_PASSWORD), "ETUDIANT", 21),
            (24, "anais.dev", hash_password(DEFAULT_PASSWORD), "ETUDIANT", 24),
            (27, "sophie.dev", hash_password(DEFAULT_PASSWORD), "ETUDIANT", 27),
            (30, "julien.dev", hash_password(DEFAULT_PASSWORD), "ETUDIANT", 30),
            (33, "clara.dev", hash_password(DEFAULT_PASSWORD), "ETUDIANT", 33),
            (201, "tech.solutions", hash_password(DEFAULT_PASSWORD), "ENTREPRISE", 201),
            (202, "innovate.labs", hash_password(DEFAULT_PASSWORD), "ENTREPRISE", 202),
            (203, "mobilio.team", hash_password(DEFAULT_PASSWORD), "ENTREPRISE", 203),
            (204, "data.hive", hash_password(DEFAULT_PASSWORD), "ENTREPRISE", 204),
            (205, "creative.studio", hash_password(DEFAULT_PASSWORD), "ENTREPRISE", 205),
            (206, "cloudworks", hash_password(DEFAULT_PASSWORD), "ENTREPRISE", 206),
            (1, "staff", hash_password(DEFAULT_PASSWORD), "STAFF", 1),
        ],
    )

    conn.executemany(
        "INSERT INTO application_match(id, offer_id, student_id, company_decision, student_decision, is_match, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
            (1, 5, 12, "LIKE", "LIKE", 1, "2026-06-01T10:00:00", "2026-06-01T10:00:00"),
            (2, 6, 18, "LIKE", "LIKE", 1, "2026-06-01T11:00:00", "2026-06-01T11:00:00"),
            (3, 7, 15, "LIKE", "DISLIKE", 0, "2026-06-01T12:00:00", "2026-06-01T12:00:00"),
            (4, 8, 24, "LIKE", "LIKE", 1, "2026-06-01T13:00:00", "2026-06-01T13:00:00"),
            (5, 9, 27, "LIKE", "LIKE", 1, "2026-06-01T14:00:00", "2026-06-01T14:00:00"),
            (6, 5, 21, "DISLIKE", "LIKE", 0, "2026-06-01T15:00:00", "2026-06-01T15:00:00"),
            (7, 10, 30, "LIKE", None, 0, "2026-06-01T16:00:00", "2026-06-01T16:00:00"),
            (8, 6, 33, "LIKE", "LIKE", 1, "2026-06-01T17:00:00", "2026-06-01T17:00:00"),
        ],
    )

    conn.executemany(
        "INSERT INTO message(match_id, sender_role, content, timestamp) VALUES (?, ?, ?, ?)",
        [
            (1, "ETUDIANT", "Bonjour, merci pour le match !", "2026-06-01T10:05:00"),
            (1, "ENTREPRISE", "Bonjour Antoine, ravi de vous compter dans notre pipeline.", "2026-06-01T10:10:00"),
            (2, "ETUDIANT", "Je suis disponible pour parler de l'offre DevOps.", "2026-06-01T11:15:00"),
            (2, "ENTREPRISE", "Super, nous organiserons un entretien cette semaine.", "2026-06-01T11:20:00"),
            (4, "ETUDIANT", "Bonjour DataHive, je suis intéressé par votre mission SQL.", "2026-06-01T13:10:00"),
            (4, "ENTREPRISE", "Merci Anaïs, pouvez-vous partager un lien vers votre portfolio ?", "2026-06-01T13:15:00"),
            (5, "ETUDIANT", "Bonjour, je serais ravi de rejoindre votre équipe design.", "2026-06-01T14:10:00"),
            (5, "ENTREPRISE", "Nous avons hâte de discuter de votre travail UX/UI.", "2026-06-01T14:15:00"),
            (8, "ETUDIANT", "Bonjour, j'ai une expérience en Vue.js et en design system.", "2026-06-01T17:10:00"),
            (8, "ENTREPRISE", "Parfait, nous allons planifier un entretien demain.", "2026-06-01T17:20:00"),
        ],
    )
