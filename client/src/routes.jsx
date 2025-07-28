import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import MyAccountPage from "./pages/MyAccountPage";
import CreateRecipePage from "./pages/CreateRecipePage";
import RecipePage from "./pages/RecipePage";
import SettingsPage from "./pages/SettingsPage";
import ContactPage from "./pages/ContactPage";
import EditRecipePage from "./pages/EditRecipePage";
import RecipesPage from "./pages/RecipesPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import NotFoundPage from "./pages/NotFoundPage";
import ErrorBoundary from "./components/ErrorBoundary";
import AdminDashboard from "./pages/AdminDashboard";

const AppRoutes = () => {
    return (
        <ErrorBoundary>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/account"
                    element={
                        <ProtectedRoute>
                            <MyAccountPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/create"
                    element={
                        <ProtectedRoute>
                            <CreateRecipePage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/recipe/:id" element={<RecipePage />} />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <SettingsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/contact"
                    element={
                        <ProtectedRoute>
                            <ContactPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/edit/:id"
                    element={
                        <ProtectedRoute>
                            <EditRecipePage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/recipes" element={<RecipesPage />} />

                {/* --- כאן מוסיפים את אדמין דשבורד --- */}
                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </ErrorBoundary>
    );
};

export default AppRoutes;
