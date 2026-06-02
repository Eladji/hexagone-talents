const navItemsByRole = {
  ETUDIANT: [
    ["home", "List"],
    ["profile", "Profil"],
    ["edit", "Edit"],
    ["chat", "Conv"],
  ],
  ENTREPRISE: [
    ["home", "Offres"],
    ["list", "Candidats"],
    ["swipe", "Swipe"],
    ["profile", "Prof"],
    ["chat", "Conv"],
  ],
  STAFF: [
    ["home", "List"],
    ["catalog", "Cat"],
    ["chat", "Conv"],
  ],
};

export function RoleShell({ session, view, setView, children }) {
  const items = navItemsByRole[session.role];

  return (
    <>
      <aside className="side-rail">
        <p className="eyebrow">{session.role}</p>
        <h2>{session.username}</h2>
        <div className="nav-list">
          {items.map(([id, label]) => (
            <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id)}>
              {label}
            </button>
          ))}
        </div>
      </aside>
      <section className="content-stage">{children}</section>
    </>
  );
}
