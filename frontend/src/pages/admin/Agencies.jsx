import { useState } from "react";
import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/admin/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/admin/users", icon: "👥", label: "Utilisateurs" },
  { path: "/admin/agencies", icon: "🏦", label: "Agences" },
  { path: "/admin/settings", icon: "⚙️", label: "Paramètres" },
  { path: "/admin/logs", icon: "📋", label: "Logs & Audit" },
];

const initialAgences = [
  { id:1, name:"BankFlow Abidjan", adresse:"Plateau, Abidjan — Côte d'Ivoire", agents:8, guichets:6, statut:"Ouverte", clients:312, satisfaction:96 },
  { id:2, name:"BankFlow Dakar", adresse:"Plateau, Dakar — Sénégal", agents:6, guichets:5, statut:"Ouverte", clients:278, satisfaction:93 },
  { id:3, name:"BankFlow Bamako", adresse:"Hippodrome, Bamako — Mali", agents:7, guichets:5, statut:"Ouverte", clients:245, satisfaction:91 },
  { id:4, name:"BankFlow Lomé", adresse:"Centre, Lomé — Togo", agents:5, guichets:4, statut:"Ouverte", clients:198, satisfaction:95 },
  { id:5, name:"BankFlow Cotonou", adresse:"Ganhi, Cotonou — Bénin", agents:6, guichets:4, statut:"Ouverte", clients:215, satisfaction:89 },
  { id:6, name:"BankFlow Ouagadougou", adresse:"Zogona, Ouagadougou — Burkina Faso", agents:5, guichets:4, statut:"Ouverte", clients:180, satisfaction:92 },
  { id:7, name:"BankFlow Accra", adresse:"Osu, Accra — Ghana", agents:7, guichets:5, statut:"Ouverte", clients:260, satisfaction:94 },
  { id:8, name:"BankFlow Lagos", adresse:"Victoria Island, Lagos — Nigeria", agents:10, guichets:8, statut:"Ouverte", clients:420, satisfaction:90 },
  { id:9, name:"BankFlow Nairobi", adresse:"CBD, Nairobi — Kenya", agents:8, guichets:6, statut:"Maintenance", clients:310, satisfaction:88 },
  { id:10, name:"BankFlow Casablanca", adresse:"Maarif, Casablanca — Maroc", agents:9, guichets:7, statut:"Ouverte", clients:380, satisfaction:97 },
];

const emptyForm = { name:"", adresse:"", agents:0, guichets:0, statut:"Ouverte", clients:0, satisfaction:0 };

const Agencies = () => {
  const [agences, setAgences] = useState(initialAgences);
  const [modalModifier, setModalModifier] = useState(null);
  const [modalStats, setModalStats] = useState(null);
  const [modalAjouter, setModalAjouter] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const openModifier = (a) => { setForm({ ...a }); setModalModifier(a.id); };
  const openStats = (a) => setModalStats(a);
  const openAjouter = () => { setForm(emptyForm); setModalAjouter(true); };

  const saveModifier = () => {
    setAgences(agences.map(a => a.id === modalModifier ? { ...form, id: modalModifier } : a));
    setModalModifier(null);
  };

  const saveAjouter = () => {
    const newId = Math.max(...agences.map(a => a.id)) + 1;
    setAgences([...agences, { ...form, id: newId }]);
    setModalAjouter(false);
  };

  const deleteAgence = (id) => {
    setAgences(agences.filter(a => a.id !== id));
    setConfirmDelete(null);
    setModalModifier(null);
  };

  const FormField = ({ label, field, type = "text" }) => (
    <div>
      <label className="text-white/50 text-xs mb-1 block">{label}</label>
      {field === "statut" ? (
        <select
          value={form[field]}
          onChange={e => setForm({ ...form, [field]: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500/50">
          <option value="Ouverte">Ouverte</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Fermée">Fermée</option>
        </select>
      ) : (
        <input
          type={type}
          value={form[field]}
          onChange={e => setForm({ ...form, [field]: type === "number" ? Number(e.target.value) : e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500/50"
        />
      )}
    </div>
  );

  const Modal = ({ title, onClose, onSave, saveLabel = "Enregistrer", children }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-white text-lg">{title}</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white text-xl transition-colors">✕</button>
        </div>
        {children}
        {onSave && (
          <div className="flex gap-3 mt-5">
            <button onClick={onClose} className="flex-1 glass border border-white/10 text-white/60 hover:text-white text-sm font-display py-2.5 rounded-xl transition-all">Annuler</button>
            <button onClick={onSave} className="flex-1 bg-yellow-500 text-black font-display font-bold text-sm py-2.5 rounded-xl hover:bg-yellow-400 transition-all">{saveLabel}</button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <PageLayout links={links} title="Gestion des Agences" subtitle={`${agences.length} agences — Afrique de l'Ouest, Est & Nord`}>

      {/* MODAL MODIFIER */}
      {modalModifier && (
        <Modal title="✏️ Modifier l'agence" onClose={() => setModalModifier(null)} onSave={saveModifier}>
          <div className="space-y-3">
            <FormField label="Nom de l'agence" field="name" />
            <FormField label="Adresse" field="adresse" />
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Nombre d'agents" field="agents" type="number" />
              <FormField label="Nombre de guichets" field="guichets" type="number" />
              <FormField label="Clients / mois" field="clients" type="number" />
              <FormField label="Satisfaction (%)" field="satisfaction" type="number" />
            </div>
            <FormField label="Statut" field="statut" />
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={() => setConfirmDelete(modalModifier)}
              className="w-full glass border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-sm font-display py-2.5 rounded-xl transition-all">
              🗑️ Supprimer cette agence
            </button>
          </div>
        </Modal>
      )}

      {/* MODAL STATS */}
      {modalStats && (
        <Modal title={`📊 Stats — ${modalStats.name}`} onClose={() => setModalStats(null)} onSave={null}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Agents", value: modalStats.agents, color: "text-yellow-400" },
                { label: "Guichets", value: modalStats.guichets, color: "text-teal-400" },
                { label: "Clients / mois", value: modalStats.clients, color: "text-rose-400" },
                { label: "Satisfaction", value: `${modalStats.satisfaction}%`, color: "text-yellow-400" },
              ].map(({ label, value, color }, i) => (
                <div key={i} className="glass border border-white/10 rounded-xl p-4 text-center">
                  <div className={`font-display font-bold text-2xl ${color} mb-1`}>{value}</div>
                  <div className="text-white/40 text-xs">{label}</div>
                </div>
              ))}
            </div>
            <div className="glass border border-white/10 rounded-xl p-4">
              <div className="text-white/50 text-xs mb-2">Taux de satisfaction</div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full transition-all" style={{ width: `${modalStats.satisfaction}%` }} />
              </div>
              <div className="text-right text-yellow-400 text-xs mt-1 font-bold">{modalStats.satisfaction}%</div>
            </div>
            <div className="glass border border-white/10 rounded-xl p-4">
              <div className="text-white/50 text-xs mb-1">Adresse</div>
              <div className="text-white text-sm">📍 {modalStats.adresse}</div>
            </div>
            <div className="glass border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div className="text-white/50 text-xs">Statut actuel</div>
              <span className={`text-xs font-display font-bold px-2.5 py-1 rounded-full ${modalStats.statut === "Ouverte" ? "badge-green" : "badge-yellow"}`}>
                {modalStats.statut}
              </span>
            </div>
          </div>
          <button onClick={() => setModalStats(null)} className="w-full mt-5 glass border border-white/10 text-white/60 hover:text-white text-sm font-display py-2.5 rounded-xl transition-all">
            Fermer
          </button>
        </Modal>
      )}

      {/* MODAL AJOUTER */}
      {modalAjouter && (
        <Modal title="➕ Ajouter une agence" onClose={() => setModalAjouter(false)} onSave={saveAjouter} saveLabel="Ajouter">
          <div className="space-y-3">
            <FormField label="Nom de l'agence" field="name" />
            <FormField label="Adresse" field="adresse" />
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Nombre d'agents" field="agents" type="number" />
              <FormField label="Nombre de guichets" field="guichets" type="number" />
              <FormField label="Clients / mois" field="clients" type="number" />
              <FormField label="Satisfaction (%)" field="satisfaction" type="number" />
            </div>
            <FormField label="Statut" field="statut" />
          </div>
        </Modal>
      )}

      {/* MODAL CONFIRMATION SUPPRESSION */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="glass border border-rose-500/30 rounded-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="font-display font-bold text-white text-lg mb-2">Confirmer la suppression</h3>
            <p className="text-white/40 text-sm mb-5">Cette action est irréversible. L'agence sera définitivement supprimée.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 glass border border-white/10 text-white/60 hover:text-white text-sm font-display py-2.5 rounded-xl transition-all">Annuler</button>
              <button onClick={() => deleteAgence(confirmDelete)} className="flex-1 bg-rose-500 text-white font-display font-bold text-sm py-2.5 rounded-xl hover:bg-rose-400 transition-all">Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* LISTE AGENCES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agences.map((a) => (
          <div key={a.id} className={`card hover:shadow-lg transition-all ${a.statut === "Maintenance" ? "opacity-70" : ""}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/15 rounded-xl flex items-center justify-center text-2xl">🏦</div>
              <span className={`text-xs font-display font-bold px-2.5 py-1 rounded-full ${a.statut === "Ouverte" ? "badge-green" : "badge-yellow"}`}>{a.statut}</span>
            </div>
            <h3 className="font-display font-bold text-white text-base mb-1">{a.name}</h3>
            <p className="text-white/30 text-xs mb-4">📍 {a.adresse}</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[["Agents", a.agents], ["Guichets", a.guichets], ["Clients/mois", a.clients], ["Satisfaction", `${a.satisfaction}%`]].map(([l, v], i) => (
                <div key={i} className="p-2 rounded-lg bg-white/5 text-center">
                  <div className="font-display font-bold text-white text-sm">{v}</div>
                  <div className="text-white/30 text-xs">{l}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => openModifier(a)} className="flex-1 glass border border-white/10 text-white/60 hover:text-white text-xs font-display py-2 rounded-lg transition-all">✏️ Modifier</button>
              <button onClick={() => openStats(a)} className="flex-1 glass border border-white/10 text-white/60 hover:text-yellow-400 text-xs font-display py-2 rounded-lg transition-all">📊 Stats</button>
            </div>
          </div>
        ))}

        {/* AJOUTER */}
        <div onClick={openAjouter} className="glass border border-dashed border-white/15 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-yellow-500/40 transition-all group min-h-64">
          <div className="w-12 h-12 bg-white/5 group-hover:bg-yellow-500/15 rounded-xl flex items-center justify-center text-2xl transition-all">+</div>
          <span className="text-white/30 group-hover:text-yellow-400 text-sm font-display font-bold transition-colors">Ajouter une agence</span>
        </div>
      </div>

    </PageLayout>
  );
};

export default Agencies;