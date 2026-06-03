export function StudentProfile({ profile, setView }) {
  const skills = profile?.skills || [];
  const projects = profile?.projects || [];
  const initials = `${profile?.firstname?.[0] || "A"}${profile?.lastname?.[0] || "D"}`;
  const fullName = `${profile?.firstname || "Antoine"} ${profile?.lastname || "Dupont"}`;

  return (
    <div className="user-profile-page">
      <section className="profile-hero">
        {profile?.avatar_url ? (
          <img className="profile-photo" src={profile.avatar_url} alt={fullName} />
        ) : (
          <div className="profile-photo placeholder">{initials}</div>
        )}
        <div className="profile-identity">
          <span className="eyebrow">Profil utilisateur</span>
          <h1>{fullName}</h1>
          <p>{profile?.bio || "Passionne par l'architecture logicielle et les interfaces produit."}</p>
          <div className="profile-contact">
            <span>{profile?.email || "email non renseigne"}</span>
            <span>{profile?.phone || "telephone non renseigne"}</span>
          </div>
        </div>
        <button className="primary-button" onClick={() => setView("edit")}>Modifier</button>
      </section>

      <div className="profile-stats">
        <div><span>Competences</span><strong>{skills.length}</strong></div>
        <div><span>Projets</span><strong>{projects.length}</strong></div>
        <div><span>Budget</span><strong>{skills.reduce((sum, skill) => sum + Number(skill.weight || 0), 0)} pts</strong></div>
      </div>

      <section className="profile-section">
        <h2>Competences</h2>
        <div className="skill-board">
          {skills.map((skill) => (
            <article key={skill.id} className="skill-tile">
              <strong>{skill.name}</strong>
              <span>{skill.weight} pts</span>
            </article>
          ))}
          {skills.length === 0 && <p className="muted">Aucune competence sauvegardee.</p>}
        </div>
      </section>

      <section className="profile-section">
        <h2>Projets preuves</h2>
        <div className="project-grid">
          {projects.map((project) => (
            <article key={project.id} className="project-card">
              <strong>{project.title}</strong>
              <p>{project.description}</p>
              <div className="chip-row">
                {project.skills.map((skill) => <span key={skill.id}>{skill.name}</span>)}
              </div>
            </article>
          ))}
          {projects.length === 0 && <p className="muted">Aucun projet sauvegarde.</p>}
        </div>
      </section>
    </div>
  );
}
