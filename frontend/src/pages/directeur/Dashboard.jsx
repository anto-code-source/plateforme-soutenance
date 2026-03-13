import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/directeur/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/directeur/kpi", icon: "📊", label: "KPI Performance" },
  { path: "/directeur/predictive", icon: "🤖", label: "Analyse Prédictive" },
];

const DirecteurDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const agences = [
    { name:"BankFlow Abidjan", clients:312, satisfaction:96, agents:8, statut:"Optimal" },
    { name:"BankFlow Dakar", clients:278, satisfaction:93, agents:6, statut:"Optimal" },
    { name:"BankFlow Bamako", clients:245, satisfaction:91, agents:7, statut:"Attention" },
    { name:"BankFlow Lomé", clients:198, satisfaction:95, agents:5, statut:"Optimal" },
    { name:"BankFlow Cotonou", clients:215, satisfaction:89, agents:6, statut:"Attention" },
    { name:"BankFlow Lagos", clients:420, satisfaction:90, agents:10, statut:"Optimal" },
    { name:"BankFlow Accra", clients:260, satisfaction:94, agents:7, statut:"Optimal" },
    { name:"BankFlow Nairobi", clients:310, satisfaction:88, agents:8, statut:"Attention" },
    { name:"BankFlow Casablanca", clients:380, satisfaction:97, agents:9, statut:"Optimal" },
  ];

  const totalClients = agences.reduce((s, a) => s + a.clients, 0);
  const avgSatisfaction = (agences.reduce((s, a) => s + a.satisfaction, 0) / agences.length).toFixed(1);
  const optimal = agences.filter(a => a.statut === "Optimal").length;
  const attention = agences.filter(a => a.statut === "Attention").length;

  return (
    <PageLayout links={links}>

      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-white/40 text-sm mb-1">Directeur</p>
          <h1 className="font-display font-bold text-2xl text-white">{user?.name} 📊</h1>
        </div>
        <div className="text-white/30 text-sm">Vue globale · Janvier 2025</div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Clients servis / mois", value: "1 248", icon: "👥", color: "text-yellow-400" },
          { label: "Taux satisfaction", value: "94.2%", icon: "⭐", color: "text-teal-400" },
          { label: "Temps moyen traitement", value: "8.5 min", icon: "⏱", color: "text-white" },
          { label: "Agences actives", value: "9/9", icon: "🏦", color: "text-yellow-400" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="text-2xl mb-3">{s.icon}</div>
            <div className={`font-display font-bold text-2xl ${s.color} mb-1`}>{s.value}</div>
            <div className="text-white/40 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* BARRE DE PROGRESSION GLOBALE */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-white">Performance Globale des Agences</h2>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-teal-400 font-display font-bold">
              <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" /> {optimal} Optimal
            </span>
            <span className="flex items-center gap-1 text-xs text-yellow-400 font-display font-bold">
              <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> {attention} Attention
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {agences.map((a, i) => {
            const pct = Math.round((a.satisfaction / 100) * 100);
            const clientPct = Math.round((a.clients / totalClients) * 100);
            return (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-yellow-500/15 rounded-xl flex items-center justify-center text-base">🏦</div>
                    <div>
                      <div className="font-display font-bold text-white text-sm">{a.name}</div>
                      <div className="text-white/30 text-xs">{a.agents} agents · {a.clients} clients/mois</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-yellow-400 font-display font-bold text-sm">{a.satisfaction}%</div>
                      <div className="text-white/30 text-xs">satisfaction</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/60 font-display font-bold text-sm">{clientPct}%</div>
                      <div className="text-white/30 text-xs">du volume</div>
                    </div>
                    <span className={`text-xs font-display font-bold px-2.5 py-1 rounded-full ${a.statut === "Optimal" ? "badge-green" : "badge-yellow"}`}>
                      {a.statut}
                    </span>
                  </div>
                </div>

                {/* BARRES DE PROGRESSION */}
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-white/30 mb-1">
                      <span>Satisfaction</span>
                      <span>{a.satisfaction}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${a.satisfaction >= 93 ? "bg-teal-500" : a.satisfaction >= 90 ? "bg-yellow-500" : "bg-rose-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-white/30 mb-1">
                      <span>Volume clients</span>
                      <span>{clientPct}% du total</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-yellow-500/60 transition-all"
                        style={{ width: `${clientPct * 3}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RÉSUMÉ GLOBAL */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="font-display font-bold text-xl text-yellow-400">{totalClients.toLocaleString()}</div>
            <div className="text-white/30 text-xs">Total clients / mois</div>
          </div>
          <div className="text-center">
            <div className="font-display font-bold text-xl text-teal-400">{avgSatisfaction}%</div>
            <div className="text-white/30 text-xs">Satisfaction moyenne</div>
          </div>
          <div className="text-center">
            <div className="font-display font-bold text-xl text-white">{agences.length}</div>
            <div className="text-white/30 text-xs">Agences supervisées</div>
          </div>
        </div>
      </div>

      {/* NAVIGATION RAPIDE */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: "📊", label: "KPI Performance", sub: "Temps, satisfaction, volume", path: "/directeur/kpi", color: "border-yellow-500/20 hover:border-yellow-500/50" },
          { icon: "🤖", label: "Analyse Prédictive", sub: "Prévisions & tendances", path: "/directeur/predictive", color: "border-teal-500/20 hover:border-teal-500/50" },
        ].map((q, i) => (
          <button key={i} onClick={() => navigate(q.path)}
            className={`flex items-center gap-4 p-5 glass border rounded-2xl transition-all group ${q.color}`}>
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">{q.icon}</div>
            <div className="text-left">
              <div className="font-display font-bold text-white text-sm">{q.label}</div>
              <div className="text-white/30 text-xs">{q.sub}</div>
            </div>
          </button>
        ))}
      </div>

    </PageLayout>
  );
};

export default DirecteurDashboard;