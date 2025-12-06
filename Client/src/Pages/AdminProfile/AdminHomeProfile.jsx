import { FiUser, FiMail, FiPhone, FiCalendar } from "react-icons/fi";
import { admin } from "./../../data";
import imgProfile from "../../assets/profile.png";

export default function AdminHomeProfile() {
    return (
        <div className="profile-page">
            <div className="page-header">
                <h1>الملف الشخصي</h1>
                <p>معلومات حساب المسؤول</p>
            </div>

            <div className="admin-profile-card">
                <div className="profile-image">
                    <img src={imgProfile} alt="" />
                </div>

                <div className="profile-info">
                    <h2>
                        {admin.first_name} {admin.last_name}
                    </h2>

                    <div className="info-grid">
                        <div className="info-item">
                            <label>الاسم الأول</label>
                            <span>{admin.first_name}</span>
                        </div>

                        <div className="info-item">
                            <label>الاسم الأخير</label>
                            <span>{admin.last_name}</span>
                        </div>

                        <div className="info-item">
                            <label>
                                <FiMail
                                    style={{
                                        display: "inline",
                                        marginLeft: "0.5rem",
                                    }}
                                />
                                البريد الإلكتروني
                            </label>
                            <span>{admin.email}</span>
                        </div>

                        <div className="info-item">
                            <label>
                                <FiPhone
                                    style={{
                                        display: "inline",
                                        marginLeft: "0.5rem",
                                    }}
                                />
                                رقم الهاتف
                            </label>
                            <span>{admin.phone}</span>
                        </div>

                        <div className="info-item">
                            <label>الجنس</label>
                            <span>{admin.gender}</span>
                        </div>

                        <div className="info-item">
                            <label>
                                <FiCalendar
                                    style={{
                                        display: "inline",
                                        marginLeft: "0.5rem",
                                    }}
                                />
                                تاريخ الميلاد
                            </label>
                            <span>{admin.birth_date}</span>
                        </div>
                        <div className="info-item">
                            <label>تاريخ إنشاء الحساب</label>
                            <span>{admin.created_at}</span>
                        </div>

                        <div className="info-item">
                            <label>تاريخ التوظيف</label>
                            <span>{admin.date_employed}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
