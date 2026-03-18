import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/client/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/client/appointment", icon: "📅", label: "Rendez-vous" },
  { path: "/client/ticket", icon: "🎫", label: "Mon Ticket" },
  { path: "/client/queue", icon: "👥", label: "File d'attente" },
  { path: "/client/profile", icon: "👤", label: "Mon Profil" },
];

const queue = [
  { ticket: "A-044", service: "Virement", guichet: "Guichet 1", status: "En cours", time: "En cours" },
  { ticket: "A-045", service: "Carte", guichet: "Guichet 2", status: "En cours", time: "~3 min" },
  { ticket: "A-046", service: "Compte", guichet: "Guichet 3", status: "En attente", time: "~6 min" },
  { ticket: "A-047", service: "Virement", guichet: "Guichet 3", status: "En attente", time: "~12 min", isMe: true },
  { ticket: "A-048", service: "Crédit", guichet: "—", status: "En attente", time: "~18 min" },
  { ticket: "A-049", service: "Change", guichet: "—", status: "En attente", time: "~21 min" },
];

const QueueTracking = () => (
  <PageLayout links={links} title="File d'Attente" subtitle="Visualisez votre position en temps réel">
    <div className="grid grid-cols-3 gap-4 mb-8">
      {[
        { label: "Numéro appelé", value: "A-044", color: "text-yellow-400" },
        { label: "Ma position", value: "#3", color: "text-teal-400" },
        { label: "Temps estimé", value: "12 min", color: "text-white" },
      ].map((s, i) => (
        <div key={i} className="stat-card text-center">
          <div className={`font-display font-bold text-3xl ${s.color} mb-1`}>{s.value}</div>
          <div className="text-white/40 text-xs">{s.label}</div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-white">File d'Attente</h2>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
            Temps réel
          </div>
        </div>
        <div className="space-y-2">
          {queue.map((q, i) => (
            <div key={i} className={`flex items-center justify-between p-4 rounded-xl border transition-all
              ${q.isMe ? "bg-yellow-500/10 border-yellow-500/40 shadow-lg shadow-yellow-500/10" : "bg-white/3 border-white/6 hover:border-white/12"}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm
                  ${q.isMe ? "bg-yellow-500 text-black" : q.status === "En cours" ? "bg-teal-500/20 text-teal-400" : "bg-white/8 text-white/50"}`}>
                  {q.isMe ? "★" : q.ticket.split("-")[1]}
                </div>
                <div>
                  <div className={`font-display font-bold text-sm flex items-center gap-2 ${q.isMe ? "text-yellow-400" : "text-white"}`}>
                    {q.ticket} {q.isMe && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">Vous</span>}
                  </div>
                  <div className="text-white/40 text-xs">{q.service} · {q.guichet}</div>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs font-display font-bold px-2.5 py-1 rounded-full ${q.status === "En cours" ? "badge-green" : "badge-yellow"}`}>{q.status}</span>
                <div className="text-white/30 text-xs mt-1">{q.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="card">
          <h3 className="font-display font-bold text-white mb-4">Guichets</h3>
          <div className="space-y-2">
            {[
              { name: "Guichet 1", agent: "Moussa T.", status: "Occupé", ticket: "A-044" },
              { name: "Guichet 2", agent: "Aïcha K.", status: "Occupé", ticket: "A-045" },
              { name: "Guichet 3", agent: "Kofi A.", status: "Occupé", ticket: "A-046" },
              { name: "Guichet 4", agent: "—", status: "Fermé", ticket: "—" },
            ].map((g, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/4 border border-white/6">
                <div>
                  <div className="font-display font-bold text-white text-sm">{g.name}</div>
                  <div className="text-white/30 text-xs">{g.agent}</div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-display font-bold px-2 py-0.5 rounded-full ${g.status === "Occupé" ? "badge-yellow" : "bg-white/5 text-white/30 border border-white/10"}`}>{g.status}</span>
                  <div className="text-white/30 text-xs mt-1">{g.ticket}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass border border-yellow-500/20 rounded-2xl p-5">
          <div className="text-yellow-400 font-display font-bold text-sm mb-1">💡 Votre ticket</div>
          <div className="text-4xl font-display font-bold text-white mb-1">A-047</div>
          <div className="text-white/40 text-sm">Position #3 · ~12 min</div>
        </div>
      </div>
    </div>
  </PageLayout>
);

export default QueueTracking;