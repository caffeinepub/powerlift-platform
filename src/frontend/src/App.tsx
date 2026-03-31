import { useEffect } from "react";
import Layout from "./components/Layout";
import AdminPanel from "./pages/AdminPanel";
import CompetitionDetail from "./pages/CompetitionDetail";
import CompetitionsPage from "./pages/CompetitionsPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotificationsPage from "./pages/NotificationsPage";
import OrganizerPanel from "./pages/OrganizerPanel";
import PlayerDashboard from "./pages/PlayerDashboard";
import ProfilePage from "./pages/ProfilePage";
import Register from "./pages/Register";
import { useStore } from "./store";

export default function App() {
  const { currentPage, navigate } = useStore();

  // Sync with browser history
  useEffect(() => {
    const handlePop = () => {
      navigate(window.location.pathname);
    };
    window.addEventListener("popstate", handlePop);
    // Set initial page from URL
    navigate(window.location.pathname);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  // Push to history when currentPage changes
  useEffect(() => {
    if (window.location.pathname !== currentPage) {
      window.history.pushState({}, "", currentPage);
    }
  }, [currentPage]);

  const renderPage = () => {
    if (currentPage === "/") return <Home />;
    if (currentPage === "/login") return <Login />;
    if (currentPage === "/register") return <Register />;
    if (currentPage === "/competitions") return <CompetitionsPage />;
    if (currentPage.startsWith("/competitions/")) {
      const id = currentPage.replace("/competitions/", "");
      return <CompetitionDetail id={id} />;
    }
    if (currentPage === "/dashboard") return <PlayerDashboard />;
    if (currentPage === "/organizer") return <OrganizerPanel />;
    if (currentPage === "/admin") return <AdminPanel />;
    if (currentPage === "/profile") return <ProfilePage />;
    if (currentPage === "/notifications") return <NotificationsPage />;
    return <Home />;
  };

  return <Layout>{renderPage()}</Layout>;
}
