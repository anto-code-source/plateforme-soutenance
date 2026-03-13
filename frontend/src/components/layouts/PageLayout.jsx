import { useState } from "react";
import Sidebar from "../common/Sidebar";

const allNotifications = [
  { id: 1, msg: "Nouveau client en attente : Ticket A-052", time: "Il y a 1 min", type: "warning", read: false },
  { id: 2, msg: "Tâche #1045 validée par le manager", time: "Il y a 10 min", type: "success", read: false },
  { id: 3, msg: "Rendez-vous confirmé pour Jean Akpovi", time: "Il y a 30 min", type: "info", read: false },
  { id: 4, msg: "Rapport journalier disponible", time: "Il y a 1h", type: "info", read: true },
  { id: 5, msg: "Agence Nairobi en maintenance", time: "Il y a 2h", type: "warning", read: true },
];

const typeStyles = {
  warning: { dot: "bg-rose-400", bg: "border-rose-500/20", icon: "⚠️" },
  success: { dot: "bg-teal-400", bg: "border-teal-500/20", icon: "✅" },
  info: { dot: "bg-yellow-400", bg: "border-yellow-500/20", icon: "ℹ️" },
};

const PageLayout = ({ children, links, title, subtitle }) => {
  const [notifications, setNotifications] = useState(allNotifications);
  const [open, setOpen] = useState(false);

  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id) => setNotifications(notifications.filter(n => n.id !== id));

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/4 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-500/4 rounded-full blur-3xl" />
      </div>

      <Sidebar links={links} />

      <main className="ml-64 flex-1 p-8 relative z-10">

        {/* TOPBAR */}
        <div className="flex items-center justify-between mb-8">
          <div>
            {title && <h1 className="font-display font-bold text-2xl text-white">{title}</h1>}
            {subtitle && <p className="text-white/40 font-body text-sm mt-1">{subtitle}</p>}
          </div>

          {/* CLOCHE NOTIFICATIONS */}
          <div className="relative">
            <button
              onClick={() => { setOpen(!open); }}
              className="relative w-10 h-10 glass border border-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:border-yellow-500/40 transition-all">
              🔔
              {unread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-white text-xs font-display font-bold border-2 border-[#0A0F1E]">
                  {unread}
                </span>
              )}
            </button>

            {/* DROPDOWN NOTIFICATIONS */}
            {open && (
              <>
                {/* OVERLAY pour fermer */}
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

                <div className="absolute right-0 top-12 w-80 glass border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl shadow-black/40">

                  {/* HEADER */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-white text-sm">Notifications</span>
                      {unread > 0 && (
                        <span className="bg-rose-500/20 text-rose-400 text-xs font-display font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                          {unread} nouveau{unread > 1 ? "x" : ""}
                        </span>
                      )}
                    </div>
                    {unread > 0 && (
                      <button onClick={markAllRead} className="text-yellow-400 text-xs font-display hover:text-yellow-300 transition-colors">
                        Tout lire
                      </button>
                    )}
                  </div>

                  {/* LISTE */}
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8 text-white/20 text-sm">
                        Aucune notification
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markRead(n.id)}
                          className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 ${!n.read ? "bg-white/3" : ""}`}>
                          <div className="flex-shrink-0 mt-0.5">
                            <div className={`w-2 h-2 rounded-full mt-1.5 ${!n.read ? typeStyles[n.type].dot : "bg-white/10"}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs leading-relaxed ${!n.read ? "text-white" : "text-white/40"}`}>
                              {typeStyles[n.type].icon} {n.msg}
                            </p>
                            <span className="text-white/20 text-xs">{n.time}</span>
                          </div>
                          <button
                            onClick={e => { e.stopPropagation(); deleteNotif(n.id); }}
                            className="text-white/20 hover:text-rose-400 text-xs transition-colors flex-shrink-0 mt-0.5">
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* FOOTER */}
                  {notifications.length > 0 && (
                    <div className="px-4 py-3 border-t border-white/10 text-center">
                      <button
                        onClick={() => setNotifications([])}
                        className="text-white/30 hover:text-rose-400 text-xs font-display transition-colors">
                        Effacer toutes les notifications
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {children}
      </main>
    </div>
  );
};

export default PageLayout;