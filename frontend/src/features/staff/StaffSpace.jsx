import { ChatPanel } from "../chat/ChatPanel";
import { AccountsAdmin, OffersAdmin, SkillCatalog, SkillModeration, StaffHome } from "./StaffViews";
import { useStaffSpace } from "./useStaffSpace";

export function StaffSpace({ api, view }) {
  const {
    accounts,
    manageAccount,
    manageOffer,
    moderateSkill,
    offers,
    overview,
    pending,
    skills,
  } = useStaffSpace(api);

  if (view === "home") return <StaffHome overview={overview} pending={pending} offers={offers} accounts={accounts} />;
  if (view === "catalog") return <SkillCatalog skills={skills} />;
  if (view === "chat") return <ChatPanel api={api} matches={[]} role="STAFF" />;
  if (view === "offers") return <OffersAdmin offers={offers} manageOffer={manageOffer} />;
  if (view === "accounts") return <AccountsAdmin accounts={accounts} manageAccount={manageAccount} />;
  return <SkillModeration pending={pending} moderateSkill={moderateSkill} />;
}
