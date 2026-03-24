import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/agent/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/agent/tasks", icon: "📋", label: "Mes Tâches" },
  { path: "/agent/history", icon: "🕐", label: "Historique" },
];

const AGENTS = [
  { id: "A1", name: "Moussa Traoré",  avatar: "MT", role: "Agent Senior",    color: "#F59E0B" },
  { id: "A2", name: "Koffi Agbessi",  avatar: "KA", role: "Agent Clientèle", color: "#14B8A6" },
  { id: "A3", name: "Marie Dossou",   avatar: "MD", role: "Agent Junior",    color: "#8B5CF6" },
  { id: "A4", name: "Segun Hounto",   avatar: "SH", role: "Superviseur",     color: "#F43F5E" },
];

const INITIAL_TASKS = [
  { id:1,  agent:"A1", client:"Jean Akpovi",       service:"Virement international", statut:"En cours",  priority:"Haute",   time:"09:15", ticket:"A-044", pieces:[{label:"Pièce d'identité",checked:false},{label:"Justificatif de domicile",checked:false},{label:"RIB",checked:false},{label:"Formulaire de virement",checked:false}] },
  { id:2,  agent:"A2", client:"Fatou Diallo",       service:"Ouverture de compte",    statut:"En attente",priority:"Normale",  time:"09:30", ticket:"A-047", pieces:[{label:"Pièce d'identité",checked:false},{label:"Justificatif de domicile",checked:false},{label:"Photo d'identité",checked:false}] },
  { id:3,  agent:"A1", client:"Kofi Mensah",        service:"Demande de crédit",      statut:"En attente",priority:"Haute",   time:"10:00", ticket:"A-048", pieces:[{label:"Pièce d'identité",checked:false},{label:"RIB",checked:false},{label:"Justificatif de revenus",checked:false},{label:"Relevé bancaire 3 mois",checked:false}] },
  { id:4,  agent:"A3", client:"Awa Traoré",         service:"Carte bancaire",         statut:"Terminé",   priority:"Normale",  time:"08:00", ticket:"A-040", pieces:[{label:"Pièce d'identité",checked:true},{label:"RIB",checked:true}] },
  { id:5,  agent:"A2", client:"Ibrahim Coulibaly",  service:"Relevé de compte",       statut:"Terminé",   priority:"Basse",   time:"08:30", ticket:"A-041", pieces:[{label:"Pièce d'identité",checked:true}] },
  { id:6,  agent:"A3", client:"Aïcha Sow",          service:"Virement local",         statut:"En cours",  priority:"Normale",  time:"10:30", ticket:"A-050", pieces:[{label:"Pièce d'identité",checked:false},{label:"RIB",checked:false}] },
  { id:7,  agent:"A4", client:"Moussa Traoré",      service:"Clôture de compte",      statut:"En attente",priority:"Haute",   time:"11:00", ticket:"A-052", pieces:[{label:"Pièce d'identité",checked:false},{label:"Formulaire clôture",checked:false},{label:"RIB",checked:false}] },
  { id:8,  agent:"A4", client:"Salimata Bah",       service:"Virement international", statut:"Terminé",   priority:"Haute",   time:"07:45", ticket:"A-038", pieces:[{label:"Pièce d'identité",checked:true},{label:"Formulaire de virement",checked:true},{label:"RIB",checked:true}] },
  { id:9,  agent:"A1", client:"Clément Yao",        service:"Dépôt d'espèces",        statut:"Terminé",   priority:"Basse",   time:"11:30", ticket:"A-055", pieces:[{label:"Pièce d'identité",checked:true}] },
  { id:10, agent:"A2", client:"Rokhaya Ndiaye",     service:"Demande de crédit",      statut:"En cours",  priority:"Haute",   time:"12:00", ticket:"A-056", pieces:[{label:"Pièce d'identité",checked:false},{label:"Justificatif de revenus",checked:false},{label:"Relevé bancaire 3 mois",checked:false}] },
];

const STATUT_CONFIG = {
  "En cours":  { bg:"rgba(234,179,8,0.12)",  border:"rgba(234,179,8,0.35)",  text:"#EAB308", dot:"#EAB308" },
  "En attente":{ bg:"rgba(148,163,184,0.10)",border:"rgba(148,163,184,0.25)",text:"#94A3B8", dot:"#94A3B8" },
  "Terminé":   { bg:"rgba(20,184,166,0.12)", border:"rgba(20,184,166,0.35)", text:"#14B8A6", dot:"#14B8A6" },
};

const PRIORITY_CONFIG = {
  "Haute":  { bg:"rgba(244,63,94,0.12)",  border:"rgba(244,63,94,0.35)",  text:"#F43F5E" },
  "Normale":{ bg:"rgba(234,179,8,0.10)",  border:"rgba(234,179,8,0.30)",  text:"#EAB308" },
  "Basse":  { bg:"rgba(255,255,255,0.06)",border:"rgba(255,255,255,0.12)",text:"rgba(255,255,255,0.4)" },
};

function RingChart({ value, color, size = 56 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={5}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition:"stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)" }}/>
    </svg>
  );
}

function Badge({ label, cfg }) {
  return (
    <span style={{
      background: cfg.bg, border:`1px solid ${cfg.border}`, color: cfg.text,
      fontSize:11, fontWeight:700, padding:"2px 10px", borderRadius:99,
      letterSpacing:"0.03em", whiteSpace:"nowrap"
    }}>{label}</span>
  );
}

function AnimBar({ value, color }) {
  return (
    <div style={{ width:"100%", height:4, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden" }}>
      <div style={{
        height:"100%", width:`${value}%`, background:color, borderRadius:99,
        transition:"width 1s cubic-bezier(0.4,0,0.2,1)", boxShadow:`0 0 8px ${color}60`
      }}/>
    </div>
  );
}

export default function Tasks() {
  const { user } = useAuth(); // ✅ agent connecté

  const [tasks, setTasks]         = useState(INITIAL_TASKS);
  const [filterStatut, setFS]     = useState("Tous");
  const [search, setSearch]       = useState("");
  const [selectedTask, setST]     = useState(null);
  const [saved, setSaved]         = useState(false);
  const [collapsed, setCollapsed] = useState({});
  const [view, setView]           = useState("agent");
  const [mounted, setMounted]     = useState(false);
  const [confirmDelete, setCD]    = useState(false);
  const [deleteReason, setDR]     = useState("");
  const [deleted, setDeleted]     = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  // ✅ Agent connecté trouvé via agentId
  const currentAgent = AGENTS.find(a => a.id === user?.agentId);

  // ✅ Filtrer uniquement les tâches de l'agent connecté
  const myTasks = tasks.filter(t => t.agent === user?.agentId);

  const filtered = myTasks.filter(t => {
    const sOk = filterStatut === "Tous" || t.statut === filterStatut;
    const qOk = !search || t.client.toLowerCase().includes(search.toLowerCase())
                        || t.service.toLowerCase().includes(search.toLowerCase())
                        || t.ticket.toLowerCase().includes(search.toLowerCase());
    return sOk && qOk;
  });

  // ✅ KPIs uniquement sur les tâches de l'agent connecté
  const totalDone = myTasks.filter(t => t.statut === "Terminé").length;
  const totalPct  = myTasks.length > 0 ? Math.round((totalDone / myTasks.length) * 100) : 0;

  const openTask = t => {
    setST({ ...t, pieces: t.pieces.map(p=>({...p})) });
    setSaved(false); setCD(false); setDR(""); setDeleted(false);
  };

  const togglePiece = i => {
    setST(prev => { const p=[...prev.pieces]; p[i]={...p[i],checked:!p[i].checked}; return {...prev,pieces:p}; });
    setSaved(false);
  };

  const allChecked  = selectedTask?.pieces.every(p=>p.checked);
  const hasUnchecked = selectedTask?.pieces.some(p=>!p.checked);

  const handleSave = () => {
    const ns = allChecked ? "Terminé" : selectedTask.statut==="En attente" ? "En cours" : selectedTask.statut;
    const up = { ...selectedTask, statut:ns };
    setTasks(tasks.map(t => t.id===selectedTask.id ? up : t));
    setST(up); setSaved(true);
  };

  const handleDelete = () => {
    if (!deleteReason.trim()) return;
    setDeleted(true);
    setTimeout(() => {
      setTasks(tasks.filter(t => t.id !== selectedTask.id));
      setST(null); setCD(false); setDR(""); setDeleted(false);
    }, 1200);
  };

  const closeModal = () => {
    setST(null); setCD(false); setDR(""); setSaved(false); setDeleted(false);
  };

  const card = {
    background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)",
    borderRadius:20, padding:24, backdropFilter:"blur(12px)"
  };

  const MOTIFS = [
    "Pièces manquantes", "Document expiré", "Dossier incomplet",
    "Client absent", "Informations incorrectes",
  ];

  return (
    <PageLayout links={links} title="Mes Tâches" subtitle={`Bonjour ${user?.name || "Agent"} · Vos tâches du jour`}>

      {/* ══ MODAL ══ */}
      {selectedTask && (
        <div style={{
          position:"fixed", inset:0, zIndex:100,
          background:"rgba(0,0,0,0.75)", backdropFilter:"blur(16px)",
          display:"flex", alignItems:"center", justifyContent:"center", padding:16
        }}>
          <div style={{
            ...card, width:"100%", maxWidth:480, maxHeight:"92vh", overflowY:"auto",
            border:"1px solid rgba(255,255,255,0.12)",
            animation:"slideUp 0.28s cubic-bezier(0.34,1.56,0.64,1)"
          }}>
            <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(24px) scale(0.97)}to{opacity:1;transform:none}}`}</style>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
              <div>
                <div style={{ fontSize:18, fontWeight:800, color:"#fff", letterSpacing:"-0.02em" }}>{selectedTask.client}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:3 }}>
                  {selectedTask.service} · <span style={{ color:"rgba(255,255,255,0.5)" }}>{selectedTask.ticket}</span>
                </div>
              </div>
              <button onClick={closeModal} style={{
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                color:"rgba(255,255,255,0.5)", width:32, height:32, borderRadius:10,
                cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center"
              }}>✕</button>
            </div>

            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
              <Badge label={selectedTask.statut}   cfg={STATUT_CONFIG[selectedTask.statut]} />
              <Badge label={selectedTask.priority} cfg={PRIORITY_CONFIG[selectedTask.priority]} />
              <span style={{ color:"rgba(255,255,255,0.3)", fontSize:12, display:"flex", alignItems:"center", gap:4 }}>
                🕐 {selectedTask.time}
              </span>
            </div>

            {/* Agent assigné */}
            {currentAgent && (
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px",
                background:"rgba(255,255,255,0.04)", borderRadius:12, marginBottom:20,
                border:"1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ width:30, height:30, borderRadius:10, background:`${currentAgent.color}20`,
                  border:`1px solid ${currentAgent.color}40`, display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:11, fontWeight:800, color:currentAgent.color }}>{currentAgent.avatar}</div>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.8)" }}>{currentAgent.name}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>{currentAgent.role}</div>
                </div>
              </div>
            )}

            {/* Pièces justificatives */}
            {!confirmDelete && (
              <div style={{ marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.7)" }}>📎 Pièces justificatives</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>
                    {selectedTask.pieces.filter(p=>p.checked).length}/{selectedTask.pieces.length} vérifiées
                  </div>
                </div>
                <div style={{ marginBottom:14 }}>
                  <AnimBar value={(selectedTask.pieces.filter(p=>p.checked).length / selectedTask.pieces.length)*100} color="#F59E0B"/>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {selectedTask.pieces.map((piece, i) => (
                    <div key={i} onClick={()=>togglePiece(i)} style={{
                      display:"flex", alignItems:"center", gap:12, padding:"11px 14px",
                      borderRadius:12, cursor:"pointer", transition:"all 0.18s",
                      background: piece.checked ? "rgba(20,184,166,0.09)" : "rgba(255,255,255,0.04)",
                      border: piece.checked ? "1px solid rgba(20,184,166,0.3)" : "1px solid rgba(255,255,255,0.08)"
                    }}>
                      <div style={{
                        width:20, height:20, borderRadius:6, flexShrink:0,
                        background: piece.checked ? "#14B8A6" : "transparent",
                        border: piece.checked ? "2px solid #14B8A6" : "2px solid rgba(255,255,255,0.2)",
                        display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.18s"
                      }}>
                        {piece.checked && <span style={{ color:"#fff", fontSize:11, fontWeight:800 }}>✓</span>}
                      </div>
                      <span style={{
                        fontSize:13, fontWeight:500, transition:"all 0.18s",
                        color: piece.checked ? "rgba(20,184,166,0.7)" : "rgba(255,255,255,0.7)",
                        textDecoration: piece.checked ? "line-through" : "none"
                      }}>{piece.label}</span>
                      {!piece.checked && (
                        <span style={{ marginLeft:"auto", fontSize:10, color:"#F43F5E", fontWeight:700,
                          background:"rgba(244,63,94,0.1)", border:"1px solid rgba(244,63,94,0.25)",
                          padding:"2px 8px", borderRadius:99 }}>Manquant</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirmation suppression */}
            {confirmDelete && (
              <div style={{ marginBottom:20, animation:"slideUp 0.22s ease" }}>
                <div style={{ padding:"14px 16px", borderRadius:14, marginBottom:16,
                  background:"rgba(244,63,94,0.08)", border:"1px solid rgba(244,63,94,0.25)" }}>
                  <div style={{ fontSize:13, fontWeight:800, color:"#F43F5E", marginBottom:4 }}>
                    ⚠️ Rejeter la demande de {selectedTask.client} ?
                  </div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", lineHeight:1.5 }}>
                    Cette action est irréversible. Le dossier sera supprimé.
                  </div>
                </div>
                <div style={{ padding:"12px 14px", borderRadius:12, marginBottom:16,
                  background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.5)", marginBottom:8 }}>Pièces manquantes :</div>
                  {selectedTask.pieces.filter(p=>!p.checked).map((p,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <span style={{ color:"#F43F5E", fontSize:12 }}>✕</span>
                      <span style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>{p.label}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:8 }}>Motif de rejet :</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
                    {MOTIFS.map(m => (
                      <button key={m} onClick={()=>setDR(m)} style={{
                        padding:"5px 12px", borderRadius:99, fontSize:11, fontWeight:700, cursor:"pointer",
                        background: deleteReason===m ? "rgba(244,63,94,0.15)" : "rgba(255,255,255,0.05)",
                        border: deleteReason===m ? "1px solid rgba(244,63,94,0.4)" : "1px solid rgba(255,255,255,0.08)",
                        color: deleteReason===m ? "#F43F5E" : "rgba(255,255,255,0.4)", transition:"all 0.15s"
                      }}>{m}</button>
                    ))}
                  </div>
                  <input value={deleteReason} onChange={e=>setDR(e.target.value)}
                    placeholder="Ou saisir un motif personnalisé…"
                    style={{
                      width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)",
                      borderRadius:10, padding:"9px 13px", color:"#fff", fontSize:12,
                      outline:"none", boxSizing:"border-box"
                    }}/>
                </div>
                {deleted && (
                  <div style={{ padding:"11px 14px", borderRadius:12, marginBottom:12,
                    background:"rgba(244,63,94,0.08)", border:"1px solid rgba(244,63,94,0.25)",
                    color:"#F43F5E", fontSize:13, textAlign:"center", fontWeight:600 }}>
                    🗑️ Dossier rejeté — suppression en cours…
                  </div>
                )}
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={()=>{ setCD(false); setDR(""); }} style={{
                    flex:1, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
                    color:"rgba(255,255,255,0.5)", borderRadius:12, padding:"11px 0",
                    cursor:"pointer", fontSize:13, fontWeight:700
                  }}>← Annuler</button>
                  <button onClick={handleDelete} disabled={!deleteReason.trim() || deleted} style={{
                    flex:1.5, background: deleteReason.trim() ? "#F43F5E" : "rgba(244,63,94,0.2)",
                    border:"none", color: deleteReason.trim() ? "#fff" : "rgba(255,255,255,0.3)",
                    borderRadius:12, padding:"11px 0", cursor: deleteReason.trim() ? "pointer" : "not-allowed",
                    fontSize:13, fontWeight:800, transition:"all 0.2s",
                    boxShadow: deleteReason.trim() ? "0 4px 20px rgba(244,63,94,0.35)" : "none"
                  }}>🗑️ Confirmer le rejet</button>
                </div>
              </div>
            )}

            {!confirmDelete && allChecked && (
              <div style={{ marginBottom:14, padding:"11px 14px", borderRadius:12,
                background:"rgba(20,184,166,0.08)", border:"1px solid rgba(20,184,166,0.25)",
                color:"#14B8A6", fontSize:13, textAlign:"center", fontWeight:600 }}>
                ✅ Toutes les pièces vérifiées — prêt à terminer
              </div>
            )}
            {!confirmDelete && saved && (
              <div style={{ marginBottom:14, padding:"11px 14px", borderRadius:12,
                background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.25)",
                color:"#F59E0B", fontSize:13, textAlign:"center", fontWeight:600 }}>
                ✅ Tâche enregistrée avec succès !
              </div>
            )}

            {!confirmDelete && (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={closeModal} style={{
                    flex:1, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
                    color:"rgba(255,255,255,0.5)", borderRadius:12, padding:"11px 0",
                    cursor:"pointer", fontSize:13, fontWeight:700
                  }}>Fermer</button>
                  <button onClick={handleSave} style={{
                    flex:1, background: allChecked ? "#14B8A6" : "#F59E0B",
                    border:"none", color: allChecked ? "#fff" : "#000",
                    borderRadius:12, padding:"11px 0", cursor:"pointer",
                    fontSize:13, fontWeight:800, transition:"all 0.2s",
                    boxShadow: allChecked ? "0 4px 20px rgba(20,184,166,0.35)" : "0 4px 20px rgba(245,158,11,0.35)"
                  }}>{allChecked ? "✅ Terminer" : "💾 Enregistrer"}</button>
                </div>
                {hasUnchecked && selectedTask.statut !== "Terminé" && (
                  <button onClick={()=>setCD(true)} style={{
                    width:"100%", background:"rgba(244,63,94,0.08)",
                    border:"1px solid rgba(244,63,94,0.25)", color:"#F43F5E",
                    borderRadius:12, padding:"10px 0", cursor:"pointer",
                    fontSize:13, fontWeight:700, transition:"all 0.2s",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:8
                  }}
                    onMouseEnter={e=>{ e.currentTarget.style.background="rgba(244,63,94,0.15)"; e.currentTarget.style.borderColor="rgba(244,63,94,0.4)"; }}
                    onMouseLeave={e=>{ e.currentTarget.style.background="rgba(244,63,94,0.08)"; e.currentTarget.style.borderColor="rgba(244,63,94,0.25)"; }}
                  >
                    🗑️ Rejeter — dossier incomplet
                    <span style={{ fontSize:11, background:"rgba(244,63,94,0.2)", padding:"2px 8px", borderRadius:99 }}>
                      {selectedTask.pieces.filter(p=>!p.checked).length} pièce{selectedTask.pieces.filter(p=>!p.checked).length>1?"s":""} manquante{selectedTask.pieces.filter(p=>!p.checked).length>1?"s":""}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── KPIs — uniquement les tâches de l'agent connecté ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:14, marginBottom:28 }}>
        {[
          { label:"Mes tâches",      value:myTasks.length,                                    icon:"📋", color:"#F59E0B" },
          { label:"En cours",        value:myTasks.filter(t=>t.statut==="En cours").length,    icon:"⚡", color:"#EAB308" },
          { label:"En attente",      value:myTasks.filter(t=>t.statut==="En attente").length,  icon:"⏳", color:"#94A3B8" },
          { label:"Terminées",       value:totalDone,                                          icon:"✅", color:"#14B8A6" },
          { label:"Taux complétion", value:`${totalPct}%`,                                     icon:"📊", color:"#8B5CF6" },
        ].map((k,i) => (
          <div key={i} style={{
            ...card, padding:"16px 18px",
            opacity: mounted?1:0, transform: mounted?"none":"translateY(12px)",
            transition:`opacity 0.4s ${i*0.07}s, transform 0.4s ${i*0.07}s`
          }}>
            <div style={{ fontSize:20, marginBottom:6 }}>{k.icon}</div>
            <div style={{ fontSize:24, fontWeight:900, color:k.color, letterSpacing:"-0.03em" }}>{k.value}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:2, fontWeight:600 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* ── BARRE D'OUTILS ── */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:20, alignItems:"center" }}>
        <div style={{ position:"relative", flexGrow:1, minWidth:200 }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14 }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Rechercher client, service, ticket…"
            style={{
              width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:12, padding:"10px 14px 10px 36px", color:"#fff", fontSize:13,
              outline:"none", boxSizing:"border-box"
            }}/>
          {search && (
            <button onClick={()=>setSearch("")} style={{
              position:"absolute", right:10, top:"50%", transform:"translateY(-50%)",
              background:"none", border:"none", color:"rgba(255,255,255,0.3)", cursor:"pointer", fontSize:14
            }}>✕</button>
          )}
        </div>
        <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,0.05)", borderRadius:12, padding:4 }}>
          {[{k:"agent",label:"👤 Mes tâches"},{k:"kanban",label:"📌 Kanban"}].map(v => (
            <button key={v.k} onClick={()=>setView(v.k)} style={{
              padding:"7px 14px", borderRadius:9, border:"none", cursor:"pointer", fontSize:12, fontWeight:700,
              background: view===v.k ? "rgba(255,255,255,0.12)" : "transparent",
              color: view===v.k ? "#fff" : "rgba(255,255,255,0.4)", transition:"all 0.2s"
            }}>{v.label}</button>
          ))}
        </div>
      </div>

      {/* ── FILTRES STATUT ── */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:24 }}>
        {["Tous","En cours","En attente","Terminé"].map(f => (
          <button key={f} onClick={()=>setFS(f)} style={{
            padding:"7px 16px", borderRadius:99, border:"1px solid",
            borderColor: filterStatut===f ? (STATUT_CONFIG[f]?.border||"rgba(255,255,255,0.3)") : "rgba(255,255,255,0.1)",
            background: filterStatut===f ? (STATUT_CONFIG[f]?.bg||"rgba(255,255,255,0.1)") : "transparent",
            color: filterStatut===f ? (STATUT_CONFIG[f]?.text||"#fff") : "rgba(255,255,255,0.4)",
            fontSize:12, fontWeight:700, cursor:"pointer", transition:"all 0.18s"
          }}>
            {f==="Tous" ? `Tous (${myTasks.length})` : `${f} (${myTasks.filter(t=>t.statut===f).length})`}
          </button>
        ))}
      </div>

      {/* ── VUE MES TÂCHES ── */}
      {view === "agent" && (
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {currentAgent && filtered.length > 0 ? (
            <div style={{
              ...card, border:`1px solid ${currentAgent.color}25`,
              opacity: mounted?1:0, transform: mounted?"none":"translateY(16px)",
              transition:"opacity 0.45s, transform 0.45s"
            }}>
              {/* Header agent connecté */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ position:"relative", width:56, height:56 }}>
                    <RingChart value={totalPct} color={currentAgent.color} size={56}/>
                    <div style={{
                      position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
                      width:40, height:40, borderRadius:13, margin:8,
                      background:`${currentAgent.color}18`, border:`1.5px solid ${currentAgent.color}40`,
                      fontSize:12, fontWeight:900, color:currentAgent.color
                    }}>{currentAgent.avatar}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>{currentAgent.name}</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{currentAgent.role}</div>
                    <div style={{ display:"flex", gap:10, marginTop:6 }}>
                      {myTasks.filter(t=>t.statut==="En cours").length > 0 &&
                        <span style={{ fontSize:11, fontWeight:700, color:"#EAB308" }}>⚡ {myTasks.filter(t=>t.statut==="En cours").length} en cours</span>}
                      {myTasks.filter(t=>t.statut==="En attente").length > 0 &&
                        <span style={{ fontSize:11, fontWeight:700, color:"#94A3B8" }}>⏳ {myTasks.filter(t=>t.statut==="En attente").length} en attente</span>}
                      {totalDone > 0 &&
                        <span style={{ fontSize:11, fontWeight:700, color:"#14B8A6" }}>✅ {totalDone} terminé{totalDone>1?"s":""}</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, minWidth:100 }}>
                  <div style={{ fontSize:20, fontWeight:900, color:currentAgent.color }}>{totalPct}%</div>
                  <AnimBar value={totalPct} color={currentAgent.color}/>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>{totalDone}/{myTasks.length} tâches</div>
                </div>
              </div>

              {/* Liste tâches */}
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {filtered.map((t, ti) => (
                  <div key={t.id} onClick={()=>openTask(t)} style={{
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"13px 16px", borderRadius:14, cursor:"pointer",
                    background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)",
                    opacity: mounted?1:0, transform: mounted?"none":"translateX(-8px)",
                    transition:`opacity 0.35s ${ti*0.05+0.15}s, transform 0.35s ${ti*0.05+0.15}s, border-color 0.18s, background 0.18s`
                  }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${currentAgent.color}40`; e.currentTarget.style.background=`${currentAgent.color}08`; }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"; e.currentTarget.style.background="rgba(255,255,255,0.03)"; }}
                  >
                    <div style={{ display:"flex", alignItems:"center", gap:13 }}>
                      <div style={{
                        width:38, height:38, borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center",
                        background:STATUT_CONFIG[t.statut].bg, border:`1px solid ${STATUT_CONFIG[t.statut].border}`,
                        fontSize:12, fontWeight:800, color:STATUT_CONFIG[t.statut].text
                      }}>{t.ticket.split("-")[1]}</div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>{t.client}</div>
                        <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:1 }}>{t.service}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                      {t.pieces.some(p=>!p.checked) && (
                        <span style={{ fontSize:10, color:"#F43F5E", fontWeight:700,
                          background:"rgba(244,63,94,0.1)", border:"1px solid rgba(244,63,94,0.2)",
                          padding:"2px 8px", borderRadius:99 }}>
                          ✕ {t.pieces.filter(p=>!p.checked).length} manquant{t.pieces.filter(p=>!p.checked).length>1?"s":""}
                        </span>
                      )}
                      <span style={{ color:"rgba(255,255,255,0.2)", fontSize:11 }}>{t.time}</span>
                      <Badge label={t.priority} cfg={PRIORITY_CONFIG[t.priority]}/>
                      <Badge label={t.statut}   cfg={STATUT_CONFIG[t.statut]}/>
                      <span style={{ color:"rgba(255,255,255,0.2)", fontSize:14 }}>›</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign:"center", padding:60, color:"rgba(255,255,255,0.2)" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
              <div style={{ fontSize:14, fontWeight:600 }}>Aucune tâche trouvée</div>
              <div style={{ fontSize:12, marginTop:6 }}>Essayez de modifier vos filtres</div>
            </div>
          )}
        </div>
      )}

      {/* ── VUE KANBAN ── */}
      {view === "kanban" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
          {["En attente","En cours","Terminé"].map(col => {
            const colTasks = filtered.filter(t=>t.statut===col);
            const cfg = STATUT_CONFIG[col];
            return (
              <div key={col} style={{ minWidth:260 }}>
                <div style={{
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"10px 14px", borderRadius:"14px 14px 0 0",
                  background:cfg.bg, border:`1px solid ${cfg.border}`, borderBottom:"none"
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:cfg.dot }}/>
                    <span style={{ fontSize:13, fontWeight:800, color:cfg.text }}>{col}</span>
                  </div>
                  <span style={{ fontSize:12, fontWeight:700, color:cfg.text, opacity:0.7,
                    background:`${cfg.dot}20`, padding:"2px 10px", borderRadius:99 }}>{colTasks.length}</span>
                </div>
                <div style={{
                  background:"rgba(255,255,255,0.02)", border:`1px solid ${cfg.border}`,
                  borderRadius:"0 0 14px 14px", padding:12, minHeight:200,
                  display:"flex", flexDirection:"column", gap:10
                }}>
                  {colTasks.length === 0 && (
                    <div style={{ textAlign:"center", color:"rgba(255,255,255,0.2)", fontSize:13, padding:24 }}>Aucune tâche</div>
                  )}
                  {colTasks.map(t => {
                    const docsPct = Math.round((t.pieces.filter(p=>p.checked).length / t.pieces.length)*100);
                    return (
                      <div key={t.id} onClick={()=>openTask(t)} style={{
                        background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
                        borderRadius:13, padding:14, cursor:"pointer", transition:"all 0.18s"
                      }}
                        onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${currentAgent?.color}50`; e.currentTarget.style.background=`${currentAgent?.color}08`; }}
                        onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}
                      >
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                          <div>
                            <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>{t.client}</div>
                            <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{t.service}</div>
                          </div>
                          <Badge label={t.priority} cfg={PRIORITY_CONFIG[t.priority]}/>
                        </div>
                        <div style={{ marginBottom:10 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                            <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>Documents</span>
                            <span style={{ fontSize:11, color: docsPct===100?"#14B8A6":docsPct>0?"#EAB308":"#F43F5E" }}>{docsPct}%</span>
                          </div>
                          <AnimBar value={docsPct} color={docsPct===100?"#14B8A6":docsPct>0?"#EAB308":"#F43F5E"}/>
                        </div>
                        <div style={{ display:"flex", justifyContent:"flex-end" }}>
                          <span style={{ fontSize:11, color:"rgba(255,255,255,0.25)" }}>{t.ticket} · {t.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </PageLayout>
  );
}