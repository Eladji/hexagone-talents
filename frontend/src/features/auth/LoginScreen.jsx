import { useState } from "react";

import { loginRequest, registerRequest } from "../../api/client";
import { demoAccounts } from "../../data/demoData";

const REGISTER_FIELDS = [
  ["firstname", "Prénom"],
  ["lastname", "Nom"],
  ["email", "Email"],
  ["bio", "Bio"],
];

const MAX_AVATAR_SIZE = 1_500_000;

export function LoginScreen({ setSession, setToast }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("antoine.dev");
  const [password, setPassword] = useState("password123");
  const [registerFields, setRegisterFields] = useState({
    firstname: "Antoine",
    lastname: "Dupont",
    email: "antoine@example.com",
    bio: "Passionne par l'architecture logicielle.",
    avatarUrl: "https://ui-avatars.com/api/?name=Antoine+Dupont&background=4969b2&color=ffffff",
  });
  const [loading, setLoading] = useState(false);

  function updateRegisterField(key, value) {
    setRegisterFields((current) => ({ ...current, [key]: value }));
  }

  function uploadAvatar(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setToast("Veuillez choisir une image.");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setToast("L'image doit faire moins de 1.5 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => updateRegisterField("avatarUrl", reader.result);
    reader.onerror = () => setToast("Impossible de charger l'image.");
    reader.readAsDataURL(file);
  }

  async function login(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await loginRequest(username, password);
      setSession({ ...data, username });
    } catch (error) {
      setToast(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function register(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await registerRequest({
        username,
        password,
        firstname: registerFields.firstname,
        lastname: registerFields.lastname,
        email: registerFields.email,
        bio: registerFields.bio,
        phone: "0600000000",
        avatar_url: registerFields.avatarUrl,
      });
      setSession({ ...data, username });
    } catch (error) {
      setToast(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="phone-panel auth-card">
        <div className="auth-switch" aria-label="Mode">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
            CONNEXION
          </button>
          <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
            INSCRIPTION
          </button>
        </div>

        {mode === "login" && (
          <>
            <div className="logo-large">H</div>
            <form onSubmit={login} className="stack">
              <label>
                Identifiants
                <input
                  placeholder="Saisissez texte"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </label>
              <label>
                Mot de passe
                <input
                  type="password"
                  placeholder="Saisissez texte"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              <button className="primary-button" disabled={loading}>
                {loading ? "Connexion..." : "Connexion"}
              </button>
            </form>
            <div className="demo-grid">
              {demoAccounts.map((account) => (
                <button
                  key={account.username}
                  onClick={() => {
                    setUsername(account.username);
                    setPassword("password123");
                  }}
                >
                  {account.label}
                </button>
              ))}
            </div>
          </>
        )}

        {mode === "register" && (
          <>
            <div className="logo-large">H</div>
            <form onSubmit={register} className="stack">
              <label>
                Identifiants
                <input value={username} onChange={(event) => setUsername(event.target.value)} />
              </label>
              <label>
                Mot de passe
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </label>
              {REGISTER_FIELDS.map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    value={registerFields[key]}
                    onChange={(event) => updateRegisterField(key, event.target.value)}
                  />
                </label>
              ))}
              <label>
                Photo de profil
                <input type="file" accept="image/*" onChange={uploadAvatar} />
              </label>
              {registerFields.avatarUrl && (
                <img className="auth-avatar-preview" src={registerFields.avatarUrl} alt="Apercu du profil" />
              )}
              <button className="primary-button" disabled={loading}>
                {loading ? "Inscription..." : "Inscription"}
              </button>
            </form>
            <button className="danger-button full-width-button" onClick={() => setMode("login")}>
              Retour
            </button>
          </>
        )}
      </section>
    </main>
  );
}
