import { useState } from "react";
import { S, BLOOD_TYPES } from "../../styles";
import { Topbar, Card, Select, Input, BloodBadge, Btn } from "../shared/UI";

const DonorDashboard = ({ user, banks, donations, onCreateDonation, onLogout }) => {
  const [searchType, setSearchType]       = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedBank, setSelectedBank]   = useState("");
  const [donateUnits, setDonateUnits]     = useState("");
  const [donateDate, setDonateDate]       = useState(new Date().toISOString().split("T")[0]);
  const [donateMsg, setDonateMsg]         = useState("");
  const [busy, setBusy]                   = useState(false);

  const filteredBanks = banks.filter(
    (b) => !locationSearch ||
      b.address?.toLowerCase().includes(locationSearch.toLowerCase()) ||
      b.name?.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const lastDonation  = donations.length > 0 ? donations[0] : null;
  const daysSinceLast = lastDonation ? Math.floor((new Date() - new Date(lastDonation.date)) / 86400000) : null;
  const canDonate     = daysSinceLast === null || daysSinceLast >= 90;
  const statusColor   = { Scheduled: S.warning, Completed: S.success, Cancelled: S.red };

  const handleDonate = async () => {
    if (!selectedBank)                      { setDonateMsg("Please select a blood bank.");         return; }
    if (!donateUnits || +donateUnits <= 0)  { setDonateMsg("Please enter a valid number of units."); return; }
    if (!user.bloodType)                    { setDonateMsg("Your profile has no blood type set.");  return; }
    if (!canDonate) {
      setDonateMsg(`Wait ${90 - daysSinceLast} more day(s) before donating again.`);
      return;
    }
    const bank = banks.find((b) => String(b._id || b.id) === String(selectedBank));
    setBusy(true);
    try {
      await onCreateDonation({ bankId: bank._id || bank.id, bloodType: user.bloodType, units: +donateUnits, date: donateDate });
      setDonateMsg("Donation scheduled at " + bank.name + " on " + donateDate + "!");
      setSelectedBank(""); setDonateUnits(""); setDonateDate(new Date().toISOString().split("T")[0]);
    } catch (err) {
      setDonateMsg(err.message || "Failed to schedule donation.");
    } finally {
      setBusy(false);
      setTimeout(() => setDonateMsg(""), 4000);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: S.bg, fontFamily: "system-ui, sans-serif" }}>
      <Topbar subtitle="Donor Portal" onLogout={onLogout} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>

        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>Donor Dashboard</h2>
              <p style={{ margin: 0, color: S.muted }}>
                Welcome, {user.name || user.username} · Blood Type: <strong style={{ color: S.red }}>{user.bloodType || "—"}</strong>
              </p>
            </div>
            <div style={{ background: canDonate ? "#EAFAF1" : "#FFF3E0", border: "1px solid " + (canDonate ? "#A9DFBF" : "#FFE0B2"), borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: canDonate ? S.success : S.warning }}>
              {canDonate ? "✅ Eligible to donate" : `⏳ Next eligible in ${90 - daysSinceLast} day(s)`}
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
            {[
              { label: "Total Donations", value: donations.length },
              { label: "Units Donated",   value: donations.reduce((s, d) => s + d.units, 0) },
              { label: "Last Donation",   value: lastDonation ? lastDonation.date : "Never" },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: S.bg, borderRadius: 10, padding: "10px 18px", border: "1px solid " + S.border, minWidth: 120 }}>
                <div style={{ fontSize: 11, color: S.muted, marginBottom: 2 }}>{label}</div>
                <div style={{ fontWeight: 800, fontSize: 18, color: S.text }}>{value}</div>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
          <Card>
            <h3 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 700 }}>🩸 Donate Blood</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: S.text }}>Your Blood Type</label>
              <div style={{ background: S.redPale, border: "1.5px solid " + S.redBorder, borderRadius: 10, padding: "11px 14px", fontSize: 14, fontWeight: 700, color: S.red }}>
                {user.bloodType || "Not set — please update your profile"}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: S.text }}>Select Blood Bank *</label>
              <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}
                style={{ width: "100%", border: "1.5px solid " + S.border, borderRadius: 10, padding: "11px 14px", fontSize: 14, fontFamily: "inherit", background: S.white, color: S.text, outline: "none" }}>
                <option value="">— Choose a blood bank —</option>
                {banks.map((b) => <option key={b._id || b.id} value={b._id || b.id}>{b.name}</option>)}
              </select>
            </div>
            <Input label="Units to Donate *" placeholder="e.g. 1" type="number" value={donateUnits} onChange={(e) => setDonateUnits(e.target.value)} />
            <Input label="Preferred Date *"  type="date" value={donateDate} onChange={(e) => setDonateDate(e.target.value)} />
            {donateMsg && (
              <p style={{ color: donateMsg.startsWith("Donation scheduled") ? S.success : S.red, fontSize: 13, marginBottom: 12, fontWeight: 600 }}>
                {donateMsg.startsWith("Donation scheduled") ? "✅ " : "⚠️ "}{donateMsg}
              </p>
            )}
            <Btn full onClick={handleDonate} disabled={busy || !canDonate} style={{ background: canDonate ? S.red : S.muted, cursor: canDonate ? "pointer" : "not-allowed" }}>
              {busy ? "Scheduling…" : "🩸 Schedule Donation"}
            </Btn>
            {!canDonate && <p style={{ fontSize: 12, color: S.muted, textAlign: "center", marginTop: 8 }}>Donors must wait 90 days between donations</p>}
          </Card>

          <Card>
            <h3 style={{ margin: "0 0 16px", fontSize: 17, fontWeight: 700 }}>📍 Find Blood Banks Near You</h3>
            <Input placeholder="Search by city or name…" value={locationSearch} onChange={(e) => setLocationSearch(e.target.value)} />
            {filteredBanks.map((bank) => (
              <div key={bank._id || bank.id} style={{ border: "1px solid " + S.border, borderRadius: 10, padding: 14, marginBottom: 10 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{bank.name}</div>
                <div style={{ color: S.muted, fontSize: 13 }}>📍 {bank.address}</div>
                <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
                  <a href={"tel:" + bank.phone}  style={{ color: "#2980B9", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>📞 Call</a>
                  <a href={"mailto:" + bank.email} style={{ color: "#2980B9", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>✉️ Email</a>
                </div>
              </div>
            ))}
          </Card>
        </div>

        <Card style={{ marginBottom: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 17, fontWeight: 700 }}>📋 My Donation History</h3>
          {donations.length === 0 ? (
            <p style={{ color: S.muted, textAlign: "center", padding: "20px 0" }}>No donations yet — schedule your first donation above!</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: S.bg }}>
                  {["Blood Type", "Units", "Blood Bank", "Date", "Status"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, fontSize: 12, color: S.muted, borderBottom: "1px solid " + S.border }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d._id || d.id} style={{ borderBottom: "1px solid " + S.border }}>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: S.red }}>{d.bloodType}</td>
                    <td style={{ padding: "12px 14px" }}>{d.units}</td>
                    <td style={{ padding: "12px 14px" }}>{d.bankName}</td>
                    <td style={{ padding: "12px 14px", color: S.muted }}>{d.date}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ background: (statusColor[d.status] || S.muted) + "20", color: statusColor[d.status] || S.muted, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card>
          <h3 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 700 }}>🏥 Blood Bank Inventory</h3>
          {banks.map((bank) => (
            <div key={bank._id || bank.id} style={{ border: "1px solid " + S.border, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>{bank.name}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {BLOOD_TYPES.map((bt) => <BloodBadge key={bt} type={bt} units={bank.inventory?.[bt] ?? 0} />)}
              </div>
            </div>
          ))}
        </Card>

      </div>
    </div>
  );
};

export default DonorDashboard;