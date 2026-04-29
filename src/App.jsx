import { useState } from "react";
import { INITIAL_USERS, INITIAL_BANKS } from "./data/initialData";

// Pages
import Landing          from "./components/Landing";

// Auth components (one per role)
import HospitalAuth     from "./components/auth/HospitalAuth";
import BloodBankAuth    from "./components/auth/BloodBankAuth";
import DonorAuth        from "./components/auth/DonorAuth";

// Dashboard components (one per role)
import HospitalDashboard    from "./components/dashboards/HospitalDashboard";
import BloodBankDashboard   from "./components/dashboards/BloodBankDashboard";
import DonorDashboard       from "./components/dashboards/DonorDashboard";

export default function App() {
  // Navigation state
  const [screen, setScreen]           = useState("landing"); // "landing" | "auth" | "dashboard"
  const [role, setRole]               = useState(null);      // "hospital" | "bank" | "donor"
  const [currentUser, setCurrentUser] = useState(null);

  // Shared application state
  const [users, setUsers]       = useState(INITIAL_USERS);
  const [banks, setBanks]       = useState(INITIAL_BANKS);
  const [requests, setRequests] = useState([]);

  // Navigation handlers
  const handleSelect  = (r)    => { setRole(r); setScreen("auth"); };
  const handleLogin   = (user) => { setCurrentUser(user); setScreen("dashboard"); };
  const handleBack    = ()     => { setScreen("landing"); setRole(null); };
  const handleLogout  = ()     => { setCurrentUser(null); setRole(null); setScreen("landing"); };
  const handleRegister = (newUser) =>
    setUsers((u) => ({ ...u, [role]: [...u[role], newUser] }));

  // ── Landing ───────────────────────────────────────────────────────────────
  if (screen === "landing") {
    return <Landing onSelect={handleSelect} />;
  }

  // ── Auth (role-specific) ──────────────────────────────────────────────────
  if (screen === "auth") {
    const authProps = {
      users: users[role],
      onLogin: handleLogin,
      onBack: handleBack,
      onRegister: handleRegister,
    };

    if (role === "hospital") return <HospitalAuth  {...authProps} />;
    if (role === "bank")     return <BloodBankAuth {...authProps} />;
    if (role === "donor")    return <DonorAuth     {...authProps} />;
  }

  // ── Dashboards (role-specific) ────────────────────────────────────────────
  if (screen === "dashboard") {
    if (role === "bank") {
      return (
        <BloodBankDashboard
          user={currentUser}
          banks={banks}
          setBanks={setBanks}
          requests={requests}
          setRequests={setRequests}
          onLogout={handleLogout}
        />
      );
    }

    if (role === "hospital") {
      return (
        <HospitalDashboard
          user={currentUser}
          banks={banks}
          requests={requests}
          setRequests={setRequests}
          onLogout={handleLogout}
        />
      );
    }

    if (role === "donor") {
      return (
        <DonorDashboard
          user={currentUser}
          banks={banks}
          donors={users.donor}
          onLogout={handleLogout}
        />
      );
    }
  }

  return null;
}
