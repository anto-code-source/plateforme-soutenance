import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (credentials) => {
    const users = {
      "admin@bank.com":     { role: "admin",     name: "Ibrahim Koné",  avatar: "IK" },
      "manager@bank.com":   { role: "manager",   name: "Fatou Diallo",  avatar: "FD" },
      "agent@bank.com":     { role: "agent",     name: "Moussa Traoré", avatar: "MT" },
      "directeur@bank.com": { role: "directeur", name: "Awa Coulibaly", avatar: "AC" },
      "client@bank.com":    { role: "client",    name: "Jean Akpovi",   avatar: "JA" },
    };
    const found = users[credentials.email];
    if (found && credentials.password === "password123") {
      setUser({ ...found, email: credentials.email });
      return { success: true, role: found.role };
    }
    return { success: false };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};