import { Panel } from "../../components/ui";
import { getOfferId } from "./companyUtils";
import { ActiveOfferSummary, OfferSelector } from "./OfferManagement";

export function CandidatesList({ api, offers, activeOfferId, setActiveOfferId, candidates, setCandidates, setView }) {
  const activeOffer = offers.find((offer) => getOfferId(offer) === activeOfferId) || offers[0];

  async function decide(candidate, decision) {
    await submitCompanySwipe(api, activeOfferId, candidate.student_id, decision);
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

export function SwipeDeck({ api, offers, activeOfferId, setActiveOfferId, candidates, setCandidates }) {
  const candidate = candidates[0];
  const activeOffer = offers.find((offer) => getOfferId(offer) === activeOfferId) || offers[0];

  async function decide(decision) {
    if (!candidate) return;
    await submitCompanySwipe(api, activeOfferId, candidate.student_id, decision);
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
        <button className="danger-button" onClick={() => decide("DISLIKE")}>Refuser</button>
        <button className="primary-button" onClick={() => decide("LIKE")}>Liker</button>
      </div>
    </div>
  );
}

function CandidateAvatar({ candidate, large = false }) {
  const initials = `${candidate.firstname?.[0] || "A"}${candidate.lastname?.[0] || "D"}`;
  if (!candidate.avatar_url) return <div className={large ? "candidate-initials large" : "candidate-initials"}>{initials}</div>;
  return (
    <img
      className={large ? "candidate-photo large" : "candidate-photo"}
      src={candidate.avatar_url}
      alt={`${candidate.firstname} ${candidate.lastname}`}
    />
  );
}

function CandidateSummary({ candidate }) {
  return (
    <div className="candidate-summary">
      <div>
        <h3>{candidate.firstname} {candidate.lastname}</h3>
        <p>{candidate.bio}</p>
      </div>
      <div className="chip-row">
        {candidate.skills.map((skill) => <span key={skill}>{skill}</span>)}
      </div>
    </div>
  );
}

function submitCompanySwipe(api, offerId, studentId, decision) {
  return api.safe(null, () =>
    api.request("/swipes", {
      method: "POST",
      body: JSON.stringify({ offer_id: offerId, student_id: studentId, actor_role: "ENTREPRISE", decision }),
    })
  );
}
