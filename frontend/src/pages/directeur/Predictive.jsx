import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/directeur/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/directeur/kpi", icon: "📊", label: "KPI Performance" },
  { path: "/directeur/predictive", icon: "🤖", label: "Analyse Prédictive" },
];

const Predictive = () => {
  const heures = ["8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h"];
  const reel    = [15, 42, 68, 55, 30, 20, 45, 52, 38, 18];
  const prevue  = [18, 45, 65, 52, 28, 22, 48, 50, 40, 20];
  const max = Math.max(...reel, ...prevue);

  const semaine = [
    { jour: "Lun", prevision: 195, charge: "Haute" },
    { jour: "Mar", prevision: 148, charge: "Normale" },
    { jour: "Mer", prevision: 160, charge: "Normale" },
    { jour: "Jeu", prevision: 172, charge: "Haute" },
    { jour: "Ven", prevision: 220, charge: "Très haute" },
    { jour: "Sam", prevision: 100, charge: "Basse" },
  ];
  const maxS = Math.max(...semaine.map(s => s.prevision));

  return (
    <PageLayout links={links} title="Analyse Prédictive" subtitle="Prévisions d'affluence et recommandations IA">
      <div className="inline-flex items-center gap-2 glass border border-teal-500/30 rounded-full px-4 py-2 mb-8">
        <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
        <span className="text-teal-400 text-xs font-display font-bold tracking-widest uppercase">Module IA actif</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: "📈", label: "Pic d'affluence prévu", value: "Lundi 10h-11h", color: "text-rose-400" },
          { icon: "🏦", label: "Agence la plus chargée", value: "Agence Plateau", color: "text-yellow-400" },
          { icon: "💸", label: "Service le plus demandé", value: "Virement (32%)", color: "text-teal-400" },
          { icon: "🧑‍💼", label: "Recommandation", value: "+2 agents lundi", color: "text-white" },
        ].map((t, i) => (
          <div key={i} className="stat-card">
            <div className="text-2xl mb-3">{t.icon}</div>
            <div className={`font-display font-bold text-sm ${t.color} mb-1`}>{t.value}</div>
            <div className="text-white/30 text-xs">{t.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-display font-bold text-white mb-5">Prévision d'Affluence — Aujourd'hui</h3>
          <div className="flex items-end gap-2 h-36 mb-4">
            {heures.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-full flex gap-0.5" style={{ height: `${(Math.max(reel[i], prevue[i]) / max) * 100}%` }}>
                  <div className="flex-1 bg-yellow-500/30 rounded-t hover:bg-yellow-500/50 transition-all"
                    style={{ height: `${(reel[i] / Math.max(reel[i], prevue[i])) * 100}%`, alignSelf: "flex-end" }} />
                  <div className="flex-1 bg-teal-500/30 rounded-t hover:bg-teal-500/50 transition-all"
                    style={{ height: `${(prevue[i] / Math.max(reel[i], prevue[i])) * 100}%`, alignSelf: "flex-end" }} />
                </div>
                <span className="text-white/20 text-xs">{h}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500/40 rounded" /><span className="text-white/30 text-xs">Réel</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-teal-500/40 rounded" /><span className="text-white/30 text-xs">Prévision</span></div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-display font-bold text-white mb-5">Prévision Semaine Prochaine</h3>
          <div className="space-y-3">
            {semaine.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-white/40 text-xs font-display w-8">{s.jour}</span>
                <div className="flex-1 bg-white/10 rounded-full h-2">
                  <div className={`h-2 rounded-full ${s.charge === "Très haute" ? "bg-rose-400" : s.charge === "Haute" ? "bg-yellow-400" : s.charge === "Normale" ? "bg-teal-400" : "bg-white/30"}`}
                    style={{ width: `${(s.prevision / maxS) * 100}%` }} />
                </div>
                <span className="text-white/60 text-xs font-display w-8 text-right">{s.prevision}</span>
                <span className={`text-xs font-bold w-20 text-right ${s.charge === "Très haute" ? "text-rose-400" : s.charge === "Haute" ? "text-yellow-400" : "text-teal-400"}`}>{s.charge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card border border-teal-500/20">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-2xl">🤖</span>
          <h3 className="font-display font-bold text-white">Recommandations IA</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "👥", title: "Renforcer les effectifs", desc: "Ajouter 2 agents supplémentaires le lundi et vendredi pour absorber le pic d'affluence prévu.", color: "border-rose-500/20 bg-rose-500/5" },
            { icon: "⏰", title: "Optimiser les horaires", desc: "Décaler les pauses agents entre 10h-11h pour maintenir la capacité maximale au pic d'activité.", color: "border-yellow-500/20 bg-yellow-500/5" },
            { icon: "🏦", title: "Ouvrir guichets supplémentaires", desc: "Activer le Guichet 5 dès vendredi matin pour réduire le temps d'attente moyen.", color: "border-teal-500/20 bg-teal-500/5" },
          ].map((r, i) => (
            <div key={i} className={`p-4 rounded-xl border ${r.color}`}>
              <div className="text-2xl mb-3">{r.icon}</div>
              <div className="font-display font-bold text-white text-sm mb-2">{r.title}</div>
              <p className="text-white/40 text-xs leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Predictive;