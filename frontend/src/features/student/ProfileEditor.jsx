import { Panel } from "../../components/ui";
import { useProfileEditor } from "./useProfileEditor";

export function ProfileEditor(props) {
  const { skills, refreshSkills } = props;
  const editor = useProfileEditor(props);
  const projectSkillOptions = editor.profileSkills;

  return (
    <div className="editor-grid">
      <Panel title="Profil personnel">
        {["firstname", "lastname", "bio", "email", "phone"].map((field) => (
          <label key={field}>
            {profileLabels[field]}
            <input value={editor.profileFields[field]} onChange={(event) => editor.updateProfileField(field, event.target.value)} />
          </label>
        ))}
        <div className="profile-photo-editor">
          {editor.profileFields.avatar_url ? (
            <img className="profile-photo-preview" src={editor.profileFields.avatar_url} alt="Apercu du profil" />
          ) : (
            <div className="profile-photo-preview placeholder">H</div>
          )}
          <label>
            Photo de profil
            <input type="file" accept="image/*" onChange={editor.uploadProfilePhoto} />
          </label>
          <button className="danger-button" onClick={() => editor.updateProfileField("avatar_url", "")}>Retirer la photo</button>
        </div>
        {editor.profileError && <p className="muted">{editor.profileError}</p>}
        <label>
          URL photo de profil
          <input value={editor.profileFields.avatar_url} onChange={(event) => editor.updateProfileField("avatar_url", event.target.value)} />
        </label>
        <button className="primary-button" onClick={editor.saveProfile} disabled={editor.savingProfile}>
          {editor.savingProfile ? "Sauvegarde..." : "Sauvegarder le profil"}
        </button>
      </Panel>

      <Panel title="Competences">
        <div className={`budget ${editor.total === 100 ? "ok" : ""}`}>{editor.total}/100 pts</div>
        {editor.hasDuplicateSkills && <p className="muted">Une competence ne peut pas etre selectionnee deux fois.</p>}
        {editor.hasInvalidWeight && <p className="muted">Chaque competence sauvegardee doit avoir au moins 1 point.</p>}
        {editor.selected.map((item, index) => (
          <div className="skill-line" key={`${item.skill_id}-${index}`}>
            <select value={item.skill_id} onChange={(event) => editor.updateSkill(index, "skill_id", Number(event.target.value))}>
              {skills.map((skill) => <option key={skill.id} value={skill.id}>{skill.name}</option>)}
            </select>
            <input type="number" min="0" max="100" value={item.weight} onChange={(event) => editor.updateSkill(index, "weight", Number(event.target.value))} />
            <button disabled={editor.selected.length <= 1} onClick={() => editor.removeSkillLine(index)}>Retirer</button>
          </div>
        ))}
        <div className="button-row">
          <button disabled={editor.selected.length >= 5 || editor.selected.length >= skills.length} onClick={editor.addSkillLine}>+ Skill</button>
          <button onClick={refreshSkills}>Actualiser</button>
          <button className="primary-button" disabled={!editor.canSaveSkills} onClick={editor.saveSkills}>Sauver</button>
        </div>
      </Panel>

      <Panel title="Projet preuve">
        <input placeholder="Titre" value={editor.project.title} onChange={(event) => editor.setProject({ ...editor.project, title: event.target.value })} />
        <textarea
          placeholder="Description"
          value={editor.project.description}
          onChange={(event) => editor.setProject({ ...editor.project, description: event.target.value })}
        />
        <select
          disabled={!projectSkillOptions.length}
          value={editor.project.associated_skill_ids[0]}
          onChange={(event) => editor.setProject({ ...editor.project, associated_skill_ids: [Number(event.target.value)] })}
        >
          {projectSkillOptions.map((skill) => (
            <option key={skill.id || skill.skill_id} value={skill.id || skill.skill_id}>
              {skill.name || skills.find((item) => item.id === skill.skill_id)?.name}
            </option>
          ))}
        </select>
        <button
          className="primary-button"
          disabled={!projectSkillOptions.length || !editor.project.title.trim() || !editor.project.description.trim()}
          onClick={editor.createProject}
        >
          Publier le projet
        </button>
        {!editor.profileSkills.length && <p className="muted">Sauvegarde d'abord tes competences avec 100 points avant de publier un projet.</p>}
      </Panel>

      <Panel title="Suggester une competence">
        <input maxLength="25" placeholder="Rust" value={editor.suggestion} onChange={(event) => editor.setSuggestion(event.target.value)} />
        <button onClick={editor.suggestSkill}>Envoyer au staff</button>
      </Panel>
    </div>
  );
}

const profileLabels = {
  firstname: "Prenom",
  lastname: "Nom",
  bio: "Bio",
  email: "Email",
  phone: "Telephone",
};
