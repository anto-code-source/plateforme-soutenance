import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/agent/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/agent/tasks", icon: "📋", label: "Mes Tâches" },
  { path: "/agent/history", icon: "🕐", label: "Historique" },
];

const tasksData = {
  1: { client: "Jean Akpovi", tel: "+225 07 11 22 33", email: "jean@email.com", service: "Virement international", montant: "500 000 FCFA", statut: "En cours", ticket: "A-044", docs: ["Pièce d'identité", "Justificatif de domicile", "RIB bénéficiaire"] },
  2: { client: "Fatou Diallo", tel: "+225 05 44 55 66", email: "fatou@email.com", service: "Ouverture de compte", montant: "—", statut: "En attente", ticket: "A-047", docs: ["Pièce d'identité", "Justificatif de revenu"] },
  3: { client: "Kofi Mensah", tel: "+225 01 77 88 99", email: "kofi@email.com", service: "Demande de crédit", montant: "2 000 000 FCFA", statut: "En attente", ticket: "A-048", docs: ["Pièce d'identité", "Fiche de salaire x3", "Relevé bancaire"] },
};

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = tasksData[id] || tasksData[1];
  const [statut, setStatut] = useState(task.statut);
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <PageLayout links={links} title="Détails Tâche" subtitle={`Ticket ${task.ticket} · ${task.service}`}>
      <button onClick={() => navigate("/agent/tasks")} className="text-white/40 hover:text-white text-sm flex items-center gap-1 mb-6 transition-colors">
        ← Retour
      </button>

      {saved && (
        <div className="bg-teal-500/15 border border-teal-500/30 rounded-xl p-3 mb-6 flex items-center gap-2">
          <span className="text-teal-400 text-sm">✓ Statut mis à jour : <strong>{statut}</strong></span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="font-display font-bold text-white mb-5">Informations Client</h3>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-teal-500 rounded-2xl flex items-center justify-center text-black font-display font-bold text-xl">
                {task.client.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div className="font-display font-bold text-white text-lg">{task.client}</div>
                <div className="text-white/40 text-sm">{task.email}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[["Téléphone", task.tel], ["Email", task.email], ["Ticket", task.ticket], ["Service", task.service], ["Montant", task.montant]].map(([l, v], i) => (
                <div key={i} className="p-3 rounded-xl bg-white/4 border border-white/6">
                  <div className="text-white/30 text-xs mb-1">{l}</div>
                  <div className="text-white font-display font-bold text-sm">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-display font-bold text-white mb-4">Documents</h3>
            <div className="space-y-2">
              {task.docs.map((doc, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/6">
                  <span className="text-yellow-400">📄</span>
                  <span className="text-white/70 text-sm">{doc}</span>
                  <span className="ml-auto badge-green">✓ Vérifié</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h3 className="font-display font-bold text-white mb-5">Mise à Jour Statut</h3>
            <div className="space-y-2 mb-5">
              {["En attente", "En cours", "Terminé"].map((s) => (
                <button key={s} onClick={() => setStatut(s)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left
                    ${statut === s
                      ? s === "Terminé" ? "bg-teal-500/15 border-teal-500/40 text-teal-400"
                        : s === "En cours" ? "bg-yellow-500/15 border-yellow-500/40 text-yellow-400"
                        : "bg-white/10 border-white/30 text-white"
                      : "glass border-white/10 text-white/50 hover:border-white/20"}`}>
                  <div className={`w-3 h-3 rounded-full ${statut === s ? s === "Terminé" ? "bg-teal-400" : s === "En cours" ? "bg-yellow-400" : "bg-white/60" : "bg-white/20"}`} />
                  <span className="font-display font-bold text-sm">{s}</span>
                  {statut === s && <span className="ml-auto">✓</span>}
                </button>
              ))}
            </div>
            <button onClick={handleSave} className="w-full bg-yellow-500 text-black font-display font-bold py-3 rounded-xl hover:bg-yellow-400 transition-all">
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TaskDetail;