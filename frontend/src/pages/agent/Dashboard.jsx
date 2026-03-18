import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/agent/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/agent/tasks", icon: "📋", label: "Mes Tâches" },
  { path: "/agent/history", icon: "🕐", label: "Historique" },
];

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const tasks = [
    { id: 1, client: "Jean Akpovi", service: "Virement international", statut: "En cours", priority: "Haute", time: "09:15" },
    { id: 2, client: "Fatou Diallo", service: "Ouverture de compte", statut: "En attente", priority: "Normale", time: "09:30" },
    { id: 3, client: "Kofi Mensah", service: "Demande de crédit", statut: "En attente", priority: "Haute", time: "10:00" },
  ];

  const notifications = [
    { msg: "Nouveau client en attente : Ticket A-048", time: "Il y a 2 min", type: "warning" },
    { msg: "Tâche #1042 validée par le manager", time: "Il y a 15 min", type: "success" },
    { msg: "Rappel : rapport journalier à 17h", time: "Il y a 1h", type: "info" },
  ];

  const quickNav = [
    {
      path: "/agent/dashboard",
      icon: "🏠",
      label: "Tableau de bord",
      desc: "Vue d'ensemble de votre activité",
      color: "border-yellow-500/30 hover:border-yellow-500/60 hover:bg-yellow-500/5",
      badge: "bg-yellow-500/15 text-yellow-400",
      stat: "Actif",
    },
    {
      path: "/agent/tasks",
      icon: "📋",
      label: "Mes Tâches",
      desc: "Gérez et traitez vos tâches assignées",
      color: "border-teal-500/30 hover:border-teal-500/60 hover:bg-teal-500/5",
      badge: "bg-teal-500/15 text-teal-400",
      stat: "8 tâches",
    },
    {
      path: "/agent/history",
      icon: "🕐",
      label: "Historique",
      desc: "Consultez toutes vos opérations passées",
      color: "border-rose-500/30 hover:border-rose-500/60 hover:bg-rose-500/5",
      badge: "bg-rose-500/15 text-rose-400",
      stat: "5 traitées",
    },
  ];

  return (
    <PageLayout links={links}>
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-white/40 text-sm mb-1">Agent connecté</p>
          <h1 className="font-display font-bold text-2xl text-white">{user?.name} 🧑‍💼</h1>
        </div>
        <div className="glass border border-teal-500/30 rounded-xl px-4 py-2">
          <span className="text-teal-400 text-sm font-display font-bold">● Guichet 3 actif</span>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Tâches du jour", value: "8", icon: "📋", color: "text-yellow-400" },
          { label: "Clients en attente", value: "3", icon: "👥", color: "text-rose-400" },
          { label: "Traitées aujourd'hui", value: "5", icon: "✅", color: "text-teal-400" },
          { label: "Temps moyen", value: "8 min", icon: "⏱", color: "text-white" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="text-2xl mb-3">{s.icon}</div>
            <div className={`font-display font-bold text-2xl ${s.color} mb-1`}>{s.value}</div>
            <div className="text-white/40 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* TÂCHES + NOTIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-white">Tâches en cours</h2>
            <button onClick={() => navigate("/agent/tasks")} className="text-yellow-400 text-xs font-display font-bold hover:text-yellow-300">Voir tout →</button>
          </div>
          <div className="space-y-3">
            {tasks.map((t) => (
              <div key={t.id} onClick={() => navigate("/agent/tasks")}
                className="flex items-center justify-between p-4 rounded-xl bg-white/4 border border-white/6 hover:border-white/15 cursor-pointer transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/15 rounded-xl flex items-center justify-center text-lg">🧑‍💼</div>
                  <div>
                    <div className="font-display font-bold text-white text-sm group-hover:text-yellow-400 transition-colors">{t.client}</div>
                    <div className="text-white/40 text-xs">{t.service} · {t.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-display font-bold px-2 py-0.5 rounded-full ${t.priority === "Haute" ? "badge-red" : "badge-yellow"}`}>{t.priority}</span>
                  <span className={`text-xs font-display font-bold px-2.5 py-1 rounded-full ${t.statut === "En cours" ? "badge-green" : "badge-yellow"}`}>{t.statut}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="font-display font-bold text-white mb-5">Notifications</h2>
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/3 border border-white/5">
                <div className={`w-1.5 h-1.5 rounded-full mb-2 ${n.type === "success" ? "bg-teal-400" : n.type === "warning" ? "bg-rose-400" : "bg-yellow-400"}`} />
                <div className="text-white/70 text-xs leading-relaxed">{n.msg}</div>
                <div className="text-white/25 text-xs mt-1">{n.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NAVIGATION RAPIDE */}
      <div className="mb-2">
        <h2 className="font-display font-bold text-white text-lg mb-1">Navigation rapide</h2>
        <p className="text-white/30 text-xs mb-5">Accédez directement à votre espace de travail</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickNav.map((item, i) => (
            <div
              key={i}
              onClick={() => navigate(item.path)}
              className={`glass border rounded-2xl p-5 cursor-pointer transition-all hover:scale-105 group ${item.color}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-white/5 group-hover:bg-white/10 rounded-xl flex items-center justify-center text-2xl transition-all">
                  {item.icon}
                </div>
                <span className={`text-xs font-display font-bold px-2.5 py-1 rounded-full ${item.badge}`}>
                  {item.stat}
                </span>
              </div>
              <h3 className="font-display font-bold text-white text-base mb-1 group-hover:text-yellow-400 transition-colors">
                {item.label}
              </h3>
              <p className="text-white/30 text-xs leading-relaxed mb-4">{item.desc}</p>
              <div className="flex items-center gap-1 text-white/20 group-hover:text-yellow-400 transition-colors">
                <span className="text-xs font-display">Accéder</span>
                <span className="text-xs">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </PageLayout>
  );
};

export default AgentDashboard;