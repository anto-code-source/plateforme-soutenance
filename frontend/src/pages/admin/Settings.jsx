import { useState } from "react";
import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/admin/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/admin/users", icon: "👥", label: "Utilisateurs" },
  { path: "/admin/agencies", icon: "🏦", label: "Agences" },
  { path: "/admin/settings", icon: "⚙️", label: "Paramètres" },
  { path: "/admin/logs", icon: "📋", label: "Logs & Audit" },
];

const Toggle = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)}
    className={`relative w-12 h-6 rounded-full transition-all ${value ? "bg-yellow-500" : "bg-white/15"}`}>
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? "left-7" : "left-1"}`} />
  </button>
);

const Settings = () => {
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("affectation");
  const [resetConfirm, setResetConfirm] = useState(false);
  const [config, setConfig] = useState({
    maxTasksPerAgent: 8,
    maxWaitTime: 45,
    notificationsEnabled: true,
    autoAssign: false,
    predictiveModule: true,
    sessionTimeout: 30,
    langue: "Français",
    timezone: "Africa/Abidjan",
    emailNotif: true,
    smsNotif: false,
    maintenanceMode: false,
    twoFactor: false,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
    nomPlateforme: "BankFlow",
    supportEmail: "support@bankflow.com",
    telephone: "+225 00 00 00 00",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setConfig({
      maxTasksPerAgent: 8, maxWaitTime: 45,
      notificationsEnabled: true, autoAssign: false,
      predictiveModule: true, sessionTimeout: 30,
      langue: "Français", timezone: "Africa/Abidjan",
      emailNotif: true, smsNotif: false,
      maintenanceMode: false, twoFactor: false,
      passwordExpiry: 90, maxLoginAttempts: 5,
      nomPlateforme: "BankFlow", supportEmail: "support@bankflow.com",
      telephone: "+225 00 00 00 00",
    });
    setResetConfirm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { key: "affectation", label: "Affectation", icon: "📋" },
    { key: "fonctionnalites", label: "Fonctionnalités", icon: "⚡" },
    { key: "securite", label: "Sécurité", icon: "🔒" },
    { key: "notifications", label: "Notifications", icon: "🔔" },
    { key: "general", label: "Général", icon: "⚙️" },
  ];

  const selectStyle = { backgroundColor: "#0F1629", color: "white", colorScheme: "dark" };

  return (
    <PageLayout links={links} title="Paramètres Système" subtitle="Configuration globale de la plateforme">

      {/* MODAL RESET */}
      {resetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass border border-rose-500/30 rounded-2xl p-6 w-full max-w-sm mx-4">
            <div className="text-3xl text-center mb-3">⚠️</div>
            <h3 className="font-display font-bold text-white text-lg text-center mb-2">Réinitialiser les paramètres ?</h3>
            <p className="text-white/40 text-sm text-center mb-5">Tous les paramètres seront remis aux valeurs par défaut.</p>
            <div className="flex gap-3">
              <button onClick={() => setResetConfirm(false)}
                className="flex-1 glass border border-white/10 text-white/60 hover:text-white font-display py-2.5 rounded-xl transition-all">
                Annuler
              </button>
              <button onClick={handleReset}
                className="flex-1 bg-rose-500 text-white font-display font-bold py-2.5 rounded-xl hover:bg-rose-400 transition-all">
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MESSAGE SUCCÈS */}
      {saved && (
        <div className="bg-teal-500/20 border border-teal-500/30 rounded-xl p-3 mb-6 flex items-center gap-2">
          <span className="text-teal-400 text-sm">✓ Paramètres enregistrés avec succès</span>
        </div>
      )}

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

      <div className="max-w-2xl space-y-6">

        {/* TAB AFFECTATION */}
        {activeTab === "affectation" && (
          <div className="card">
            <h3 className="font-display font-bold text-white mb-5">📋 Règles d'affectation</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-white/50 text-xs mb-2">
                  Nombre max de tâches par agent : <span className="text-yellow-400 font-bold">{config.maxTasksPerAgent}</span>
                </label>
                <input type="range" min={4} max={15} value={config.maxTasksPerAgent}
                  onChange={e => setConfig({ ...config, maxTasksPerAgent: +e.target.value })}
                  className="w-full accent-yellow-400" />
                <div className="flex justify-between text-white/20 text-xs mt-1"><span>4</span><span>15</span></div>
              </div>
              <div>
                <label className="block text-white/50 text-xs mb-2">
                  Temps d'attente max avant alerte (min) : <span className="text-yellow-400 font-bold">{config.maxWaitTime}</span>
                </label>
                <input type="range" min={10} max={90} value={config.maxWaitTime}
                  onChange={e => setConfig({ ...config, maxWaitTime: +e.target.value })}
                  className="w-full accent-yellow-400" />
                <div className="flex justify-between text-white/20 text-xs mt-1"><span>10 min</span><span>90 min</span></div>
              </div>
              <div className="glass border border-white/10 rounded-xl p-4">
                <label className="block text-white/50 text-xs mb-2">Mode d'assignation des tâches</label>
                <select value={config.autoAssign ? "auto" : "manuel"}
                  onChange={e => setConfig({ ...config, autoAssign: e.target.value === "auto" })}
                  className="input-field" style={selectStyle}>
                  <option value="manuel" style={{ backgroundColor: "#0F1629" }}>Manuel — Le manager assigne</option>
                  <option value="auto" style={{ backgroundColor: "#0F1629" }}>Automatique — L'IA assigne</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB FONCTIONNALITÉS */}
        {activeTab === "fonctionnalites" && (
          <div className="card">
            <h3 className="font-display font-bold text-white mb-5">⚡ Fonctionnalités</h3>
            <div className="space-y-3">
              {[
                { label: "Notifications en temps réel", desc: "Alertes push pour clients et agents", key: "notificationsEnabled" },
                { label: "Assignation automatique IA", desc: "L'IA répartit les tâches automatiquement", key: "autoAssign" },
                { label: "Module prédictif", desc: "Activer les prévisions d'affluence", key: "predictiveModule" },
                { label: "Mode maintenance", desc: "Suspendre temporairement l'accès public", key: "maintenanceMode", danger: true },
              ].map((f) => (
                <div key={f.key} className={`flex items-center justify-between p-4 rounded-xl border transition-all
                  ${f.danger && config[f.key] ? "bg-rose-500/10 border-rose-500/30" : "bg-white/5 border-white/10"}`}>
                  <div>
                    <div className={`font-display font-bold text-sm ${f.danger && config[f.key] ? "text-rose-400" : "text-white"}`}>
                      {f.label}
                    </div>
                    <div className="text-white/30 text-xs">{f.desc}</div>
                  </div>
                  <Toggle value={config[f.key]} onChange={v => setConfig({ ...config, [f.key]: v })} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB SÉCURITÉ */}
        {activeTab === "securite" && (
          <div className="card">
            <h3 className="font-display font-bold text-white mb-5">🔒 Sécurité</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-white/50 text-xs mb-2">
                  Timeout de session (min) : <span className="text-yellow-400 font-bold">{config.sessionTimeout}</span>
                </label>
                <input type="range" min={10} max={120} value={config.sessionTimeout}
                  onChange={e => setConfig({ ...config, sessionTimeout: +e.target.value })}
                  className="w-full accent-yellow-400" />
                <div className="flex justify-between text-white/20 text-xs mt-1"><span>10 min</span><span>120 min</span></div>
              </div>
              <div>
                <label className="block text-white/50 text-xs mb-2">
                  Expiration mot de passe (jours) : <span className="text-yellow-400 font-bold">{config.passwordExpiry}</span>
                </label>
                <input type="range" min={30} max={180} value={config.passwordExpiry}
                  onChange={e => setConfig({ ...config, passwordExpiry: +e.target.value })}
                  className="w-full accent-yellow-400" />
                <div className="flex justify-between text-white/20 text-xs mt-1"><span>30 j</span><span>180 j</span></div>
              </div>
              <div>
                <label className="block text-white/50 text-xs mb-2">
                  Tentatives de connexion max : <span className="text-yellow-400 font-bold">{config.maxLoginAttempts}</span>
                </label>
                <input type="range" min={3} max={10} value={config.maxLoginAttempts}
                  onChange={e => setConfig({ ...config, maxLoginAttempts: +e.target.value })}
                  className="w-full accent-yellow-400" />
                <div className="flex justify-between text-white/20 text-xs mt-1"><span>3</span><span>10</span></div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <div className="font-display font-bold text-white text-sm">Double authentification (2FA)</div>
                  <div className="text-white/30 text-xs">Sécurité renforcée pour tous les comptes</div>
                </div>
                <Toggle value={config.twoFactor} onChange={v => setConfig({ ...config, twoFactor: v })} />
              </div>
            </div>
          </div>
        )}

        {/* TAB NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="card">
            <h3 className="font-display font-bold text-white mb-5">🔔 Notifications</h3>
            <div className="space-y-3">
              {[
                { label: "Notifications Email", desc: "Envoyer des confirmations par email", key: "emailNotif" },
                { label: "Notifications SMS", desc: "Alertes par SMS aux clients", key: "smsNotif" },
                { label: "Notifications temps réel", desc: "Alertes push dans l'application", key: "notificationsEnabled" },
              ].map((f) => (
                <div key={f.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <div className="font-display font-bold text-white text-sm">{f.label}</div>
                    <div className="text-white/30 text-xs">{f.desc}</div>
                  </div>
                  <Toggle value={config[f.key]} onChange={v => setConfig({ ...config, [f.key]: v })} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB GÉNÉRAL */}
        {activeTab === "general" && (
          <div className="card">
            <h3 className="font-display font-bold text-white mb-5">⚙️ Paramètres Généraux</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/40 text-xs mb-1">Nom de la plateforme</label>
                <input type="text" value={config.nomPlateforme}
                  onChange={e => setConfig({ ...config, nomPlateforme: e.target.value })}
                  className="input-field" />
              </div>
              <div>
                <label className="block text-white/40 text-xs mb-1">Email de support</label>
                <input type="email" value={config.supportEmail}
                  onChange={e => setConfig({ ...config, supportEmail: e.target.value })}
                  className="input-field" />
              </div>
              <div>
                <label className="block text-white/40 text-xs mb-1">Téléphone de contact</label>
                <input type="tel" value={config.telephone}
                  onChange={e => setConfig({ ...config, telephone: e.target.value })}
                  className="input-field" />
              </div>
              <div>
                <label className="block text-white/40 text-xs mb-1">Langue</label>
                <select value={config.langue}
                  onChange={e => setConfig({ ...config, langue: e.target.value })}
                  className="input-field" style={selectStyle}>
                  {["Français", "English", "Portugais", "Arabe"].map(l => (
                    <option key={l} value={l} style={{ backgroundColor: "#0F1629" }}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/40 text-xs mb-1">Fuseau horaire</label>
                <select value={config.timezone}
                  onChange={e => setConfig({ ...config, timezone: e.target.value })}
                  className="input-field" style={selectStyle}>
                  {["Africa/Abidjan", "Africa/Dakar", "Africa/Lagos", "Africa/Nairobi", "Africa/Casablanca"].map(tz => (
                    <option key={tz} value={tz} style={{ backgroundColor: "#0F1629" }}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* BOUTONS ACTION */}
        <div className="flex gap-3">
          <button onClick={handleSave}
            className="flex-1 bg-yellow-500 text-black font-display font-bold py-3.5 rounded-xl hover:bg-yellow-400 transition-all">
            Enregistrer ✓
          </button>
          <button onClick={() => setResetConfirm(true)}
            className="glass border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-display font-bold px-5 py-3.5 rounded-xl transition-all text-sm">
            🔄 Réinitialiser
          </button>
        </div>

      </div>
    </PageLayout>
  );
};

export default Settings;