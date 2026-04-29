import { useState } from "react";
import { S } from "../../styles";
import { Btn, Input, AuthShell } from "../shared/UI";

const HospitalAuth = ({ users, onLogin, onBack, onRegister }) => {
  const [mode, setMode]   = useState("login");
  const [form, setForm]   = useState({});
  const [error, setError] = useState("");

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleLogin = () => {
    const user = users.find(
      (u) => u.username === form.username && u.password === form.password
    );
    if (user) onLogin(user);
    else setError("Invalid username or password.");
  };

  const handleRegister = () => {
    if (!form.username || !form.password) {
      setError("Username and password are required.");
      return;
    }
    if (users.find((u) => u.username === form.username)) {
      setError("Username already taken.");
      return;
    }
    onRegister({ ...form });
    setMode("login");
    setError("Account created! Please log in.");
    setForm({});
  };

  return (
    <AuthShell>
      {mode === "login" ? (
        <>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>
            🏥 Hospital Login
          </h3>
          <Input
            label="Username"
            placeholder="Enter username"
            value={form.username || ""}
            onChange={f("username")}
          />
          <Input
            label="Password"
            placeholder="Enter password"
            type="password"
            value={form.password || ""}
            onChange={f("password")}
          />
          {error && (
            <p style={{ color: S.red, fontSize: 13, margin: "-8px 0 12px" }}>
              {error}
            </p>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <Btn outline full onClick={onBack}>← Back</Btn>
            <Btn full onClick={handleLogin}>Login</Btn>
          </div>
          <p style={{ textAlign: "center", marginTop: 16, fontSize: 13 }}>
            Don't have an account?{" "}
            <span
              style={{ color: S.red, cursor: "pointer", fontWeight: 600 }}
              onClick={() => { setMode("register"); setError(""); }}
            >
              Register here
            </span>
          </p>
        </>
      ) : (
        <>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>
            🏥 Register as Hospital
          </h3>
          <Input label="Username *"      placeholder="Choose a username"    value={form.username || ""}  onChange={f("username")} />
          <Input label="Password *"      placeholder="Choose a password"    type="password" value={form.password || ""} onChange={f("password")} />
          <Input label="Hospital Name *" placeholder="Enter hospital name"  value={form.name || ""}      onChange={f("name")} />
          <Input label="Email *"         placeholder="Enter email"          value={form.email || ""}     onChange={f("email")} />
          <Input label="Phone Number *"  placeholder="+91 XXXXXXXXXX"       value={form.phone || ""}     onChange={f("phone")} />
          <Input label="City"            placeholder="Your city"            value={form.city || ""}      onChange={f("city")} />
          {error && (
            <p
              style={{
                color: error.includes("created") ? S.success : S.red,
                fontSize: 13, margin: "-4px 0 12px",
              }}
            >
              {error}
            </p>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <Btn outline full onClick={() => { setMode("login"); setError(""); }}>← Back</Btn>
            <Btn full onClick={handleRegister}>Register</Btn>
          </div>
        </>
      )}
    </AuthShell>
  );
};

export default HospitalAuth;
