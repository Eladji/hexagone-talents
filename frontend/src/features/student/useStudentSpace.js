import { useCallback, useEffect, useState } from "react";

import { normalizeSkills, seedSkills } from "../../data/demoData";

export function useStudentSpace({ api, session, setView }) {
  const [skills, setSkills] = useState(seedSkills);
  const [profile, setProfile] = useState(null);
  const [likes, setLikes] = useState([]);
  const [matches, setMatches] = useState([]);
  const [acceptingOfferId, setAcceptingOfferId] = useState(null);

  const refreshSkills = useCallback(() => {
    return api.safe(seedSkills, () => api.request("/skills").then(normalizeSkills)).then(setSkills);
  }, [api]);

  const refreshProfile = useCallback(() => {
    return api.safe(null, () => api.request(`/student/${session.user_id}/profile`)).then(setProfile);
  }, [api, session.user_id]);

  const refreshInteractions = useCallback(async () => {
    const [loadedLikes, loadedMatches] = await Promise.all([
      api.safe([], () => api.request(`/student/${session.user_id}/likes`)),
      api.safe([], () => api.request(`/student/${session.user_id}/matches`)),
    ]);
    setLikes(loadedLikes);
    setMatches(loadedMatches);
  }, [api, session.user_id]);

  const applySavedSkills = useCallback((savedSkills) => {
    setProfile((current) => mergeProfile(current, { id: session.user_id, skills: savedSkills }));
  }, [session.user_id]);

  const applySavedProfile = useCallback((savedProfile) => {
    setProfile((current) => mergeProfile(current, { id: session.user_id, ...savedProfile }));
  }, [session.user_id]);

  useEffect(() => {
    refreshSkills();
    refreshProfile();
    refreshInteractions();
  }, [refreshProfile, refreshSkills, refreshInteractions]);

  async function acceptLike(offer) {
    const offerId = offer.offer_id || offer.id;
    setAcceptingOfferId(offerId);
    const result = await api.safe(null, () =>
      api.request("/swipes", {
        method: "POST",
        body: JSON.stringify({ offer_id: offerId, student_id: session.user_id, actor_role: "ETUDIANT", decision: "LIKE" }),
      })
    );
    setAcceptingOfferId(null);
    if (!result) return;

    setLikes((current) => current.filter((item) => (item.offer_id || item.id) !== offerId));
    await refreshInteractions();
    if (result.is_match) setView("chat");
  }

  return {
    acceptingOfferId,
    acceptLike,
    applySavedProfile,
    applySavedSkills,
    likes,
    matches,
    profile,
    refreshProfile,
    refreshSkills,
    skills,
  };
}

function mergeProfile(current, updates) {
  return {
    id: current?.id || updates.id,
    firstname: current?.firstname || "Antoine",
    lastname: current?.lastname || "Dupont",
    bio: current?.bio || "Passionne par l'architecture logicielle et les interfaces produit.",
    skills: current?.skills || [],
    projects: current?.projects || [],
    ...current,
    ...updates,
  };
}
