import { useState } from "react";
import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/admin/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/admin/users", icon: "👥", label: "Utilisateurs" },
  { path: "/admin/agencies", icon: "🏦", label: "Agences" },
  { path: "/admin/settings", icon: "⚙️", label: "Paramètres" },
  { path: "/admin/logs", icon: "📋", label: "Logs & Audit" },
];

const logsData = [
  { id: "LOG-2245", user: "admin@bank.com", action: "CREATE_USER", detail: "Ajout de Kofi Asante (agent)", ip: "192.168.1.12", date: "15 Jan 2025 10:42", type: "success" },
  { id: "LOG-2244", user: "manager@bank.com", action: "ASSIGN_TASK", detail: "Tâche T-1050 assignée à Moussa Traoré", ip: "192.168.1.8", date: "15 Jan 2025 10:30", type: "info" },
  { id: "LOG-2243", user: "agent@bank.com", action: "UPDATE_STATUS", detail: "Ticket A-044 → Terminé", ip: "192.168.1.15", date: "15 Jan 2025 09:55", type: "success" },
  { id: "LOG-2242", user: "client@bank.com", action: "CREATE_APPOINTMENT", detail: "RDV Virement · Agence Plateau", ip: "41.202.18.5", date: "15 Jan 2025 09:15", type: "info" },
  { id: "LOG-2241", user: "admin@bank.com", action: "UPDATE_SETTINGS", detail: "Max tâches/agent modifié : 6 → 8", ip: "192.168.1.12", date: "14 Jan 2025 17:30", type: "warning" },
  { id: "LOG-2240", user: "unknown", action: "LOGIN_FAILED", detail: "Tentative échouée : mauvais mot de passe", ip: "197.255.12.44", date: "13 Jan 2025 23:14", type: "error" },
];

const typeStyle = {
  success: { dot: "bg-teal-400", badge: "badge-green" },
  info: { dot: "bg-white/40", badge: "bg-white/10 text-white/50" },
  warning: { dot: "bg-yellow-400", badge: "badge-yellow" },
  error: { dot: "bg-rose-400", badge: "badge-red" },
};

const Logs = () => {
  const [filter, setFilter] = useState("Tous");
  const [search, setSearch] = useState("");

  const filtered = logsData.filter(l => {
    const matchFilter = filter === "Tous" || l.type === filter;
    const matchSearch = l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.detail.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <PageLayout links={links} title="Logs & Audit" subtitle="Historique complet des actions système">
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total logs", value: logsData.length, color: "text-white" },
          { label: "Succès", value: logsData.filter(l => l.type === "success").length, color: "text-teal-400" },
          { label: "Alertes", value: logsData.filter(l => l.type === "warning").length, color: "text-yellow-400" },
          { label: "Erreurs", value: logsData.filter(l => l.type === "error").length, color: "text-rose-400" },
        ].map((s, i) => (
          <div key={i} className="stat-card text-center">
            <div className={`font-display font-bold text-2xl ${s.color} mb-1`}>{s.value}</div>
            <div className="text-white/40 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input type="text" placeholder="Rechercher dans les logs..." value={search} onChange={e => setSearch(e.target.value)} className="input-field max-w-xs" />
        <div className="flex gap-2">
          {["Tous", "success", "info", "warning", "error"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold capitalize transition-all
                ${filter === f ? "bg-yellow-500 text-black" : "glass border border-white/10 text-white/50 hover:text-white"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="space-y-2">
          {filtered.map((l) => {
            const s = typeStyle[l.type];
            return (
              <div key={l.id} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${s.dot}`} />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-white/30 text-xs">{l.id}</span>
                    <span className={`text-xs font-display font-bold px-2 py-0.5 rounded-full ${s.badge}`}>{l.action}</span>
                    <span className="text-white/20 text-xs">{l.user}</span>
                  </div>
                  <div className="text-white/50 text-xs">{l.detail}</div>
                  <div className="flex gap-3 mt-1">
                    <span className="text-white/20 text-xs">{l.date}</span>
                    <span className="text-white/15 text-xs">IP: {l.ip}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};

export default Logs;