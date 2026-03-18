import { useState, useEffect } from "react";
import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/client/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/client/appointment", icon: "📅", label: "Rendez-vous" },
  { path: "/client/ticket", icon: "🎫", label: "Mon Ticket" },
  { path: "/client/queue", icon: "👥", label: "File d'attente" },
  { path: "/client/profile", icon: "👤", label: "Mon Profil" },
];

const TOTAL_TIME = 720;
const ALERT_THRESHOLD = 120; // 2 minutes restantes = alerte

const VirtualTicket = () => {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [notified, setNotified] = useState(false);
  const [position, setPosition] = useState(3);
  const [showAlert, setShowAlert] = useState(false);
  const [called, setCalled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          setCalled(true);
          return 0;
        }
        // Simuler avancement de position
        if (t === 480) setPosition(2);
        if (t === 240) setPosition(1);
        // Alerte 2 minutes
        if (t === ALERT_THRESHOLD) setShowAlert(true);
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = ((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100;

  const isUrgent = timeLeft <= ALERT_THRESHOLD && timeLeft > 0;
  const isDone = timeLeft === 0 || called;

  const getStepStatus = () => {
    if (isDone) return 3;
    if (timeLeft <= ALERT_THRESHOLD) return 2;
    if (timeLeft < TOTAL_TIME) return 1;
    return 0;
  };
  const currentStep = getStepStatus();

  return (
    <PageLayout links={links} title="Mon Ticket Virtuel" subtitle="Suivez votre position en temps réel">
      <div className="max-w-2xl mx-auto">

        {/* ALERTE BIENTÔT VOTRE TOUR */}
        {showAlert && !isDone && (
          <div className="mb-5 glass border border-yellow-500/40 rounded-2xl p-4 flex items-center gap-3 animate-pulse">
            <span className="text-2xl">⚠️</span>
            <div>
              <div className="font-display font-bold text-yellow-400 text-sm">Préparez-vous !</div>
              <div className="text-white/50 text-xs">Votre tour arrive dans moins de 2 minutes. Veuillez vous rapprocher du guichet 3.</div>
            </div>
            <button onClick={() => setShowAlert(false)} className="ml-auto text-white/30 hover:text-white text-lg">✕</button>
          </div>
        )}

        {/* ALERTE APPELÉ */}
        {isDone && (
          <div className="mb-5 glass border border-teal-500/40 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <div className="font-display font-bold text-teal-400 text-sm">C'est votre tour !</div>
              <div className="text-white/50 text-xs">Veuillez vous présenter immédiatement au Guichet 3. Merci.</div>
            </div>
          </div>
        )}

        {/* TICKET PRINCIPAL */}
        <div className={`glass rounded-3xl overflow-hidden mb-6 border transition-all ${isUrgent ? "border-yellow-500/60" : isDone ? "border-teal-500/50" : "border-yellow-500/30"}`}>
          <div className={`border-b border-white/8 px-8 py-4 flex items-center justify-between transition-all ${isDone ? "bg-gradient-to-r from-teal-500/20 to-teal-500/5" : "bg-gradient-to-r from-yellow-500/20 to-teal-500/10"}`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isDone ? "bg-teal-400" : "bg-yellow-400 animate-pulse"}`} />
              <span className={`text-xs font-display font-bold tracking-widest uppercase ${isDone ? "text-teal-400" : "text-yellow-400"}`}>
                {isDone ? "Appelé au guichet" : isUrgent ? "⚡ Préparez-vous" : "Ticket Actif"}
              </span>
            </div>
            <span className="text-white/30 text-xs">BankFlow · Agence Plateau</span>
          </div>

          <div className="p-10 text-center">
            <div className="text-white/30 text-sm mb-2 uppercase tracking-widest">Numéro de ticket</div>
            <div className={`font-display font-bold text-8xl leading-none mb-1 transition-all ${isDone ? "text-teal-400" : "text-white"}`}>
              A-047
            </div>
            <div className="text-yellow-400 font-display font-bold text-xl">Guichet 3</div>

            <div className="flex items-center gap-2 my-8">
              <div className="flex-1 border-t-2 border-dashed border-white/10" />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                ["Service", "Virement"],
                ["Heure émission", "09:15"],
                ["Position", isDone ? "✓" : `#${position}`],
              ].map(([l, v], i) => (
                <div key={i}>
                  <div className="text-white/30 text-xs mb-1">{l}</div>
                  <div className={`font-display font-bold text-sm ${l === "Position" ? (isDone ? "text-teal-400 text-2xl" : isUrgent ? "text-yellow-400" : "text-teal-400") : "text-white"}`}>
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COUNTDOWN */}
          <div className="border-t border-white/8 px-8 py-5 bg-white/2">
            {!isDone ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/40 text-sm">Temps estimé restant</span>
                  <span className={`font-display font-bold text-xl transition-all ${isUrgent ? "text-yellow-400 animate-pulse" : "text-white"}`}>
                    {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${isUrgent ? "bg-yellow-500" : "bg-gradient-to-r from-yellow-500 to-teal-500"}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/20">
                  <span>Début</span>
                  <span>{Math.round(progress)}% écoulé</span>
                  <span>Guichet</span>
                </div>
              </>
            ) : (
              <div className="text-center py-2">
                <div className="font-display font-bold text-teal-400 text-lg">🎉 Vous êtes appelé !</div>
                <div className="text-white/40 text-xs mt-1">Présentez-vous au Guichet 3</div>
              </div>
            )}
          </div>
        </div>

        {/* TIMELINE STATUT */}
        <div className="card mb-6">
          <h3 className="font-display font-bold text-white mb-5">Statut</h3>
          <div className="space-y-4">
            {[
              { label: "Ticket généré", time: "09:15", step: 0 },
              { label: "En file d'attente", time: "09:15", step: 0 },
              { label: "Bientôt votre tour", time: "~09:25", step: 1 },
              { label: "Passage au guichet", time: "~09:27", step: 2 },
            ].map((s, i) => {
              const isDoneStep = currentStep > s.step || isDone;
              const isActiveStep = currentStep === s.step && !isDone;
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm transition-all
                    ${isDoneStep ? "bg-teal-500 text-white" : isActiveStep ? "bg-yellow-500 text-black animate-pulse" : "bg-white/10 text-white/30"}`}>
                    {isDoneStep ? "✓" : i + 1}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <span className={`text-sm transition-all ${isDoneStep || isActiveStep ? "text-white" : "text-white/30"}`}>{s.label}</span>
                    <span className="text-white/30 text-xs">{s.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* POSITION EN TEMPS RÉEL */}
        <div className="card mb-6">
          <h3 className="font-display font-bold text-white mb-4">File d'attente en direct</h3>
          <div className="flex items-center gap-3">
            {[...Array(5)].map((_, i) => {
              const pos = i + 1;
              const isPast = pos < position;
              const isCurrent = pos === position && !isDone;
              const isFuture = pos > position;
              return (
                <div key={i} className={`flex-1 h-12 rounded-xl flex items-center justify-center font-display font-bold text-sm transition-all
                  ${isPast ? "bg-teal-500/20 text-teal-400 border border-teal-500/30" :
                    isCurrent ? "bg-yellow-500 text-black animate-pulse" :
                    isDone && pos === 1 ? "bg-teal-500 text-white" :
                    "bg-white/5 text-white/20 border border-white/10"}`}>
                  {isPast ? "✓" : isCurrent ? `#${pos}` : isDone && pos === 1 ? "✓" : `#${pos}`}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-white/20 mt-2">
            <span>Servis</span>
            <span>Votre position</span>
            <span>En attente</span>
          </div>
        </div>

        {/* BOUTON NOTIFICATION */}
        <button onClick={() => setNotified(!notified)}
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl border font-display font-bold transition-all
            ${notified ? "bg-teal-500/15 border-teal-500/40 text-teal-400" : "glass border-white/15 text-white hover:border-yellow-500/40"}`}>
          <span className="text-xl">{notified ? "🔔" : "🔕"}</span>
          {notified ? "Notifications activées" : "Activer les notifications"}
        </button>

      </div>
    </PageLayout>
  );
};

export default VirtualTicket;