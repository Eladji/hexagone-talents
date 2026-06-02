import { useEffect, useState } from "react";

import { Panel } from "../../components/ui";
import { normalizeSkills, seedSkills } from "../../data/demoData";
import { ChatPanel } from "../chat/ChatPanel";

export function StaffSpace({ api, view }) {
  const [pending, setPending] = useState([]);
  const [skills, setSkills] = useState(seedSkills);
  const [overview, setOverview] = useState({
    active_accounts: 0,
    suspended_accounts: 0,
    active_offers: 0,
    archived_offers: 0,
    pending_skills: 0,
  });
  const [offers, setOffers] = useState([]);
  const [accounts, setAccounts] = useState([]);

  function refreshStaffData() {
    api.safe(overview, () => api.request("/staff/overview")).then(setOverview);
    api.safe([], () => api.request("/staff/skills/pending").then(normalizeSkills)).then(setPending);
    api.safe(seedSkills, () => api.request("/skills").then(normalizeSkills)).then(setSkills);
    api.safe([], () => api.request("/staff/offers")).then(setOffers);
    api.safe([], () => api.request("/staff/accounts")).then(setAccounts);
  }

  useEffect(() => {
    refreshStaffData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api]);

  async function moderateSkill(skillId, action) {
    await api.safe(null, () => api.request(`/staff/skills/${skillId}`, { method: "PATCH", body: JSON.stringify({ action }) }));
    setPending((current) => current.filter((item) => item.id !== skillId));
    refreshStaffData();
  }

  async function manageOffer(offerId, action) {
    const updated = await api.safe(null, () => api.request(`/staff/offers/${offerId}`, { method: "PATCH", body: JSON.stringify({ action }) }));
    if (!updated) return;
    setOffers((current) => current.map((offer) => (offer.id === offerId ? { ...offer, status: updated.status, closed_at: action === "ACTIVATE" ? "" : offer.closed_at } : offer)));
    refreshStaffData();
  }

  async function manageAccount(userId, action) {
    const updated = await api.safe(null, () => api.request(`/staff/accounts/${userId}`, { method: "PATCH", body: JSON.stringify({ action }) }));
    if (!updated) return;
    setAccounts((current) => current.map((account) => (account.id === userId ? { ...account, status: updated.status } : account)));
    refreshStaffData();
  }

  if (view === "home") {
    return (
      <div className="screen-grid">
        <Panel title="Tableau de bord staff">
          <div className="admin-metrics">
            <div>
              <span>Comptes actifs</span>
              <strong>{overview.active_accounts}</strong>
            </div>
            <div>
              <span>Comptes suspendus</span>
              <strong>{overview.suspended_accounts}</strong>
            </div>
            <div>
              <span>Offres actives</span>
              <strong>{overview.active_offers}</strong>
            </div>
            <div>
              <span>Offres archivees</span>
              <strong>{overview.archived_offers}</strong>
            </div>
            <div>
              <span>Skills en attente</span>
              <strong>{overview.pending_skills}</strong>
            </div>
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

  if (view === "catalog") {
    return (
      <Panel title="Catalogue approuve">
        <div className="catalog-grid">
          {skills.map((skill) => (
            <span key={skill.id}>{skill.name}</span>
          ))}
        </div>
      </Panel>
    );
  }
  if (view === "chat") return <ChatPanel api={api} matches={[]} role="STAFF" />;

  if (view === "offers") {
    return (
      <Panel title="Gestion des offres">
        <div className="admin-table">
          <div className="admin-table-head offer-admin-grid">
            <span>Offre</span>
            <span>Entreprise</span>
            <span>Statut</span>
            <span>Matches</span>
            <span>Action</span>
          </div>
          {offers.map((offer) => (
            <div className="admin-table-row offer-admin-grid" key={offer.id}>
              <div>
                <strong>{offer.title}</strong>
                <small>{offer.description}</small>
              </div>
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

  if (view === "accounts") {
    return (
      <Panel title="Gestion des comptes">
        <div className="admin-table">
          <div className="admin-table-head account-admin-grid">
            <span>Compte</span>
            <span>Role</span>
            <span>Email</span>
            <span>Statut</span>
            <span>Action</span>
          </div>
          {accounts.map((account) => (
            <div className="admin-table-row account-admin-grid" key={account.id}>
              <div>
                <strong>{account.display_name || account.username}</strong>
                <small>{account.username}</small>
              </div>
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

  return (
    <Panel title="Moderation des competences">
      {pending.length === 0 && <p className="muted">Aucune demande en attente.</p>}
      {pending.map((skill) => (
        <div className="moderation-row" key={skill.id}>
          <strong>{skill.name}</strong>
          <div className="button-row">
            <button
              onClick={() => moderateSkill(skill.id, "REJECT")}
            >
              Rejeter
            </button>
            <button
              className="primary-button"
              onClick={() => moderateSkill(skill.id, "APPROVE")}
            >
              Valider
            </button>
          </div>
        </div>
      ))}
    </Panel>
  );
}
