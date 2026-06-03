import { useEffect, useState } from "react";

import { Panel } from "../../components/ui";

export function ChatPanel({ api, matches, role }) {
  const [active, setActive] = useState(matches[0]?.match_id || null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    setActive(matches[0]?.match_id || null);
  }, [matches]);

  useEffect(() => {
    if (!active) {
      setMessages([]);
      return;
    }
    api.safe([], () => api.request(`/messages/${active}`)).then(setMessages);
  }, [active, api]);

  async function send() {
    if (!active || !content.trim()) return;
    const message = await api.safe(null, () =>
      api.request(`/messages/${active}`, {
        method: "POST",
        body: JSON.stringify({ content }),
      })
    );
    if (message) {
      setMessages((current) => [...current, message]);
      setContent("");
    }
  }

  const activeConversation = matches.find((match) => match.match_id === active);
  const activeTitle = activeConversation
    ? activeConversation.offer_title || `${activeConversation.firstname || ""} ${activeConversation.lastname || ""}`.trim()
    : "";
  const activeSubtitle = activeConversation?.company_name || activeConversation?.email || activeConversation?.contact_email || "";
  const emptyMessage = active ? "Aucun message pour le moment." : "Aucune conversation active.";

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
