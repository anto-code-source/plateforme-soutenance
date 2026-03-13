import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/client/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/client/appointment", icon: "📅", label: "Rendez-vous" },
  { path: "/client/ticket", icon: "🎫", label: "Mon Ticket" },
  { path: "/client/queue", icon: "👥", label: "File d'attente" },
  { path: "/client/profile", icon: "👤", label: "Mon Profil" },
];

const ticketsHistory = [
  { id: "A-047", service: "Virement international", date: "15 Jan 2025", statut: "Terminé" },
  { id: "A-041", service: "Relevé de compte", date: "10 Jan 2025", statut: "Terminé" },
  { id: "A-035", service: "Carte bancaire", date: "02 Jan 2025", statut: "Terminé" },
  { id: "A-028", service: "Ouverture de compte", date: "15 Déc 2024", statut: "Terminé" },
];

const rdvHistory = [
  { ref: "RDV-A3K9X", service: "Demande de crédit", date: "20 Jan 2025", heure: "10:00", statut: "À venir" },
  { ref: "RDV-B7Z2W", service: "Virement international", date: "15 Jan 2025", heure: "09:15", statut: "Terminé" },
  { ref: "RDV-C1P4Q", service: "Carte bancaire", date: "05 Jan 2025", heure: "14:30", statut: "Annulé" },
];

const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("infos");
  const [avatar, setAvatar] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [rdvs, setRdvs] = useState(rdvHistory);
  const [cancelDone, setCancelDone] = useState(false);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    nom: user?.name || "Jean Akpovi",
    telephone: "+225 07 00 00 00",
    email: user?.email || "client@bank.com",
    adresse: "Cocody, Abidjan",
    agence: "BankFlow Abidjan",
    dateNaissance: "1990-05-14",
  });

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = (ref) => {
    setRdvs(rdvs.map(r => r.ref === ref ? { ...r, statut: "Annulé" } : r));
    setCancelConfirm(null);
    setCancelDone(true);
    setTimeout(() => setCancelDone(false), 3000);
  };

  const tabs = [
    { key: "infos", label: "Informations", icon: "👤" },
    { key: "tickets", label: "Mes Tickets", icon: "🎫" },
    { key: "rdv", label: "Mes Rendez-vous", icon: "📅" },
    { key: "securite", label: "Sécurité", icon: "🔒" },
  ];

  return (
    <PageLayout links={links} title="Mon Profil" subtitle="Gérez vos informations personnelles">
      <div className="max-w-2xl">

        {/* MESSAGES */}
        {saved && (
          <div className="bg-teal-500/15 border border-teal-500/30 rounded-xl p-3 mb-6 flex items-center gap-2">
            <span className="text-teal-400 text-sm">✓ Informations mises à jour avec succès</span>
          </div>
        )}
        {cancelDone && (
          <div className="bg-rose-500/15 border border-rose-500/30 rounded-xl p-3 mb-6 flex items-center gap-2">
            <span className="text-rose-400 text-sm">✓ Rendez-vous annulé avec succès</span>
          </div>
        )}

        {/* MODAL CONFIRMATION ANNULATION */}
        {cancelConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass border border-rose-500/30 rounded-2xl p-6 w-full max-w-sm mx-4">
              <div className="text-3xl mb-3 text-center">❌</div>
              <h3 className="font-display font-bold text-white text-lg text-center mb-2">Annuler ce rendez-vous ?</h3>
              <p className="text-white/40 text-sm text-center mb-5">
                Réf : <span className="text-white font-bold">{cancelConfirm}</span><br />
                Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setCancelConfirm(null)}
                  className="flex-1 glass border border-white/10 text-white/60 hover:text-white font-display py-2.5 rounded-xl transition-all">
                  Garder
                </button>
                <button onClick={() => handleCancel(cancelConfirm)}
                  className="flex-1 bg-rose-500 text-white font-display font-bold py-2.5 rounded-xl hover:bg-rose-400 transition-all">
                  Annuler le RDV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CARTE PROFIL */}
        <div className="card mb-6">
          <div className="flex items-center gap-6">
            {/* AVATAR AVEC UPLOAD */}
            <div className="relative group cursor-pointer" onClick={() => fileRef.current.click()}>
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-teal-500 rounded-2xl flex items-center justify-center text-black font-display font-bold text-2xl overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.avatar || "JA"
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                <span className="text-white text-xs font-display font-bold">📷</span>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            <div className="flex-1">
              <h2 className="font-display font-bold text-white text-xl">{form.nom}</h2>
              <p className="text-white/40 text-sm">Client · {form.agence}</p>
              <p className="text-white/20 text-xs mt-0.5">{form.email}</p>
              <div className="mt-2 flex gap-2">
                <span className="badge-green">Compte vérifié</span>
                <span className="bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 text-xs font-display font-bold px-2.5 py-1 rounded-full">
                  Client depuis 14 mois
                </span>
              </div>
            </div>
            <button onClick={() => setEditing(!editing)}
              className="glass border border-white/15 text-white text-sm px-4 py-2 rounded-xl hover:border-yellow-500/40 hover:text-yellow-400 transition-all">
              {editing ? "Annuler" : "✏️ Modifier"}
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Rendez-vous", value: rdvs.length, icon: "📅" },
            { label: "Tickets générés", value: ticketsHistory.length, icon: "🎫" },
            { label: "Mois d'ancienneté", value: "14", icon: "⭐" },
          ].map((s, i) => (
            <div key={i} className="stat-card text-center">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="font-display font-bold text-2xl text-white">{s.value}</div>
              <div className="text-white/30 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-xl text-xs font-display font-bold transition-all flex items-center gap-1.5
                ${activeTab === t.key ? "bg-yellow-500 text-black" : "glass border border-white/10 text-white/60 hover:text-white"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* TAB — INFORMATIONS */}
        {activeTab === "infos" && (
          <div className="card">
            <h3 className="font-display font-bold text-white mb-6">Informations personnelles</h3>
            <div className="space-y-4">
              {[
                { label: "Nom complet", key: "nom", type: "text" },
                { label: "Téléphone", key: "telephone", type: "tel" },
                { label: "Email", key: "email", type: "email" },
                { label: "Adresse", key: "adresse", type: "text" },
                { label: "Agence", key: "agence", type: "text" },
                { label: "Date de naissance", key: "dateNaissance", type: "date" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-white/40 text-xs font-body mb-1">{f.label}</label>
                  {editing ? (
                    <input type={f.type} value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      className="input-field" style={f.type === "date" ? { colorScheme: "dark" } : {}} />
                  ) : (
                    <div className="px-4 py-3 rounded-xl bg-white/4 border border-white/6 text-white text-sm">{form[f.key]}</div>
                  )}
                </div>
              ))}
            </div>
            {editing && (
              <button onClick={handleSave}
                className="mt-6 w-full bg-yellow-500 text-black font-display font-bold py-3 rounded-xl hover:bg-yellow-400 transition-all">
                Enregistrer ✓
              </button>
            )}
          </div>
        )}

        {/* TAB — TICKETS */}
        {activeTab === "tickets" && (
          <div className="card">
            <h3 className="font-display font-bold text-white mb-5">Historique des tickets</h3>
            <div className="space-y-3">
              {ticketsHistory.map((t, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-500/15 rounded-xl flex items-center justify-center text-teal-400 font-display font-bold text-xs">✓</div>
                    <div>
                      <div className="font-display font-bold text-white text-sm">{t.service}</div>
                      <div className="text-white/30 text-xs">{t.id} · {t.date}</div>
                    </div>
                  </div>
                  <span className="badge-green text-xs">{t.statut}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB — RENDEZ-VOUS */}
        {activeTab === "rdv" && (
          <div className="card">
            <h3 className="font-display font-bold text-white mb-5">Mes Rendez-vous</h3>
            <div className="space-y-3">
              {rdvs.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg
                      ${r.statut === "À venir" ? "bg-yellow-500/15" : r.statut === "Terminé" ? "bg-teal-500/15" : "bg-rose-500/15"}`}>
                      {r.statut === "À venir" ? "📅" : r.statut === "Terminé" ? "✅" : "❌"}
                    </div>
                    <div>
                      <div className="font-display font-bold text-white text-sm">{r.service}</div>
                      <div className="text-white/30 text-xs">{r.ref} · {r.date} à {r.heure}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-display font-bold px-2.5 py-1 rounded-full
                      ${r.statut === "À venir" ? "badge-yellow" : r.statut === "Terminé" ? "badge-green" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"}`}>
                      {r.statut}
                    </span>
                    {r.statut === "À venir" && (
                      <button onClick={() => setCancelConfirm(r.ref)}
                        className="glass border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-display px-3 py-1.5 rounded-lg transition-all">
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB — SÉCURITÉ */}
        {activeTab === "securite" && (
          <div className="card">
            <h3 className="font-display font-bold text-white mb-6">Sécurité du compte</h3>
            <div className="space-y-4 mb-6">
              {[
                { label: "Mot de passe actuel", type: "password", placeholder: "••••••••" },
                { label: "Nouveau mot de passe", type: "password", placeholder: "••••••••" },
                { label: "Confirmer le mot de passe", type: "password", placeholder: "••••••••" },
              ].map((f, i) => (
                <div key={i}>
                  <label className="block text-white/40 text-xs mb-1">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} className="input-field" />
                </div>
              ))}
            </div>
            <button className="w-full bg-yellow-500 text-black font-display font-bold py-3 rounded-xl hover:bg-yellow-400 transition-all">
              Mettre à jour le mot de passe
            </button>
            <div className="mt-4 glass border border-teal-500/20 rounded-xl p-4 flex items-start gap-3">
              <span className="text-teal-400">🔒</span>
              <div>
                <div className="text-teal-400 font-display font-bold text-xs mb-1">Compte sécurisé</div>
                <p className="text-white/30 text-xs leading-relaxed">
                  Votre compte est protégé. Dernière connexion : aujourd'hui à 09:15 depuis Abidjan.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </PageLayout>
  );
};

export default Profile;