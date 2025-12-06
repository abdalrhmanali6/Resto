import { Outlet } from "react-router-dom";
import Nav from "../Components/Nav";

export default function AdminLayout() {
    return (
        <div className="app-container">
            <div className="profile-body">
                <Nav />
                <div className="profile-section">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
