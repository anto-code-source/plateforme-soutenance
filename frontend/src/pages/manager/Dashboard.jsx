import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/manager/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/manager/tasks", icon: "📋", label: "Répartition Tâches" },
  { path: "/manager/agents", icon: "👥", label: "Suivi Agents" },
  { path: "/manager/alerts", icon: "🔔", label: "Alertes" },
];

const initialAgents = [
  { name: "Moussa Traoré", tasks: 5, max: 8, statut: "Actif", guichet: "Guichet 1", traites: 12, tempsM: "7 min" },
  { name: "Aïcha Koné", tasks: 7, max: 8, statut: "Chargé", guichet: "Guichet 2", traites: 18, tempsM: "9 min" },
  { name: "Kofi Asante", tasks: 3, max: 8, statut: "Actif", guichet: "Guichet 3", traites: 9, tempsM: "6 min" },
  { name: "Aminata Bah", tasks: 8, max: 8, statut: "Surchargé", guichet: "Guichet 4", traites: 20, tempsM: "11 min" },
  { name: "Seydou Diallo", tasks: 4, max: 8, statut: "Actif", guichet: "Guichet 5", traites: 10, tempsM: "8 min" },
  { name: "Mariam Touré", tasks: 6, max: 8, statut: "Chargé", guichet: "Guichet 6", traites: 15, tempsM: "8 min" },
];

const fluxData = [
  { heure: "08h", clients: 12 }, { heure: "09h", clients: 28 },
  { heure: "10h", clients: 35 }, { heure: "11h", clients: 22 },
  { heure: "12h", clients: 10 }, { heure: "13h", clients: 8 },
  { heure: "14h", clients: 18 }, { heure: "15h", clients: 25 },
  { heure: "16h", clients: 20 },
];
const maxClients = Math.max(...fluxData.map(d => d.clients));

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [agents, setAgents] = useState(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [assignModal, setAssignModal] = useState(null);
  const [taskInput, setTaskInput] = useState("");
  const [alerts, setAlerts] = useState([
    { id: 1, msg: "Aminata Bah : surcharge (8/8 tâches)", type: "error", read: false },
    { id: 2, msg: "File d'attente > 15 personnes", type: "warning", read: false },
    { id: 3, msg: "Guichet 5 inactif depuis 30 min", type: "info", read: true },
  ]);

  const unreadAlerts = alerts.filter(a => !a.read).length;

  const handleAssign = () => {
    if (!taskInput.trim()) return;
    setAgents(agents.map(a =>
      a.name === assignModal.name
        ? { ...a, tasks: Math.min(a.tasks + 1, a.max), statut: a.tasks + 1 >= a.max ? "Surchargé" : a.tasks + 1 >= 6 ? "Chargé" : "Actif" }
        : a
    ));
    setAssignModal(null);
    setTaskInput("");
  };

  const dismissAlert = (id) => setAlerts(alerts.filter(a => a.id !== id));

  return (
    <PageLayout links={links}>

      {/* MODAL DÉTAIL AGENT */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedAgent(null)}>
          <div className="glass border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center font-display font-bold text-white">
                  {selectedAgent.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-display font-bold text-white">{selectedAgent.name}</h3>
                  <p className="text-white/40 text-xs">{selectedAgent.guichet}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAgent(null)} className="text-white/30 hover:text-white text-xl">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: "Tâches en cours", value: `${selectedAgent.tasks}/${selectedAgent.max}`, color: "text-yellow-400" },
                { label: "Clients traités", value: selectedAgent.traites, color: "text-teal-400" },
                { label: "Temps moyen", value: selectedAgent.tempsM, color: "text-white" },
                { label: "Statut", value: selectedAgent.statut, color: selectedAgent.statut === "Surchargé" ? "text-rose-400" : selectedAgent.statut === "Chargé" ? "text-yellow-400" : "text-teal-400" },
              ].map(({ label, value, color }, i) => (
                <div key={i} className="glass border border-white/10 rounded-xl p-3 text-center">
                  <div className={`font-display font-bold text-lg ${color}`}>{value}</div>
                  <div className="text-white/30 text-xs">{label}</div>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-white/30 mb-1">
                <span>Charge de travail</span>
                <span>{Math.round((selectedAgent.tasks / selectedAgent.max) * 100)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all ${selectedAgent.statut === "Surchargé" ? "bg-rose-400" : selectedAgent.statut === "Chargé" ? "bg-yellow-400" : "bg-teal-400"}`}
                  style={{ width: `${(selectedAgent.tasks / selectedAgent.max) * 100}%` }} />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setAssignModal(selectedAgent); setSelectedAgent(null); }}
                className="flex-1 bg-yellow-500 text-black font-display font-bold py-2.5 rounded-xl hover:bg-yellow-400 transition-all text-sm">
                ➕ Assigner une tâche
              </button>
              <button onClick={() => setSelectedAgent(null)}
                className="flex-1 glass border border-white/10 text-white/60 hover:text-white font-display py-2.5 rounded-xl transition-all text-sm">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ASSIGNATION */}
      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass border border-yellow-500/20 rounded-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="font-display font-bold text-white mb-1">Assigner une tâche</h3>
            <p className="text-white/40 text-xs mb-4">À : <span className="text-yellow-400 font-bold">{assignModal.name}</span></p>
            <label className="block text-white/40 text-xs mb-1">Description de la tâche</label>
            <input type="text" value={taskInput}
              onChange={e => setTaskInput(e.target.value)}
              placeholder="Ex: Traiter dossier crédit client..."
              className="input-field mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setAssignModal(null)}
                className="flex-1 glass border border-white/10 text-white/60 hover:text-white font-display py-2.5 rounded-xl transition-all text-sm">
                Annuler
              </button>
              <button onClick={handleAssign}
                className="flex-1 bg-yellow-500 text-black font-display font-bold py-2.5 rounded-xl hover:bg-yellow-400 transition-all text-sm">
                Assigner ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-white/40 text-sm mb-1">Manager</p>
          <h1 className="font-display font-bold text-2xl text-white">{user?.name} 👔</h1>
        </div>
        <div className="text-white/30 text-sm">Agence Plateau · Aujourd'hui</div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Clients aujourd'hui", value: "47", icon: "👥", color: "text-yellow-400" },
          { label: "Agents actifs", value: `${agents.filter(a => a.statut !== "Surchargé").length}/${agents.length}`, icon: "🧑‍💼", color: "text-teal-400" },
          { label: "Tâches en cours", value: agents.reduce((s, a) => s + a.tasks, 0), icon: "📋", color: "text-white" },
          { label: "Alertes actives", value: unreadAlerts, icon: "🔔", color: "text-rose-400" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="text-2xl mb-3">{s.icon}</div>
            <div className={`font-display font-bold text-2xl ${s.color} mb-1`}>{s.value}</div>
            <div className="text-white/40 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* GRAPHIQUE FLUX + ALERTES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-white">Flux Clients — Aujourd'hui</h2>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <div className="w-3 h-3 bg-yellow-500/40 rounded" />
              <span>Clients / heure</span>
            </div>
          </div>
          <div className="flex items-end gap-2 h-36 mb-3">
            {fluxData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="text-white/0 group-hover:text-white/60 text-xs transition-all">{d.clients}</div>
                <div className="w-full bg-yellow-500/20 rounded-t-lg hover:bg-yellow-500/50 transition-all cursor-pointer"
                  style={{ height: `${(d.clients / maxClients) * 100}%`, minHeight: "4px" }} />
                <span className="text-white/30 text-xs">{d.heure}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-white/20 pt-2 border-t border-white/5">
            <span>Total : {fluxData.reduce((s, d) => s + d.clients, 0)} clients</span>
            <span>Pic : {maxClients} clients à 10h</span>
          </div>
        </div>

        {/* ALERTES */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-white">Alertes</h2>
            {unreadAlerts > 0 && (
              <span className="bg-rose-500/20 text-rose-400 text-xs font-display font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                {unreadAlerts} actives
              </span>
            )}
          </div>
          <div className="space-y-3">
            {alerts.map((a) => (
              <div key={a.id} className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-2
                ${a.type === "error" ? "bg-rose-500/10 border-rose-500/30 text-rose-300" :
                  a.type === "warning" ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-300" :
                  "bg-white/5 border-white/10 text-white/50"}`}>
                <span>{a.msg}</span>
                <button onClick={() => dismissAlert(a.id)}
                  className="text-white/20 hover:text-white/60 transition-colors flex-shrink-0">✕</button>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="text-center text-white/20 text-xs py-4">Aucune alerte active ✓</div>
            )}
          </div>
          <button onClick={() => navigate("/manager/alerts")}
            className="w-full mt-4 glass border border-white/10 text-white/40 hover:text-white text-xs font-display py-2 rounded-xl transition-all">
            Voir toutes les alertes →
          </button>
        </div>
      </div>

      {/* CHARGE DES AGENTS */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-white">Charge des Agents</h2>
          <button onClick={() => navigate("/manager/tasks")}
            className="text-yellow-400 text-xs font-display font-bold hover:text-yellow-300 transition-colors">
            Répartir les tâches →
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((a, i) => (
            <div key={i}
              onClick={() => setSelectedAgent(a)}
              className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-105 group
                ${a.statut === "Surchargé" ? "bg-rose-500/10 border-rose-500/20 hover:border-rose-500/40" :
                  a.statut === "Chargé" ? "bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/40" :
                  "bg-white/5 border-white/10 hover:border-white/30"}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-white font-display font-bold text-xs">
                  {a.name.split(" ").map(n => n[0]).join("")}
                </div>
                <span className={`text-xs font-display font-bold px-2 py-0.5 rounded-full
                  ${a.statut === "Surchargé" ? "badge-red" : a.statut === "Chargé" ? "badge-yellow" : "badge-green"}`}>
                  {a.statut}
                </span>
              </div>
              <div className="font-display font-bold text-white text-sm mb-0.5 group-hover:text-yellow-400 transition-colors">{a.name}</div>
              <div className="text-white/30 text-xs mb-3">{a.guichet}</div>
              <div className="flex justify-between mb-1">
                <span className="text-white/40 text-xs">Charge</span>
                <span className="text-white/60 text-xs font-bold">{a.tasks}/{a.max}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
                <div className={`h-1.5 rounded-full transition-all ${a.statut === "Surchargé" ? "bg-rose-400" : a.statut === "Chargé" ? "bg-yellow-400" : "bg-teal-400"}`}
                  style={{ width: `${(a.tasks / a.max) * 100}%` }} />
              </div>
              <div className="text-white/20 text-xs text-center group-hover:text-yellow-400/60 transition-colors">
                Cliquer pour détails →
              </div>
            </div>
          ))}
        </div>
      </div>

    </PageLayout>
  );
};

export default ManagerDashboard;