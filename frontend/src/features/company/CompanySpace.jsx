import { ChatPanel } from "../chat/ChatPanel";
import { CandidatesList, SwipeDeck } from "./CandidateViews";
import { CompanyHome } from "./OfferManagement";
import { CompanyProfile } from "./CompanyProfile";
import { useCompanySpace } from "./useCompanySpace";

export function CompanySpace({ api, session, view, setView }) {
  const {
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
  } = useCompanySpace(api);

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
        profile={profile}
        setProfile={setProfile}
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
      closeOffer={closeOffer}
    />
  );
}
