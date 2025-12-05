import { IoIosLogOut } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { RiHome9Line } from "react-icons/ri";
import { NavLink } from "react-router-dom";


export default function Nav() {
    return (
        <div className="profile-nav">
            <div className="links">
                    <NavLink
                        key={"profile"}
                        to={"/adminprofile"}
                        className={({ isActive }) =>
                            `link ${isActive ? "active" : ""}`
                        }
                        data-title={"الرئيسية"}
                    >
                        <span><RiHome9Line /></span>
                    </NavLink>
                    <NavLink
                        key={"foods"}
                        to={"/adminfoods"}
                        className={({ isActive }) =>
                            `link ${isActive ? "active" : ""}`
                        }
                        data-title={"الوجبات"}
                    >
                        <span>{""}</span>
                    </NavLink>
                    <NavLink
                        key={"users"}
                        to={"/adminusers"}
                        className={({ isActive }) =>
                            `link ${isActive ? "active" : ""}`
                        }
                        data-title={"المستخدمين"}
                    >
                        <span></span>
                    </NavLink>
                    <NavLink
                        key={"setting"}
                        to={"/adminsetting"}
                        className={({ isActive }) =>
                            `link ${isActive ? "active" : ""}`
                        }
                        data-title={"الاعدادات"}
                    >
                        <span><IoSettingsOutline /></span>
                    </NavLink>
            </div>

            <button
                data-title="تسجيل خروج"
                className="logout"
                onClick={()=>{}}
            >
                <IoIosLogOut />
                <span>تسجيل خروج</span>
            </button>
        </div>
    );
}
