import React from "react";
import Header from "../Components/Headernav";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <>
            <Header />
            <div>
                <Outlet />
            </div>
        </>
    );
}
