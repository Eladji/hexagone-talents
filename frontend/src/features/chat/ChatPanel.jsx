import { Panel } from "../../components/ui";
import { useChatPanel } from "./useChatPanel";

export function ChatPanel({ api, matches, role }) {
  const {
    active,
    activeConversation,
    activeSubtitle,
    activeTitle,
    content,
    emptyMessage,
    messages,
    send,
    setActive,
    setContent,
  } = useChatPanel({ api, matches });

  return (
    <div className="chat-layout">
      <Panel title="Conversations">
        {matches.length === 0 && <p className="muted">Les messages se debloquent apres un match mutuel.</p>}
        {matches.map((match) => (
          <button
            key={match.match_id}
            className={active === match.match_id ? "active conversation" : "conversation"}
            onClick={() => setActive(match.match_id)}
          >
            <ConversationAvatar match={match} />
            <span>
              <strong>{match.offer_title || `${match.firstname} ${match.lastname}`}</strong>
              <small>{match.company_name || match.email || match.contact_email || "Match actif"}</small>
            </span>
          </button>
        ))}
      </Panel>
      <section className="phone-panel chat-phone">
        <div className={`chat-header ${activeConversation ? "" : "empty"}`}>
          {activeConversation && <ConversationAvatar match={activeConversation} />}
          <div>
            <strong>{activeTitle || "Selectionnez une conversation"}</strong>
            {activeSubtitle && <span>{activeSubtitle}</span>}
          </div>
        </div>
        <div className="chat-stream">
          {(messages.length ? messages : [{ sender_role: "SYSTEM", content: emptyMessage }]).map((message, index) => (
            <div className={`bubble ${message.sender_role === role ? "mine" : ""}`} key={`${message.timestamp || index}-${message.content}`}>
              {message.content}
            </div>
          ))}
        </div>
        <div className="composer">
          <input disabled={!active} value={content} onChange={(event) => setContent(event.target.value)} placeholder="Message" />
          <button disabled={!active} onClick={send}>
            Envoyer
          </button>
        </div>
      </section>
    </div>
  );
}

function ConversationAvatar({ match }) {
  const name = match?.firstname && match?.lastname ? `${match.firstname} ${match.lastname}` : match?.company_name || match?.offer_title || "Conversation";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  if (match?.avatar_url) {
    return <img className="conversation-avatar" src={match.avatar_url} alt={name} />;
  }

  return <span className="conversation-avatar placeholder">{initials || "H"}</span>;
}
