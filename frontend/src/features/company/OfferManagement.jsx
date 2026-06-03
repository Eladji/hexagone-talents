import { useState } from "react";

import { HeroMetric, OfferRow, Panel } from "../../components/ui";
import { formatArchiveMeta, getOfferId, getOfferKey, uniqueOffers } from "./companyUtils";

export function CompanyHome({ api, skills, offers, offerHistory, activeOfferId, setOffers, setActiveOfferId, setView, candidates }) {
  const activeOffer = offers.find((offer) => getOfferId(offer) === activeOfferId) || offers[0];

  return (
    <div className="screen-grid">
      <OfferCreator api={api} skills={skills} setOffers={setOffers} setActiveOfferId={setActiveOfferId} setView={setView} />
      <Panel title="Offre active">
        <OfferSelector offers={offers} activeOfferId={activeOfferId} onSelect={setActiveOfferId} />
        <ActiveOfferSummary offer={activeOffer} count={candidates.length} />
        <div className="button-row">
          <button className="primary-button" onClick={() => setView("list")}>Liste candidats</button>
          <button onClick={() => setView("swipe")}>Swipe</button>
        </div>
      </Panel>
      <PublishedOffers offers={offers} activeOfferId={activeOfferId} setActiveOfferId={setActiveOfferId} setView={setView} />
      <ArchivedOffers offerHistory={offerHistory} />
      <HeroMetric title="Candidats disponibles" value={candidates.length} text="Changez d'offre a tout moment pour rafraichir la file." />
    </div>
  );
}

export function OfferSelector({ offers, activeOfferId, onSelect }) {
  return (
    <div className="offer-selector">
      <label>
        Offre
        <select value={activeOfferId} onChange={(event) => onSelect(Number(event.target.value))}>
          {offers.map((offer) => (
            <option key={getOfferKey(offer)} value={getOfferId(offer)}>
              {offer.company_name} - {offer.title || offer.offer_title}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export function ActiveOfferSummary({ offer, count }) {
  if (!offer) return <p className="muted">Aucune offre selectionnee.</p>;
  return (
    <div className="active-offer-summary">
      <strong>{offer.title || offer.offer_title}</strong>
      <span>{offer.company_name}</span>
      <p>{offer.description}</p>
      <small>{count} candidat(s) dans la file</small>
    </div>
  );
}

function OfferCreator({ api, skills, setOffers, setActiveOfferId, setView }) {
  const [draft, setDraft] = useState({
    company_name: "Tech Solutions",
    title: "",
    description: "",
    required_skill_ids: [skills[0]?.id || 1],
    contact_email: "recrutement@techsolutions.com",
    contact_phone: "0123456789",
  });

  async function submit() {
    const created = await api.safe(null, () => api.request("/offers", { method: "POST", body: JSON.stringify(draft) }));
    if (!created) return;
    const offer = { ...draft, ...created, id: created.offer_id };
    setOffers((current) => uniqueOffers([offer, ...current]));
    setActiveOfferId(created.offer_id);
    setView("swipe");
  }

  return (
    <Panel title="Nouvelle offre">
      <input placeholder="Titre du poste" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
      <textarea placeholder="Description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
      <select
        value={draft.required_skill_ids.map(String)}
        onChange={(event) => setDraft({ ...draft, required_skill_ids: [...event.target.selectedOptions].map((option) => Number(option.value)) })}
        multiple
      >
        {skills.map((skill) => <option key={skill.id} value={skill.id}>{skill.name}</option>)}
      </select>
      <button className="primary-button" onClick={submit}>Publier</button>
    </Panel>
  );
}

function PublishedOffers({ offers, activeOfferId, setActiveOfferId, setView }) {
  return (
    <Panel title="Offres publiees">
      {offers.map((offer) => (
        <OfferRow
          key={getOfferKey(offer)}
          offer={offer}
          active={getOfferId(offer) === activeOfferId}
          actionLabel="Voir"
          onAction={() => {
            setActiveOfferId(getOfferId(offer));
            setView("swipe");
          }}
        />
      ))}
    </Panel>
  );
}

function ArchivedOffers({ offerHistory }) {
  return (
    <Panel title="Historique anciennes offres">
      {offerHistory.length === 0 ? (
        <p className="muted">Aucune ancienne offre pour l'instant.</p>
      ) : (
        offerHistory.map((offer) => <OfferRow key={getOfferKey(offer)} offer={offer} meta={formatArchiveMeta(offer)} />)
      )}
    </Panel>
  );
}
