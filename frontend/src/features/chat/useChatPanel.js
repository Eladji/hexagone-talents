import { useEffect, useState } from "react";

export function useChatPanel({ api, matches }) {
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
  const activeTitle = getConversationTitle(activeConversation);
  const activeSubtitle = activeConversation?.company_name || activeConversation?.email || activeConversation?.contact_email || "";
  const emptyMessage = active ? "Aucun message pour le moment." : "Aucune conversation active.";

  return {
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
  };
}

function getConversationTitle(conversation) {
  if (!conversation) return "";
  return conversation.offer_title || `${conversation.firstname || ""} ${conversation.lastname || ""}`.trim();
}
