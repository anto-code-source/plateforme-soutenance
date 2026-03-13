import { useState } from "react";
import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/manager/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/manager/tasks", icon: "📋", label: "Répartition Tâches" },
  { path: "/manager/agents", icon: "👥", label: "Suivi Agents" },
  { path: "/manager/alerts", icon: "🔔", label: "Alertes" },
];

const Alerts = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, type: "error", title: "Surcharge agent", msg: "Aminata Bah a atteint sa capacité maximale (8/8 tâches)", time: "Il y a 5 min", resolved: false },
    { id: 2, type: "warning", title: "File d'attente longue", msg: "La file dépasse 15 clients en attente (actuellement 18)", time: "Il y a 12 min", resolved: false },
    { id: 3, type: "info", title: "Guichet inactif", msg: "Le Guichet 5 est inactif depuis plus de 30 minutes", time: "Il y a 35 min", resolved: false },
    { id: 4, type: "warning", title: "Retard de traitement", msg: "Ticket A-039 en attente depuis plus de 45 minutes", time: "Il y a 50 min", resolved: true },
  ]);
  const [filter, setFilter] = useState("Tous");

  const resolve = (id) => setAlerts(alerts.map(a => a.id === id ? { ...a, resolved: true } : a));
  const filtered = filter === "Actives" ? alerts.filter(a => !a.resolved) : filter === "Résolues" ? alerts.filter(a => a.resolved) : alerts;

  const typeStyle = {
    error: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-300", icon: "🔴" },
    warning: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-300", icon: "🟡" },
    info: { bg: "bg-white/5", border: "border-white/10", text: "text-white/60", icon: "🔵" },
  };

  return (
    <PageLayout links={links} title="Alertes" subtitle="Surveillez et gérez les situations critiques">
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Alertes actives", value: alerts.filter(a => !a.resolved).length, color: "text-rose-400" },
          { label: "Résolues", value: alerts.filter(a => a.resolved).length, color: "text-teal-400" },
          { label: "Total", value: alerts.length, color: "text-white" },
        ].map((s, i) => (
          <div key={i} className="stat-card text-center">
            <div className={`font-display font-bold text-3xl ${s.color} mb-1`}>{s.value}</div>
            <div className="text-white/40 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        {["Tous", "Actives", "Résolues"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-display font-bold transition-all
              ${filter === f ? "bg-yellow-500 text-black" : "glass border border-white/10 text-white/60 hover:text-white"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((a) => {
          const s = typeStyle[a.type];
          return (
            <div key={a.id} className={`p-5 rounded-2xl border ${s.bg} ${s.border} ${a.resolved ? "opacity-50" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-lg">{s.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-display font-bold text-sm ${a.resolved ? "text-white/50" : "text-white"}`}>{a.title}</span>
                      {a.resolved && <span className="badge-green text-xs">Résolu</span>}
                    </div>
                    <p className={`text-sm ${s.text}`}>{a.msg}</p>
                    <p className="text-white/25 text-xs mt-1">{a.time}</p>
                  </div>
                </div>
                {!a.resolved && (
                  <button onClick={() => resolve(a.id)}
                    className="glass border border-white/15 text-white/60 hover:text-teal-400 hover:border-teal-500/40 text-xs font-display font-bold px-3 py-1.5 rounded-lg transition-all">
                    ✓ Résoudre
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
};

export default Alerts;