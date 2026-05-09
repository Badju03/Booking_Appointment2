import { useState } from "react";

const services = [
  { id: 1, name: "Consultation", duration: "30 min", price: "$50", emoji: "🌿", desc: "Quick focused session" },
  { id: 2, name: "Deep Session", duration: "60 min", price: "$95", emoji: "✦", desc: "Comprehensive review" },
  { id: 3, name: "Full Assessment", duration: "90 min", price: "$140", emoji: "◎", desc: "Complete evaluation" },
];

const specialists = [
  { id: 1, name: "Dr. Amara Osei", role: "Lead Specialist", available: true, color: "#f4c2a1", initials: "AO" },
  { id: 2, name: "Dr. Lena Vasquez", role: "Senior Consultant", available: true, color: "#a8d5e2", initials: "LV" },
  { id: 3, name: "Dr. Kai Tanaka", role: "Associate", available: false, color: "#c9bfe8", initials: "KT" },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "16:00",
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function getDays(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirst(y, m) { return new Date(y, m, 1).getDay(); }

export default function BookingApp() {
  const today = new Date();
  const [step, setStep] = useState(1);
  const [service, setService] = useState(null);
  const [specialist, setSpecialist] = useState(null);
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", note: "" });
  const [done, setDone] = useState(false);

  const daysInMonth = getDays(calYear, calMonth);
  const firstDay = getFirst(calYear, calMonth);

  const isDisabled = (day) => {
    const d = new Date(calYear, calMonth, day);
    return d < new Date(today.getFullYear(), today.getMonth(), today.getDate()) || d.getDay() === 0;
  };

  const canGo = () => {
    if (step === 1) return service !== null;
    if (step === 2) return specialist !== null;
    if (step === 3) return date !== null && time !== null;
    if (step === 4) return form.name && form.email;
    return false;
  };

  const stepLabels = ["Service", "Specialist", "Date & Time", "Your Info"];
  const stepIcons = ["◈", "◉", "◎", "◌"];

  if (done) {
    const sv = services.find(s => s.id === service);
    const sp = specialists.find(s => s.id === specialist);
    return (
      <div style={S.page}>
        <Blobs />
        <div style={S.successWrap}>
          <div style={S.successPill}>Booking Confirmed</div>
          <div style={S.successEmoji}>🌸</div>
          <h2 style={S.successTitle}>You're all set!</h2>
          <p style={S.successSub}>We've sent your confirmation to <span style={{ color: "#6b6b6b" }}>{form.email}</span></p>
          <div style={S.successCard}>
            {[
              ["Service", sv?.name],
              ["Duration", sv?.duration],
              ["Specialist", sp?.name],
              ["Date", `${MONTHS[calMonth]} ${date}, ${calYear}`],
              ["Time", time],
            ].map(([l, v]) => (
              <div key={l} style={S.successRow}>
                <span style={S.successRowLabel}>{l}</span>
                <span style={S.successRowVal}>{v}</span>
              </div>
            ))}
          </div>
          <button style={S.restartBtn}
            onClick={() => { setStep(1); setService(null); setSpecialist(null); setDate(null); setTime(null); setForm({ name:"",email:"",phone:"",note:"" }); setDone(false); }}>
            Book another appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <Blobs />
      <div style={S.shell}>
        {/* Sidebar */}
        <div style={S.sidebar}>
          <div style={S.sidebarTop}>
            <div style={S.brandMark}>✦</div>
            <div style={S.brandName}>Bloom</div>
            <div style={S.brandTag}>Wellness Studio</div>
          </div>
          <div style={S.steps}>
            {stepLabels.map((label, i) => {
              const active = step === i + 1;
              const isDone = step > i + 1;
              return (
                <div key={i} style={S.stepItem}>
                  <div style={{ ...S.stepDot, background: isDone ? "#8a8a8a" : active ? "#fff" : "transparent", border: isDone ? "2px solid #8a8a8a" : active ? "2px solid #4a4a4a" : "2px solid rgba(0,0,0,0.15)" }}>
                    {isDone
                      ? <span style={{ fontSize: "10px", color: "#fff" }}>✓</span>
                      : <span style={{ fontSize: "11px", color: active ? "#4a4a4a" : "rgba(0,0,0,0.25)" }}>{stepIcons[i]}</span>}
                  </div>
                  <div>
                    <div style={{ ...S.stepNum, color: active || isDone ? "#2e2e2e" : "rgba(0,0,0,0.3)" }}>Step {i + 1}</div>
                    <div style={{ ...S.stepLabel, color: active ? "#2e2e2e" : isDone ? "#555" : "rgba(0,0,0,0.3)" }}>{label}</div>
                  </div>
                  {i < 3 && <div style={{ ...S.stepLine, background: isDone ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.08)" }} />}
                </div>
              );
            })}
          </div>
          <div style={S.sidebarBottom}>
            <div style={S.tagline}>"Your time, thoughtfully held."</div>
          </div>
        </div>

        {/* Main */}
        <div style={S.main}>
          <div style={S.mainInner}>

            {step === 1 && (
              <div>
                <div style={S.pill}>Choose a service</div>
                <h1 style={S.title}>What brings you in today?</h1>
                <p style={S.sub}>Select the type of session you'd like to book.</p>
                <div style={S.serviceGrid}>
                  {services.map(sv => (
                    <div key={sv.id} onClick={() => setService(sv.id)}
                      style={{ ...S.serviceCard, ...(service === sv.id ? S.serviceCardActive : {}) }}>
                      <div style={S.serviceEmoji}>{sv.emoji}</div>
                      <div style={S.serviceName}>{sv.name}</div>
                      <div style={S.serviceDesc}>{sv.desc}</div>
                      <div style={S.serviceBottom}>
                        <span style={S.serviceDuration}>{sv.duration}</span>
                        <span style={S.servicePrice}>{sv.price}</span>
                      </div>
                      {service === sv.id && <div style={S.checkBadge}>✓</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div style={S.pill}>Choose a specialist</div>
                <h1 style={S.title}>Who would you like to see?</h1>
                <p style={S.sub}>All our specialists are highly qualified.</p>
                <div style={S.specialistList}>
                  {specialists.map(sp => (
                    <div key={sp.id}
                      onClick={() => sp.available && setSpecialist(sp.id)}
                      style={{ ...S.spCard, ...(specialist === sp.id ? S.spCardActive : {}), opacity: sp.available ? 1 : 0.5, cursor: sp.available ? "pointer" : "not-allowed" }}>
                      <div style={{ ...S.spAvatar, background: sp.color }}>{sp.initials}</div>
                      <div style={{ flex: 1 }}>
                        <div style={S.spName}>{sp.name}</div>
                        <div style={S.spRole}>{sp.role}</div>
                      </div>
                      <div style={{ ...S.spBadge, background: sp.available ? "#e8f5e9" : "#fce4ec", color: sp.available ? "#388e3c" : "#c62828" }}>
                        {sp.available ? "● Available" : "● Busy"}
                      </div>
                      {specialist === sp.id && <div style={S.spCheck}>✓</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div style={S.pill}>Pick a time</div>
                <h1 style={S.title}>When works for you?</h1>
                <p style={S.sub}>Times shown in your local timezone.</p>
                <div style={S.calTimeWrap}>
                  <div style={S.calBox}>
                    <div style={S.calHead}>
                      <button style={S.calBtn} onClick={() => { if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1); }}>‹</button>
                      <span style={S.calHeadLabel}>{MONTHS[calMonth]} {calYear}</span>
                      <button style={S.calBtn} onClick={() => { if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1); }}>›</button>
                    </div>
                    <div style={S.calGrid}>
                      {DAYS.map(d => <div key={d} style={S.calDayHead}>{d}</div>)}
                      {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
                      {Array(daysInMonth).fill(null).map((_, i) => {
                        const day = i + 1;
                        const disabled = isDisabled(day);
                        const active = date === day;
                        return (
                          <div key={day} onClick={() => !disabled && setDate(day)}
                            style={{ ...S.calDay, background: active ? "#D3D3D3" : "transparent", color: disabled ? "#ddd" : active ? "#2e2e2e" : "#4a4a4a", cursor: disabled ? "default" : "pointer", fontWeight: active ? "700" : "400" }}>
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div style={S.timeBox}>
                    <div style={S.timeBoxTitle}>{date ? `${MONTHS[calMonth]} ${date}` : "Select a date first"}</div>
                    {date ? (
                      <div style={S.timeGrid}>
                        {timeSlots.map(t => (
                          <div key={t} onClick={() => setTime(t)}
                            style={{ ...S.timeChip, background: time === t ? "#D3D3D3" : "#fff", color: time === t ? "#2e2e2e" : "#6b7280", border: time === t ? "1.5px solid #B8B8B8" : "1.5px solid #f0ebe3" }}>
                            {t}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={S.timePlaceholder}>
                        <span style={{ fontSize: "32px" }}>📅</span>
                        <span style={{ color: "#c9bab0", fontSize: "13px", marginTop: "8px" }}>No date selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <div style={S.pill}>Almost there</div>
                <h1 style={S.title}>Tell us about you</h1>
                <p style={S.sub}>We'll send your confirmation here.</p>
                <div style={S.formGrid}>
                  {[
                    { key: "name", label: "Full Name", placeholder: "Jane Smith", type: "text", span: 1 },
                    { key: "email", label: "Email Address", placeholder: "jane@example.com", type: "email", span: 1 },
                    { key: "phone", label: "Phone (optional)", placeholder: "+1 555 000 0000", type: "tel", span: 2 },
                  ].map(f => (
                    <div key={f.key} style={{ ...S.fieldWrap, gridColumn: f.span === 2 ? "1 / -1" : "auto" }}>
                      <label style={S.fieldLabel}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        style={S.input} />
                    </div>
                  ))}
                  <div style={{ ...S.fieldWrap, gridColumn: "1 / -1" }}>
                    <label style={S.fieldLabel}>Notes (optional)</label>
                    <textarea placeholder="Anything we should know..." value={form.note}
                      onChange={e => setForm({ ...form, note: e.target.value })}
                      style={{ ...S.input, height: "80px", resize: "vertical" }} />
                  </div>
                </div>
                <div style={S.summaryStrip}>
                  {[
                    services.find(s => s.id === service)?.name,
                    specialists.find(s => s.id === specialist)?.name,
                    `${MONTHS[calMonth]} ${date} · ${time}`,
                  ].map((v, i) => v && (
                    <div key={i} style={S.summaryChip}>{v}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={S.footer}>
            {step > 1 && (
              <button style={S.backBtn} onClick={() => setStep(s => s - 1)}>← Back</button>
            )}
            <div style={{ flex: 1 }} />
            <button
              style={{ ...S.nextBtn, opacity: canGo() ? 1 : 0.45, cursor: canGo() ? "pointer" : "not-allowed" }}
              onClick={() => canGo() && (step < 4 ? setStep(s => s + 1) : setDone(true))}>
              {step === 4 ? "Confirm Booking 🌸" : "Continue →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Blobs() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, #fde8df66 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, #dce9f866 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", top: "40%", left: "30%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, #f5e8f566 0%, transparent 70%)" }} />
    </div>
  );
}

const S = {
  page: {
    minHeight: "100vh",
    background: "#faf7f4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
    padding: "24px",
    position: "relative",
  },
  shell: {
    width: "100%",
    maxWidth: "820px",
    display: "flex",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 24px 80px rgba(180,180,180,0.18), 0 4px 16px rgba(0,0,0,0.06)",
    position: "relative",
    zIndex: 1,
    minHeight: "560px",
  },
  sidebar: {
    width: "220px",
    flexShrink: 0,
    background: "linear-gradient(160deg, #D3D3D3 0%, #E0E0E0 50%, #C8C8C8 100%)",
    padding: "36px 24px",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
  },
  sidebarTop: { marginBottom: "40px" },
  brandMark: { fontSize: "28px", color: "#5a5a5a", marginBottom: "8px" },
  brandName: { fontSize: "22px", color: "#2e2e2e", fontWeight: "700", letterSpacing: "0.02em" },
  brandTag: { fontSize: "11px", color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "2px" },
  steps: { flex: 1, display: "flex", flexDirection: "column", gap: 0 },
  stepItem: { display: "flex", alignItems: "flex-start", gap: "12px", position: "relative", paddingBottom: "28px" },
  stepLine: { position: "absolute", left: "13px", top: "28px", width: "2px", height: "calc(100% - 28px)", transition: "background 0.3s" },
  stepDot: { width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.3s" },
  stepNum: { fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1px", transition: "color 0.3s" },
  stepLabel: { fontSize: "13px", fontWeight: "600", transition: "color 0.3s" },
  sidebarBottom: { marginTop: "auto" },
  tagline: { fontSize: "11px", color: "#999", fontStyle: "italic", lineHeight: "1.6" },

  main: { flex: 1, background: "#fff", display: "flex", flexDirection: "column" },
  mainInner: { flex: 1, padding: "40px 40px 24px", overflowY: "auto" },

  pill: { display: "inline-block", background: "#f5f5f5", color: "#6b6b6b", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", padding: "5px 14px", borderRadius: "20px", marginBottom: "16px", fontFamily: "'Courier New', monospace" },
  title: { fontSize: "26px", color: "#2d2420", margin: "0 0 6px", fontWeight: "400", lineHeight: "1.2" },
  sub: { fontSize: "14px", color: "#9e8e86", margin: "0 0 28px", lineHeight: "1.5" },

  serviceGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" },
  serviceCard: { border: "1.5px solid #f0ebe3", borderRadius: "16px", padding: "20px 16px", cursor: "pointer", transition: "all 0.2s", position: "relative", background: "#faf8f6" },
  serviceCardActive: { border: "1.5px solid #D3D3D3", background: "#f9f9f9", boxShadow: "0 4px 20px rgba(211,211,211,0.35)" },
  serviceEmoji: { fontSize: "22px", marginBottom: "12px" },
  serviceName: { fontSize: "14px", color: "#2d2420", fontWeight: "700", marginBottom: "4px" },
  serviceDesc: { fontSize: "11px", color: "#b0a09a", marginBottom: "14px", lineHeight: "1.4" },
  serviceBottom: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  serviceDuration: { fontSize: "11px", color: "#c0afa8", background: "#f5f0ec", padding: "3px 8px", borderRadius: "8px" },
  servicePrice: { fontSize: "16px", color: "#6b6b6b", fontWeight: "700" },
  checkBadge: { position: "absolute", top: "12px", right: "12px", width: "20px", height: "20px", background: "#D3D3D3", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700" },

  specialistList: { display: "flex", flexDirection: "column", gap: "12px" },
  spCard: { display: "flex", alignItems: "center", gap: "16px", border: "1.5px solid #f0ebe3", borderRadius: "16px", padding: "16px 20px", transition: "all 0.2s", background: "#faf8f6", position: "relative" },
  spCardActive: { border: "1.5px solid #D3D3D3", background: "#f9f9f9", boxShadow: "0 4px 20px rgba(211,211,211,0.3)" },
  spAvatar: { width: "46px", height: "46px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", color: "#fff", flexShrink: 0, letterSpacing: "0.05em" },
  spName: { fontSize: "15px", color: "#2d2420", fontWeight: "600" },
  spRole: { fontSize: "12px", color: "#b0a09a", marginTop: "2px" },
  spBadge: { fontSize: "11px", padding: "4px 12px", borderRadius: "20px", fontFamily: "'Courier New', monospace", flexShrink: 0 },
  spCheck: { position: "absolute", top: "12px", right: "14px", width: "20px", height: "20px", background: "#D3D3D3", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700" },

  calTimeWrap: { display: "flex", gap: "20px" },
  calBox: { flex: "0 0 230px", background: "#faf8f6", border: "1.5px solid #f0ebe3", borderRadius: "16px", padding: "18px" },
  calHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" },
  calBtn: { background: "none", border: "none", color: "#6b6b6b", fontSize: "20px", cursor: "pointer", lineHeight: 1, padding: "2px 6px" },
  calHeadLabel: { fontSize: "13px", color: "#4a4a4a", fontWeight: "600" },
  calGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" },
  calDayHead: { textAlign: "center", fontSize: "10px", color: "#c0b0a8", padding: "4px 0", fontFamily: "'Courier New', monospace" },
  calDay: { textAlign: "center", padding: "7px 2px", borderRadius: "8px", fontSize: "12px", transition: "all 0.15s", userSelect: "none" },
  timeBox: { flex: 1 },
  timeBoxTitle: { fontSize: "13px", color: "#6b6b6b", fontWeight: "600", marginBottom: "14px" },
  timeGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" },
  timeChip: { padding: "10px", textAlign: "center", borderRadius: "10px", fontSize: "12px", cursor: "pointer", fontFamily: "'Courier New', monospace", transition: "all 0.15s", fontWeight: "500" },
  timePlaceholder: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "180px", gap: "4px" },

  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" },
  fieldWrap: { display: "flex", flexDirection: "column", gap: "6px" },
  fieldLabel: { fontSize: "11px", color: "#b0a09a", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Courier New', monospace" },
  input: { background: "#faf8f6", border: "1.5px solid #f0ebe3", borderRadius: "10px", color: "#2d2420", padding: "10px 14px", fontSize: "14px", outline: "none", fontFamily: "'Palatino Linotype', serif", transition: "border 0.2s" },
  summaryStrip: { display: "flex", flexWrap: "wrap", gap: "8px" },
  summaryChip: { background: "#f5f5f5", color: "#6b6b6b", fontSize: "12px", padding: "6px 14px", borderRadius: "20px", fontWeight: "500" },

  footer: { display: "flex", alignItems: "center", padding: "20px 40px", borderTop: "1px solid #f5f0ec" },
  backBtn: { background: "none", border: "1.5px solid #f0ebe3", borderRadius: "10px", color: "#b0a09a", padding: "10px 20px", cursor: "pointer", fontSize: "13px", fontFamily: "'Palatino Linotype', serif", transition: "all 0.2s" },
  nextBtn: { background: "linear-gradient(135deg, #D3D3D3 0%, #BEBEBE 100%)", border: "none", borderRadius: "12px", color: "#3a3a3a", padding: "12px 28px", fontSize: "14px", fontWeight: "700", fontFamily: "'Palatino Linotype', serif", transition: "all 0.2s", boxShadow: "0 4px 16px rgba(211,211,211,0.5)" },

  successWrap: { position: "relative", zIndex: 1, textAlign: "center", maxWidth: "480px", width: "100%", background: "#fff", borderRadius: "24px", padding: "52px 40px", boxShadow: "0 24px 80px rgba(180,180,180,0.18)" },
  successPill: { display: "inline-block", background: "#e8f5e9", color: "#388e3c", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", padding: "5px 14px", borderRadius: "20px", marginBottom: "20px", fontFamily: "'Courier New', monospace" },
  successEmoji: { fontSize: "48px", marginBottom: "16px" },
  successTitle: { fontSize: "28px", color: "#2d2420", margin: "0 0 8px", fontWeight: "400" },
  successSub: { fontSize: "14px", color: "#9e8e86", marginBottom: "28px" },
  successCard: { background: "#faf8f6", border: "1.5px solid #f0ebe3", borderRadius: "16px", padding: "20px", marginBottom: "28px", textAlign: "left" },
  successRow: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f5f0ec" },
  successRowLabel: { fontSize: "12px", color: "#b0a09a", fontFamily: "'Courier New', monospace", textTransform: "uppercase", letterSpacing: "0.08em" },
  successRowVal: { fontSize: "13px", color: "#2d2420", fontWeight: "600" },
  restartBtn: { background: "linear-gradient(135deg, #D3D3D3 0%, #BEBEBE 100%)", border: "none", borderRadius: "12px", color: "#3a3a3a", padding: "12px 28px", fontSize: "14px", fontWeight: "700", fontFamily: "'Palatino Linotype', serif", cursor: "pointer", boxShadow: "0 4px 16px rgba(211,211,211,0.45)" },
};
