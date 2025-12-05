import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";

export default function AppRoutes() {
    const location = useLocation();
    return (
        <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route />
        </Routes>
    );
}
