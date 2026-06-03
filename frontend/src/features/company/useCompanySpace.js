import { useEffect, useState } from "react";

import { normalizeSkills, seedCandidates, seedOfferHistory, seedOffers, seedSkills } from "../../data/demoData";
import { getOfferId, uniqueOffers } from "./companyUtils";

const FIRST_SEED_OFFER_ID = getOfferId(seedOffers[0]) || null;

export function useCompanySpace(api) {
  const [skills, setSkills] = useState(seedSkills);
  const [offers, setOffers] = useState(seedOffers);
  const [offerHistory, setOfferHistory] = useState(seedOfferHistory);
  const [activeOfferId, setActiveOfferId] = useState(FIRST_SEED_OFFER_ID);
  const [candidates, setCandidates] = useState(seedCandidates);
  const [matches, setMatches] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.safe(seedSkills, () => api.request("/skills").then(normalizeSkills)).then(setSkills);
  }, [api]);

  useEffect(() => {
    api.safe(null, () => api.request("/company/profile")).then(setProfile);
  }, [api]);

  useEffect(() => {
    api.safe(seedOffers, () => api.request("/offers")).then(updateActiveOffers);
  }, [api]);

  useEffect(() => {
    api.safe(seedOfferHistory, () => api.request("/offers/history")).then((loadedOffers) => {
      setOfferHistory(uniqueOffers(loadedOffers));
    });
  }, [api]);

  useEffect(() => {
    if (!activeOfferId) {
      setCandidates([]);
      setMatches([]);
      return;
    }
    api.safe(seedCandidates, () => api.request(`/offers/${activeOfferId}/suggestions`).then((data) => data.candidates)).then(setCandidates);
    api.safe([], () => api.request(`/offers/${activeOfferId}/matches`)).then(setMatches);
  }, [api, activeOfferId]);

  function updateActiveOffers(loadedOffers) {
    const activeOffers = uniqueOffers(loadedOffers.filter((offer) => offer.status !== "ARCHIVED"));

    setOffers(activeOffers);
    setActiveOfferId((current) => keepCurrentOrPickFirst(activeOffers, current));
  }

  async function closeOffer(offerId) {
    const offer = offers.find((item) => getOfferId(item) === offerId);
    if (!offer) return;

    const updated = await api.safe(null, () => api.request(`/offers/${offerId}/archive`, { method: "PATCH" }));
    if (!updated) return;

    const archivedOffer = {
      ...offer,
      status: updated.status,
      closed_at: updated.closed_at,
    };
    const remainingOffers = offers.filter((item) => getOfferId(item) !== offerId);

    setOffers(remainingOffers);
    setOfferHistory((current) => uniqueOffers([archivedOffer, ...current]));
    setActiveOfferId((current) => (current === offerId ? getOfferId(remainingOffers[0]) || null : current));
  }

  return {
    activeOfferId,
    candidates,
    closeOffer,
    matches,
    offerHistory,
    offers,
    profile,
    setActiveOfferId,
    setCandidates,
    setOffers,
    setProfile,
    skills,
  };
}

function keepCurrentOrPickFirst(offers, currentId) {
  if (offers.some((offer) => getOfferId(offer) === currentId)) return currentId;
  return getOfferId(offers[0]) || null;
}
