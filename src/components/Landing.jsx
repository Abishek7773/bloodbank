import { S } from "../styles";

const Landing = ({ onSelect }) => (
  <div
    style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 60%, #FFF0F0 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Georgia, serif",
    }}
  >
    <div style={{ textAlign: "center", maxWidth: 400, width: "100%", padding: "0 24px" }}>
      <div
        style={{
          width: 80, height: 80, borderRadius: "50%", background: S.redPale,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", fontSize: 36,
          boxShadow: `0 0 0 12px ${S.redBorder}30`,
        }}
      >
        🩸
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: S.text, margin: "0 0 6px" }}>
        Blood Bank System
      </h1>
      <p style={{ color: S.muted, marginBottom: 36, fontSize: 15 }}>
        Saving lives, one donation at a time
      </p>

      {[
        { role: "hospital", icon: "🏥", label: "Hospital Login" },
        { role: "bank",     icon: "💉", label: "Blood Bank Center Login" },
        { role: "donor",    icon: "👤", label: "Blood Donor Login" },
      ].map(({ role, icon, label }) => (
        <button
          key={role}
          onClick={() => onSelect(role)}
          style={{
            display: "flex", alignItems: "center", gap: 14,
            width: "100%", padding: "16px 20px", marginBottom: 12,
            border: `1.5px solid ${S.border}`, borderRadius: 14, cursor: "pointer",
            background: S.white, fontSize: 15, fontWeight: 600, color: S.text,
            fontFamily: "inherit", boxShadow: S.shadow,
            transition: "box-shadow .15s, border-color .15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = S.red;
            e.currentTarget.style.boxShadow = S.shadowMd;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = S.border;
            e.currentTarget.style.boxShadow = S.shadow;
          }}
        >
          <span style={{ fontSize: 22 }}>{icon}</span> {label}
        </button>
      ))}
    </div>
  </div>
);

export default Landing;
