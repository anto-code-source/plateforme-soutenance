import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/client/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/client/appointment", icon: "📅", label: "Rendez-vous" },
  { path: "/client/ticket", icon: "🎫", label: "Mon Ticket" },
  { path: "/client/queue", icon: "👥", label: "File d'attente" },
  { path: "/client/profile", icon: "👤", label: "Mon Profil" },
];

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const stats = [
    { label: "Rendez-vous à venir", value: "2", icon: "📅", color: "text-yellow-400" },
    { label: "Ticket actif", value: "A-047", icon: "🎫", color: "text-teal-400" },
    { label: "Position en file", value: "#3", icon: "👥", color: "text-rose-400" },
    { label: "Temps estimé", value: "12 min", icon: "⏱", color: "text-yellow-400" },
  ];

  const appointments = [
    { service: "Ouverture de compte", agence: "Agence Plateau", date: "15 Jan 2025", heure: "09:30", statut: "Confirmé" },
    { service: "Virement international", agence: "Agence Cocody", date: "18 Jan 2025", heure: "14:00", statut: "En attente" },
  ];

  const notifications = [
    { msg: "Votre ticket A-047 est prêt", time: "Il y a 2 min", type: "success" },
    { msg: "Rappel : RDV demain à 09h30", time: "Il y a 1h", type: "info" },
    { msg: "Votre demande de virement a été traitée", time: "Hier", type: "success" },
  ];

  const services = [
    { icon: "💳", label: "Carte bancaire" },
    { icon: "💸", label: "Virement" },
    { icon: "🏦", label: "Crédit" },
    { icon: "📄", label: "Relevé" },
    { icon: "🔐", label: "Épargne" },
    { icon: "🌍", label: "Change" },
  ];

  return (
    <PageLayout links={links}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-white/40 text-sm mb-1">Bonjour,</p>
          <h1 className="font-display font-bold text-2xl text-white">{user?.name} 👋</h1>
        </div>
        <div className="flex items-center gap-2 glass border border-white/10 rounded-xl px-4 py-2">
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
          <span className="text-white/60 text-sm">Système en ligne</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
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
            <h2 className="font-display font-bold text-white">Mes Rendez-vous</h2>
            <button onClick={() => navigate("/client/appointment")} className="text-yellow-400 text-xs font-display font-bold hover:text-yellow-300">+ Nouveau</button>
          </div>
          <div className="space-y-3">
            {appointments.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/4 border border-white/6 hover:border-white/12 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/15 rounded-xl flex items-center justify-center text-lg">📅</div>
                  <div>
                    <div className="font-display font-bold text-white text-sm">{a.service}</div>
                    <div className="text-white/40 text-xs">{a.agence} · {a.date} à {a.heure}</div>
                  </div>
                </div>
                <span className={`text-xs font-display font-bold px-2.5 py-1 rounded-full ${a.statut === "Confirmé" ? "badge-green" : "badge-yellow"}`}>{a.statut}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="font-display font-bold text-white mb-5">Notifications</h2>
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.type === "success" ? "bg-teal-400" : "bg-yellow-400"}`} />
                <div>
                  <div className="text-white/70 text-xs leading-relaxed">{n.msg}</div>
                  <div className="text-white/25 text-xs mt-1">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="font-display font-bold text-white mb-5">Nos Services</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {services.map((s, i) => (
            <button key={i} onClick={() => navigate("/client/appointment")}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/4 border border-white/6 hover:border-yellow-500/30 hover:bg-yellow-500/5 transition-all group">
              <span className="text-2xl group-hover:scale-110 transition-transform">{s.icon}</span>
              <span className="text-white/50 text-xs text-center group-hover:text-white/80 transition-colors">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => navigate("/client/appointment")}
          className="flex items-center gap-4 p-5 glass border border-yellow-500/20 rounded-2xl hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all group">
          <div className="w-12 h-12 bg-yellow-500/15 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📅</div>
          <div className="text-left">
            <div className="font-display font-bold text-white text-sm">Prendre Rendez-vous</div>
            <div className="text-white/40 text-xs">Choisir service & horaire</div>
          </div>
        </button>
        <button onClick={() => navigate("/client/queue")}
          className="flex items-center gap-4 p-5 glass border border-teal-500/20 rounded-2xl hover:border-teal-500/50 hover:bg-teal-500/5 transition-all group">
          <div className="w-12 h-12 bg-teal-500/15 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">👥</div>
          <div className="text-left">
            <div className="font-display font-bold text-white text-sm">Voir la File d'Attente</div>
            <div className="text-white/40 text-xs">Position & temps estimé</div>
          </div>
        </button>
      </div>
    </PageLayout>
  );
};

export default ClientDashboard;