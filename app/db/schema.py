CREATE_TABLES_SQL = """
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('ETUDIANT', 'ENTREPRISE', 'STAFF')),
    linked_id INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS student (
    id INTEGER PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    bio TEXT DEFAULT '',
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    avatar_url TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS company (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT DEFAULT '',
    phone TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT DEFAULT '',
    phone TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS skill (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL CHECK(status IN ('PENDING', 'APPROVED', 'REJECTED')),
    suggested_by INTEGER,
    FOREIGN KEY (suggested_by) REFERENCES student(id)
);

CREATE TABLE IF NOT EXISTS student_skill (
    student_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    weight INTEGER NOT NULL CHECK(weight > 0 AND weight <= 100),
    PRIMARY KEY (student_id, skill_id),
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skill(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_skill (
    project_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, skill_id),
    FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skill(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS offer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    company_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    contact_email TEXT DEFAULT '',
    contact_phone TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'ARCHIVED')),
    created_at TEXT DEFAULT '',
    closed_at TEXT DEFAULT '',
    FOREIGN KEY (company_id) REFERENCES company(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS offer_skill (
    offer_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    PRIMARY KEY (offer_id, skill_id),
    FOREIGN KEY (offer_id) REFERENCES offer(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skill(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS application_match (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    offer_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    company_decision TEXT CHECK(company_decision IN ('LIKE', 'DISLIKE')),
    student_decision TEXT CHECK(student_decision IN ('LIKE', 'DISLIKE')),
    is_match INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE(offer_id, student_id),
    FOREIGN KEY (offer_id) REFERENCES offer(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS message (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    match_id INTEGER NOT NULL,
    sender_role TEXT NOT NULL CHECK(sender_role IN ('ETUDIANT', 'ENTREPRISE', 'STAFF')),
    content TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (match_id) REFERENCES application_match(id) ON DELETE CASCADE
);
"""
