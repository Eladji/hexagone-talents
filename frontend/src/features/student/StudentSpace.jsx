import { OfferRow, Panel } from "../../components/ui";
import { ChatPanel } from "../chat/ChatPanel";
import { ProfileEditor } from "./ProfileEditor";
import { StudentProfile } from "./StudentProfile";
import { useStudentSpace } from "./useStudentSpace";

export function StudentSpace({ api, session, view, setView }) {
  const {
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
  } = useStudentSpace({ api, session, setView });

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
