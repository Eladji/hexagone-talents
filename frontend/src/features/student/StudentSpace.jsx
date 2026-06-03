import { useCallback, useEffect, useState } from "react";

import { OfferRow, Panel } from "../../components/ui";
import { normalizeSkills, seedSkills } from "../../data/demoData";
import { ChatPanel } from "../chat/ChatPanel";
import { ProfileEditor } from "./ProfileEditor";
import { StudentProfile } from "./StudentProfile";

export function StudentSpace({ api, session, view, setView }) {
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
    const [nextLikes, nextMatches] = await Promise.all([
      api.safe([], () => api.request(`/student/${session.user_id}/likes`)),
      api.safe([], () => api.request(`/student/${session.user_id}/matches`)),
    ]);
    setLikes(nextLikes);
    setMatches(nextMatches);
  }, [api, session.user_id]);

  const applySavedSkills = useCallback((savedSkills) => {
    setProfile((current) => ({
      id: current?.id || session.user_id,
      firstname: current?.firstname || "Antoine",
      lastname: current?.lastname || "Dupont",
      bio: current?.bio || "Passionne par l'architecture logicielle et les interfaces produit.",
      projects: current?.projects || [],
      ...current,
      skills: savedSkills,
    }));
  }, [session.user_id]);

  const applySavedProfile = useCallback((savedProfile) => {
    setProfile((current) => ({
      id: current?.id || session.user_id,
      skills: current?.skills || [],
      projects: current?.projects || [],
      ...current,
      ...savedProfile,
    }));
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

  if (view === "edit") {
    return (
      <ProfileEditor
        api={api}
        session={session}
        skills={skills}
        profile={profile}
        applySavedSkills={applySavedSkills}
        applySavedProfile={applySavedProfile}
        refreshProfile={refreshProfile}
        refreshSkills={refreshSkills}
      />
    );
  }
  if (view === "profile") return <StudentProfile profile={profile} setView={setView} />;
  if (view === "chat") return <ChatPanel api={api} matches={matches} role={session.role} />;

  return (
    <div className="screen-grid">
      <Panel title="Likes en attente">
        {likes.map((offer) => {
          const offerId = offer.offer_id || offer.id;
          return (
            <OfferRow
              key={offerId}
              offer={offer}
              actionLabel={acceptingOfferId === offerId ? "Acceptation..." : "Accepter"}
              actionDisabled={acceptingOfferId === offerId}
              meta="L'entreprise a deja like ton profil."
              onAction={() => acceptLike(offer)}
            />
          );
        })}
        {likes.length === 0 && <p className="muted">Aucun like entreprise en attente pour le moment.</p>}
      </Panel>
      <Panel title="Raccourcis">
        <div className="quick-actions">
          <button onClick={() => setView("edit")}>Ajouter un projet</button>
          <button onClick={() => setView("profile")}>Voir le profil</button>
        </div>
      </Panel>
    </div>
  );
}
