import { useEffect, useState } from "react";

import { normalizeSkills, seedCandidates, seedOfferHistory, seedOffers, seedSkills } from "../../data/demoData";
import { ChatPanel } from "../chat/ChatPanel";
import { CandidatesList, SwipeDeck } from "./CandidateViews";
import { CompanyHome } from "./OfferManagement";
import { CompanyProfile } from "./CompanyProfile";
import { getOfferId, uniqueOffers } from "./companyUtils";

export function CompanySpace({ api, session, view, setView }) {
  const [skills, setSkills] = useState(seedSkills);
  const [offers, setOffers] = useState(seedOffers);
  const [offerHistory, setOfferHistory] = useState(seedOfferHistory);
  const [activeOfferId, setActiveOfferId] = useState(seedOffers[0]?.id || 5);
  const [candidates, setCandidates] = useState(seedCandidates);
  const [matches, setMatches] = useState([]);
  const [companyProfile, setCompanyProfile] = useState(null);

  useEffect(() => {
    api.safe(seedSkills, () => api.request("/skills").then(normalizeSkills)).then(setSkills);
  }, [api]);

  useEffect(() => {
    api.safe(null, () => api.request("/company/profile")).then(setCompanyProfile);
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
    api.safe(seedOfferHistory, () => api.request("/offers/history")).then((loadedOffers) => setOfferHistory(uniqueOffers(loadedOffers)));
  }, [api]);

  useEffect(() => {
    if (!activeOfferId) return;
    api.safe(seedCandidates, () => api.request(`/offers/${activeOfferId}/suggestions`).then((data) => data.candidates)).then(setCandidates);
    api.safe([], () => api.request(`/offers/${activeOfferId}/matches`)).then(setMatches);
  }, [api, activeOfferId]);

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

  if (view === "profile") {
    return (
      <CompanyProfile
        api={api}
        profile={companyProfile}
        setProfile={setCompanyProfile}
        offers={offers}
        setOffers={setOffers}
        offerHistory={offerHistory}
        skills={skills}
      />
    );
  }
  if (view === "chat") return <ChatPanel api={api} matches={matches} role={session.role} />;

  return (
    <CompanyHome
      api={api}
      skills={skills}
      offers={offers}
      offerHistory={offerHistory}
      activeOfferId={activeOfferId}
      setOffers={setOffers}
      setActiveOfferId={setActiveOfferId}
      setView={setView}
      candidates={candidates}
    />
  );
}
