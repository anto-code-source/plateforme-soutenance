import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/manager/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/manager/tasks", icon: "📋", label: "Répartition Tâches" },
  { path: "/manager/agents", icon: "👥", label: "Suivi Agents" },
  { path: "/manager/alerts", icon: "🔔", label: "Alertes" },
];

const agents = [
  { name: "Moussa Traoré", guichet: "Guichet 1", tasks: 24, temps: "7.5 min", satisfaction: 96, statut: "Actif" },
  { name: "Aïcha Koné", guichet: "Guichet 2", tasks: 31, temps: "6.2 min", satisfaction: 98, statut: "Actif" },
  { name: "Kofi Asante", guichet: "Guichet 3", tasks: 18, temps: "9.1 min", satisfaction: 91, statut: "Actif" },
  { name: "Aminata Bah", guichet: "Guichet 4", tasks: 38, temps: "5.8 min", satisfaction: 97, statut: "Surchargé" },
  { name: "Seydou Diallo", guichet: "Guichet 5", tasks: 0, temps: "—", satisfaction: 0, statut: "Absent" },
  { name: "Nadia Touré", guichet: "Guichet 6", tasks: 14, temps: "11.2 min", satisfaction: 88, statut: "Actif" },
];

const AgentTracking = () => (
  <PageLayout links={links} title="Suivi des Agents" subtitle="Performances et activité en temps réel">
    <div className="grid grid-cols-4 gap-4 mb-8">
      {[
        { label: "Agents actifs", value: "4/6", color: "text-teal-400" },
        { label: "Tâches traitées", value: "125", color: "text-yellow-400" },
        { label: "Temps moyen", value: "8.0 min", color: "text-white" },
        { label: "Satisfaction moy.", value: "94%", color: "text-teal-400" },
      ].map((s, i) => (
        <div key={i} className="stat-card text-center">
          <div className={`font-display font-bold text-2xl ${s.color} mb-1`}>{s.value}</div>
          <div className="text-white/40 text-xs">{s.label}</div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map((a, i) => (
        <div key={i} className={`card hover:shadow-lg transition-all ${a.statut === "Absent" ? "opacity-50" : ""}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white font-display font-bold">
                {a.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div className="font-display font-bold text-white">{a.name}</div>
                <div className="text-white/30 text-xs">{a.guichet}</div>
              </div>
            </div>
            <span className={`text-xs font-display font-bold px-2 py-0.5 rounded-full ${a.statut === "Surchargé" ? "badge-red" : a.statut === "Absent" ? "bg-white/10 text-white/30" : "badge-green"}`}>
              {a.statut}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[["Tâches", a.tasks], ["Tps moyen", a.temps], ["Satisfaction", a.satisfaction > 0 ? `${a.satisfaction}%` : "—"]].map(([l, v], j) => (
              <div key={j} className="text-center p-2 rounded-lg bg-white/5">
                <div className="font-display font-bold text-white text-sm">{v}</div>
                <div className="text-white/30 text-xs">{l}</div>
              </div>
            ))}
          </div>
          {a.satisfaction > 0 && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/30">Satisfaction</span>
                <span className="text-yellow-400 font-bold">{a.satisfaction}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full ${a.satisfaction >= 95 ? "bg-teal-400" : a.satisfaction >= 85 ? "bg-yellow-400" : "bg-rose-400"}`}
                  style={{ width: `${a.satisfaction}%` }} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </PageLayout>
);

export default AgentTracking;