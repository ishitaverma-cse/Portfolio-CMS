import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    User,
    Code2,
    FolderKanban,
    FileText,
    Briefcase,
    MessageSquareQuote,
    Wrench,
    LogOut,
} from "lucide-react";

function Sidebar() {
    const navigate = useNavigate();

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "About",
            path: "/about",
            icon: User,
        },
        {
            name: "Skills",
            path: "/skills",
            icon: Code2,
        },
        {
            name: "Projects",
            path: "/projects",
            icon: FolderKanban,
        },
        {
            name: "Blogs",
            path: "/blogs",
            icon: FileText,
        },
        {
            name: "Experience",
            path: "/experience",
            icon: Briefcase,
        },
        {
            name: "Testimonials",
            path: "/testimonials",
            icon: MessageSquareQuote,
        },
        {
            name: "Services",
            path: "/services",
            icon: Wrench,
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem("cmsToken");
        localStorage.removeItem("cmsAdmin");

        window.location.href = "http://localhost:5173";
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col">
            {/* Logo */}
            <div className="px-6 py-6 border-b border-gray-800">
                <h1 className="text-xl font-bold">Portfolio CMS</h1>
                <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                                    ? "bg-white text-gray-900"
                                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                }`
                            }
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="px-4 py-5 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;