import { useEffect, useState } from "react";

export function CompanyProfile({ api, profile, setProfile, offers, setOffers, offerHistory, skills }) {
  const [fields, setFields] = useState(getProfileFields(profile));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFields(getProfileFields(profile));
  }, [profile]);

  function updateField(key, value) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function saveProfile() {
    setSaving(true);
    const saved = await api.safe(null, () =>
      api.request("/company/profile", { method: "PUT", body: JSON.stringify(fields) })
    );
    if (saved) {
      setProfile(saved);
      setOffers((current) => current.map((offer) => ({ ...offer, company_name: saved.name })));
    }
    setSaving(false);
  }

  if (!profile) {
    return (
      <div className="phone-panel profile-card">
        <div className="avatar-block">CO</div>
        <h2>Profil entreprise</h2>
        <p className="muted">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="phone-panel profile-card">
      <div className="avatar-block">{fields.name.slice(0, 2).toUpperCase() || "CO"}</div>
      <h2>{fields.name || "Entreprise"}</h2>
      <label>
        Nom
        <input value={fields.name} onChange={(event) => updateField("name", event.target.value)} />
      </label>
      <label>
        Email
        <input value={fields.email} onChange={(event) => updateField("email", event.target.value)} />
      </label>
      <label>
        Telephone
        <input value={fields.phone} onChange={(event) => updateField("phone", event.target.value)} />
      </label>
      <button className="primary-button" disabled={saving || !fields.name.trim()} onClick={saveProfile}>
        {saving ? "Sauvegarde..." : "Sauvegarder le profil"}
      </button>
      <p>
        {offers.length} offre(s) actives, {offerHistory.length} ancienne(s) offre(s). Competences suivies:{" "}
        {skills.map((skill) => skill.name).join(", ")}.
      </p>
      <div className="chip-row">
        <span>Produit</span>
        <span>Alternance</span>
        <span>Fullstack</span>
      </div>
    </div>
  );
}

function getProfileFields(profile) {
  return {
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
  };
}
