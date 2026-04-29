import { useState } from "react";
import { S, BLOOD_TYPES } from "../../styles";
import { Topbar, Card, Select, Input, BloodBadge, Btn } from "../shared/UI";

const DonorDashboard = ({ user, banks, donors, onLogout }) => {
  const [searchType, setSearchType] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  // Donate Blood form state
  const [selectedBank, setSelectedBank] = useState("");
  const [donateUnits, setDonateUnits] = useState("");
  const [donateDate, setDonateDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [donateMsg, setDonateMsg] = useState("");
  const [donations, setDonations] = useState([]);

  const filteredBanks = banks.filter(
    (b) =>
      !locationSearch ||
      b.address.toLowerCase().includes(locationSearch.toLowerCase()) ||
      b.name.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const matchedDonors = searchType
    ? donors.filter((d) => d.bloodType === searchType && d.username !== user.username)
    : [];

  // Last donation date — donors should wait 90 days between donations
  const lastDonation = donations.length > 0 ? donations[donations.length - 1] : null;
  const daysSinceLast = lastDonation
    ? Math.floor((new Date() - new Date(lastDonation.date)) / (1000 * 60 * 60 * 24))
    : null;
  const canDonate = daysSinceLast === null || daysSinceLast >= 90;

  const handleDonate = () => {
    if (!selectedBank) { setDonateMsg("Please select a blood bank."); return; }
    if (!donateUnits || parseInt(donateUnits) <= 0) { setDonateMsg("Please enter a valid number of units."); return; }
    if (!user.bloodType) { setDonateMsg("Your profile has no blood type set."); return; }
    if (!canDonate) {
      setDonateMsg(`You need to wait ${90 - daysSinceLast} more day(s) before donating again.`);
      return;
    }
    const bank = banks.find((b) => b.id === parseInt(selectedBank));
    const newDonation = {
      id: Date.now(),
      bankId: bank.id,
      bankName: bank.name,
      bloodType: user.bloodType,
      units: parseInt(donateUnits),
      date: donateDate,
      status: "Scheduled",
    };
    setDonations((d) => [...d, newDonation]);
    setDonateMsg("Donation scheduled at " + bank.name + " on " + donateDate + "!");
    setSelectedBank(""); setDonateUnits("");
    setDonateDate(new Date().toISOString().split("T")[0]);
    setTimeout(() => setDonateMsg(""), 4000);
  };

  const statusColor = { Scheduled: S.warning, Completed: S.success, Cancelled: S.red };

  return (
    <div style={{ minHeight: "100vh", background: S.bg, fontFamily: "system-ui, sans-serif" }}>
      <Topbar subtitle="Donor Portal" onLogout={onLogout} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>

        {/* Header with stats */}
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>Donor Dashboard</h2>
              <p style={{ margin: 0, color: S.muted }}>
                Welcome, {user.name || user.username} · Blood Type:{" "}
                <strong style={{ color: S.red }}>{user.bloodType || "—"}</strong>
              </p>
            </div>
            <div style={{
              background: canDonate ? "#EAFAF1" : "#FFF3E0",
              border: "1px solid " + (canDonate ? "#A9DFBF" : "#FFE0B2"),
              borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600,
              color: canDonate ? S.success : S.warning,
            }}>
              {canDonate ? "✅ Eligible to donate" : ("⏳ Next eligible in " + (90 - daysSinceLast) + " day(s)")}
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
            {[
              { label: "Total Donations", value: donations.length },
              { label: "Units Donated", value: donations.reduce((s, d) => s + d.units, 0) },
              { label: "Last Donation", value: lastDonation ? lastDonation.date : "Never" },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: S.bg, borderRadius: 10, padding: "10px 18px",
                border: "1px solid " + S.border, minWidth: 120,
              }}>
                <div style={{ fontSize: 11, color: S.muted, marginBottom: 2 }}>{label}</div>
                <div style={{ fontWeight: 800, fontSize: 18, color: S.text }}>{value}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Donate Blood + Find Blood Banks */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>

          {/* Donate Blood */}
          <Card>
            <h3 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 700 }}>🩸 Donate Blood</h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: S.text }}>
                Your Blood Type
              </label>
              <div style={{
                background: S.redPale, border: "1.5px solid " + S.redBorder,
                borderRadius: 10, padding: "11px 14px", fontSize: 14,
                fontWeight: 700, color: S.red,
              }}>
                {user.bloodType || "Not set — please update your profile"}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: S.text }}>
                Select Blood Bank *
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                style={{
                  width: "100%", border: "1.5px solid " + S.border, borderRadius: 10,
                  padding: "11px 14px", fontSize: 14, fontFamily: "inherit",
                  background: S.white, color: S.text, outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = S.red)}
                onBlur={(e) => (e.target.style.borderColor = S.border)}
              >
                <option value="">— Choose a blood bank —</option>
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <Input
              label="Units to Donate *"
              placeholder="e.g. 1"
              type="number"
              value={donateUnits}
              onChange={(e) => setDonateUnits(e.target.value)}
            />
            <Input
              label="Preferred Date *"
              type="date"
              value={donateDate}
              onChange={(e) => setDonateDate(e.target.value)}
            />

            {donateMsg && (
              <p style={{
                color: donateMsg.startsWith("Donation scheduled") ? S.success : S.red,
                fontSize: 13, marginBottom: 12, fontWeight: 600,
              }}>
                {donateMsg.startsWith("Donation scheduled") ? "✅ " : "⚠️ "}{donateMsg}
              </p>
            )}

            <Btn
              full
              onClick={handleDonate}
              style={{ background: canDonate ? S.red : S.muted, cursor: canDonate ? "pointer" : "not-allowed" }}
            >
              🩸 Schedule Donation
            </Btn>
            {!canDonate && (
              <p style={{ fontSize: 12, color: S.muted, textAlign: "center", marginTop: 8 }}>
                Donors must wait 90 days between donations
              </p>
            )}
          </Card>

          {/* Find Blood Banks */}
          <Card>
            <h3 style={{ margin: "0 0 16px", fontSize: 17, fontWeight: 700 }}>📍 Find Blood Banks Near You</h3>
            <Input
              placeholder="Search by city or name…"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
            />
            {filteredBanks.map((bank) => (
              <div key={bank.id} style={{ border: "1px solid " + S.border, borderRadius: 10, padding: 14, marginBottom: 10 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{bank.name}</div>
                <div style={{ color: S.muted, fontSize: 13 }}>📍 {bank.address}</div>
                <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
                  <a href={"tel:" + bank.phone} style={{ color: "#2980B9", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>📞 Call</a>
                  <a href={"mailto:" + bank.email} style={{ color: "#2980B9", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>✉️ Email</a>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Donation History */}
        <Card style={{ marginBottom: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 17, fontWeight: 700 }}>📋 My Donation History</h3>
          {donations.length === 0 ? (
            <p style={{ color: S.muted, textAlign: "center", padding: "20px 0" }}>
              No donations yet — schedule your first donation above!
            </p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: S.bg }}>
                  {["Blood Type", "Units", "Blood Bank", "Date", "Status"].map((h) => (
                    <th key={h} style={{
                      padding: "10px 14px", textAlign: "left", fontWeight: 700,
                      fontSize: 12, color: S.muted, borderBottom: "1px solid " + S.border,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...donations].reverse().map((d) => (
                  <tr key={d.id} style={{ borderBottom: "1px solid " + S.border }}>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: S.red }}>{d.bloodType}</td>
                    <td style={{ padding: "12px 14px" }}>{d.units}</td>
                    <td style={{ padding: "12px 14px" }}>{d.bankName}</td>
                    <td style={{ padding: "12px 14px", color: S.muted }}>{d.date}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        background: statusColor[d.status] + "20",
                        color: statusColor[d.status],
                        padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                      }}>{d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {/* Find Donors + Inventory */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <Card>
            <h3 style={{ margin: "0 0 16px", fontSize: 17, fontWeight: 700 }}>👥 Find Other Donors</h3>
            <Select value={searchType} onChange={(e) => setSearchType(e.target.value)} options={BLOOD_TYPES} />
            {searchType && matchedDonors.length === 0 && (
              <p style={{ color: S.muted, textAlign: "center", padding: "16px 0" }}>No donors found for {searchType}</p>
            )}
            {matchedDonors.map((d) => (
              <div key={d.username} style={{
                border: "1px solid " + S.border, borderRadius: 10, padding: 14,
                marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{d.name || d.username}</div>
                  <div style={{ fontSize: 13, color: S.muted }}>{d.city || "Location unknown"}</div>
                  <div style={{ fontSize: 13, color: S.muted }}>{d.phone}</div>
                </div>
                <span style={{ background: S.redPale, color: S.red, fontWeight: 800, padding: "6px 12px", borderRadius: 20, fontSize: 13 }}>
                  {d.bloodType}
                </span>
              </div>
            ))}
            {!searchType && <p style={{ color: S.muted, textAlign: "center", padding: "24px 0" }}>Select a blood type to search</p>}
          </Card>

          <Card>
            <h3 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 700 }}>🏥 Blood Bank Inventory</h3>
            {banks.map((bank) => (
              <div key={bank.id} style={{ border: "1px solid " + S.border, borderRadius: 12, padding: 16, marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>{bank.name}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {BLOOD_TYPES.map((bt) => <BloodBadge key={bt} type={bt} units={bank.inventory[bt] || 0} />)}
                </div>
              </div>
            ))}
          </Card>
        </div>

      </div>
    </div>
  );
};

export default DonorDashboard;