import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Home from "../pages/auth/Home";
import Login from "../pages/auth/Login";
import ClientDashboard from "../pages/client/Dashboard";
import ClientAppointment from "../pages/client/Appointment";
import ClientTicket from "../pages/client/VirtualTicket";
import ClientQueue from "../pages/client/QueueTracking";
import ClientProfile from "../pages/client/Profile";
import AgentDashboard from "../pages/agent/Dashboard";
import AgentTasks from "../pages/agent/Tasks";
import AgentTaskDetail from "../pages/agent/TaskDetail";
import AgentHistory from "../pages/agent/History";
import ManagerDashboard from "../pages/manager/Dashboard";
import ManagerTasks from "../pages/manager/TaskAssignment";
import ManagerAgents from "../pages/manager/AgentTracking";
import ManagerAlerts from "../pages/manager/Alerts";
import DirecteurDashboard from "../pages/directeur/Dashboard";
import DirecteurKPI from "../pages/directeur/KPI";
import DirecteurPredictive from "../pages/directeur/Predictive";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminAgencies from "../pages/admin/Agencies";
import AdminSettings from "../pages/admin/Settings";
import AdminLogs from "../pages/admin/Logs";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
};

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/client/dashboard"   element={<ProtectedRoute allowedRoles={["client"]}><ClientDashboard /></ProtectedRoute>} />
      <Route path="/client/appointment" element={<ProtectedRoute allowedRoles={["client"]}><ClientAppointment /></ProtectedRoute>} />
      <Route path="/client/ticket"      element={<ProtectedRoute allowedRoles={["client"]}><ClientTicket /></ProtectedRoute>} />
      <Route path="/client/queue"       element={<ProtectedRoute allowedRoles={["client"]}><ClientQueue /></ProtectedRoute>} />
      <Route path="/client/profile"     element={<ProtectedRoute allowedRoles={["client"]}><ClientProfile /></ProtectedRoute>} />
      <Route path="/agent/dashboard"    element={<ProtectedRoute allowedRoles={["agent"]}><AgentDashboard /></ProtectedRoute>} />
      <Route path="/agent/tasks"        element={<ProtectedRoute allowedRoles={["agent"]}><AgentTasks /></ProtectedRoute>} />
      <Route path="/agent/tasks/:id"    element={<ProtectedRoute allowedRoles={["agent"]}><AgentTaskDetail /></ProtectedRoute>} />
      <Route path="/agent/history"      element={<ProtectedRoute allowedRoles={["agent"]}><AgentHistory /></ProtectedRoute>} />
      <Route path="/manager/dashboard"  element={<ProtectedRoute allowedRoles={["manager"]}><ManagerDashboard /></ProtectedRoute>} />
      <Route path="/manager/tasks"      element={<ProtectedRoute allowedRoles={["manager"]}><ManagerTasks /></ProtectedRoute>} />
      <Route path="/manager/agents"     element={<ProtectedRoute allowedRoles={["manager"]}><ManagerAgents /></ProtectedRoute>} />
      <Route path="/manager/alerts"     element={<ProtectedRoute allowedRoles={["manager"]}><ManagerAlerts /></ProtectedRoute>} />
      <Route path="/directeur/dashboard"  element={<ProtectedRoute allowedRoles={["directeur"]}><DirecteurDashboard /></ProtectedRoute>} />
      <Route path="/directeur/kpi"        element={<ProtectedRoute allowedRoles={["directeur"]}><DirecteurKPI /></ProtectedRoute>} />
      <Route path="/directeur/predictive" element={<ProtectedRoute allowedRoles={["directeur"]}><DirecteurPredictive /></ProtectedRoute>} />
      <Route path="/admin/dashboard"  element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users"      element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/agencies"   element={<ProtectedRoute allowedRoles={["admin"]}><AdminAgencies /></ProtectedRoute>} />
      <Route path="/admin/settings"   element={<ProtectedRoute allowedRoles={["admin"]}><AdminSettings /></ProtectedRoute>} />
      <Route path="/admin/logs"       element={<ProtectedRoute allowedRoles={["admin"]}><AdminLogs /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;