import { useState } from "react";
import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/agent/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/agent/tasks", icon: "📋", label: "Mes Tâches" },
  { path: "/agent/history", icon: "🕐", label: "Historique" },
];

const allHistory = [
  { id: "T-1042", client: "Jean Akpovi", service: "Virement international", date: "15 Jan 2025", heure: "09:45", duree: "8 min", pieces: ["Pièce d'identité", "RIB", "Formulaire de virement"] },
  { id: "T-1041", client: "Awa Traoré", service: "Carte bancaire", date: "15 Jan 2025", heure: "09:10", duree: "6 min", pieces: ["Pièce d'identité", "RIB"] },
  { id: "T-1040", client: "Moussa Koné", service: "Relevé de compte", date: "14 Jan 2025", heure: "16:30", duree: "4 min", pieces: ["Pièce d'identité"] },
  { id: "T-1039", client: "Adja Sow", service: "Ouverture de compte", date: "14 Jan 2025", heure: "14:15", duree: "15 min", pieces: ["Pièce d'identité", "Justificatif de domicile", "Photo d'identité"] },
  { id: "T-1038", client: "Ibrahim Diop", service: "Demande de crédit", date: "13 Jan 2025", heure: "11:00", duree: "20 min", pieces: ["Pièce d'identité", "RIB", "Justificatif de revenus", "Relevé bancaire 3 mois"] },
  { id: "T-1037", client: "Fatou Diallo", service: "Change de devises", date: "13 Jan 2025", heure: "10:15", duree: "5 min", pieces: ["Pièce d'identité"] },
  { id: "T-1036", client: "Kofi Mensah", service: "Épargne / Placement", date: "12 Jan 2025", heure: "15:00", duree: "12 min", pieces: ["Pièce d'identité", "RIB", "Justificatif de revenus"] },
];

const History = () => {
  const [selected, setSelected] = useState(null);
  const [filterDate, setFilterDate] = useState("Tous");

  const dates = ["Tous", "15 Jan 2025", "14 Jan 2025", "13 Jan 2025", "12 Jan 2025"];
  const filtered = filterDate === "Tous" ? allHistory : allHistory.filter(h => h.date === filterDate);

  // Grouper par date
  const grouped = filtered.reduce((acc, h) => {
    if (!acc[h.date]) acc[h.date] = [];
    acc[h.date].push(h);
    return acc;
  }, {});

  return (
    <PageLayout links={links} title="Historique" subtitle="Toutes vos opérations passées">

      {/* MODAL DÉTAIL */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSelected(null)}>
          <div className="glass border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-bold text-white text-lg">{selected.client}</h3>
                <p className="text-white/40 text-xs">{selected.service} · {selected.id}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white text-xl">✕</button>
            </div>

            {/* INFOS */}
            <div className="glass border border-white/10 rounded-xl p-4 mb-4 space-y-2">
              {[
                ["Date", selected.date],
                ["Heure", selected.heure],
                ["Durée de traitement", selected.duree],
                ["Statut", "Terminé ✓"],
              ].map(([l, v], i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-white/40">{l}</span>
                  <span className={`font-display font-bold ${l === "Statut" ? "text-teal-400" : "text-white"}`}>{v}</span>
                </div>
              ))}
            </div>

            {/* TIMELINE PIÈCES */}
            <div className="mb-5">
              <p className="text-white/50 text-xs font-display font-bold mb-3">📎 Pièces vérifiées</p>
              <div className="relative">
                {selected.pieces.map((p, i) => (
                  <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs flex-shrink-0">✓</div>
                      {i < selected.pieces.length - 1 && <div className="w-0.5 h-4 bg-teal-500/30 mt-1" />}
                    </div>
                    <div className="pt-0.5">
                      <span className="text-white/70 text-sm">{p}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setSelected(null)}
              className="w-full glass border border-white/10 text-white/60 hover:text-white text-sm font-display py-2.5 rounded-xl transition-all">
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total opérations", value: "142", icon: "📋", color: "text-yellow-400" },
          { label: "Cette semaine", value: "24", icon: "📅", color: "text-teal-400" },
          { label: "Temps moyen", value: "8.5 min", icon: "⏱", color: "text-white" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`font-display font-bold text-2xl ${s.color} mb-1`}>{s.value}</div>
            <div className="text-white/40 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* FILTRES PAR DATE */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {dates.map(d => (
          <button key={d} onClick={() => setFilterDate(d)}
            className={`px-4 py-2 rounded-xl text-xs font-display font-bold transition-all
              ${filterDate === d ? "bg-yellow-500 text-black" : "glass border border-white/10 text-white/60 hover:text-white"}`}>
            {d}
          </button>
        ))}
      </div>

      {/* TIMELINE GROUPÉE PAR DATE */}
      <div className="space-y-8">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            {/* SÉPARATEUR DATE */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-yellow-400 font-display font-bold text-sm">{date}</span>
              <div className="flex-1 border-t border-white/10" />
              <span className="text-white/20 text-xs">{items.length} opération{items.length > 1 ? "s" : ""}</span>
            </div>

            {/* ITEMS */}
            <div className="relative pl-4">
              {/* LIGNE VERTICALE */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white/10 rounded-full" />

              <div className="space-y-3">
                {items.map((h, i) => (
                  <div key={h.id}
                    onClick={() => setSelected(h)}
                    className="relative flex items-center justify-between p-4 rounded-xl bg-white/4 border border-white/6 hover:border-yellow-500/30 cursor-pointer transition-all group ml-4">
                    {/* POINT SUR LA LIGNE */}
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-teal-500 border-2 border-[#0A0F1E]" />

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-teal-500/15 rounded-xl flex items-center justify-center text-teal-400 font-display font-bold text-xs">✓</div>
                      <div>
                        <div className="font-display font-bold text-white text-sm group-hover:text-yellow-400 transition-colors">{h.client}</div>
                        <div className="text-white/40 text-xs">{h.service} · {h.id}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-white/60 text-xs">{h.heure}</div>
                        <div className="text-yellow-400 text-xs font-display font-bold">{h.duree}</div>
                      </div>
                      <span className="badge-green">Terminé</span>
                      <span className="text-white/20 group-hover:text-white/60 text-xs transition-colors">→</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </PageLayout>
  );
};

export default History;