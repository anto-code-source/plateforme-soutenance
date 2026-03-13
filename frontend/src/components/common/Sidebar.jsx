import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ links }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-white/8 flex flex-col z-50">
      <div className="p-6 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-yellow-500 rounded-xl flex items-center justify-center">
            <span className="text-black font-display font-bold text-sm">BF</span>
          </div>
          <span className="font-display font-bold text-white text-lg">BankFlow</span>
        </div>
      </div>

      <div className="p-4 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-teal-500 rounded-xl flex items-center justify-center text-black font-display font-bold text-sm">
            {user?.avatar}
          </div>
          <div>
            <div className="text-white font-display font-bold text-sm">{user?.name}</div>
            <div className="text-white/40 text-xs font-body capitalize">{user?.role}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link, i) => (
          <div key={i}
            className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
            onClick={() => navigate(link.path)}>
            <span className="text-lg">{link.icon}</span>
            <span>{link.label}</span>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/8">
        <button onClick={() => { logout(); navigate("/login"); }}
          className="sidebar-link w-full text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10">
          <span className="text-lg">🚪</span>
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;