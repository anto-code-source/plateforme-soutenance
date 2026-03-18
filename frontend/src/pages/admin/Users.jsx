import { useState } from "react";
import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/admin/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/admin/users", icon: "👥", label: "Utilisateurs" },
  { path: "/admin/agencies", icon: "🏦", label: "Agences" },
  { path: "/admin/settings", icon: "⚙️", label: "Paramètres" },
  { path: "/admin/logs", icon: "📋", label: "Logs & Audit" },
];

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Jean Akpovi", email: "jean@email.com", role: "client", agence: "BankFlow Cotonou — Bénin", statut: "Actif" },
    { id: 2, name: "Moussa Traoré", email: "moussa@bankflow.com", role: "agent", agence: "BankFlow Abidjan — Côte d'Ivoire", statut: "Actif" },
    { id: 3, name: "Fatou Diallo", email: "fatou@bankflow.com", role: "manager", agence: "BankFlow Dakar — Sénégal", statut: "Actif" },
    { id: 4, name: "Awa Coulibaly", email: "awa@bankflow.com", role: "directeur", agence: "Siège", statut: "Actif" },
    { id: 5, name: "Kofi Mensah", email: "kofi@email.com", role: "client", agence: "BankFlow Accra — Ghana", statut: "Inactif" },
  ]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", role: "client",
    agence: "BankFlow Abidjan — Côte d'Ivoire", password: ""
  });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [savedUser, setSavedUser] = useState(null);

  const agencesList = [
    "BankFlow Abidjan — Côte d'Ivoire",
    "BankFlow Dakar — Sénégal",
    "BankFlow Bamako — Mali",
    "BankFlow Lomé — Togo",
    "BankFlow Cotonou — Bénin",
    "BankFlow Ouagadougou — Burkina Faso",
    "BankFlow Accra — Ghana",
    "BankFlow Lagos — Nigeria",
    "BankFlow Nairobi — Kenya",
    "BankFlow Casablanca — Maroc",
    "Siège",
  ];

  const selectStyle = { backgroundColor: "#0F1629", color: "white", colorScheme: "dark" };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!form.name || !form.email) return;
    if (!editUser && !form.password) return;
    if (editUser) {
      setUsers(users.map(u => u.id === editUser.id ? { ...u, ...form } : u));
    } else {
      const newUser = { id: Date.now(), ...form, statut: "Actif" };
      setUsers(prev => [...prev, newUser]);
      if (form.role === "client") setSavedUser(newUser);
    }
    setForm({ name: "", email: "", role: "client", agence: "BankFlow Abidjan — Côte d'Ivoire", password: "" });
    setShowForm(false);
    setEditUser(null);
  };

  const roleColors = {
    client: "badge-green",
    agent: "badge-yellow",
    manager: "bg-rose-500/20 text-rose-400",
    directeur: "bg-teal-500/20 text-teal-400",
    admin: "bg-yellow-500/20 text-yellow-400",
  };

  return (
    <PageLayout links={links} title="Gestion des Utilisateurs" subtitle={`${users.length} utilisateurs enregistrés`}>

      {/* MODAL INFO CLIENT CRÉÉ */}
      {savedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setSavedUser(null)}>
          <div className="glass border border-teal-500/30 rounded-2xl p-6 max-w-sm w-full mx-4"
            onClick={e => e.stopPropagation()}>
            <div className="text-4xl mb-3 text-center">✅</div>
            <h3 className="font-display font-bold text-white text-lg text-center mb-1">
              Compte créé avec succès !
            </h3>
            <p className="text-white/40 text-xs text-center mb-5">
              Voici les identifiants à communiquer au client.
            </p>
            <div className="glass border border-white/10 rounded-xl p-4 mb-4 space-y-2">
              {[
                ["Nom", savedUser.name],
                ["Email", savedUser.email],
                ["Agence", savedUser.agence],
                ["Mot de passe", savedUser.password],
              ].map(([l, v], i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-white/40">{l}</span>
                  <span className={`font-display font-bold ${l === "Mot de passe" ? "text-yellow-400" : "text-white"}`}>{v}</span>
                </div>
              ))}
            </div>
            <div className="glass border border-yellow-500/20 rounded-xl p-3 mb-5 flex items-start gap-2">
              <span className="text-yellow-400 text-sm flex-shrink-0">ℹ</span>
              <p className="text-white/50 text-xs leading-relaxed">
                Veuillez communiquer ces identifiants au client en agence. Il pourra se connecter immédiatement avec ces accès.
              </p>
            </div>
            <button onClick={() => setSavedUser(null)}
              className="w-full bg-yellow-500 text-black font-display font-bold py-2.5 rounded-xl hover:bg-yellow-400 transition-all">
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* BARRE RECHERCHE + BOUTON */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <input type="text" placeholder="Rechercher..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field max-w-sm" />
        <button onClick={() => {
          setShowForm(!showForm);
          setEditUser(null);
          setForm({ name: "", email: "", role: "client", agence: "BankFlow Abidjan — Côte d'Ivoire", password: "" });
        }}
          className="bg-yellow-500 text-black font-display font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-400 transition-all">
          + Ajouter
        </button>
      </div>

      {/* FORMULAIRE */}
      {showForm && (
        <div className="card border border-yellow-500/20 mb-6">
          <h3 className="font-display font-bold text-white mb-4">
            {editUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-white/40 text-xs mb-1">Nom complet</label>
              <input type="text" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="input-field" placeholder="Nom Prénom" />
            </div>
            <div>
              <label className="block text-white/40 text-xs mb-1">Email</label>
              <input type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field" placeholder="email@exemple.com" />
            </div>
            <div>
              <label className="block text-white/40 text-xs mb-1">Rôle</label>
              <select value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className="input-field" style={selectStyle}>
                {["client", "agent", "manager", "directeur", "admin"].map(r => (
                  <option key={r} value={r} style={{ backgroundColor: "#0F1629", color: "white" }}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white/40 text-xs mb-1">Agence</label>
              <select value={form.agence}
                onChange={e => setForm({ ...form, agence: e.target.value })}
                className="input-field" style={selectStyle}>
                {agencesList.map(a => (
                  <option key={a} value={a} style={{ backgroundColor: "#0F1629", color: "white" }}>{a}</option>
                ))}
              </select>
            </div>

            {/* CHAMP MOT DE PASSE — UNIQUEMENT À LA CRÉATION */}
            {!editUser && (
              <div className="col-span-2">
                <label className="block text-white/40 text-xs mb-1">
                  Mot de passe <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="input-field pr-12"
                    placeholder="Créer un mot de passe sécurisé" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-sm">
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {/* INDICATEUR FORCE MOT DE PASSE */}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`flex-1 h-1 rounded-full transition-all ${
                          form.password.length >= i * 3
                            ? i <= 1 ? "bg-rose-500"
                            : i <= 2 ? "bg-yellow-500"
                            : i <= 3 ? "bg-teal-500"
                            : "bg-teal-400"
                            : "bg-white/10"
                        }`} />
                      ))}
                    </div>
                    <p className={`text-xs ${
                      form.password.length < 4 ? "text-rose-400" :
                      form.password.length < 7 ? "text-yellow-400" :
                      "text-teal-400"
                    }`}>
                      {form.password.length < 4 ? "Mot de passe trop court" :
                       form.password.length < 7 ? "Mot de passe faible" :
                       form.password.length < 10 ? "Mot de passe correct" :
                       "Mot de passe fort ✓"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MESSAGE INFO SI RÔLE CLIENT */}
          {form.role === "client" && !editUser && (
            <div className="glass border border-yellow-500/20 rounded-xl p-3 mb-4 flex items-start gap-2">
              <span className="text-yellow-400 text-sm flex-shrink-0">ℹ</span>
              <p className="text-white/50 text-xs leading-relaxed">
                Un compte client va être créé. Définissez un mot de passe sécurisé à communiquer au client en agence.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={handleSave}
              disabled={!form.name || !form.email || (!editUser && !form.password)}
              className="bg-yellow-500 text-black font-display font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-40">
              {editUser ? "Enregistrer" : "Ajouter"}
            </button>
            <button onClick={() => { setShowForm(false); setEditUser(null); }}
              className="btn-ghost">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* LISTE UTILISATEURS */}
      <div className="card">
        <div className="space-y-2">
          {filtered.map((u) => (
            <div key={u.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white font-display font-bold text-sm">
                  {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="font-display font-bold text-white text-sm">{u.name}</div>
                  <div className="text-white/30 text-xs">{u.email} · {u.agence}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-display font-bold px-2.5 py-1 rounded-full ${roleColors[u.role] || "badge-yellow"}`}>
                  {u.role}
                </span>
                <span className={`text-xs font-display font-bold px-2.5 py-1 rounded-full ${u.statut === "Actif" ? "badge-green" : "bg-white/10 text-white/40"}`}>
                  {u.statut}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => {
                    setEditUser(u);
                    setForm({ name: u.name, email: u.email, role: u.role, agence: u.agence, password: "" });
                    setShowForm(true);
                  }}
                    className="w-8 h-8 glass border border-white/10 rounded-lg flex items-center justify-center text-white/50 hover:text-yellow-400 transition-all text-xs">
                    ✏️
                  </button>
                  <button onClick={() => setConfirmDelete(u.id)}
                    className="w-8 h-8 glass border border-white/10 rounded-lg flex items-center justify-center text-white/50 hover:text-rose-400 transition-all text-xs">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-white/30 text-sm text-center py-8">
              Aucun utilisateur trouvé
            </div>
          )}
        </div>
      </div>

      {/* MODAL SUPPRESSION */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setConfirmDelete(null)}>
          <div className="glass border border-rose-500/30 rounded-2xl p-6 max-w-sm w-full mx-4"
            onClick={e => e.stopPropagation()}>
            <div className="text-3xl mb-3">🗑️</div>
            <h3 className="font-display font-bold text-white mb-2">Supprimer l'utilisateur ?</h3>
            <p className="text-white/40 text-sm mb-5">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => {
                setUsers(users.filter(u => u.id !== confirmDelete));
                setConfirmDelete(null);
              }}
                className="flex-1 bg-rose-500 text-white font-display font-bold py-2.5 rounded-xl hover:bg-rose-400 transition-all">
                Supprimer
              </button>
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 btn-ghost">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

    </PageLayout>
  );
};

export default Users;