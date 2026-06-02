import { useState } from "react";

import { loginRequest, registerRequest } from "../../api/client";
import { demoAccounts } from "../../data/demoData";

export function LoginScreen({ setSession, setToast }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("antoine.dev");
  const [password, setPassword] = useState("password123");
  const [firstname, setFirstname] = useState("Antoine");
  const [lastname, setLastname] = useState("Dupont");
  const [email, setEmail] = useState("antoine@example.com");
  const [bio, setBio] = useState("Passionne par l'architecture logicielle.");
  const [avatarUrl, setAvatarUrl] = useState(
    "https://ui-avatars.com/api/?name=Antoine+Dupont&background=4969b2&color=ffffff"
  );
  const [loading, setLoading] = useState(false);

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
        firstname,
        lastname,
        email,
        bio,
        phone: "0600000000",
        avatar_url: avatarUrl,
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
                <input placeholder="Saisissez texte" value={username} onChange={(event) => setUsername(event.target.value)} />
              </label>
              <label>
                Mot de passe
                <input type="password" placeholder="Saisissez texte" value={password} onChange={(event) => setPassword(event.target.value)} />
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
              <label>
                Prénom
                <input value={firstname} onChange={(event) => setFirstname(event.target.value)} />
              </label>
              <label>
                Nom
                <input value={lastname} onChange={(event) => setLastname(event.target.value)} />
              </label>
              <label>
                Email
                <input value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>
              <label>
                Bio
                <input value={bio} onChange={(event) => setBio(event.target.value)} />
              </label>
              <label>
                URL photo de profil
                <input value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} />
              </label>
              <button className="primary-button" disabled={loading}>
                {loading ? "Inscription..." : "Inscription"}
              </button>
            </form>
            <button className="danger-button" onClick={() => setMode("login")} style={{ width: "100%" }}>
              Retour
            </button>
          </>
        )}
      </section>
    </main>
  );
}
