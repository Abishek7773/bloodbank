import { useState } from "react";
import { S, BLOOD_TYPES } from "../../styles";
import { Topbar, Btn, Card, Select, Input } from "../shared/UI";

const HospitalDashboard = ({ user, banks, requests, setRequests, onLogout }) => {
  const [bloodType, setBloodType] = useState("");
  const [units, setUnits]         = useState("");
  const [urgency, setUrgency]     = useState("Normal");
  const [msg, setMsg]             = useState("");

  const myRequests = requests.filter((r) => r.hospitalUsername === user.username);

  const submit = () => {
    if (!bloodType || !units) { setMsg("Please fill blood type and units."); return; }
    const newReq = {
      id: Date.now(),
      bankId: banks[0].id,
      hospitalUsername: user.username,
      hospitalName: user.name || user.username,
      bloodType,
      units: parseInt(units),
      urgency,
      status: "pending",
      time: new Date().toLocaleTimeString(),
    };
    setRequests((r) => [...r, newReq]);
    setMsg("Request submitted successfully!");
    setBloodType(""); setUnits(""); setUrgency("Normal");
    setTimeout(() => setMsg(""), 3000);
  };

  const sendEmergency = () => {
    ["A+", "O+", "B+"].forEach((bt, i) => {
      const newReq = {
        id: Date.now() + i,
        bankId: banks[i % banks.length].id,
        hospitalUsername: user.username,
        hospitalName: user.name || user.username,
        bloodType: bt, units: 5, urgency: "Critical",
        status: "pending", time: new Date().toLocaleTimeString(),
      };
      setRequests((r) => [...r, newReq]);
    });
    setMsg("🚨 Emergency alert sent to all blood banks!");
    setTimeout(() => setMsg(""), 4000);
  };

  const statusColor = { pending: S.warning, approved: S.success, rejected: S.red };

  return (
    <div style={{ minHeight: "100vh", background: S.bg, fontFamily: "system-ui, sans-serif" }}>
      <Topbar subtitle="Hospital Portal" onLogout={onLogout} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        <Card style={{ marginBottom: 24 }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>Hospital Dashboard</h2>
          <p style={{ margin: 0, color: S.muted }}>Welcome, {user.name || user.username}</p>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Request Blood */}
          <Card>
            <h3 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              💉 Request Blood
            </h3>
            <Select
              label="Blood Type"
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              options={BLOOD_TYPES}
            />
            <Input
              label="Units Required"
              placeholder="Number of units"
              type="number"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
            />
            <Select
              label="Urgency"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              options={["Normal", "Urgent", "Critical"]}
            />
            {msg && (
              <p style={{ color: msg.includes("🚨") || msg.includes("success") ? S.success : S.red, fontSize: 13, marginBottom: 12 }}>
                {msg}
              </p>
            )}
            <Btn full onClick={submit} style={{ marginBottom: 10 }}>Submit Request</Btn>
            <Btn full onClick={sendEmergency} style={{ background: "#E67E22" }}>
              🚨 Send Emergency Alert
            </Btn>
          </Card>

          {/* Available Blood Banks */}
          <Card style={{ overflow: "hidden" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 17, fontWeight: 700 }}>Available Blood Banks</h3>
            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              {banks.map((bank) => (
                <div
                  key={bank.id}
                  style={{ border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, marginBottom: 14 }}
                >
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{bank.name}</div>
                  <div style={{ color: S.muted, fontSize: 13, marginBottom: 2 }}>📍 {bank.address}</div>
                  <div style={{ color: S.muted, fontSize: 13, marginBottom: 12 }}>📞 {bank.phone}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                    {BLOOD_TYPES.map((bt) => (
                      <div
                        key={bt}
                        style={{ background: S.redPale, borderRadius: 8, padding: "8px 4px", textAlign: "center" }}
                      >
                        <div style={{ color: S.red, fontWeight: 800, fontSize: 11 }}>{bt}</div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{bank.inventory[bt] || 0}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* My Requests Table */}
          <Card style={{ gridColumn: "1 / -1" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 17, fontWeight: 700 }}>My Blood Requests</h3>
            {myRequests.length === 0 ? (
              <p style={{ color: S.muted, textAlign: "center", padding: "16px 0" }}>No requests yet</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: S.bg }}>
                    {["Blood Type", "Units", "Urgency", "Blood Bank", "Time", "Status"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 14px", textAlign: "left",
                          fontWeight: 700, fontSize: 12, color: S.muted,
                          borderBottom: `1px solid ${S.border}`,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...myRequests].reverse().map((r) => (
                    <tr key={r.id} style={{ borderBottom: `1px solid ${S.border}` }}>
                      <td style={{ padding: "12px 14px", fontWeight: 700, color: S.red }}>{r.bloodType}</td>
                      <td style={{ padding: "12px 14px" }}>{r.units}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span
                          style={{
                            color: r.urgency === "Critical" ? S.urgent : r.urgency === "Urgent" ? S.warning : S.muted,
                            fontWeight: 600,
                          }}
                        >
                          {r.urgency}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        {banks.find((b) => b.id === r.bankId)?.name || "—"}
                      </td>
                      <td style={{ padding: "12px 14px", color: S.muted }}>{r.time}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span
                          style={{
                            background: `${statusColor[r.status]}20`,
                            color: statusColor[r.status],
                            padding: "3px 10px", borderRadius: 20,
                            fontSize: 12, fontWeight: 700,
                          }}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
