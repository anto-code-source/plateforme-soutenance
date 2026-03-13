import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* NAVBAR */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-yellow-500 rounded-xl flex items-center justify-center">
            <span className="text-black font-display font-bold text-sm">BF</span>
          </div>
          <span className="font-display font-bold text-white text-xl">BankFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#features" className="text-white/50 hover:text-white text-sm transition-colors">Modules</a>
          <a href="#roles" className="text-white/50 hover:text-white text-sm transition-colors">Roles</a>
          <a href="#contact" className="text-white/50 hover:text-white text-sm transition-colors">Contact</a>
          <button onClick={() => navigate("/login")}
            className="bg-yellow-500 text-black font-display font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-yellow-400 transition-all">
            Connexion
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 glass border border-yellow-500/30 rounded-full px-4 py-2 mb-8">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          <span className="text-yellow-400 text-xs font-display font-bold tracking-widest uppercase">Système Bancaire Nouvelle Génération</span>
        </div>

        <h1 className="font-display font-bold text-5xl md:text-6xl text-white leading-tight mb-4">
          Conception d'une Application Prédictive pour<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-teal-400 to-rose-400">
            l'Optimisation des Flux Bancaires
          </span>
        </h1>

        <p className="text-white/50 text-base max-w-3xl mx-auto mb-6">
          BankFlow est une solution complète pour l'optimisation des flux clients et la répartition
          intelligente des tâches internes dans les banques et micro-finances — avec un module
          de prédiction d'affluence par intelligence artificielle.
        </p>

        {/* BADGES THEMES */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { label: "Tickets Virtuels", color: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400" },
            { label: "Rendez-vous en ligne", color: "bg-teal-500/15 border-teal-500/30 text-teal-400" },
            { label: "File d'Attente", color: "bg-rose-500/15 border-rose-500/30 text-rose-400" },
            { label: "KPIs & Dashboards", color: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400" },
            { label: "IA Predictive", color: "bg-teal-500/15 border-teal-500/30 text-teal-400" },
            { label: "Gestion des Agents", color: "bg-rose-500/15 border-rose-500/30 text-rose-400" },
            { label: "Multi-Agences", color: "bg-white/10 border-white/20 text-white/60" },
            { label: "Controle d'Acces", color: "bg-white/10 border-white/20 text-white/60" },
          ].map((b, i) => (
            <span key={i} className={`px-3 py-1.5 rounded-full text-xs font-display font-bold border ${b.color}`}>
              {b.label}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button onClick={() => navigate("/login")}
            className="bg-yellow-500 text-black font-display font-bold px-8 py-4 rounded-xl hover:bg-yellow-400 transition-all hover:shadow-xl hover:shadow-yellow-500/30 text-base">
            Acceder a la plateforme
          </button>
          <button onClick={scrollToFeatures}
            className="glass border border-white/20 text-white font-display px-8 py-4 rounded-xl hover:bg-white/10 transition-all text-base">
            Decouvrir les modules
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { value: "5", label: "Roles utilisateurs", sub: "Client · Agent · Manager · Directeur · Admin", color: "text-yellow-400" },
            { value: "15+", label: "Modules fonctionnels", sub: "Dashboards, tickets, RDV, KPIs...", color: "text-teal-400" },
            { value: "-62%", label: "Temps d'attente", sub: "Grace aux tickets virtuels", color: "text-rose-400" },
            { value: "94%", label: "Satisfaction client", sub: "Mesuree en temps reel", color: "text-yellow-400" },
          ].map((s, i) => (
            <div key={i} className="glass rounded-2xl p-5 border border-white/10 text-center">
              <div className={`font-display font-bold text-3xl ${s.color} mb-1`}>{s.value}</div>
              <div className="text-white/70 text-xs font-bold mb-1">{s.label}</div>
              <div className="text-white/25 text-xs">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MODULES */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-8 py-16 border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl text-white mb-3">Tous les modules de la plateforme</h2>
          <p className="text-white/40 text-sm">Cliquez sur un module pour le tester directement</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          {[
            {
              title: "Ticket Virtuel",
              desc: "Generez un ticket depuis chez vous, suivez votre position en temps reel avec un countdown automatique.",
              features: ["Position en direct", "Temps d'attente estime", "Notifications"],
              color: "border-yellow-500/20 hover:border-yellow-500/50",
              badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
            },
            {
              title: "Prise de Rendez-vous",
              desc: "Reservez votre creneau en 3 etapes : service, agence, date et heure disponible.",
              features: ["Wizard 3 etapes", "Choix agence & service", "Confirmation instantanee"],
              color: "border-teal-500/20 hover:border-teal-500/50",
              badge: "bg-teal-500/15 text-teal-400 border-teal-500/30",
            },
            {
              title: "File d'Attente",
              desc: "Visualisez en temps reel la file d'attente, les guichets actifs et l'etat de chaque agent.",
              features: ["Vue temps reel", "Statut guichets", "Position client"],
              color: "border-rose-500/20 hover:border-rose-500/50",
              badge: "bg-rose-500/15 text-rose-400 border-rose-500/30",
            },
            {
              title: "Espace Agent",
              desc: "Gerez vos taches assignees, mettez a jour les statuts clients et consultez votre historique.",
              features: ["Liste des taches", "Mise a jour statut", "Historique complet"],
              color: "border-yellow-500/20 hover:border-yellow-500/50",
              badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
            },
            {
              title: "Supervision Manager",
              desc: "Suivez la charge des agents, repartissez les taches et gerez les alertes en temps reel.",
              features: ["Charge des agents", "Assignation taches", "Alertes critiques"],
              color: "border-rose-500/20 hover:border-rose-500/50",
              badge: "bg-rose-500/15 text-rose-400 border-rose-500/30",
            },
            {
              title: "IA Predictive",
              desc: "Anticipez les pics d'affluence par heure et par jour avec des recommandations automatiques.",
              features: ["Previsions horaires", "Recommandations IA", "Analyse semaine"],
              color: "border-teal-500/20 hover:border-teal-500/50",
              badge: "bg-teal-500/15 text-teal-400 border-teal-500/30",
            },
            {
              title: "KPIs Directeur",
              desc: "Analysez les indicateurs cles de performance sur 7 mois : satisfaction, volume, temps de traitement.",
              features: ["Graphiques 7 mois", "Taux satisfaction", "Volume clients"],
              color: "border-yellow-500/20 hover:border-yellow-500/50",
              badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
            },
            {
              title: "Administration",
              desc: "Gerez les utilisateurs, les agences, configurez le systeme et consultez les logs d'audit.",
              features: ["CRUD utilisateurs", "Gestion agences", "Logs & audit"],
              color: "border-white/10 hover:border-white/30",
              badge: "bg-white/10 text-white/50 border-white/20",
            },
            {
              title: "Multi-Agences",
              desc: "Pilotez plusieurs agences simultanement avec une vue consolidee des performances.",
              features: ["5 agences", "Vue globale", "Comparatif"],
              color: "border-teal-500/20 hover:border-teal-500/50",
              badge: "bg-teal-500/15 text-teal-400 border-teal-500/30",
            },
          ].map((f, i) => (
            <div key={i}
              onClick={() => navigate("/login")}
              className={`glass rounded-2xl p-5 border ${f.color} cursor-pointer transition-all hover:scale-105 group`}>
              <div className="mb-4">
                <h3 className="font-display font-bold text-white text-sm mb-2 group-hover:text-yellow-400 transition-colors">{f.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {f.features.map((feat, j) => (
                  <span key={j} className={`text-xs px-2 py-0.5 rounded-full font-display border ${f.badge}`}>
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" className="relative z-10 max-w-6xl mx-auto px-8 py-16 border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl text-white mb-3">5 espaces dedies, 5 roles</h2>
          <p className="text-white/40 text-sm">Chaque utilisateur accede uniquement a son espace securise</p>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-12">
          {[
            { role: "Client", desc: "Tickets · RDV · File", color: "text-teal-400", bg: "border-teal-500/20 hover:border-teal-500/50 hover:bg-teal-500/5" },
            { role: "Agent", desc: "Taches · Guichet · Historique", color: "text-yellow-400", bg: "border-yellow-500/20 hover:border-yellow-500/50 hover:bg-yellow-500/5" },
            { role: "Manager", desc: "Agents · Alertes · Taches", color: "text-rose-400", bg: "border-rose-500/20 hover:border-rose-500/50 hover:bg-rose-500/5" },
            { role: "Directeur", desc: "KPIs · IA · Agences", color: "text-teal-400", bg: "border-teal-500/20 hover:border-teal-500/50 hover:bg-teal-500/5" },
            { role: "Admin", desc: "Users · Config · Logs", color: "text-yellow-400", bg: "border-yellow-500/20 hover:border-yellow-500/50 hover:bg-yellow-500/5" },
          ].map((r, i) => (
            <div key={i}
              onClick={() => navigate("/login")}
              className={`glass rounded-2xl p-5 border ${r.bg} text-center cursor-pointer transition-all hover:scale-105`}>
              <div className={`font-display font-bold text-base ${r.color} mb-2`}>{r.role}</div>
              <p className="text-white/30 text-xs leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>

        {/* COMPTES DEMO */}
        <div className="glass rounded-3xl p-8 border border-yellow-500/20 max-w-lg mx-auto">
          <div className="text-center mb-4">
            <div className="font-display font-bold text-white text-lg">Comptes de demonstration</div>
            <p className="text-white/30 text-xs mt-1">Cliquez pour acceder directement</p>
          </div>
          <div className="space-y-2 mb-4">
            {[
              { email: "client@bank.com", role: "Client", color: "text-teal-400", border: "hover:border-teal-500/40" },
              { email: "agent@bank.com", role: "Agent", color: "text-yellow-400", border: "hover:border-yellow-500/40" },
              { email: "manager@bank.com", role: "Manager", color: "text-rose-400", border: "hover:border-rose-500/40" },
              { email: "directeur@bank.com", role: "Directeur", color: "text-teal-400", border: "hover:border-teal-500/40" },
              { email: "admin@bank.com", role: "Admin", color: "text-yellow-400", border: "hover:border-yellow-500/40" },
            ].map((u, i) => (
              <div key={i} onClick={() => navigate("/login")}
                className={`flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 ${u.border} cursor-pointer transition-all`}>
                <span className="text-white/50 text-sm">{u.email}</span>
                <span className={`text-xs font-display font-bold ${u.color}`}>{u.role}</span>
              </div>
            ))}
          </div>
          <p className="text-white/25 text-xs text-center">
            Mot de passe : <span className="text-white/50 font-bold">password123</span>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <section id="contact" className="relative z-10 border-t border-white/5 py-10">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-display font-bold text-xs">BF</span>
            </div>
            <div>
              <span className="font-display font-bold text-white">BankFlow</span>
              <span className="text-white/20 text-xs ml-2">· Conception d'une Application Prédictive — Banques & Micro-Finance</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href="mailto:contact@bankflow.com" className="text-white/30 hover:text-yellow-400 text-sm transition-colors">contact@bankflow.com</a>
            <a href="tel:+22500000000" className="text-white/30 hover:text-yellow-400 text-sm transition-colors">+225 00 00 00 00</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;