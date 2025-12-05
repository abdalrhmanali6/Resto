import { Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="profile-body">
            <Nav />
            <div className="profile-section">
                <Outlet />
            </div>
        </div>
    );
}
