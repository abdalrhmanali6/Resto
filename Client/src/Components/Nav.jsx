import { FaUsers } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { MdDeliveryDining, MdFastfood, MdFoodBank } from "react-icons/md";
import { RiHome9Line } from "react-icons/ri";
import { NavLink } from "react-router-dom";

export default function Nav() {
    return (
        <div className="profile-nav">
            <div>
                <div className="logo">
                    <MdFoodBank size={35} />
                    <h3>لوحة التحكم</h3>
                </div>
                <div className="links">
                    <NavLink
                        key={"profile"}
                        to={"profile"}
                        className={({ isActive }) =>
                            `link ${isActive ? "active" : ""}`
                        }
                        data-title={"الرئيسية"}
                    >
                        <RiHome9Line />
                        <span>الرئيسية</span>
                    </NavLink>
                    <NavLink
                        key={"foods"}
                        to={"foods"}
                        className={({ isActive }) =>
                            `link ${isActive ? "active" : ""}`
                        }
                        data-title={"الوجبات"}
                    >
                        <MdFastfood />
                        <span>الوجبات</span>
                    </NavLink>
                    <NavLink
                        key={"orders"}
                        to={"orders"}
                        className={({ isActive }) =>
                            `link ${isActive ? "active" : ""}`
                        }
                        data-title={"الطلبات"}
                    >
                        <MdDeliveryDining />
                        <span>الطلبات</span>
                    </NavLink>
                    <NavLink
                        key={"users"}
                        to={"users"}
                        className={({ isActive }) =>
                            `link ${isActive ? "active" : ""}`
                        }
                        data-title={"المستخدمين"}
                    >
                        <FaUsers />
                        <span>المستخدمين</span>
                    </NavLink>
                    <NavLink
                        key={"setting"}
                        to={"settings"}
                        className={({ isActive }) =>
                            `link ${isActive ? "active" : ""}`
                        }
                        data-title={"الاعدادات"}
                    >
                        <IoSettingsOutline />
                        <span>الاعدادات</span>
                    </NavLink>
                </div>
            </div>
            <button
                data-title="تسجيل خروج"
                className="logout"
                onClick={() => {}}
            >
                <IoIosLogOut />
                <span>تسجيل خروج</span>
            </button>
        </div>
    );
}
