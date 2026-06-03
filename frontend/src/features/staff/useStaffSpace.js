import { useCallback, useEffect, useState } from "react";

import { normalizeSkills, seedSkills } from "../../data/demoData";

const INITIAL_OVERVIEW = {
  active_accounts: 0,
  suspended_accounts: 0,
  active_offers: 0,
  archived_offers: 0,
  pending_skills: 0,
};

export function useStaffSpace(api) {
  const [pending, setPending] = useState([]);
  const [skills, setSkills] = useState(seedSkills);
  const [overview, setOverview] = useState(INITIAL_OVERVIEW);
  const [offers, setOffers] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const refreshStaffData = useCallback(() => {
    api.safe(INITIAL_OVERVIEW, () => api.request("/staff/overview")).then(setOverview);
    api.safe([], () => api.request("/staff/skills/pending").then(normalizeSkills)).then(setPending);
    api.safe(seedSkills, () => api.request("/skills").then(normalizeSkills)).then(setSkills);
    api.safe([], () => api.request("/staff/offers")).then(setOffers);
    api.safe([], () => api.request("/staff/accounts")).then(setAccounts);
  }, [api]);

  useEffect(() => {
    refreshStaffData();
  }, [refreshStaffData]);

  async function moderateSkill(skillId, action) {
    await api.safe(null, () => api.request(`/staff/skills/${skillId}`, { method: "PATCH", body: JSON.stringify({ action }) }));
    setPending((current) => current.filter((item) => item.id !== skillId));
    refreshStaffData();
  }

  async function manageOffer(offerId, action) {
    const updated = await api.safe(null, () => api.request(`/staff/offers/${offerId}`, { method: "PATCH", body: JSON.stringify({ action }) }));
    if (!updated) return;
    setOffers((current) => current.map((offer) => (offer.id === offerId ? { ...offer, status: updated.status } : offer)));
    refreshStaffData();
  }

  async function manageAccount(userId, action) {
    const updated = await api.safe(null, () => api.request(`/staff/accounts/${userId}`, { method: "PATCH", body: JSON.stringify({ action }) }));
    if (!updated) return;
    setAccounts((current) => current.map((account) => (account.id === userId ? { ...account, status: updated.status } : account)));
    refreshStaffData();
  }

  return {
    accounts,
    manageAccount,
    manageOffer,
    moderateSkill,
    offers,
    overview,
    pending,
    skills,
  };
}
