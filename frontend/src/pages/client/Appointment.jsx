import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/client/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/client/appointment", icon: "📅", label: "Rendez-vous" },
  { path: "/client/ticket", icon: "🎫", label: "Mon Ticket" },
  { path: "/client/queue", icon: "👥", label: "File d'attente" },
  { path: "/client/profile", icon: "👤", label: "Mon Profil" },
];

const services = ["Ouverture de compte","Virement international","Demande de crédit","Carte bancaire","Relevé de compte","Change de devises","Épargne / Placement","Autre demande"];

const agences = [
  { name: "BankFlow Abidjan", ville: "Plateau, Abidjan — Côte d'Ivoire" },
  { name: "BankFlow Dakar", ville: "Plateau, Dakar — Sénégal" },
  { name: "BankFlow Bamako", ville: "Hippodrome, Bamako — Mali" },
  { name: "BankFlow Lomé", ville: "Centre, Lomé — Togo" },
  { name: "BankFlow Cotonou", ville: "Ganhi, Cotonou — Bénin" },
  { name: "BankFlow Ouagadougou", ville: "Zogona, Ouagadougou — Burkina Faso" },
  { name: "BankFlow Accra", ville: "Osu, Accra — Ghana" },
  { name: "BankFlow Lagos", ville: "Victoria Island, Lagos — Nigeria" },
  { name: "BankFlow Nairobi", ville: "CBD, Nairobi — Kenya" },
  { name: "BankFlow Casablanca", ville: "Maarif, Casablanca — Maroc" },
];

const horaires = [
  "08:00","08:30","09:00","09:30","10:00","10:30",
  "11:00","11:30","12:00","12:30","13:00","13:30",
  "14:00","14:30","15:00","15:30","16:00","16:30",
  "17:00","17:30","18:00",
];

const refCode = () => `RDV-${Math.random().toString(36).substring(2,7).toUpperCase()}`;

const Appointment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ service: "", agence: "", ville: "", date: "", heure: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [ref] = useState(refCode());

  const handleSubmit = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 1500);
  };

  // ÉCRAN CONFIRMATION EMAIL SIMULÉ
  if (submitted) return (
    <PageLayout links={links}>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-lg">

          {/* BADGE SUCCÈS */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-500/30">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="font-display font-bold text-2xl text-white mb-1">Rendez-vous confirmé !</h2>
            <p className="text-white/40 text-sm">Un email de confirmation a été envoyé</p>
          </div>

          {/* EMAIL SIMULÉ */}
          <div className="glass border border-white/10 rounded-2xl overflow-hidden mb-5">
            {/* HEADER EMAIL */}
            <div className="bg-white/5 border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <span className="text-black font-display font-bold text-xs">BF</span>
                </div>
                <div>
                  <div className="text-white font-display font-bold text-sm">BankFlow</div>
                  <div className="text-white/30 text-xs">noreply@bankflow.com</div>
                </div>
                <div className="ml-auto text-white/20 text-xs">À l'instant</div>
              </div>
              <div className="text-white/70 text-sm font-display font-bold">
                ✉️ Confirmation de votre rendez-vous — {ref}
              </div>
            </div>

            {/* CORPS EMAIL */}
            <div className="px-5 py-5 space-y-4">
              <p className="text-white/60 text-sm leading-relaxed">
                Bonjour, votre rendez-vous a bien été enregistré. Voici le récapitulatif :
              </p>

              {/* DÉTAILS RDV */}
              <div className="glass border border-yellow-500/20 rounded-xl p-4 space-y-2">
                {[
                  ["📋 Service", form.service],
                  ["🏦 Agence", form.agence],
                  ["📍 Adresse", form.ville],
                  ["📅 Date", form.date],
                  ["🕐 Heure", form.heure],
                  ["🔖 Référence", ref],
                ].map(([l, v], i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-white/40">{l}</span>
                    <span className={`font-display font-bold ${l.includes("Référence") ? "text-yellow-400" : "text-white"}`}>{v}</span>
                  </div>
                ))}
              </div>

              {/* INSTRUCTIONS */}
              <div className="glass border border-teal-500/20 rounded-xl p-4">
                <div className="text-teal-400 font-display font-bold text-xs mb-2">📌 À savoir</div>
                <ul className="space-y-1">
                  {[
                    "Présentez-vous 10 min avant l'heure prévue",
                    "Munissez-vous d'une pièce d'identité valide",
                    "Conservez votre référence de rendez-vous",
                  ].map((item, i) => (
                    <li key={i} className="text-white/40 text-xs flex items-start gap-2">
                      <span className="text-teal-400 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-white/20 text-xs text-center">
                Pour annuler ou modifier votre rendez-vous, contactez-nous au{" "}
                <span className="text-white/40">+225 00 00 00 00</span>
              </p>
            </div>

            {/* FOOTER EMAIL */}
            <div className="bg-white/3 border-t border-white/10 px-5 py-3 flex items-center justify-between">
              <span className="text-white/20 text-xs">© 2025 BankFlow — Tous droits réservés</span>
              <span className="text-teal-400 text-xs font-display font-bold">✓ Envoyé</span>
            </div>
          </div>

          {/* BOUTONS */}
          <div className="flex gap-3">
            <button onClick={() => navigate("/client/ticket")}
              className="flex-1 bg-yellow-500 text-black font-display font-bold py-3 rounded-xl hover:bg-yellow-400 transition-all">
              Voir mon ticket →
            </button>
            <button onClick={() => navigate("/client/dashboard")}
              className="flex-1 glass border border-white/10 text-white/60 hover:text-white font-display py-3 rounded-xl transition-all">
              Tableau de bord
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );

  return (
    <PageLayout links={links} title="Prendre Rendez-vous" subtitle="Réservez votre créneau en quelques étapes">

      {/* STEPPER */}
      <div className="flex items-center gap-0 mb-10 max-w-lg">
        {[1, 2, 3].map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-display font-bold transition-all
              ${step >= s ? "bg-yellow-500 text-black" : "glass border border-white/20 text-white/30"}`}>
              {step > s ? "✓" : s}
            </div>
            {i < 2 && <div className={`h-0.5 w-20 transition-all ${step > s ? "bg-yellow-500" : "bg-white/10"}`} />}
          </div>
        ))}
        <div className="ml-4 text-white/40 text-sm">
          {step === 1 ? "Choisir le service" : step === 2 ? "Choisir l'agence" : "Date & heure"}
        </div>
      </div>

      <div className="max-w-2xl">

        {/* ÉTAPE 1 — SERVICE */}
        {step === 1 && (
          <div>
            <h2 className="font-display font-bold text-xl text-white mb-6">Quel service souhaitez-vous ?</h2>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {services.map((s, i) => (
                <button key={i} onClick={() => setForm({ ...form, service: s })}
                  className={`p-4 rounded-xl border text-left text-sm transition-all
                    ${form.service === s ? "bg-yellow-500/15 border-yellow-500/50 text-yellow-400" : "glass border-white/10 text-white/60 hover:border-white/30 hover:text-white"}`}>
                  {s}
                </button>
              ))}
            </div>
            <button onClick={() => form.service && setStep(2)} disabled={!form.service}
              className="bg-yellow-500 text-black font-display font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-40">
              Continuer →
            </button>
          </div>
        )}

        {/* ÉTAPE 2 — AGENCE */}
        {step === 2 && (
          <div>
            <h2 className="font-display font-bold text-xl text-white mb-6">Choisissez votre agence</h2>
            <div className="space-y-3 mb-8">
              {agences.map((a, i) => (
                <button key={i} onClick={() => setForm({ ...form, agence: a.name, ville: a.ville })}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all
                    ${form.agence === a.name ? "bg-yellow-500/15 border-yellow-500/50" : "glass border-white/10 hover:border-white/30"}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${form.agence === a.name ? "bg-yellow-500/20" : "bg-white/5"}`}>🏦</div>
                  <div>
                    <div className={`font-display font-bold text-sm ${form.agence === a.name ? "text-yellow-400" : "text-white"}`}>{a.name}</div>
                    <div className="text-white/30 text-xs">📍 {a.ville}</div>
                  </div>
                  {form.agence === a.name && <span className="ml-auto text-yellow-400">✓</span>}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-ghost">← Retour</button>
              <button onClick={() => form.agence && setStep(3)} disabled={!form.agence}
                className="bg-yellow-500 text-black font-display font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-40">
                Continuer →
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 — DATE & HEURE */}
        {step === 3 && (
          <div>
            <h2 className="font-display font-bold text-xl text-white mb-6">Choisissez la date et l'heure</h2>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-white/50 text-xs font-display font-bold mb-2 uppercase tracking-wider">Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                  className="input-field" style={{ colorScheme: "dark" }} />
              </div>
              <div>
                <label className="block text-white/50 text-xs font-display font-bold mb-2 uppercase tracking-wider">
                  Heure <span className="text-white/20 normal-case tracking-normal">(créneaux de 30 min)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {horaires.map((h, i) => (
                    <button key={i} onClick={() => setForm({ ...form, heure: h })}
                      className={`py-2 px-3 rounded-lg text-xs font-display font-bold transition-all
                        ${form.heure === h ? "bg-yellow-500 text-black" : "glass border border-white/10 text-white/60 hover:border-white/30"}`}>
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RÉCAPITULATIF */}
            {form.date && form.heure && (
              <div className="glass border border-teal-500/30 rounded-2xl p-5 mb-6">
                <div className="text-teal-400 font-display font-bold text-sm mb-3">📋 Récapitulatif</div>
                <div className="space-y-2">
                  {[
                    ["Service", form.service],
                    ["Agence", form.agence],
                    ["Adresse", form.ville],
                    ["Date", form.date],
                    ["Heure", form.heure],
                  ].map(([l, v], i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-white/40">{l}</span>
                      <span className="text-white font-display font-bold">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-ghost">← Retour</button>
              <button onClick={handleSubmit} disabled={!form.date || !form.heure || sending}
                className="bg-yellow-500 text-black font-display font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-40 flex items-center gap-2">
                {sending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : "Confirmer ✓"}
              </button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Appointment;