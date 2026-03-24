import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const STEPS = [
  { id: 1, label: "Identité", icon: "👤" },
  { id: 2, label: "Contact",  icon: "📱" },
  { id: 3, label: "Sécurité", icon: "🔐" },
];

const InputField = ({ label, type = "text", placeholder, value, onChange, icon, error, hint }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-white/50 text-xs font-display font-bold uppercase tracking-wider">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">{icon}</span>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        className={`input-field w-full ${icon ? "pl-10" : ""} ${error ? "border-rose-500/50" : ""}`}
        onFocus={e  => e.target.classList.add("border-yellow-500/50")}
        onBlur={e   => e.target.classList.remove("border-yellow-500/50")}
      />
    </div>
    {error && <span className="text-rose-400 text-xs font-semibold">⚠ {error}</span>}
    {hint && !error && <span className="text-white/25 text-xs">{hint}</span>}
  </div>
);

export default function Register() {
  const navigate    = useNavigate();
  const { register } = useAuth();

  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPwd, setShowPwd]   = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const [form, setForm] = useState({
    prenom:"", nom:"", dateNaissance:"", genre:"",
    email:"", telephone:"", adresse:"", ville:"",
    password:"", confirmPassword:"", acceptCGU: false,
  });
  const [errors, setErrors] = useState({});

  const set = (key, val) => { setForm(p => ({ ...p, [key]: val })); setErrors(p => ({ ...p, [key]: "" })); };

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!form.prenom.trim())   e.prenom       = "Prénom requis";
      if (!form.nom.trim())      e.nom          = "Nom requis";
      if (!form.dateNaissance)   e.dateNaissance = "Date de naissance requise";
      if (!form.genre)           e.genre        = "Veuillez sélectionner votre genre";
    }
    if (step === 2) {
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email     = "Email invalide";
      if (!form.telephone.match(/^[0-9+\s]{8,15}$/))       e.telephone = "Numéro invalide";
      if (!form.adresse.trim()) e.adresse = "Adresse requise";
      if (!form.ville.trim())   e.ville   = "Ville requise";
    }
    if (step === 3) {
      if (form.password.length < 8)                        e.password        = "Minimum 8 caractères";
      if (form.password !== form.confirmPassword)          e.confirmPassword = "Les mots de passe ne correspondent pas";
      if (!form.acceptCGU)                                 e.acceptCGU       = "Vous devez accepter les CGU";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validateStep()) setStep(s => s + 1); };
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = () => {
    if (!validateStep()) return;
    setLoading(true);
    setTimeout(() => {
      const result = register({
        prenom: form.prenom, nom: form.nom,
        email: form.email,   password: form.password,
        telephone: form.telephone, adresse: form.adresse, ville: form.ville,
      });
      setLoading(false);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 2200);
      } else {
        setErrors({ email: result.message });
        setStep(2);
      }
    }, 1500);
  };

  const pwdStrength = () => {
    const p = form.password; if (!p) return 0;
    let s = 0;
    if (p.length >= 8)           s++;
    if (/[A-Z]/.test(p))         s++;
    if (/[0-9]/.test(p))         s++;
    if (/[^A-Za-z0-9]/.test(p))  s++;
    return s;
  };
  const strength = pwdStrength();
  const strengthColor = ["","text-rose-400","text-yellow-400","text-orange-400","text-teal-400"][strength];
  const strengthLabel = ["","Faible","Moyen","Bon","Fort"][strength];
  const strengthBarColor = ["","bg-rose-400","bg-yellow-400","bg-orange-400","bg-teal-400"][strength];

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
          <div className="text-6xl mb-6">✨</div>
          <h2 className="font-display font-bold text-4xl text-white mb-4 leading-tight">
            Rejoignez<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-teal-400">
              BankFlow
            </span>
          </h2>
          <p className="text-white/40 text-base leading-relaxed mb-8">
            Créez votre compte client en quelques minutes et accédez à tous nos services bancaires en ligne.
          </p>
          <div className="space-y-3">
            {[
              { icon:"🎫", text:"Prise de rendez-vous en ligne"       },
              { icon:"📋", text:"Suivi de vos demandes en temps réel" },
              { icon:"🔔", text:"Notifications et alertes personnalisées" },
              { icon:"🔒", text:"Sécurité et confidentialité garanties" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-white/50 text-sm">
                <span>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/20 text-xs">© 2025 BankFlow. Tous droits réservés.</p>
      </div>

      {/* ── PANNEAU DROIT ── */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="flex lg:hidden items-center gap-3 justify-center mb-8">
            <div className="w-9 h-9 bg-yellow-500 rounded-xl flex items-center justify-center">
              <span className="text-black font-display font-bold text-sm">BF</span>
            </div>
            <span className="font-display font-bold text-white text-lg">BankFlow</span>
          </div>

          <div className="glass rounded-3xl p-8 border border-white/10">

            {/* Succès */}
            {success ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="font-display font-bold text-2xl text-white mb-2">Compte créé !</h2>
                <p className="text-white/40 text-sm mb-6">
                  Bienvenue sur BankFlow, {form.prenom} !<br />Redirection vers la connexion…
                </p>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div className="bg-yellow-500 h-1.5 rounded-full animate-pulse" style={{ width:"70%" }}/>
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-display font-bold text-2xl text-white mb-1">Créer un compte</h1>
                <p className="text-white/40 text-sm mb-6">Inscription réservée aux clients</p>

                {/* Stepper */}
                <div className="flex items-center mb-8">
                  {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center" style={{ flex: i < STEPS.length - 1 ? 1 : "none" }}>
                      <div className="flex flex-col items-center gap-1">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold transition-all
                          ${step > s.id  ? "bg-teal-500 border-2 border-teal-500 text-white"
                          : step === s.id ? "bg-yellow-500/20 border-2 border-yellow-500/60 text-yellow-400"
                          :                "bg-white/5 border-2 border-white/10 text-white/30"}`}>
                          {step > s.id ? "✓" : s.icon}
                        </div>
                        <span className={`text-xs font-display font-bold uppercase tracking-wider
                          ${step >= s.id ? "text-white/60" : "text-white/20"}`}>{s.label}</span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all
                          ${step > s.id ? "bg-teal-500" : "bg-white/10"}`}/>
                      )}
                    </div>
                  ))}
                </div>

                {/* ── ÉTAPE 1 ── */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="mb-2">
                      <p className="font-display font-bold text-white text-base">👤 Informations personnelles</p>
                      <p className="text-white/30 text-xs mt-1">Étape 1 sur 3</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <InputField label="Prénom" placeholder="Jean" value={form.prenom}
                        onChange={e => set("prenom", e.target.value)} icon="✏️" error={errors.prenom}/>
                      <InputField label="Nom" placeholder="Akpovi" value={form.nom}
                        onChange={e => set("nom", e.target.value)} icon="✏️" error={errors.nom}/>
                    </div>
                    <InputField label="Date de naissance" type="date" value={form.dateNaissance}
                      onChange={e => set("dateNaissance", e.target.value)} icon="📅" error={errors.dateNaissance}/>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/50 text-xs font-display font-bold uppercase tracking-wider">Genre</label>
                      <div className="flex gap-2">
                        {["Homme","Femme","Autre"].map(g => (
                          <button key={g} onClick={() => set("genre", g)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-display font-bold transition-all
                              ${form.genre === g
                                ? "bg-yellow-500/15 border border-yellow-500/40 text-yellow-400"
                                : "glass border border-white/10 text-white/40 hover:text-white"}`}>
                            {g}
                          </button>
                        ))}
                      </div>
                      {errors.genre && <span className="text-rose-400 text-xs font-semibold">⚠ {errors.genre}</span>}
                    </div>
                  </div>
                )}

                {/* ── ÉTAPE 2 ── */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="mb-2">
                      <p className="font-display font-bold text-white text-base">📱 Coordonnées</p>
                      <p className="text-white/30 text-xs mt-1">Étape 2 sur 3</p>
                    </div>
                    <InputField label="Adresse email" type="email" placeholder="jean.akpovi@email.com"
                      value={form.email} onChange={e => set("email", e.target.value)}
                      icon="📧" error={errors.email}/>
                    <InputField label="Téléphone" placeholder="+229 97 00 00 00"
                      value={form.telephone} onChange={e => set("telephone", e.target.value)}
                      icon="📞" error={errors.telephone} hint="Format international recommandé"/>
                    <InputField label="Adresse" placeholder="123 Rue des Cocotiers"
                      value={form.adresse} onChange={e => set("adresse", e.target.value)}
                      icon="🏠" error={errors.adresse}/>
                    <InputField label="Ville" placeholder="Cotonou"
                      value={form.ville} onChange={e => set("ville", e.target.value)}
                      icon="🌍" error={errors.ville}/>
                  </div>
                )}

                {/* ── ÉTAPE 3 ── */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="mb-2">
                      <p className="font-display font-bold text-white text-base">🔐 Sécurité</p>
                      <p className="text-white/30 text-xs mt-1">Étape 3 sur 3</p>
                    </div>

                    {/* Mot de passe */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/50 text-xs font-display font-bold uppercase tracking-wider">Mot de passe</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">🔒</span>
                        <input type={showPwd ? "text" : "password"} value={form.password}
                          onChange={e => set("password", e.target.value)} placeholder="Minimum 8 caractères"
                          className={`input-field w-full pl-10 pr-10 ${errors.password ? "border-rose-500/50" : ""}`}/>
                        <button onClick={() => setShowPwd(p => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-base">
                          {showPwd ? "🙈" : "👁️"}
                        </button>
                      </div>
                      {form.password && (
                        <div className="space-y-1.5">
                          <div className="flex gap-1">
                            {[1,2,3,4].map(i => (
                              <div key={i} className={`flex-1 h-1 rounded-full transition-all
                                ${i <= strength ? strengthBarColor : "bg-white/10"}`}/>
                            ))}
                          </div>
                          <span className={`text-xs font-bold ${strengthColor}`}>{strengthLabel}</span>
                        </div>
                      )}
                      {errors.password && <span className="text-rose-400 text-xs font-semibold">⚠ {errors.password}</span>}
                    </div>

                    {/* Confirmation */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/50 text-xs font-display font-bold uppercase tracking-wider">
                        Confirmer le mot de passe
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">🔏</span>
                        <input type={showPwd2 ? "text" : "password"} value={form.confirmPassword}
                          onChange={e => set("confirmPassword", e.target.value)} placeholder="Répétez votre mot de passe"
                          className={`input-field w-full pl-10 pr-10
                            ${errors.confirmPassword ? "border-rose-500/50"
                            : form.confirmPassword && form.confirmPassword === form.password ? "border-teal-500/40" : ""}`}/>
                        <button onClick={() => setShowPwd2(p => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-base">
                          {showPwd2 ? "🙈" : "👁️"}
                        </button>
                      </div>
                      {form.confirmPassword && form.confirmPassword === form.password &&
                        <span className="text-teal-400 text-xs font-semibold">✓ Les mots de passe correspondent</span>}
                      {errors.confirmPassword &&
                        <span className="text-rose-400 text-xs font-semibold">⚠ {errors.confirmPassword}</span>}
                    </div>

                    {/* CGU */}
                    <div onClick={() => set("acceptCGU", !form.acceptCGU)}
                      className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all
                        ${form.acceptCGU
                          ? "bg-teal-500/8 border border-teal-500/25"
                          : errors.acceptCGU
                            ? "bg-rose-500/5 border border-rose-500/25"
                            : "glass border border-white/8 hover:border-white/15"}`}>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
                        ${form.acceptCGU ? "bg-teal-500 border-teal-500" : "border-white/20"}`}>
                        {form.acceptCGU && <span className="text-white text-xs font-bold">✓</span>}
                      </div>
                      <span className="text-white/50 text-xs leading-relaxed">
                        J'accepte les{" "}
                        <span className="text-yellow-400 font-bold">Conditions Générales d'Utilisation</span>
                        {" "}et la{" "}
                        <span className="text-yellow-400 font-bold">Politique de Confidentialité</span>
                        {" "}de BankFlow
                      </span>
                    </div>
                    {errors.acceptCGU &&
                      <span className="text-rose-400 text-xs font-semibold">⚠ {errors.acceptCGU}</span>}
                  </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3 mt-6">
                  {step > 1 && (
                    <button onClick={prevStep}
                      className="flex-1 glass border border-white/10 text-white/50 hover:text-white font-display font-bold py-3 rounded-xl transition-all text-sm">
                      ← Retour
                    </button>
                  )}
                  <button onClick={step === 3 ? handleSubmit : nextStep} disabled={loading}
                    className="flex-[2] bg-yellow-500 text-black font-display font-bold py-3 rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-60 text-sm">
                    {loading ? "Création…" : step === 3 ? "✅ Créer mon compte" : "Continuer →"}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Lien login */}
          {!success && (
            <p className="text-center text-white/30 text-sm mt-4">
              Déjà un compte ?{" "}
              <button onClick={() => navigate("/login")}
                className="text-yellow-400 font-display font-bold hover:text-yellow-300 transition-colors">
                Se connecter →
              </button>
            </p>
          )}

          <p className="text-center text-white/20 text-xs mt-3 cursor-pointer hover:text-white/40 transition-colors"
            onClick={() => navigate("/")}>
            ← Retour à l'accueil
          </p>
        </div>
      </div>
    </div>
  );
}