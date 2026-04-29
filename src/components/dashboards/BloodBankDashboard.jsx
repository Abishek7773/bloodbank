import { useState } from "react";
import { S, BLOOD_TYPES } from "../../styles";
import { Topbar, Btn, Card, BloodBadge } from "../shared/UI";

const BloodBankDashboard = ({ user, banks, requests, onUpdateInventory, onUpdateRequest, onLogout }) => {
  const bank    = banks.find((b) => b.username === user.username) || banks[0];
  const [editing, setEditing] = useState(false);
  const [inv,     setInv]     = useState(bank ? { ...bank.inventory } : {});
  const [busy,    setBusy]    = useState(false);

  const currentInv = editing ? inv : (bank?.inventory || {});
  const pending = requests.filter(
    (r) => String(r.bankId) === String(bank?._id || bank?.id) && r.status === "pending"
  );

  const saveInventory = async () => {
    if (!bank) return;
    setBusy(true);
    try {
      await onUpdateInventory(bank._id || bank.id, inv);
      setEditing(false);
    } catch (err) {
      alert(err.message || "Failed to save inventory");
    } finally { setBusy(false); }
  };

  const handleRequest = async (reqId, action) => {
    setBusy(true);
    try { await onUpdateRequest(reqId, action); }
    catch (err) { alert(err.message || "Failed to update request"); }
    finally { setBusy(false); }
  };

  if (!bank) return (
    <div style={{ minHeight: "100vh", background: S.bg }}>
      <Topbar subtitle="Blood Bank Portal" onLogout={onLogout} />
      <div style={{ textAlign: "center", padding: 60, color: S.muted }}>Loading…</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: S.bg, fontFamily: "system-ui, sans-serif" }}>
      <Topbar subtitle="Blood Bank Portal" onLogout={onLogout} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        <Card style={{ marginBottom: 24 }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>Blood Bank Dashboard</h2>
          <p style={{ margin: 0, color: S.muted }}>{bank.name}</p>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Blood Inventory</h3>
              {editing ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn size="sm" outline onClick={() => { setEditing(false); setInv({ ...bank.inventory }); }} disabled={busy}>Cancel</Btn>
                  <Btn size="sm" onClick={saveInventory} disabled={busy}>{busy ? "Saving…" : "Save"}</Btn>
                </div>
              ) : (
                <Btn size="sm" onClick={() => { setEditing(true); setInv({ ...bank.inventory }); }}>✏️ Edit</Btn>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {BLOOD_TYPES.map((bt) =>
                editing ? (
                  <div key={bt} style={{ background: S.redPale, borderRadius: 10, padding: 12, border: `1px solid ${S.redBorder}` }}>
                    <div style={{ color: S.red, fontWeight: 800, fontSize: 13, marginBottom: 6 }}>{bt}</div>
                    <input type="number" value={inv[bt] ?? 0}
                      onChange={(e) => setInv((i) => ({ ...i, [bt]: parseInt(e.target.value) || 0 }))}
                      style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${S.redBorder}`, borderRadius: 7, padding: "6px 10px", fontSize: 15, fontWeight: 700, textAlign: "center", fontFamily: "inherit" }}
                    />
                    <div style={{ fontSize: 11, color: S.muted, textAlign: "center" }}>units</div>
                  </div>
                ) : (
                  <BloodBadge key={bt} type={bt} units={currentInv[bt] ?? 0} />
                )
              )}
            </div>
          </Card>

          <Card>
            <h3 style={{ margin: "0 0 16px", fontSize: 17, fontWeight: 700 }}>Pending Requests</h3>
            {pending.length === 0 ? (
              <p style={{ color: S.muted, textAlign: "center", padding: "20px 0" }}>No pending requests</p>
            ) : (
              pending.map((r) => (
                <div key={r._id || r.id} style={{ border: `1px solid ${S.border}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontWeight: 700 }}>{r.hospitalName}</span>
                    <span style={{ background: r.urgency === "Critical" ? "#FFF0F0" : "#FFF8E7", color: r.urgency === "Critical" ? S.urgent : S.warning, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>{r.urgency}</span>
                  </div>
                  <p style={{ margin: "4px 0 10px", fontSize: 13, color: S.muted }}>{r.bloodType} × {r.units} units</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn size="sm" onClick={() => handleRequest(r._id || r.id, "approve")} disabled={busy} style={{ flex: 1, background: S.success }}>Approve</Btn>
                    <Btn size="sm" outline onClick={() => handleRequest(r._id || r.id, "reject")} disabled={busy} style={{ flex: 1, color: S.red }}>Reject</Btn>
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BloodBankDashboard;
