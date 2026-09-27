import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Dashboard() {
    const [counts, setCounts] = useState({
        projects: 0,
        skills: 0,
        blogs: 0,
        services: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [projectsRes, skillsRes, blogsRes, servicesRes] =
                    await Promise.all([
                        api.get("/projects"),
                        api.get("/skills"),
                        api.get("/blogs"),
                        api.get("/services"),
                    ]);

                setCounts({
                    projects: projectsRes.data.projects?.length || 0,
                    skills: skillsRes.data.skills?.length || 0,
                    blogs: blogsRes.data.blogs?.length || 0,
                    services: servicesRes.data.services?.length || 0,
                });
            } catch (error) {
                console.error("Failed to fetch dashboard counts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar />

            <div className="ml-64">
                <Navbar />

                <main className="p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Dashboard
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Manage your portfolio content from one place.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

                        {/* Projects */}
                        <div className="rounded-xl bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                Projects
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                {loading ? "..." : counts.projects}
                            </h2>

                            <p className="mt-1 text-sm text-gray-400">
                                Portfolio projects
                            </p>
                        </div>

                        {/* Skills */}
                        <div className="rounded-xl bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                Skills
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                {loading ? "..." : counts.skills}
                            </h2>

                            <p className="mt-1 text-sm text-gray-400">
                                Technical skills
                            </p>
                        </div>

                        {/* Blogs */}
                        <div className="rounded-xl bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                Blogs
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                {loading ? "..." : counts.blogs}
                            </h2>

                            <p className="mt-1 text-sm text-gray-400">
                                Published articles
                            </p>
                        </div>

                        {/* Services */}
                        <div className="rounded-xl bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                Services
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                {loading ? "..." : counts.services}
                            </h2>

                            <p className="mt-1 text-sm text-gray-400">
                                Available services
                            </p>
                        </div>

                    </div>

                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Quick Actions
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Quickly navigate to the sections you want to manage.
                        </p>

                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

                            <a
                                href="/about"
                                className="rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <h3 className="font-semibold text-gray-900">
                                    Manage About
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    Update your profile information and introduction.
                                </p>
                            </a>

                            <a
                                href="/skills"
                                className="rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <h3 className="font-semibold text-gray-900">
                                    Manage Skills
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    Add and manage your technical skills.
                                </p>
                            </a>

                            <a
                                href="/projects"
                                className="rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <h3 className="font-semibold text-gray-900">
                                    Manage Projects
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    Manage portfolio projects and links.
                                </p>
                            </a>

                            <a
                                href="/blogs"
                                className="rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <h3 className="font-semibold text-gray-900">
                                    Manage Blogs
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    Create and manage portfolio articles.
                                </p>
                            </a>

                            <a
                                href="/experience"
                                className="rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <h3 className="font-semibold text-gray-900">
                                    Manage Experience
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    Manage your professional experience.
                                </p>
                            </a>

                            <a
                                href="/services"
                                className="rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <h3 className="font-semibold text-gray-900">
                                    Manage Services
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    Manage services displayed on your portfolio.
                                </p>
                            </a>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;