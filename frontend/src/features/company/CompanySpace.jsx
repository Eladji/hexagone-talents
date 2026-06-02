import { useEffect, useState } from "react";

import { HeroMetric, OfferRow, Panel } from "../../components/ui";
import { normalizeSkills, seedCandidates, seedOfferHistory, seedOffers, seedSkills } from "../../data/demoData";
import { ChatPanel } from "../chat/ChatPanel";

function getOfferId(offer) {
  return offer.id || offer.offer_id;
}

function getOfferKey(offer) {
  return getOfferId(offer) || `${offer.company_name}-${offer.title || offer.offer_title}`;
}

function getOfferTitleKey(offer) {
  return `${offer.company_name || ""}-${offer.title || offer.offer_title || ""}`.trim().toLowerCase();
}

function uniqueOffers(offers) {
  const seenIds = new Set();
  const seenTitles = new Set();
  return offers.filter((offer) => {
    const id = getOfferId(offer);
    const titleKey = getOfferTitleKey(offer);
    if ((id && seenIds.has(id)) || seenTitles.has(titleKey)) return false;
    if (id) seenIds.add(id);
    seenTitles.add(titleKey);
    return true;
  });
}

function formatArchiveMeta(offer) {
  if (!offer.closed_at) return "Ancienne offre";
  return `Archivee le ${new Date(offer.closed_at).toLocaleDateString("fr-FR")}`;
}

export function CompanySpace({ api, session, view, setView }) {
  const [skills, setSkills] = useState(seedSkills);
  const [offers, setOffers] = useState(seedOffers);
  const [offerHistory, setOfferHistory] = useState(seedOfferHistory);
  const [activeOfferId, setActiveOfferId] = useState(seedOffers[0]?.id || 5);
  const [candidates, setCandidates] = useState(seedCandidates);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    api.safe(seedSkills, () => api.request("/skills").then(normalizeSkills)).then(setSkills);
  }, [api]);

  useEffect(() => {
    api.safe(seedOffers, () => api.request("/offers")).then((loadedOffers) => {
      const activeOffers = uniqueOffers(loadedOffers.filter((offer) => offer.status !== "ARCHIVED"));
      if (!activeOffers.length) return;
      setOffers(activeOffers);
      setActiveOfferId((current) => (activeOffers.some((offer) => getOfferId(offer) === current) ? current : getOfferId(activeOffers[0])));
    });
  }, [api]);

  useEffect(() => {
    api.safe(seedOfferHistory, () => api.request("/offers/history")).then((loadedOffers) => {
      setOfferHistory(uniqueOffers(loadedOffers));
    });
  }, [api]);

  useEffect(() => {
    if (!activeOfferId) return;
    api.safe(seedCandidates, () => api.request(`/offers/${activeOfferId}/suggestions`).then((data) => data.candidates)).then(setCandidates);
    api.safe([], () => api.request(`/offers/${activeOfferId}/matches`)).then(setMatches);
  }, [api, activeOfferId]);

  const activeOffer = offers.find((offer) => getOfferId(offer) === activeOfferId) || offers[0];

  if (view === "list") {
    return (
      <CandidatesList
        api={api}
        offers={offers}
        activeOfferId={activeOfferId}
        setActiveOfferId={setActiveOfferId}
        candidates={candidates}
        setCandidates={setCandidates}
        setView={setView}
      />
    );
  }

  if (view === "swipe") {
    return (
      <SwipeDeck
        api={api}
        offers={offers}
        activeOfferId={activeOfferId}
        setActiveOfferId={setActiveOfferId}
        candidates={candidates}
        setCandidates={setCandidates}
      />
    );
  }

  if (view === "profile") return <CompanyProfile offers={offers} offerHistory={offerHistory} skills={skills} />;
  if (view === "chat") return <ChatPanel api={api} matches={matches} role={session.role} />;

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
      <Panel title="Historique anciennes offres">
        {offerHistory.length === 0 ? (
          <p className="muted">Aucune ancienne offre pour l'instant.</p>
        ) : (
          offerHistory.map((offer) => (
            <OfferRow
              key={getOfferKey(offer)}
              offer={offer}
              meta={formatArchiveMeta(offer)}
            />
          ))
        )}
      </Panel>
      <HeroMetric title="Candidats disponibles" value={candidates.length} text="Changez d'offre a tout moment pour rafraichir la file." />
    </div>
  );
}

function OfferSelector({ offers, activeOfferId, onSelect }) {
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

function ActiveOfferSummary({ offer, count }) {
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
    const created = await api.safe(null, () =>
      api.request("/offers", {
        method: "POST",
        body: JSON.stringify(draft),
      })
    );
    if (created) {
      const offer = { ...draft, ...created, id: created.offer_id };
      setOffers((current) => uniqueOffers([offer, ...current]));
      setActiveOfferId(created.offer_id);
      setView("swipe");
    }
  }

  return (
    <Panel title="Nouvelle offre">
      <input placeholder="Titre du poste" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
      <textarea
        placeholder="Description"
        value={draft.description}
        onChange={(event) => setDraft({ ...draft, description: event.target.value })}
      />
      <select
        value={draft.required_skill_ids.map(String)}
        onChange={(event) =>
          setDraft({ ...draft, required_skill_ids: [...event.target.selectedOptions].map((option) => Number(option.value)) })
        }
        multiple
      >
        {skills.map((skill) => (
          <option key={skill.id} value={skill.id}>
            {skill.name}
          </option>
        ))}
      </select>
      <button className="primary-button" onClick={submit}>
        Publier
      </button>
    </Panel>
  );
}

function CandidatesList({ api, offers, activeOfferId, setActiveOfferId, candidates, setCandidates, setView }) {
  const activeOffer = offers.find((offer) => getOfferId(offer) === activeOfferId) || offers[0];

  async function decide(candidate, decision) {
    await api.safe(null, () =>
      api.request("/swipes", {
        method: "POST",
        body: JSON.stringify({
          offer_id: activeOfferId,
          student_id: candidate.student_id,
          actor_role: "ENTREPRISE",
          decision,
        }),
      })
    );
    setCandidates((current) => current.filter((item) => item.student_id !== candidate.student_id));
  }

  return (
    <div className="candidates-page">
      <Panel title="Acces candidats">
        <OfferSelector offers={offers} activeOfferId={activeOfferId} onSelect={setActiveOfferId} />
        <ActiveOfferSummary offer={activeOffer} count={candidates.length} />
        <div className="button-row">
          <button className="primary-button" onClick={() => setView("swipe")}>Swipe</button>
          <button onClick={() => setView("home")}>Offres</button>
        </div>
      </Panel>
      <Panel title={`Candidats - ${activeOffer?.title || "Offre"}`}>
        {candidates.length === 0 ? (
          <p className="muted">Aucun candidat pour l'instant sur cette offre.</p>
        ) : (
          candidates.map((candidate) => (
            <article key={candidate.student_id} className="candidate-list-card">
              <CandidateAvatar candidate={candidate} />
              <CandidateSummary candidate={candidate} />
              <div className="swipe-actions">
                <button className="danger-button" onClick={() => decide(candidate, "DISLIKE")}>Refuser</button>
                <button className="primary-button" onClick={() => decide(candidate, "LIKE")}>Liker</button>
              </div>
            </article>
          ))
        )}
      </Panel>
    </div>
  );
}

function SwipeDeck({ api, offers, activeOfferId, setActiveOfferId, candidates, setCandidates }) {
  const candidate = candidates[0];
  const activeOffer = offers.find((offer) => getOfferId(offer) === activeOfferId) || offers[0];

  async function decide(decision) {
    if (!candidate) return;
    await api.safe(null, () =>
      api.request("/swipes", {
        method: "POST",
        body: JSON.stringify({
          offer_id: activeOfferId,
          student_id: candidate.student_id,
          actor_role: "ENTREPRISE",
          decision,
        }),
      })
    );
    setCandidates((current) => current.slice(1));
  }

  if (!candidate) {
    return (
      <div className="deck-layout">
        <Panel title="Offre de swipe">
          <OfferSelector offers={offers} activeOfferId={activeOfferId} onSelect={setActiveOfferId} />
          <ActiveOfferSummary offer={activeOffer} count={0} />
        </Panel>
        <div className="empty-state">
          <h2>Plus aucun candidat</h2>
          <p>La pile est vide pour cette offre. Changez d'offre ou revenez plus tard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="deck-layout">
      <Panel title="Offre de swipe">
        <OfferSelector offers={offers} activeOfferId={activeOfferId} onSelect={setActiveOfferId} />
        <ActiveOfferSummary offer={activeOffer} count={candidates.length} />
      </Panel>
      <article className="candidate-card swipe-card">
        <div className="swipe-media">
          <CandidateAvatar candidate={candidate} large />
          <div className="score-ring">{candidate.alignment_score}</div>
        </div>
        <CandidateSummary candidate={candidate} />
      </article>
      <div className="swipe-actions">
        <button className="danger-button" onClick={() => decide("DISLIKE")}>
          Refuser
        </button>
        <button className="primary-button" onClick={() => decide("LIKE")}>
          Liker
        </button>
      </div>
    </div>
  );
}

function CandidateAvatar({ candidate, large = false }) {
  const initials = `${candidate.firstname?.[0] || "A"}${candidate.lastname?.[0] || "D"}`;
  if (candidate.avatar_url) {
    return (
      <img
        className={large ? "candidate-photo large" : "candidate-photo"}
        src={candidate.avatar_url}
        alt={`${candidate.firstname} ${candidate.lastname}`}
      />
    );
  }
  return <div className={large ? "candidate-initials large" : "candidate-initials"}>{initials}</div>;
}

function CandidateSummary({ candidate }) {
  return (
    <div className="candidate-summary">
      <div>
        <h3>
          {candidate.firstname} {candidate.lastname}
        </h3>
        <p>{candidate.bio}</p>
      </div>
      <div className="chip-row">
        {candidate.skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
    </div>
  );
}

function CompanyProfile({ offers, offerHistory, skills }) {
  return (
    <div className="phone-panel profile-card">
      <div className="avatar-block">TS</div>
      <h2>Tech Solutions</h2>
      <p>{offers.length} offre(s) actives, {offerHistory.length} ancienne(s) offre(s). Competences suivies: {skills.map((skill) => skill.name).join(", ")}.</p>
      <div className="chip-row">
        <span>Produit</span>
        <span>Alternance</span>
        <span>Fullstack</span>
      </div>
    </div>
  );
}
