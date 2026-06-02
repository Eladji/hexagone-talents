import { useCallback, useEffect, useState } from "react";

import { HeroMetric, OfferRow, Panel } from "../../components/ui";
import { normalizeSkills, seedOffers, seedSkills } from "../../data/demoData";
import { ChatPanel } from "../chat/ChatPanel";

export function StudentSpace({ api, session, view, setView }) {
  const [skills, setSkills] = useState(seedSkills);
  const [profile, setProfile] = useState(null);
  const [likes, setLikes] = useState([]);
  const [matches, setMatches] = useState([]);

  const refreshSkills = useCallback(() => {
    return api.safe(seedSkills, () => api.request("/skills").then(normalizeSkills)).then(setSkills);
  }, [api]);

  const refreshProfile = useCallback(() => {
    return api.safe(null, () => api.request(`/student/${session.user_id}/profile`)).then(setProfile);
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

  useEffect(() => {
    refreshSkills();
    refreshProfile();
    api.safe([], () => api.request(`/student/${session.user_id}/likes`)).then(setLikes);
    api.safe([], () => api.request(`/student/${session.user_id}/matches`)).then(setMatches);
  }, [api, refreshProfile, refreshSkills, session.user_id]);

  if (view === "edit") {
    return (
      <ProfileEditor
        api={api}
        session={session}
        skills={skills}
        profile={profile}
        applySavedSkills={applySavedSkills}
        refreshProfile={refreshProfile}
        refreshSkills={refreshSkills}
      />
    );
  }
  if (view === "profile") return <StudentProfile profile={profile} setView={setView} />;
  if (view === "chat") return <ChatPanel api={api} matches={matches} role={session.role} />;

  return (
    <div className="screen-grid">
      <HeroMetric title="Budget RPG" value="100 pts" text="Max 5 competences pour eviter le profil maxxing." />
      <Panel title="Likes en attente">
        {(likes.length ? likes : seedOffers).map((offer) => (
          <OfferRow
            key={offer.offer_id || offer.id}
            offer={offer}
            actionLabel="Accepter"
            onAction={() =>
              api
                .safe(null, () =>
                  api.request("/swipes", {
                    method: "POST",
                    body: JSON.stringify({
                      offer_id: offer.offer_id || offer.id,
                      student_id: session.user_id,
                      actor_role: "ETUDIANT",
                      decision: "LIKE",
                    }),
                  })
                )
                .then(() => setView("chat"))
            }
          />
        ))}
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

function StudentProfile({ profile, setView }) {
  const skills = profile?.skills || [];
  const projects = profile?.projects || [];
  const initials = `${profile?.firstname?.[0] || "A"}${profile?.lastname?.[0] || "D"}`;
  const fullName = `${profile?.firstname || "Antoine"} ${profile?.lastname || "Dupont"}`;

  return (
    <div className="user-profile-page">
      <section className="profile-hero">
        {profile?.avatar_url ? (
          <img className="profile-photo" src={profile.avatar_url} alt={fullName} />
        ) : (
          <div className="profile-photo placeholder">{initials}</div>
        )}
        <div className="profile-identity">
          <span className="eyebrow">Profil utilisateur</span>
          <h1>{fullName}</h1>
          <p>{profile?.bio || "Passionne par l'architecture logicielle et les interfaces produit."}</p>
          <div className="profile-contact">
            <span>{profile?.email || "email non renseigne"}</span>
            <span>{profile?.phone || "telephone non renseigne"}</span>
          </div>
        </div>
        <button className="primary-button" onClick={() => setView("edit")}>Modifier</button>
      </section>

      <div className="profile-stats">
        <div>
          <span>Competences</span>
          <strong>{skills.length}</strong>
        </div>
        <div>
          <span>Projets</span>
          <strong>{projects.length}</strong>
        </div>
        <div>
          <span>Budget</span>
          <strong>{skills.reduce((sum, skill) => sum + Number(skill.weight || 0), 0)} pts</strong>
        </div>
      </div>

      <section className="profile-section">
        <h2>Competences</h2>
        <div className="skill-board">
          {skills.map((skill) => (
            <article key={skill.id} className="skill-tile">
              <strong>{skill.name}</strong>
              <span>{skill.weight} pts</span>
            </article>
          ))}
          {skills.length === 0 && <p className="muted">Aucune competence sauvegardee.</p>}
        </div>
      </section>

      <section className="profile-section">
        <h2>Projets preuves</h2>
        <div className="project-grid">
          {projects.map((project) => (
            <article key={project.id} className="project-card">
              <strong>{project.title}</strong>
              <p>{project.description}</p>
              <div className="chip-row">
                {project.skills.map((skill) => (
                  <span key={skill.id}>{skill.name}</span>
                ))}
              </div>
            </article>
          ))}
          {projects.length === 0 && <p className="muted">Aucun projet sauvegarde.</p>}
        </div>
      </section>
    </div>
  );
}

function ProfileEditor({ api, session, skills, profile, applySavedSkills, refreshProfile, refreshSkills }) {
  const [profileFields, setProfileFields] = useState({
    firstname: profile?.firstname || "",
    lastname: profile?.lastname || "",
    bio: profile?.bio || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    avatar_url: profile?.avatar_url || "",
  });
  const [selected, setSelected] = useState([
    { skill_id: 1, weight: 50 },
    { skill_id: 2, weight: 30 },
    { skill_id: 3, weight: 20 },
  ]);
  const [project, setProject] = useState({ title: "", description: "", associated_skill_ids: [1] });
  const [suggestion, setSuggestion] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const total = selected.reduce((sum, skill) => sum + Number(skill.weight || 0), 0);
  const profileSkills = profile?.skills || [];
  const projectSkillOptions = profileSkills;
  const selectedSkillIds = selected.map((skill) => skill.skill_id);
  const hasDuplicateSkills = new Set(selectedSkillIds).size !== selectedSkillIds.length;
  const hasInvalidWeight = selected.some((skill) => Number(skill.weight) <= 0 || Number(skill.weight) > 100);
  const canSaveSkills = total === 100 && !hasDuplicateSkills && !hasInvalidWeight;

  useEffect(() => {
    setProfileFields({
      firstname: profile?.firstname || "",
      lastname: profile?.lastname || "",
      bio: profile?.bio || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      avatar_url: profile?.avatar_url || "",
    });

    if (!profile?.skills?.length) return;
    setSelected(profile.skills.map((skill) => ({ skill_id: skill.id, weight: skill.weight })));
    setProject((current) => ({
      ...current,
      associated_skill_ids: current.associated_skill_ids.filter((skillId) => profile.skills.some((skill) => skill.id === skillId)).length
        ? current.associated_skill_ids
        : [profile.skills[0].id],
    }));
  }, [profile]);

  function updateSkill(index, key, value) {
    setSelected((current) => current.map((skill, itemIndex) => (itemIndex === index ? { ...skill, [key]: value } : skill)));
  }

  function updateProfileField(key, value) {
    setProfileFields((current) => ({ ...current, [key]: value }));
  }

  async function saveProfile() {
    setSavingProfile(true);
    await api.safe(null, () =>
      api.request("/student/profile", {
        method: "PUT",
        body: JSON.stringify({ student_id: session.user_id, ...profileFields }),
      })
    );
    refreshProfile();
    setSavingProfile(false);
  }

  function addSkillLine() {
    const nextSkill = skills.find((skill) => !selected.some((item) => item.skill_id === skill.id));
    if (!nextSkill) return;
    setSelected((current) => {
      const donorIndex = current.reduce(
        (bestIndex, skill, index) => (Number(skill.weight || 0) > Number(current[bestIndex].weight || 0) ? index : bestIndex),
        0
      );
      const adjusted = current.map((skill, index) =>
        index === donorIndex ? { ...skill, weight: Math.max(1, Number(skill.weight) - 1) } : skill
      );
      return [...adjusted, { skill_id: nextSkill.id, weight: 1 }];
    });
  }

  function removeSkillLine(index) {
    setSelected((current) => {
      if (current.length <= 1) return current;
      const removedWeight = Number(current[index].weight || 0);
      const remaining = current.filter((_, itemIndex) => itemIndex !== index);
      return remaining.map((skill, itemIndex) => (itemIndex === 0 ? { ...skill, weight: Number(skill.weight) + removedWeight } : skill));
    });
  }

  function selectedWithNames() {
    return selected.map((item) => ({
      id: item.skill_id,
      name: skills.find((skill) => skill.id === item.skill_id)?.name || `Competence ${item.skill_id}`,
      weight: Number(item.weight),
    }));
  }

  return (
    <div className="editor-grid">
      <Panel title="Profil personnel">
        <label>
          Prénom
          <input value={profileFields.firstname} onChange={(event) => updateProfileField("firstname", event.target.value)} />
        </label>
        <label>
          Nom
          <input value={profileFields.lastname} onChange={(event) => updateProfileField("lastname", event.target.value)} />
        </label>
        <label>
          Bio
          <input value={profileFields.bio} onChange={(event) => updateProfileField("bio", event.target.value)} />
        </label>
        <label>
          Email
          <input value={profileFields.email} onChange={(event) => updateProfileField("email", event.target.value)} />
        </label>
        <label>
          Téléphone
          <input value={profileFields.phone} onChange={(event) => updateProfileField("phone", event.target.value)} />
        </label>
        <label>
          URL photo de profil
          <input value={profileFields.avatar_url} onChange={(event) => updateProfileField("avatar_url", event.target.value)} />
        </label>
        <button className="primary-button" onClick={saveProfile} disabled={savingProfile}>
          {savingProfile ? "Sauvegarde..." : "Sauvegarder le profil"}
        </button>
      </Panel>

      <Panel title="Competences">
        <div className={`budget ${total === 100 ? "ok" : ""}`}>{total}/100 pts</div>
        {hasDuplicateSkills && <p className="muted">Une competence ne peut pas etre selectionnee deux fois.</p>}
        {hasInvalidWeight && <p className="muted">Chaque competence sauvegardee doit avoir au moins 1 point.</p>}
        {selected.map((item, index) => (
          <div className="skill-line" key={`${item.skill_id}-${index}`}>
            <select value={item.skill_id} onChange={(event) => updateSkill(index, "skill_id", Number(event.target.value))}>
              {skills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              max="100"
              value={item.weight}
              onChange={(event) => updateSkill(index, "weight", Number(event.target.value))}
            />
            <button disabled={selected.length <= 1} onClick={() => removeSkillLine(index)}>
              Retirer
            </button>
          </div>
        ))}
        <div className="button-row">
          <button disabled={selected.length >= 5 || selected.length >= skills.length} onClick={addSkillLine}>
            + Skill
          </button>
          <button onClick={refreshSkills}>Actualiser</button>
          <button
            className="primary-button"
            disabled={!canSaveSkills}
            onClick={() => {
              api
                .safe(null, () =>
                  api.request("/student/skills", {
                    method: "PUT",
                    body: JSON.stringify({ student_id: session.user_id, skills: selected }),
                  })
                )
                .then((result) => {
                  if (!result) return;
                  const savedSkills = selectedWithNames();
                  applySavedSkills(savedSkills);
                  setProject((current) => ({
                    ...current,
                    associated_skill_ids: savedSkills.some((skill) => skill.id === current.associated_skill_ids[0])
                      ? current.associated_skill_ids
                      : [savedSkills[0].id],
                  }));
                  refreshProfile();
                });
            }}
          >
            Sauver
          </button>
        </div>
      </Panel>

      <Panel title="Projet preuve">
        <input placeholder="Titre" value={project.title} onChange={(event) => setProject({ ...project, title: event.target.value })} />
        <textarea
          placeholder="Description"
          value={project.description}
          onChange={(event) => setProject({ ...project, description: event.target.value })}
        />
        <select
          disabled={!projectSkillOptions.length}
          value={project.associated_skill_ids[0]}
          onChange={(event) => setProject({ ...project, associated_skill_ids: [Number(event.target.value)] })}
        >
          {projectSkillOptions.map((skill) => (
            <option key={skill.id || skill.skill_id} value={skill.id || skill.skill_id}>
              {skill.name || skills.find((item) => item.id === skill.skill_id)?.name}
            </option>
          ))}
        </select>
        <button
          className="primary-button"
          disabled={!projectSkillOptions.length || !project.title.trim() || !project.description.trim()}
          onClick={() => {
            api
              .safe(null, () =>
                api.request("/student/projects", {
                  method: "POST",
                  body: JSON.stringify({ ...project, student_id: session.user_id }),
                })
              )
              .then((created) => {
                if (!created) return;
                setProject({ title: "", description: "", associated_skill_ids: [projectSkillOptions[0].id || projectSkillOptions[0].skill_id] });
                refreshProfile();
              });
          }}
        >
          Publier le projet
        </button>
        {!profileSkills.length && <p className="muted">Sauvegarde d'abord tes competences avec 100 points avant de publier un projet.</p>}
      </Panel>

      <Panel title="Suggester une competence">
        <input maxLength="25" placeholder="Rust" value={suggestion} onChange={(event) => setSuggestion(event.target.value)} />
        <button
          onClick={() =>
            api.safe(null, () =>
              api.request("/skills/suggest", {
                method: "POST",
                body: JSON.stringify({ student_id: session.user_id, skill_name: suggestion }),
              })
            )
          }
        >
          Envoyer au staff
        </button>
      </Panel>
    </div>
  );
}
