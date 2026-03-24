import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const redirectMap = {
    client: "/client/dashboard", agent: "/agent/dashboard",
    manager: "/manager/dashboard", directeur: "/directeur/dashboard", admin: "/admin/dashboard",
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError("Veuillez remplir tous les champs."); return; }
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 800));
    const result = login(form);
    if (result.success) navigate(redirectMap[result.role]);
    else setError("Email ou mot de passe incorrect.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-500/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/6 rounded-full blur-3xl" />
      </div>

      {/* ── PANNEAU GAUCHE ── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative z-10 border-r border-white/5">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
            <span className="text-black font-display font-bold">BF</span>
          </div>
          <span className="font-display font-bold text-white text-xl">BankFlow</span>
        </div>
        <div>
          <div className="text-6xl mb-6 animate-float">🏦</div>
          <h2 className="font-display font-bold text-4xl text-white mb-4 leading-tight">
            Bienvenue sur<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-teal-400">
              votre espace
            </span>
          </h2>
          <p className="text-white/40 text-base leading-relaxed mb-8">
            Connectez-vous pour accéder à votre tableau de bord personnalisé selon votre rôle.
          </p>
          <div className="space-y-2">
            {[
              { role: "Client",    desc: "Rendez-vous & tickets virtuels", icon: "👤" },
              { role: "Agent",     desc: "Gestion des tâches clients",      icon: "🧑‍💼" },
              { role: "Manager",   desc: "Supervision & répartition",       icon: "👔" },
              { role: "Directeur", desc: "KPIs & analyse prédictive",       icon: "📊" },
              { role: "Admin",     desc: "Configuration système",           icon: "⚙️" },
            ].map((u, i) => (
              <div key={i} className="flex items-center gap-3 text-white/40 text-sm">
                <span>{u.icon}</span>
                <span className="font-display font-bold text-white/60">{u.role}</span>
                <span>—</span>
                <span>{u.desc}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/20 text-xs">© 2025 BankFlow. Tous droits réservés.</p>
      </div>

      {/* ── PANNEAU DROIT ── */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="glass rounded-3xl p-8 border border-white/10">
            <h1 className="font-display font-bold text-2xl text-white mb-1">Connexion</h1>
            <p className="text-white/40 text-sm mb-8">Entrez vos identifiants pour continuer</p>

            {error && (
              <div className="bg-rose-500/15 border border-rose-500/30 rounded-xl p-3 mb-6 flex items-center gap-2">
                <span className="text-rose-400 text-sm">⚠ {error}</span>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white/50 text-xs font-display font-bold mb-2 uppercase tracking-wider">
                  Email
                </label>
                <input type="email" placeholder="exemple@bankflow.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  className="input-field" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-white/50 text-xs font-display font-bold uppercase tracking-wider">
                    Mot de passe
                  </label>
                  <button className="text-yellow-400/70 text-xs font-display hover:text-yellow-400 transition-colors">
                    Mot de passe oublié ?
                  </button>
                </div>
                <input type="password" placeholder="••••••••" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  className="input-field" />
              </div>
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="w-full bg-yellow-500 text-black font-display font-bold py-4 rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-60 text-base">
              {loading ? "Connexion en cours..." : "Se connecter →"}
            </button>

            {/* ── Lien inscription client ── */}
            <div className="mt-4 text-center">
              <p className="text-white/30 text-sm">
                Nouveau client ?{" "}
                <button onClick={() => navigate("/register")}
                  className="text-yellow-400 font-display font-bold hover:text-yellow-300 transition-colors">
                  Créer un compte →
                </button>
              </p>
            </div>

            {/* ── Comptes démo ── */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/30 text-xs text-center mb-3">Comptes de démonstration</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { email: "client@bank.com",    role: "Client",      color: "text-teal-400"   },
                  { email: "agent@bank.com",      role: "Agent A1 — Moussa",  color: "text-yellow-400" },
                  { email: "agent2@bank.com",     role: "Agent A2 — Koffi",   color: "text-yellow-400" },
                  { email: "agent3@bank.com",     role: "Agent A3 — Marie",   color: "text-yellow-400" },
                  { email: "agent4@bank.com",     role: "Agent A4 — Segun",   color: "text-yellow-400" },
                  { email: "manager@bank.com",    role: "Manager",     color: "text-rose-400"   },
                  { email: "directeur@bank.com",  role: "Directeur",   color: "text-teal-400"   },
                  { email: "admin@bank.com",      role: "Admin",       color: "text-yellow-400" },
                ].map((u, i) => (
                  <button key={i} onClick={() => setForm({ email: u.email, password: "password123" })}
                    className="glass border border-white/10 rounded-lg p-2 text-left hover:border-white/20 transition-all">
                    <div className={`text-xs font-display font-bold ${u.color}`}>{u.role}</div>
                    <div className="text-white/30 text-xs truncate">{u.email}</div>
                  </button>
                ))}
              </div>

              {/* ── Accès inscription ── */}
              <div className="mt-3 pt-3 border-t border-white/5">
                <button onClick={() => navigate("/register")}
                  className="w-full glass border border-yellow-500/20 rounded-lg p-2.5 hover:border-yellow-500/40 transition-all group">
                  <div className="text-xs font-display font-bold text-yellow-400/70 group-hover:text-yellow-400">
                    ✨ Nouveau client — Créer un compte
                  </div>
                  <div className="text-white/20 text-xs">/register</div>
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-white/20 text-xs mt-4 cursor-pointer hover:text-white/40 transition-colors"
            onClick={() => navigate("/")}>
            ← Retour à l'accueil
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;