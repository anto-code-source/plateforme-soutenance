import { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./routes/AppRouter";
import "./index.css";

const SplashScreen = () => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState(0);

  const loadingTexts = [
    "Initialisation de BankFlow...",
    "Chargement des modules...",
    "Connexion sécurisée...",
    "Prêt !",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 30) setCurrentText(0);
    else if (progress < 60) setCurrentText(1);
    else if (progress < 90) setCurrentText(2);
    else setCurrentText(3);
  }, [progress]);

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center relative overflow-hidden">

      {/* ARRIÈRE-PLAN ANIMÉ */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div className="relative z-10 text-center max-w-sm w-full px-8">

        {/* LOGO ANIMÉ */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/30"
            style={{ animation: "float 3s ease-in-out infinite" }}>
            <span className="text-black font-bold text-2xl" style={{ fontFamily: "sans-serif" }}>BF</span>
          </div>
          <span className="text-white font-bold text-4xl" style={{ fontFamily: "sans-serif" }}>BankFlow</span>
        </div>

        {/* TEXTE ANIMÉ */}
        <p className="text-white/40 text-sm mb-10 h-5 transition-all duration-500">
          {loadingTexts[currentText]}
        </p>

        {/* BARRE DE PROGRESSION */}
        <div className="w-full bg-white/10 rounded-full h-1.5 mb-4 overflow-hidden">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-yellow-500 via-teal-500 to-yellow-400 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-white/20">
          <span>Chargement en cours</span>
          <span className="text-yellow-400 font-bold">{progress}%</span>
        </div>

        {/* MODULES */}
        <div className="flex flex-wrap justify-center gap-2 mt-10">
          {[
            { label: "Tickets", active: progress > 20 },
            { label: "Rendez-vous", active: progress > 40 },
            { label: "IA Prédictive", active: progress > 60 },
            { label: "Sécurité", active: progress > 80 },
          ].map((m, i) => (
            <span key={i} className={`text-xs px-3 py-1 rounded-full border font-bold transition-all duration-500
              ${m.active
                ? "bg-yellow-500/15 border-yellow-500/40 text-yellow-400"
                : "bg-white/5 border-white/10 text-white/20"}`}>
              {m.active ? "✓ " : ""}{m.label}
            </span>
          ))}
        </div>

        {/* COPYRIGHT */}
        <p className="text-white/15 text-xs mt-10">© 2025 BankFlow — Tous droits réservés</p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;