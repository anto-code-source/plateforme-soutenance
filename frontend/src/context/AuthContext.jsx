import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// ✅ Agences initiales
const INITIAL_AGENCIES = [
  { id: "AG1", name: "Agence Plateau",    ville: "Abidjan",   directeur: "directeur@bank.com"  },
  { id: "AG2", name: "Agence Cocody",     ville: "Abidjan",   directeur: "directeur2@bank.com" },
  { id: "AG3", name: "Agence Cotonou",    ville: "Cotonou",   directeur: "directeur3@bank.com" },
  { id: "AG4", name: "Agence Dakar",      ville: "Dakar",     directeur: "directeur4@bank.com" },
  { id: "AG5", name: "Agence Lomé",       ville: "Lomé",      directeur: "directeur5@bank.com" },
];

const INITIAL_USERS = {
  // ── ADMIN ──
  "admin@bank.com": { role:"admin", name:"Ibrahim Koné",    avatar:"IK", password:"password123" },

  // ── DIRECTEURS — un par agence ──
  "directeur@bank.com":  { role:"directeur", name:"Awa Coulibaly",   avatar:"AC", password:"password123", agenceId:"AG1" },
  "directeur2@bank.com": { role:"directeur", name:"Kofi Mensah",     avatar:"KM", password:"password123", agenceId:"AG2" },
  "directeur3@bank.com": { role:"directeur", name:"Aminata Bah",     avatar:"AB", password:"password123", agenceId:"AG3" },
  "directeur4@bank.com": { role:"directeur", name:"Seydou Diallo",   avatar:"SD", password:"password123", agenceId:"AG4" },
  "directeur5@bank.com": { role:"directeur", name:"Nadia Traoré",    avatar:"NT", password:"password123", agenceId:"AG5" },

  // ── MANAGERS — liés à une agence ──
  "manager@bank.com":  { role:"manager", name:"Fatou Diallo",   avatar:"FD", password:"password123", agenceId:"AG1" },
  "manager2@bank.com": { role:"manager", name:"Oumar Koné",     avatar:"OK", password:"password123", agenceId:"AG2" },

  // ── AGENTS — liés à une agence ──
  "agent@bank.com":  { role:"agent", name:"Moussa Traoré", avatar:"MT", password:"password123", agentId:"A1", agenceId:"AG1" },
  "agent2@bank.com": { role:"agent", name:"Koffi Agbessi", avatar:"KA", password:"password123", agentId:"A2", agenceId:"AG1" },
  "agent3@bank.com": { role:"agent", name:"Marie Dossou",  avatar:"MD", password:"password123", agentId:"A3", agenceId:"AG2" },
  "agent4@bank.com": { role:"agent", name:"Segun Hounto",  avatar:"SH", password:"password123", agentId:"A4", agenceId:"AG2" },

  // ── CLIENT ──
  "client@bank.com": { role:"client", name:"Jean Akpovi", avatar:"JA", password:"password123" },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]         = useState(null);
  const [users, setUsers]       = useState(INITIAL_USERS);
  const [agencies, setAgencies] = useState(INITIAL_AGENCIES);

  // ── LOGIN ──
  const login = (credentials) => {
    const found = users[credentials.email];
    if (found && credentials.password === found.password) {
      setUser({ ...found, email: credentials.email });
      return { success: true, role: found.role };
    }
    return { success: false, message: "Email ou mot de passe incorrect" };
  };

  // ── REGISTER CLIENT ──
  const register = (data) => {
    if (users[data.email]) {
      return { success: false, message: "Cet email est déjà utilisé" };
    }
    const initials = `${data.prenom[0]}${data.nom[0]}`.toUpperCase();
    const newUser = {
      role:      "client",
      name:      `${data.prenom} ${data.nom}`,
      avatar:    initials,
      password:  data.password,
      telephone: data.telephone,
      adresse:   data.adresse,
      ville:     data.ville,
    };
    setUsers(prev => ({ ...prev, [data.email]: newUser }));
    return { success: true };
  };

  // ✅ AJOUTER UN MEMBRE (agent ou manager) — réservé au directeur
  const addMember = (data, directorEmail) => {
    if (users[data.email]) {
      return { success: false, message: "Cet email est déjà utilisé" };
    }

    // Récupérer l'agence du directeur
    const director = users[directorEmail];
    if (!director || director.role !== "directeur") {
      return { success: false, message: "Action non autorisée" };
    }

    const initials = `${data.prenom[0]}${data.nom[0]}`.toUpperCase();

    // Générer un agentId unique si c'est un agent
    let agentId = null;
    if (data.role === "agent") {
      const existingAgents = Object.values(users).filter(u => u.role === "agent" && u.agenceId === director.agenceId);
      agentId = `${director.agenceId}-A${existingAgents.length + 1}`;
    }

    const newMember = {
      role:      data.role, // "agent" ou "manager"
      name:      `${data.prenom} ${data.nom}`,
      avatar:    initials,
      password:  data.password || "password123",
      agenceId:  director.agenceId, // ✅ lié à l'agence du directeur
      ...(agentId && { agentId }),
    };

    setUsers(prev => ({ ...prev, [data.email]: newMember }));
    return { success: true, member: newMember };
  };

  // ✅ SUPPRIMER UN MEMBRE — réservé au directeur
  const removeMember = (email, directorEmail) => {
    const director = users[directorEmail];
    const member   = users[email];

    if (!director || director.role !== "directeur") {
      return { success: false, message: "Action non autorisée" };
    }
    if (!member || member.agenceId !== director.agenceId) {
      return { success: false, message: "Ce membre n'appartient pas à votre agence" };
    }

    setUsers(prev => {
      const updated = { ...prev };
      delete updated[email];
      return updated;
    });
    return { success: true };
  };

  // ✅ OBTENIR LES MEMBRES D'UNE AGENCE
  const getAgenceMembers = (agenceId) => {
    return Object.entries(users)
      .filter(([, u]) => u.agenceId === agenceId && (u.role === "agent" || u.role === "manager"))
      .map(([email, u]) => ({ ...u, email }));
  };

  // ✅ OBTENIR L'AGENCE D'UN DIRECTEUR
  const getDirecteurAgence = (directorEmail) => {
    const director = users[directorEmail];
    if (!director) return null;
    return agencies.find(a => a.id === director.agenceId) || null;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{
      user, login, logout, register,
      users, agencies,
      addMember, removeMember,
      getAgenceMembers, getDirecteurAgence,
    }}>
      {children}
    </AuthContext.Provider>
  );
};