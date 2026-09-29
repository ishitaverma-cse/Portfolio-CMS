import { NavLink } from "react-router-dom";
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
    const menuGroups = [
        {
            title: "OVERVIEW",
            items: [
                {
                    name: "Dashboard",
                    path: "/dashboard",
                    icon: LayoutDashboard,
                },
            ],
        },
        {
            title: "PORTFOLIO",
            items: [
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
                    name: "Experience",
                    path: "/experience",
                    icon: Briefcase,
                },
            ],
        },
        {
            title: "CONTENT",
            items: [
                {
                    name: "Blogs",
                    path: "/blogs",
                    icon: FileText,
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
            ],
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem("cmsToken");
        localStorage.removeItem("cmsAdmin");

        window.location.href = "http://localhost:5173";
    };

    return (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-gray-950 text-white">

            {/* Brand */}
            <div className="border-b border-white/10 px-6 py-6">
                <div className="flex items-center gap-3">
                    <img
                        src="https://res.cloudinary.com/dyxeuwxwd/image/upload/v1790669029/I.V_logo.jpg"
                        alt="I.V Studio"
                        className="h-11 w-11 rounded-lg object-cover"
                    />

                    <div>
                        <h1 className="text-lg font-semibold tracking-tight">
                            I.V Studio
                        </h1>

                        <p className="mt-0.5 text-xs text-gray-400">
                            Admin Panel
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">
                <div className="space-y-7">
                    {menuGroups.map((group) => (
                        <div key={group.title}>
                            <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.18em] text-gray-500">
                                {group.title}
                            </p>

                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            className={({ isActive }) =>
                                                `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${isActive
                                                    ? "bg-white text-gray-950 shadow-sm"
                                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                                }`
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <Icon
                                                        size={18}
                                                        strokeWidth={isActive ? 2.2 : 1.8}
                                                    />

                                                    <span className="font-medium">
                                                        {item.name}
                                                    </span>
                                                </>
                                            )}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </nav>

            {/* Admin + Logout */}
            <div className="border-t border-white/10 px-4 py-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
                >
                    <LogOut size={18} strokeWidth={1.8} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;