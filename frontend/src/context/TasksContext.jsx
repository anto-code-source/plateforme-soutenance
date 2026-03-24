import { createContext, useContext, useState } from "react";

const TasksContext = createContext(null);
export const useTasks = () => useContext(TasksContext);

const INITIAL_TASKS = [
  { id:"T-1050", agent:null, client:"Seydou Koné",   service:"Virement international", priority:"Haute",   statut:"Non assigné", time:"09:00", ticket:"T-1050", pieces:[{label:"Pièce d'identité",checked:false},{label:"Formulaire de virement",checked:false},{label:"RIB",checked:false}] },
  { id:"T-1051", agent:null, client:"Mariam Bah",    service:"Demande de crédit",      priority:"Normale",  statut:"Non assigné", time:"09:30", ticket:"T-1051", pieces:[{label:"Pièce d'identité",checked:false},{label:"Justificatif de revenus",checked:false}] },
  { id:"T-1052", agent:null, client:"Oumar Diallo",  service:"Ouverture de compte",    priority:"Basse",   statut:"Non assigné", time:"10:00", ticket:"T-1052", pieces:[{label:"Pièce d'identité",checked:false},{label:"Justificatif de domicile",checked:false}] },
  { id:"T-1053", agent:null, client:"Nadia Traoré",  service:"Carte bancaire",         priority:"Haute",   statut:"Non assigné", time:"10:30", ticket:"T-1053", pieces:[{label:"Pièce d'identité",checked:false},{label:"RIB",checked:false}] },
  { id:"T-1054", agent:"A1", client:"Jean Akpovi",   service:"Virement international", priority:"Haute",   statut:"En cours",   time:"09:15", ticket:"A-044",  pieces:[{label:"Pièce d'identité",checked:false},{label:"Justificatif de domicile",checked:false},{label:"RIB",checked:false},{label:"Formulaire de virement",checked:false}] },
  { id:"T-1055", agent:"A2", client:"Fatou Diallo",  service:"Ouverture de compte",    priority:"Normale",  statut:"En attente", time:"09:30", ticket:"A-047",  pieces:[{label:"Pièce d'identité",checked:false},{label:"Justificatif de domicile",checked:false},{label:"Photo d'identité",checked:false}] },
  { id:"T-1056", agent:"A1", client:"Kofi Mensah",   service:"Demande de crédit",      priority:"Haute",   statut:"En attente", time:"10:00", ticket:"A-048",  pieces:[{label:"Pièce d'identité",checked:false},{label:"RIB",checked:false},{label:"Justificatif de revenus",checked:false},{label:"Relevé bancaire 3 mois",checked:false}] },
  { id:"T-1057", agent:"A3", client:"Awa Traoré",    service:"Carte bancaire",         priority:"Normale",  statut:"Terminé",    time:"08:00", ticket:"A-040",  pieces:[{label:"Pièce d'identité",checked:true},{label:"RIB",checked:true}] },
  { id:"T-1058", agent:"A2", client:"Ibrahim C.",    service:"Relevé de compte",       priority:"Basse",   statut:"Terminé",    time:"08:30", ticket:"A-041",  pieces:[{label:"Pièce d'identité",checked:true}] },
  { id:"T-1059", agent:"A3", client:"Aïcha Sow",     service:"Virement local",         priority:"Normale",  statut:"En cours",   time:"10:30", ticket:"A-050",  pieces:[{label:"Pièce d'identité",checked:false},{label:"RIB",checked:false}] },
  { id:"T-1060", agent:"A4", client:"Moussa T.",     service:"Clôture de compte",      priority:"Haute",   statut:"En attente", time:"11:00", ticket:"A-052",  pieces:[{label:"Pièce d'identité",checked:false},{label:"Formulaire clôture",checked:false},{label:"RIB",checked:false}] },
  { id:"T-1061", agent:"A4", client:"Salimata Bah",  service:"Virement international", priority:"Haute",   statut:"Terminé",    time:"07:45", ticket:"A-038",  pieces:[{label:"Pièce d'identité",checked:true},{label:"Formulaire de virement",checked:true},{label:"RIB",checked:true}] },
  { id:"T-1062", agent:"A1", client:"Clément Yao",   service:"Dépôt d'espèces",        priority:"Basse",   statut:"Terminé",    time:"11:30", ticket:"A-055",  pieces:[{label:"Pièce d'identité",checked:true}] },
  { id:"T-1063", agent:"A2", client:"Rokhaya N.",    service:"Demande de crédit",      priority:"Haute",   statut:"En cours",   time:"12:00", ticket:"A-056",  pieces:[{label:"Pièce d'identité",checked:false},{label:"Justificatif de revenus",checked:false},{label:"Relevé bancaire 3 mois",checked:false}] },
];

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  // ✅ Assigner une tâche à un agent
  const assignTask = (taskId, agentId) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId
        ? { ...t, agent: agentId, statut: "En attente" }
        : t
    ));
  };

  // ✅ Mettre à jour le statut / pièces d'une tâche
  const updateTask = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  // ✅ Supprimer une tâche
  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // ✅ Tâches par agent
  const getTasksByAgent = (agentId) => tasks.filter(t => t.agent === agentId);

  // ✅ Tâches non assignées
  const unassignedTasks = tasks.filter(t => t.agent === null);

  return (
    <TasksContext.Provider value={{ tasks, assignTask, updateTask, deleteTask, getTasksByAgent, unassignedTasks }}>
      {children}
    </TasksContext.Provider>
  );
};