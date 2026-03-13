import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/admin/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/admin/users", icon: "👥", label: "Utilisateurs" },
  { path: "/admin/agencies", icon: "🏦", label: "Agences" },
  { path: "/admin/settings", icon: "⚙️", label: "Paramètres" },
  { path: "/admin/logs", icon: "📋", label: "Logs & Audit" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const recentActivity = [
    { user: "manager@bank.com", action: "Connexion", time: "Il y a 5 min", type: "info" },
    { user: "agent@bank.com", action: "Mise à jour tâche T-1050", time: "Il y a 12 min", type: "success" },
    { user: "admin@bank.com", action: "Ajout utilisateur Kofi Asante", time: "Il y a 1h", type: "success" },
    { user: "client@bank.com", action: "Nouveau rendez-vous créé", time: "Il y a 2h", type: "info" },
  ];

  return (
    <PageLayout links={links}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-white/40 text-sm mb-1">Administrateur</p>
          <h1 className="font-display font-bold text-2xl text-white">{user?.name} ⚙️</h1>
        </div>
        <div className="flex items-center gap-2 glass border border-teal-500/30 rounded-xl px-4 py-2">
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
          <span className="text-teal-400 text-sm font-display font-bold">Système opérationnel</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Utilisateurs totaux", value: "142", icon: "👥", color: "text-yellow-400" },
          { label: "Agences", value: "5", icon: "🏦", color: "text-teal-400" },
          { label: "Sessions actives", value: "38", icon: "🟢", color: "text-teal-400" },
          { label: "Alertes système", value: "0", icon: "🔔", color: "text-white" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="text-2xl mb-3">{s.icon}</div>
            <div className={`font-display font-bold text-2xl ${s.color} mb-1`}>{s.value}</div>
            <div className="text-white/40 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-white">Activité Récente</h2>
            <button onClick={() => navigate("/admin/logs")} className="text-yellow-400 text-xs font-display font-bold">Voir logs →</button>
          </div>
          <div className="space-y-2">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.type === "success" ? "bg-teal-400" : "bg-yellow-400"}`} />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-white/60 text-xs">{a.action} — <span className="text-white/30">{a.user}</span></span>
                  <span className="text-white/25 text-xs">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="font-display font-bold text-white mb-5">Utilisateurs par Rôle</h2>
          <div className="space-y-3">
            {[
              { role: "Clients", count: 98, color: "bg-teal-500", width: "70%" },
              { role: "Agents", count: 28, color: "bg-yellow-500", width: "20%" },
              { role: "Managers", count: 10, color: "bg-rose-500", width: "7%" },
              { role: "Directeurs", count: 4, color: "bg-white/40", width: "3%" },
            ].map((u, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/50">{u.role}</span>
                  <span className="text-white/60 font-bold">{u.count}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${u.color}`} style={{ width: u.width }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: "👥", label: "Gérer les utilisateurs", path: "/admin/users", color: "border-yellow-500/20 hover:border-yellow-500/50" },
          { icon: "🏦", label: "Gérer les agences", path: "/admin/agencies", color: "border-teal-500/20 hover:border-teal-500/50" },
          { icon: "⚙️", label: "Paramètres système", path: "/admin/settings", color: "border-white/10 hover:border-white/30" },
          { icon: "📋", label: "Logs & Audit", path: "/admin/logs", color: "border-rose-500/20 hover:border-rose-500/40" },
        ].map((q, i) => (
          <button key={i} onClick={() => navigate(q.path)}
            className={`flex flex-col items-center gap-2 p-4 glass border rounded-xl transition-all hover:scale-105 ${q.color}`}>
            <span className="text-2xl">{q.icon}</span>
            <span className="text-white/50 text-xs text-center">{q.label}</span>
          </button>
        ))}
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;