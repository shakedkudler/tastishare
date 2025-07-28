import { BrowserRouter, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import AppRoutes from "./routes";
import "./index.css";
import { Toolbar } from "@mui/material";
import { useEffect } from "react";

const AppContent = () => {
  const location = useLocation();

  const hideNavBarPaths = ["/login", "/register"];
  const showNavBar = !hideNavBarPaths.includes(location.pathname);

  function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return null;
  }

  return (
    <div className="app-container">
      <ScrollToTop />
      {showNavBar && (
        <>
          <NavBar />
          <Toolbar />
        </>
      )}
      <main className="main-content">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
