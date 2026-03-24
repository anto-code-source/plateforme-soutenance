import { useState } from "react";
import PageLayout from "../../components/layouts/PageLayout";
import { useTasks } from "../../context/TasksContext";

const links = [
  { path: "/manager/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/manager/tasks",     icon: "📋", label: "Répartition Tâches" },
  { path: "/manager/agents",    icon: "👥", label: "Suivi Agents" },
  { path: "/manager/alerts",    icon: "🔔", label: "Alertes" },
];

const AGENTS = [
  { id: "A1", name: "Moussa Traoré", avatar: "MT", color: "#F59E0B", max: 8 },
  { id: "A2", name: "Koffi Agbessi", avatar: "KA", color: "#14B8A6", max: 8 },
  { id: "A3", name: "Marie Dossou",  avatar: "MD", color: "#8B5CF6", max: 8 },
  { id: "A4", name: "Segun Hounto",  avatar: "SH", color: "#F43F5E", max: 8 },
];

const PRIORITY_CONFIG = {
  "Haute":  { bg:"rgba(244,63,94,0.12)",  border:"rgba(244,63,94,0.35)",  text:"#F43F5E" },
  "Normale":{ bg:"rgba(234,179,8,0.10)",  border:"rgba(234,179,8,0.30)",  text:"#EAB308" },
  "Basse":  { bg:"rgba(255,255,255,0.06)",border:"rgba(255,255,255,0.12)",text:"rgba(255,255,255,0.4)" },
};

export default function TaskAssignment() {
  const { tasks, unassignedTasks, assignTask, getTasksByAgent } = useTasks();
  const [selected, setSelected]   = useState(null);
  const [success, setSuccess]     = useState("");
  const [mounted, setMounted]     = useState(true);

  const handleAssign = (agentId) => {
    if (!selected) return;
    const agent = AGENTS.find(a => a.id === agentId);
    const agTasks = getTasksByAgent(agentId);
    if (agTasks.length >= agent.max) return;

    assignTask(selected, agentId); // ✅ mise à jour globale via contexte
    setSuccess(`✅ Tâche ${selected} assignée à ${agent.name}`);
    setSelected(null);
    setTimeout(() => setSuccess(""), 3000);
  };

  const card = {
    background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)",
    borderRadius:20, padding:24, backdropFilter:"blur(12px)"
  };

  return (
    <PageLayout links={links} title="Répartition des Tâches" subtitle="Assignez les tâches aux agents disponibles">

      {/* ── SUCCÈS ── */}
      {success && (
        <div style={{ padding:"12px 16px", borderRadius:14, marginBottom:20,
          background:"rgba(20,184,166,0.08)", border:"1px solid rgba(20,184,166,0.25)",
          color:"#14B8A6", fontSize:13, fontWeight:600 }}>
          {success}
        </div>
      )}

      {/* ── KPIs ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:14, marginBottom:28 }}>
        {[
          { label:"Total tâches",    value:tasks.length,            icon:"📋", color:"#F59E0B" },
          { label:"Non assignées",   value:unassignedTasks.length,  icon:"⏳", color:"#F43F5E" },
          { label:"En cours",        value:tasks.filter(t=>t.statut==="En cours").length,  icon:"⚡", color:"#EAB308" },
          { label:"Terminées",       value:tasks.filter(t=>t.statut==="Terminé").length,   icon:"✅", color:"#14B8A6" },
        ].map((k,i) => (
          <div key={i} style={{ ...card, padding:"16px 18px" }}>
            <div style={{ fontSize:20, marginBottom:6 }}>{k.icon}</div>
            <div style={{ fontSize:24, fontWeight:900, color:k.color, letterSpacing:"-0.03em" }}>{k.value}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:2, fontWeight:600 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

        {/* ── TÂCHES NON ASSIGNÉES ── */}
        <div style={card}>
          <div style={{ fontSize:16, fontWeight:800, color:"#fff", marginBottom:4 }}>📋 Tâches non assignées</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginBottom:16 }}>
            {selected ? `Tâche ${selected} sélectionnée — choisissez un agent →` : "Cliquez sur une tâche pour l'assigner"}
          </div>

          {unassignedTasks.length === 0 ? (
            <div style={{ textAlign:"center", padding:40, color:"rgba(255,255,255,0.2)" }}>
              <div style={{ fontSize:32, marginBottom:8 }}>🎉</div>
              <div style={{ fontSize:13, fontWeight:600 }}>Toutes les tâches sont assignées !</div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {unassignedTasks.map(t => {
                const pcfg = PRIORITY_CONFIG[t.priority];
                const isSelected = selected === t.id;
                return (
                  <div key={t.id} onClick={() => setSelected(isSelected ? null : t.id)} style={{
                    padding:"13px 16px", borderRadius:14, cursor:"pointer", transition:"all 0.18s",
                    background: isSelected ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.03)",
                    border: isSelected ? "1.5px solid rgba(245,158,11,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    boxShadow: isSelected ? "0 0 20px rgba(245,158,11,0.1)" : "none"
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color: isSelected ? "#F59E0B" : "#fff" }}>
                          {t.client}
                        </div>
                        <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:2 }}>
                          {t.service} · <span style={{ color:"rgba(255,255,255,0.5)" }}>{t.ticket}</span>
                        </div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{
                          fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:99,
                          background:pcfg.bg, border:`1px solid ${pcfg.border}`, color:pcfg.text
                        }}>{t.priority}</span>
                        {isSelected && (
                          <span style={{ fontSize:11, color:"#F59E0B" }}>← sélectionné</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── AGENTS ── */}
        <div style={card}>
          <div style={{ fontSize:16, fontWeight:800, color:"#fff", marginBottom:4 }}>👥 Agents disponibles</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginBottom:16 }}>
            {selected ? "Cliquez sur un agent pour assigner la tâche" : "Sélectionnez d'abord une tâche"}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {AGENTS.map(agent => {
              const agTasks   = getTasksByAgent(agent.id);
              const count     = agTasks.length;
              const pct       = Math.round((count / agent.max) * 100);
              const isFull    = count >= agent.max;
              const statut    = isFull ? "Surchargé" : count >= 6 ? "Chargé" : "Actif";
              const statColor = isFull ? "#F43F5E" : count >= 6 ? "#EAB308" : "#14B8A6";
              const done      = agTasks.filter(t=>t.statut==="Terminé").length;

              return (
                <div key={agent.id}
                  onClick={() => selected && !isFull && handleAssign(agent.id)}
                  style={{
                    padding:"14px 16px", borderRadius:14, transition:"all 0.2s",
                    background:"rgba(255,255,255,0.03)",
                    border: selected && !isFull
                      ? `1px solid ${agent.color}40`
                      : "1px solid rgba(255,255,255,0.08)",
                    cursor: selected && !isFull ? "pointer" : "default",
                    opacity: isFull ? 0.5 : 1,
                  }}
                  onMouseEnter={e => { if (selected && !isFull) { e.currentTarget.style.background=`${agent.color}10`; e.currentTarget.style.borderColor=`${agent.color}60`; }}}
                  onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor=selected&&!isFull?`${agent.color}40`:"rgba(255,255,255,0.08)"; }}
                >
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:36, height:36, borderRadius:11,
                        background:`${agent.color}18`, border:`1.5px solid ${agent.color}40`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:11, fontWeight:900, color:agent.color }}>{agent.avatar}</div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>{agent.name}</div>
                        <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>
                          {count}/{agent.max} tâches · {done} terminée{done>1?"s":""}
                        </div>
                      </div>
                    </div>
                    <span style={{
                      fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:99,
                      background:`${statColor}15`, border:`1px solid ${statColor}40`, color:statColor
                    }}>{statut}</span>
                  </div>

                  {/* Barre charge */}
                  <div style={{ width:"100%", height:4, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden" }}>
                    <div style={{
                      height:"100%", width:`${pct}%`, borderRadius:99,
                      background: isFull ? "#F43F5E" : count>=6 ? "#EAB308" : agent.color,
                      transition:"width 0.5s ease", boxShadow:`0 0 6px ${agent.color}40`
                    }}/>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
                    <span style={{ fontSize:10, color:"rgba(255,255,255,0.2)" }}>Charge de travail</span>
                    <span style={{ fontSize:10, color: statColor, fontWeight:700 }}>{pct}%</span>
                  </div>

                  {/* Tâches en cours pour cet agent */}
                  {agTasks.filter(t=>t.statut!=="Terminé").length > 0 && (
                    <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:4 }}>
                      {agTasks.filter(t=>t.statut!=="Terminé").slice(0,3).map(t => (
                        <span key={t.id} style={{
                          fontSize:10, padding:"2px 8px", borderRadius:99,
                          background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)",
                          color:"rgba(255,255,255,0.4)"
                        }}>{t.client}</span>
                      ))}
                      {agTasks.filter(t=>t.statut!=="Terminé").length > 3 && (
                        <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>
                          +{agTasks.filter(t=>t.statut!=="Terminé").length - 3} autres
                        </span>
                      )}
                    </div>
                  )}

                  {isFull && (
                    <div style={{ marginTop:8, fontSize:11, color:"#F43F5E", fontWeight:600 }}>
                      🚫 Agent surchargé — impossible d'assigner
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── TOUTES LES TÂCHES ASSIGNÉES ── */}
      <div style={{ ...card, marginTop:24 }}>
        <div style={{ fontSize:16, fontWeight:800, color:"#fff", marginBottom:16 }}>
          📊 Toutes les tâches assignées
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {tasks.filter(t=>t.agent!==null).map(t => {
            const agent = AGENTS.find(a=>a.id===t.agent);
            const scfg = {
              "En cours":  { color:"#EAB308", bg:"rgba(234,179,8,0.1)",   border:"rgba(234,179,8,0.3)"   },
              "En attente":{ color:"#94A3B8", bg:"rgba(148,163,184,0.1)", border:"rgba(148,163,184,0.2)" },
              "Terminé":   { color:"#14B8A6", bg:"rgba(20,184,166,0.1)",  border:"rgba(20,184,166,0.3)"  },
            }[t.statut] || { color:"#fff", bg:"rgba(255,255,255,0.05)", border:"rgba(255,255,255,0.1)" };

            return (
              <div key={t.id} style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"11px 16px", borderRadius:12,
                background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)"
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  {agent && (
                    <div style={{ width:28, height:28, borderRadius:8,
                      background:`${agent.color}18`, border:`1px solid ${agent.color}40`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:10, fontWeight:800, color:agent.color }}>{agent.avatar}</div>
                  )}
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{t.client}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>
                      {t.service} · {agent?.name || "—"}
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize:10, fontWeight:700, padding:"2px 10px", borderRadius:99,
                  background:scfg.bg, border:`1px solid ${scfg.border}`, color:scfg.color
                }}>{t.statut}</span>
              </div>
            );
          })}
        </div>
      </div>

    </PageLayout>
  );
}