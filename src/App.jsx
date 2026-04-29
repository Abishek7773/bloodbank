import { useState, useEffect, useCallback } from "react";

// API helpers
import {
  apiLogin, apiRegister,
  apiFetchBanks,
  apiFetchRequests, apiCreateRequest, apiUpdateRequest,
  apiFetchDonations, apiCreateDonation,
  apiUpdateInventory,
} from "./api";

// Pages
import Landing from "./components/Landing";

// Auth components (one per role)
import HospitalAuth  from "./components/auth/HospitalAuth";
import BloodBankAuth from "./components/auth/BloodBankAuth";
import DonorAuth     from "./components/auth/DonorAuth";

// Dashboard components (one per role)
import HospitalDashboard  from "./components/dashboards/HospitalDashboard";
import BloodBankDashboard from "./components/dashboards/BloodBankDashboard";
import DonorDashboard     from "./components/dashboards/DonorDashboard";

// ── token helpers ─────────────────────────────────────────────────────────────
const saveToken  = (t) => localStorage.setItem("bb_token", t);
const clearToken = ()  => localStorage.removeItem("bb_token");

export default function App() {
  const [screen, setScreen]         = useState("landing");
  const [role,   setRole]           = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Shared server-backed state
  const [banks,     setBanks]     = useState([]);
  const [requests,  setRequests]  = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [apiError,  setApiError]  = useState("");

  // ── fetch shared data after login ─────────────────────────────────────────
  const refreshBanks = useCallback(async () => {
    try { setBanks(await apiFetchBanks()); } catch { /* ignore */ }
  }, []);

  const refreshRequests = useCallback(async () => {
    try { setRequests(await apiFetchRequests()); } catch { /* ignore */ }
  }, []);

  const refreshDonations = useCallback(async () => {
    try { setDonations(await apiFetchDonations()); } catch { /* ignore */ }
  }, []);

  // Load banks on mount (public endpoint)
  useEffect(() => { refreshBanks(); }, [refreshBanks]);

  // ── Navigation handlers ───────────────────────────────────────────────────
  const handleSelect = (r) => { setRole(r); setScreen("auth"); setApiError(""); };
  const handleBack   = ()  => { setScreen("landing"); setRole(null); setApiError(""); };

  const handleLogin = async (username, password) => {
    setLoading(true); setApiError("");
    try {
      const data = await apiLogin(username, password, role);
      saveToken(data.token);
      setCurrentUser(data.user);
      setScreen("dashboard");
      // Fetch role-specific data
      await refreshBanks();
      if (role === "hospital" || role === "bank") await refreshRequests();
      if (role === "donor") await refreshDonations();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (payload) => {
    setLoading(true); setApiError("");
    try {
      const data = await apiRegister({ ...payload, role });
      saveToken(data.token);
      setCurrentUser(data.user);
      setScreen("dashboard");
      await refreshBanks();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    setCurrentUser(null); setRole(null); setScreen("landing");
    setRequests([]); setDonations([]);
  };

  // ── Request actions (hospital / bank) ─────────────────────────────────────
  const handleCreateRequest = async (payload) => {
    const req = await apiCreateRequest(payload);
    setRequests((r) => [req, ...r]);
    return req;
  };

  const handleUpdateRequest = async (id, action) => {
    const updated = await apiUpdateRequest(id, action);
    setRequests((rs) => rs.map((r) => (String(r._id || r.id) === String(id) ? updated : r)));
    if (action === "approve") await refreshBanks(); // refresh inventory
    return updated;
  };

  // ── Donation actions (donor) ───────────────────────────────────────────────
  const handleCreateDonation = async (payload) => {
    const d = await apiCreateDonation(payload);
    setDonations((ds) => [d, ...ds]);
    return d;
  };

  // ── Inventory update (bank) ────────────────────────────────────────────────
  const handleUpdateInventory = async (bankId, inventory) => {
    const updated = await apiUpdateInventory(bankId, inventory);
    setBanks((bs) => bs.map((b) => (String(b._id || b.id) === String(bankId) ? updated : b)));
    return updated;
  };

  // ── Landing ───────────────────────────────────────────────────────────────
  if (screen === "landing") return <Landing onSelect={handleSelect} />;

  // ── Auth (role-specific) ──────────────────────────────────────────────────
  if (screen === "auth") {
    const authProps = {
      onLogin: handleLogin,
      onBack:  handleBack,
      onRegister: handleRegister,
      loading,
      error: apiError,
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
          requests={requests}
          onUpdateInventory={handleUpdateInventory}
          onUpdateRequest={handleUpdateRequest}
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
          onCreateRequest={handleCreateRequest}
          onLogout={handleLogout}
        />
      );
    }
    if (role === "donor") {
      return (
        <DonorDashboard
          user={currentUser}
          banks={banks}
          donations={donations}
          onCreateDonation={handleCreateDonation}
          onLogout={handleLogout}
        />
      );
    }
  }

  return null;
}
