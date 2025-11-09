import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import AuthFlowApp from "./pages/AuthFlowApp.jsx";
import Dashboard from "./pages/Dashboard";
import PostProjectPage from "./pages/PostProjectPage";
import ProfilePage from "./pages/ProfilePage.jsx";
import MatchmakingPage from "./pages/MatchmakingPage";
import Events from "./pages/Events";
import ProjectDetailPage from "./pages/ProjectDetailPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<AuthFlowApp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/postProjectPage" element={<PostProjectPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/matchmaking" element={<MatchmakingPage />} />
      <Route path="/events" element={<Events />} />
      <Route path="/project/:id" element={<ProjectDetailPage />} />
    </Routes>
  );
}

export default App;
