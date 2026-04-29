import { S } from "../../styles";

export const Logo = ({ subtitle }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div
      style={{
        width: 38, height: 38, borderRadius: 10, background: S.redPale,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <span style={{ fontSize: 20 }}>🩸</span>
    </div>
    <div>
      <div
        style={{
          fontWeight: 800, fontSize: 17, color: S.text,
          lineHeight: 1.1, fontFamily: "Georgia, serif",
        }}
      >
        Blood Bank System
      </div>
      {subtitle && (
        <div style={{ fontSize: 12, color: S.muted }}>{subtitle}</div>
      )}
    </div>
  </div>
);

export const Topbar = ({ subtitle, onLogout }) => (
  <div
    style={{
      background: S.white, borderBottom: `1px solid ${S.border}`,
      padding: "0 32px", height: 60, display: "flex",
      alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      position: "sticky", top: 0, zIndex: 10,
    }}
  >
    <Logo subtitle={subtitle} />
    <button
      onClick={onLogout}
      style={{
        background: "none", border: `1px solid ${S.border}`, borderRadius: 8,
        padding: "7px 16px", cursor: "pointer", fontSize: 14, color: S.muted,
        display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit",
      }}
    >
      <span>→</span> Logout
    </button>
  </div>
);

export const Btn = ({
  children, onClick, color = S.red, outline, full, size = "md", style: sx = {},
}) => (
  <button
    onClick={onClick}
    style={{
      background: outline ? "transparent" : color,
      color: outline ? S.text : S.white,
      border: outline ? `1.5px solid ${S.border}` : "none",
      borderRadius: 10, cursor: "pointer",
      padding: size === "sm" ? "8px 16px" : "12px 24px",
      fontSize: size === "sm" ? 13 : 15, fontWeight: 600,
      width: full ? "100%" : "auto", fontFamily: "inherit",
      transition: "opacity .15s, transform .1s",
      ...sx,
    }}
    onMouseEnter={(e) => (e.target.style.opacity = ".88")}
    onMouseLeave={(e) => (e.target.style.opacity = "1")}
  >
    {children}
  </button>
);

export const Input = ({ label, placeholder, type = "text", value, onChange, prefix }) => (
  <div style={{ marginBottom: 16 }}>
    {label && (
      <label
        style={{
          display: "block", fontSize: 13, fontWeight: 600,
          marginBottom: 6, color: S.text,
        }}
      >
        {label}
      </label>
    )}
    <div style={{ position: "relative" }}>
      {prefix && (
        <span
          style={{
            position: "absolute", left: 12, top: "50%",
            transform: "translateY(-50%)", color: S.muted, fontSize: 13,
          }}
        >
          {prefix}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: "100%", boxSizing: "border-box",
          border: `1.5px solid ${S.border}`, borderRadius: 10,
          padding: prefix ? "11px 12px 11px 52px" : "11px 14px",
          fontSize: 14, outline: "none", fontFamily: "inherit",
          background: S.white, color: S.text,
        }}
        onFocus={(e) => (e.target.style.borderColor = S.red)}
        onBlur={(e) => (e.target.style.borderColor = S.border)}
      />
    </div>
  </div>
);

export const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 16 }}>
    {label && (
      <label
        style={{
          display: "block", fontSize: 13, fontWeight: 600,
          marginBottom: 6, color: S.text,
        }}
      >
        {label}
      </label>
    )}
    <select
      value={value}
      onChange={onChange}
      style={{
        width: "100%", border: `1.5px solid ${S.border}`, borderRadius: 10,
        padding: "11px 14px", fontSize: 14, fontFamily: "inherit",
        background: S.white, color: S.text, outline: "none",
      }}
      onFocus={(e) => (e.target.style.borderColor = S.red)}
      onBlur={(e) => (e.target.style.borderColor = S.border)}
    >
      <option value="">— Select —</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

export const Card = ({ children, style: sx = {} }) => (
  <div
    style={{
      background: S.card, borderRadius: 14,
      border: `1px solid ${S.border}`, padding: 24,
      boxShadow: S.shadow, ...sx,
    }}
  >
    {children}
  </div>
);

export const BloodBadge = ({ type, units }) => {
  const low = units < 10;
  return (
    <div
      style={{
        background: low ? "#FFF3F3" : S.redPale,
        border: `1px solid ${low ? S.redBorder : "#FADADD"}`,
        borderRadius: 10, padding: "12px 8px",
        textAlign: "center", minWidth: 70,
      }}
    >
      <div style={{ color: low ? S.urgent : S.red, fontWeight: 800, fontSize: 13 }}>{type}</div>
      <div style={{ fontWeight: 800, fontSize: 22, color: S.text }}>{units}</div>
      <div style={{ fontSize: 11, color: S.muted }}>units</div>
    </div>
  );
};

export const AuthShell = ({ children }) => (
  <div
    style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 60%, #FFF0F0 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Georgia, serif",
    }}
  >
    <div
      style={{
        background: S.white, borderRadius: 20, padding: "36px 32px",
        width: "100%", maxWidth: 420, boxShadow: S.shadowMd,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div
          style={{
            width: 60, height: 60, borderRadius: "50%", background: S.redPale,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px", fontSize: 28,
          }}
        >
          🩸
        </div>
        <h2 style={{ fontWeight: 900, fontSize: 24, margin: "0 0 4px" }}>
          Blood Bank System
        </h2>
        <p style={{ color: S.muted, margin: 0, fontSize: 13 }}>
          Saving lives, one donation at a time
        </p>
      </div>
      {children}
    </div>
  </div>
);
