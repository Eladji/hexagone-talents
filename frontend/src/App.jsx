import { useEffect, useMemo, useState } from "react";

import { createApi } from "./api/client";
import { RoleShell } from "./components/RoleShell";
import { LoginScreen } from "./features/auth/LoginScreen";
import { CompanySpace } from "./features/company/CompanySpace";
import { StaffSpace } from "./features/staff/StaffSpace";
import { StudentSpace } from "./features/student/StudentSpace";

function App() {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem("hexagone-session");
    return saved ? JSON.parse(saved) : null;
  });
  const [view, setView] = useState("home");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (session) localStorage.setItem("hexagone-session", JSON.stringify(session));
    else localStorage.removeItem("hexagone-session");
  }, [session]);

  const api = useMemo(() => createApi(session, setToast), [session]);

  function logout() {
    setSession(null);
    setView("home");
    setToast("");
  }

  return (
    <div className="app-shell">
      {!session ? (
        <LoginScreen setSession={setSession} setToast={setToast} />
      ) : (
        <>
          <header className="topbar">
            <div className="brand">
              <div className="mark">H</div>
              <div>
                <strong>Hexagone Talents</strong>
                <span>Matching inverse pour profils tech</span>
              </div>
            </div>
            <button className="ghost-button" onClick={logout}>
              Déconnexion
            </button>
          </header>

          <main className="workspace">
            <RoleShell session={session} view={view} setView={setView}>
              {session.role === "ETUDIANT" && (
                <StudentSpace api={api} session={session} view={view} setView={setView} />
              )}
              {session.role === "ENTREPRISE" && (
                <CompanySpace api={api} session={session} view={view} setView={setView} />
              )}
              {session.role === "STAFF" && <StaffSpace api={api} view={view} />}
            </RoleShell>
          </main>
        </>
      )}

      {toast && (
        <button className="toast" onClick={() => setToast("")}>
          {toast}
        </button>
      )}
    </div>
  );
}

export default App;
