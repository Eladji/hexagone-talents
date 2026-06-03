import { Panel } from "../../components/ui";

export function StaffHome({ overview, pending, offers, accounts }) {
  return (
    <div className="screen-grid">
      <Panel title="Tableau de bord staff">
        <div className="admin-metrics">
          <Metric label="Comptes actifs" value={overview.active_accounts} />
          <Metric label="Comptes suspendus" value={overview.suspended_accounts} />
          <Metric label="Offres actives" value={overview.active_offers} />
          <Metric label="Offres archivees" value={overview.archived_offers} />
          <Metric label="Skills en attente" value={overview.pending_skills} />
        </div>
      </Panel>
      <Panel title="Actions rapides">
        <div className="admin-summary">
          <p>{pending.length} competence(s) a moderer.</p>
          <p>{offers.filter((offer) => offer.status === "ACTIVE").length} offre(s) actuellement publiee(s).</p>
          <p>{accounts.filter((account) => account.status === "SUSPENDED").length} compte(s) suspendu(s).</p>
        </div>
      </Panel>
    </div>
  );
}

export function SkillCatalog({ skills }) {
  return (
    <Panel title="Catalogue approuve">
      <div className="catalog-summary">
        <strong>{skills.length}</strong>
        <span>competence(s) validee(s) disponibles pour les profils et les offres.</span>
      </div>
      {skills.length === 0 ? (
        <p className="muted">Aucune competence approuvee pour le moment.</p>
      ) : (
        <div className="catalog-grid">
          {skills.map((skill) => (
            <article className="catalog-skill-card" key={skill.id}>
              <strong>{skill.name}</strong>
              <span>APPROVED</span>
            </article>
          ))}
        </div>
      )}
    </Panel>
  );
}

export function OffersAdmin({ offers, manageOffer }) {
  return (
    <Panel title="Gestion des offres">
      <div className="admin-table">
        <div className="admin-table-head offer-admin-grid">
          <span>Offre</span><span>Entreprise</span><span>Statut</span><span>Matches</span><span>Action</span>
        </div>
        {offers.map((offer) => (
          <div className="admin-table-row offer-admin-grid" key={offer.id}>
            <div><strong>{offer.title}</strong><small>{offer.description}</small></div>
            <span>{offer.company_name}</span>
            <span className={`status-pill ${offer.status === "ACTIVE" ? "active" : "archived"}`}>{offer.status}</span>
            <span>{offer.match_count} / {offer.interaction_count}</span>
            <button
              className={offer.status === "ACTIVE" ? "danger-button" : "primary-button"}
              onClick={() => manageOffer(offer.id, offer.status === "ACTIVE" ? "ARCHIVE" : "ACTIVATE")}
            >
              {offer.status === "ACTIVE" ? "Archiver" : "Reactiver"}
            </button>
          </div>
        ))}
        {offers.length === 0 && <p className="muted">Aucune offre trouvee.</p>}
      </div>
    </Panel>
  );
}

export function AccountsAdmin({ accounts, manageAccount }) {
  return (
    <Panel title="Gestion des comptes">
      <div className="admin-table">
        <div className="admin-table-head account-admin-grid">
          <span>Compte</span><span>Role</span><span>Email</span><span>Statut</span><span>Action</span>
        </div>
        {accounts.map((account) => (
          <div className="admin-table-row account-admin-grid" key={account.id}>
            <div><strong>{account.display_name || account.username}</strong><small>{account.username}</small></div>
            <span>{account.role}</span>
            <span>{account.email || "Non renseigne"}</span>
            <span className={`status-pill ${account.status === "ACTIVE" ? "active" : "suspended"}`}>{account.status}</span>
            {account.role === "STAFF" ? (
              <span className="muted">Protege</span>
            ) : (
              <button
                className={account.status === "ACTIVE" ? "danger-button" : "primary-button"}
                onClick={() => manageAccount(account.id, account.status === "ACTIVE" ? "SUSPEND" : "ACTIVATE")}
              >
                {account.status === "ACTIVE" ? "Suspendre" : "Reactiver"}
              </button>
            )}
          </div>
        ))}
        {accounts.length === 0 && <p className="muted">Aucun compte trouve.</p>}
      </div>
    </Panel>
  );
}

export function SkillModeration({ pending, moderateSkill }) {
  return (
    <Panel title="Moderation des competences">
      {pending.length === 0 && <p className="muted">Aucune demande en attente.</p>}
      {pending.map((skill) => (
        <div className="moderation-row" key={skill.id}>
          <strong>{skill.name}</strong>
          <div className="button-row">
            <button onClick={() => moderateSkill(skill.id, "REJECT")}>Rejeter</button>
            <button className="primary-button" onClick={() => moderateSkill(skill.id, "APPROVE")}>Valider</button>
          </div>
        </div>
      ))}
    </Panel>
  );
}

function Metric({ label, value }) {
  return <div><span>{label}</span><strong>{value}</strong></div>;
}
