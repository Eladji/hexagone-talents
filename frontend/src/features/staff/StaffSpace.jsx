import { useEffect, useState } from "react";

import { Panel } from "../../components/ui";
import { normalizeSkills, seedSkills } from "../../data/demoData";
import { ChatPanel } from "../chat/ChatPanel";

export function StaffSpace({ api, view }) {
  const [pending, setPending] = useState([]);
  const [skills, setSkills] = useState(seedSkills);

  useEffect(() => {
    api.safe([], () => api.request("/staff/skills/pending").then(normalizeSkills)).then(setPending);
    api.safe(seedSkills, () => api.request("/skills").then(normalizeSkills)).then(setSkills);
  }, [api]);

  if (view === "catalog") {
    return (
      <Panel title="Catalogue approuve">
        <div className="catalog-grid">
          {skills.map((skill) => (
            <span key={skill.id}>{skill.name}</span>
          ))}
        </div>
      </Panel>
    );
  }
  if (view === "chat") return <ChatPanel api={api} matches={[]} role="STAFF" />;

  return (
    <Panel title="Moderation des competences">
      {pending.length === 0 && <p className="muted">Aucune demande en attente.</p>}
      {pending.map((skill) => (
        <div className="moderation-row" key={skill.id}>
          <strong>{skill.name}</strong>
          <div className="button-row">
            <button
              onClick={() =>
                api
                  .safe(null, () => api.request(`/staff/skills/${skill.id}`, { method: "PATCH", body: JSON.stringify({ action: "REJECT" }) }))
                  .then(() => setPending((current) => current.filter((item) => item.id !== skill.id)))
              }
            >
              Rejeter
            </button>
            <button
              className="primary-button"
              onClick={() =>
                api
                  .safe(null, () => api.request(`/staff/skills/${skill.id}`, { method: "PATCH", body: JSON.stringify({ action: "APPROVE" }) }))
                  .then(() => setPending((current) => current.filter((item) => item.id !== skill.id)))
              }
            >
              Valider
            </button>
          </div>
        </div>
      ))}
    </Panel>
  );
}
