import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/agent/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/agent/tasks", icon: "📋", label: "Mes Tâches" },
  { path: "/agent/history", icon: "🕐", label: "Historique" },
];

const initialTasks = [
  { id: 1, client: "Jean Akpovi", service: "Virement international", statut: "En cours", priority: "Haute", time: "09:15", ticket: "A-044",
    pieces: [
      { label: "Pièce d'identité", checked: false },
      { label: "Justificatif de domicile", checked: false },
      { label: "RIB", checked: false },
      { label: "Formulaire de virement", checked: false },
    ]
  },
  { id: 2, client: "Fatou Diallo", service: "Ouverture de compte", statut: "En attente", priority: "Normale", time: "09:30", ticket: "A-047",
    pieces: [
      { label: "Pièce d'identité", checked: false },
      { label: "Justificatif de domicile", checked: false },
      { label: "Photo d'identité", checked: false },
    ]
  },
  { id: 3, client: "Kofi Mensah", service: "Demande de crédit", statut: "En attente", priority: "Haute", time: "10:00", ticket: "A-048",
    pieces: [
      { label: "Pièce d'identité", checked: false },
      { label: "RIB", checked: false },
      { label: "Justificatif de revenus", checked: false },
      { label: "Relevé bancaire 3 mois", checked: false },
    ]
  },
  { id: 4, client: "Awa Traoré", service: "Carte bancaire", statut: "Terminé", priority: "Normale", time: "08:00", ticket: "A-040",
    pieces: [
      { label: "Pièce d'identité", checked: true },
      { label: "RIB", checked: true },
    ]
  },
  { id: 5, client: "Ibrahim Coulibaly", service: "Relevé de compte", statut: "Terminé", priority: "Basse", time: "08:30", ticket: "A-041",
    pieces: [
      { label: "Pièce d'identité", checked: true },
    ]
  },
];

const Tasks = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Tous");
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [saved, setSaved] = useState(false);

  const filters = ["Tous", "En cours", "En attente", "Terminé"];
  const filtered = filter === "Tous" ? tasks : tasks.filter(t => t.statut === filter);

  const openTask = (t) => {
    setSelectedTask({ ...t, pieces: t.pieces.map(p => ({ ...p })) });
    setSaved(false);
  };

  const togglePiece = (index) => {
    const updated = { ...selectedTask };
    updated.pieces = updated.pieces.map((p, i) => i === index ? { ...p, checked: !p.checked } : p);
    setSelectedTask(updated);
    setSaved(false);
  };

  const allChecked = selectedTask?.pieces.every(p => p.checked);

  const handleSave = () => {
    const newStatut = allChecked ? "Terminé" : selectedTask.statut === "En attente" ? "En cours" : selectedTask.statut;
    const updatedTask = { ...selectedTask, statut: newStatut };
    setTasks(tasks.map(t => t.id === selectedTask.id ? updatedTask : t));
    setSelectedTask(updatedTask);
    setSaved(true);
  };

  const handleClose = () => {
    setSelectedTask(null);
    setSaved(false);
  };

  return (
    <PageLayout links={links} title="Mes Tâches" subtitle="Liste de toutes vos tâches assignées">

      {/* MODAL DÉTAIL TÂCHE */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-bold text-white text-lg">{selectedTask.client}</h3>
                <p className="text-white/40 text-xs">{selectedTask.service} · {selectedTask.ticket}</p>
              </div>
              <button onClick={handleClose} className="text-white/30 hover:text-white text-xl transition-colors">✕</button>
            </div>

            {/* STATUT & PRIORITÉ */}
            <div className="flex gap-2 mb-5">
              <span className={`text-xs font-display font-bold px-2.5 py-1 rounded-full ${selectedTask.statut === "En cours" ? "badge-green" : selectedTask.statut === "Terminé" ? "bg-teal-500/20 text-teal-400 border border-teal-500/30" : "badge-yellow"}`}>
                {selectedTask.statut}
              </span>
              <span className={`text-xs font-display font-bold px-2 py-1 rounded-full ${selectedTask.priority === "Haute" ? "badge-red" : selectedTask.priority === "Normale" ? "badge-yellow" : "bg-white/10 text-white/40 border border-white/10"}`}>
                {selectedTask.priority}
              </span>
              <span className="text-white/30 text-xs flex items-center">🕐 {selectedTask.time}</span>
            </div>

            {/* PIÈCES JUSTIFICATIVES */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/70 text-sm font-display font-bold">📎 Pièces justificatives</p>
                <span className="text-white/30 text-xs">
                  {selectedTask.pieces.filter(p => p.checked).length}/{selectedTask.pieces.length} vérifiées
                </span>
              </div>

              {/* BARRE DE PROGRESSION */}
              <div className="w-full bg-white/10 rounded-full h-1.5 mb-4">
                <div
                  className="bg-yellow-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${(selectedTask.pieces.filter(p => p.checked).length / selectedTask.pieces.length) * 100}%` }}
                />
              </div>

              <div className="space-y-2">
                {selectedTask.pieces.map((piece, i) => (
                  <div
                    key={i}
                    onClick={() => togglePiece(i)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                      ${piece.checked
                        ? "bg-teal-500/10 border-teal-500/30"
                        : "bg-white/5 border-white/10 hover:border-yellow-500/30"}`}>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
                      ${piece.checked ? "bg-teal-500 border-teal-500" : "border-white/20"}`}>
                      {piece.checked && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className={`text-sm font-display transition-colors ${piece.checked ? "text-teal-400 line-through opacity-70" : "text-white/70"}`}>
                      {piece.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* MESSAGE SI TOUT COCHÉ */}
            {allChecked && (
              <div className="mb-4 p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm font-display text-center">
                ✅ Toutes les pièces sont vérifiées — prêt à terminer
              </div>
            )}

            {/* MESSAGE SUCCÈS APRÈS SAVE */}
            {saved && (
              <div className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-display text-center">
                ✅ Tâche enregistrée avec succès !
              </div>
            )}

            {/* BOUTONS */}
            <div className="flex gap-3">
              <button onClick={handleClose}
                className="flex-1 glass border border-white/10 text-white/60 hover:text-white text-sm font-display py-2.5 rounded-xl transition-all">
                Fermer
              </button>
              <button onClick={handleSave}
                className="flex-1 bg-yellow-500 text-black font-display font-bold text-sm py-2.5 rounded-xl hover:bg-yellow-400 transition-all">
                {allChecked ? "✅ Terminer" : "💾 Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FILTRES */}
      <div className="flex gap-2 mb-6">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-display font-bold transition-all
              ${filter === f ? "bg-yellow-500 text-black" : "glass border border-white/10 text-white/60 hover:text-white"}`}>
            {f} <span className="ml-1 text-xs opacity-60">{f === "Tous" ? tasks.length : tasks.filter(t => t.statut === f).length}</span>
          </button>
        ))}
      </div>

      {/* LISTE */}
      <div className="card">
        <div className="space-y-3">
          {filtered.map((t) => (
            <div key={t.id} onClick={() => openTask(t)}
              className="flex items-center justify-between p-4 rounded-xl bg-white/4 border border-white/6 hover:border-yellow-500/30 cursor-pointer transition-all group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm
                  ${t.statut === "En cours" ? "bg-yellow-500/20 text-yellow-400" : t.statut === "Terminé" ? "bg-teal-500/20 text-teal-400" : "bg-white/10 text-white/50"}`}>
                  {t.ticket.split("-")[1]}
                </div>
                <div>
                  <div className="font-display font-bold text-white text-sm group-hover:text-yellow-400 transition-colors">{t.client}</div>
                  <div className="text-white/40 text-xs">{t.service}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/30 text-xs">{t.time}</span>
                <span className={`text-xs font-display font-bold px-2 py-0.5 rounded-full ${t.priority === "Haute" ? "badge-red" : t.priority === "Normale" ? "badge-yellow" : "bg-white/10 text-white/40 border border-white/10"}`}>{t.priority}</span>
                <span className={`text-xs font-display font-bold px-2.5 py-1 rounded-full ${t.statut === "En cours" ? "badge-green" : t.statut === "Terminé" ? "bg-teal-500/20 text-teal-400 border border-teal-500/30" : "badge-yellow"}`}>{t.statut}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Tasks;