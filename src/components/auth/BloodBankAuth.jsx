import { useState } from "react";
import { S } from "../../styles";
import { Btn, Input, AuthShell } from "../shared/UI";

const BloodBankAuth = ({ onLogin, onBack, onRegister, loading, error: apiError }) => {
  const [mode, setMode]     = useState("login");
  const [form, setForm]     = useState({});
  const [localError, setLocalError] = useState("");

  const f   = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const err = apiError || localError;

  const handleLogin = () => {
    if (!form.username || !form.password) { setLocalError("Username and password are required."); return; }
    setLocalError("");
    onLogin(form.username, form.password);
  };

  const handleRegister = () => {
    if (!form.username || !form.password || !form.name) {
      setLocalError("Username, password and blood bank name are required.");
      return;
    }
    setLocalError("");
    onRegister({ ...form });
  };

  return (
    <AuthShell>
      {mode === "login" ? (
        <>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>💉 Blood Bank Center Login</h3>
          <Input label="Username" placeholder="Enter username" value={form.username || ""} onChange={f("username")} />
          <Input label="Password" placeholder="Enter password" type="password" value={form.password || ""} onChange={f("password")} />
          {err && <p style={{ color: S.red, fontSize: 13, margin: "-8px 0 12px" }}>{err}</p>}
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <Btn outline full onClick={onBack}>← Back</Btn>
            <Btn full onClick={handleLogin} disabled={loading}>{loading ? "Logging in…" : "Login"}</Btn>
          </div>
          <p style={{ textAlign: "center", marginTop: 16, fontSize: 13 }}>
            Don't have an account?{" "}
            <span style={{ color: S.red, cursor: "pointer", fontWeight: 600 }}
              onClick={() => { setMode("register"); setLocalError(""); }}>
              Register here
            </span>
          </p>
        </>
      ) : (
        <>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>💉 Register as Blood Bank Center</h3>
          <Input label="Username *"        placeholder="Choose a username"  value={form.username || ""}  onChange={f("username")} />
          <Input label="Password *"        placeholder="Choose a password"  type="password" value={form.password || ""} onChange={f("password")} />
          <Input label="Blood Bank Name *" placeholder="Enter name"         value={form.name || ""}      onChange={f("name")} />
          <Input label="Email *"           placeholder="Enter email"        value={form.email || ""}     onChange={f("email")} />
          <Input label="Phone Number *"    placeholder="+91 XXXXXXXXXX"     value={form.phone || ""}     onChange={f("phone")} />
          <Input label="Address"           placeholder="Full address"       value={form.address || ""}   onChange={f("address")} />
          {err && <p style={{ color: S.red, fontSize: 13, margin: "-4px 0 12px" }}>{err}</p>}
          <div style={{ display: "flex", gap: 10 }}>
            <Btn outline full onClick={() => { setMode("login"); setLocalError(""); }}>← Back</Btn>
            <Btn full onClick={handleRegister} disabled={loading}>{loading ? "Registering…" : "Register"}</Btn>
          </div>
        </>
      )}
    </AuthShell>
  );
};

export default BloodBankAuth;
