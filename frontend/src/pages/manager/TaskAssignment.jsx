import { useState } from "react";
import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/manager/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/manager/tasks", icon: "📋", label: "Répartition Tâches" },
  { path: "/manager/agents", icon: "👥", label: "Suivi Agents" },
  { path: "/manager/alerts", icon: "🔔", label: "Alertes" },
];

const unassignedTasks = [
  { id: "T-1050", client: "Seydou Koné", service: "Virement", priority: "Haute" },
  { id: "T-1051", client: "Mariam Bah", service: "Crédit", priority: "Normale" },
  { id: "T-1052", client: "Oumar Diallo", service: "Compte", priority: "Basse" },
  { id: "T-1053", client: "Nadia Traoré", service: "Carte", priority: "Haute" },
];

const agents = [
  { id: 1, name: "Moussa Traoré", tasks: 5, max: 8, statut: "Actif" },
  { id: 2, name: "Aïcha Koné", tasks: 7, max: 8, statut: "Chargé" },
  { id: 3, name: "Kofi Asante", tasks: 3, max: 8, statut: "Actif" },
  { id: 4, name: "Aminata Bah", tasks: 8, max: 8, statut: "Surchargé" },
];

const TaskAssignment = () => {
  const [selected, setSelected] = useState(null);
  const [assigned, setAssigned] = useState({});
  const [success, setSuccess] = useState("");

  const handleAssign = (agentId) => {
    if (!selected) return;
    const agent = agents.find(a => a.id === agentId);
    setAssigned({ ...assigned, [selected]: agentId });
    setSuccess(`Tâche ${selected} assignée à ${agent.name}`);
    setSelected(null);
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <PageLayout links={links} title="Répartition des Tâches" subtitle="Assignez les tâches aux agents disponibles">
      {success && (
        <div className="bg-teal-500/20 border border-teal-500/30 rounded-xl p-3 mb-6 flex items-center gap-2">
          <span className="text-teal-400 text-sm">✓ {success}</span>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-display font-bold text-white mb-2">Tâches non assignées</h2>
          <p className="text-white/30 text-xs mb-5">Sélectionnez une tâche puis un agent</p>
          <div className="space-y-3">
            {unassignedTasks.map((t) => (
              <div key={t.id} onClick={() => !assigned[t.id] && setSelected(selected === t.id ? null : t.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all
                  ${assigned[t.id] ? "opacity-40 cursor-not-allowed" :
                    selected === t.id ? "bg-yellow-500/15 border-yellow-500/50" : "bg-white/5 border-white/10 hover:border-white/20"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-display font-bold text-sm ${selected === t.id ? "text-yellow-400" : "text-white"}`}>{t.client}</div>
                    <div className="text-white/40 text-xs">{t.service} · {t.id}</div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs font-display font-bold px-2 py-0.5 rounded-full ${t.priority === "Haute" ? "badge-red" : t.priority === "Normale" ? "badge-yellow" : "bg-white/10 text-white/40"}`}>{t.priority}</span>
                    {assigned[t.id] && <span className="badge-green">Assigné</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="font-display font-bold text-white mb-2">Agents disponibles</h2>
          <p className="text-white/30 text-xs mb-5">{selected ? `Assigner ${selected} à :` : "Sélectionnez d'abord une tâche"}</p>
          <div className="space-y-3">
            {agents.map((a) => (
              <div key={a.id} onClick={() => selected && a.statut !== "Surchargé" && handleAssign(a.id)}
                className={`p-4 rounded-xl border transition-all
                  ${a.statut === "Surchargé" ? "opacity-40 cursor-not-allowed bg-white/5 border-white/10" :
                    selected ? "cursor-pointer hover:border-yellow-500/40 bg-white/5 border-white/10" : "bg-white/5 border-white/10"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-white font-display font-bold text-xs">
                      {a.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-display font-bold text-white text-sm">{a.name}</div>
                      <div className="text-white/30 text-xs">{a.tasks}/{a.max} tâches</div>
                    </div>
                  </div>
                  <span className={`text-xs font-display font-bold px-2 py-0.5 rounded-full ${a.statut === "Surchargé" ? "badge-red" : a.statut === "Chargé" ? "badge-yellow" : "badge-green"}`}>{a.statut}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${a.statut === "Surchargé" ? "bg-rose-400" : a.statut === "Chargé" ? "bg-yellow-400" : "bg-teal-400"}`}
                    style={{ width: `${(a.tasks / a.max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TaskAssignment;