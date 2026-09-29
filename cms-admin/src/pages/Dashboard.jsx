import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowUpRight,
    Briefcase,
    Code2,
    FileText,
    FolderKanban,
    MessageSquareQuote,
    Wrench,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Dashboard() {
    const [content, setContent] = useState({
        projects: [],
        skills: [],
        blogs: [],
        experience: [],
        testimonials: [],
        services: [],
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [
                    projectsRes,
                    skillsRes,
                    blogsRes,
                    experienceRes,
                    testimonialsRes,
                    servicesRes,
                ] = await Promise.all([
                    api.get("/projects"),
                    api.get("/skills"),
                    api.get("/blogs"),
                    api.get("/experience"),
                    api.get("/testimonials"),
                    api.get("/services"),
                ]);

                const getArray = (response, key) => {
                    if (Array.isArray(response.data)) {
                        return response.data;
                    }

                    return response.data?.[key] || [];
                };

                setContent({
                    projects: getArray(projectsRes, "projects"),
                    skills: getArray(skillsRes, "skills"),
                    blogs: getArray(blogsRes, "blogs"),
                    experience: getArray(experienceRes, "experience"),
                    testimonials: getArray(
                        testimonialsRes,
                        "testimonials"
                    ),
                    services: getArray(servicesRes, "services"),
                });
            } catch (error) {
                console.error(
                    "Failed to fetch dashboard data:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    /* =================================================
       RECENT PROJECTS
    ================================================= */

    const recentProjects = useMemo(() => {
        return [...content.projects]
            .sort(
                (a, b) =>
                    new Date(b.createdAt || 0) -
                    new Date(a.createdAt || 0)
            )
            .slice(0, 2);
    }, [content.projects]);

    /* =================================================
       RECENT CONTENT
    ================================================= */

    const recentContent = useMemo(() => {
        const blogs = content.blogs.map((blog) => ({
            id: blog._id,
            type: "BLOG",
            title: blog.title,
            subtitle: blog.excerpt || "Portfolio article",
            date: blog.createdAt,
            path: "/blogs",
            icon: FileText,
        }));

        const experiences = content.experience.map((item) => ({
            id: item._id,
            type: "EXPERIENCE",
            title: item.role,
            subtitle: item.company,
            date: item.createdAt,
            path: "/experience",
            icon: Briefcase,
        }));

        return [...blogs, ...experiences]
            .sort(
                (a, b) =>
                    new Date(b.date || 0) -
                    new Date(a.date || 0)
            )
            .slice(0, 3);
    }, [content.blogs, content.experience]);

    /* =================================================
       TOTAL CONTENT
    ================================================= */

    const totalContent =
        content.projects.length +
        content.skills.length +
        content.blogs.length +
        content.experience.length +
        content.testimonials.length +
        content.services.length;

    /* =================================================
       DATE
    ================================================= */

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    /* =================================================
       FORMAT DATE
    ================================================= */

    const formatMonth = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-[#f4f4f2]">
            <Sidebar />

            <div className="ml-64">
                <Navbar />

                <main className="p-8">
                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="mb-10 flex items-end justify-between">
                        <div>
                            <p className="mb-2 text-sm text-gray-500">
                                ✧ Welcome back,{" "}
                                <span className="font-semibold text-gray-950">
                                    Portfolio Admin
                                </span>
                            </p>

                            <h1 className="text-4xl font-semibold tracking-tight text-gray-950">
                                Dashboard
                            </h1>

                            <p className="mt-2 text-gray-500">
                                Your I.V Studio portfolio at a glance.
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                                Today
                            </p>

                            <p className="mt-2 text-sm font-semibold text-gray-900">
                                {today}
                            </p>
                        </div>
                    </div>

                    {/* =================================================
                        MAIN TWO-COLUMN DASHBOARD
                    ================================================= */}

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">

                        {/* =================================================
                            LEFT COLUMN
                        ================================================= */}

                        <div className="flex flex-col gap-6 xl:col-span-8">

                            {/* ================================
                                RECENT PROJECTS
                            ================================= */}

                            <div className="rounded-2xl border border-gray-200 bg-white p-7">

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                                            Portfolio
                                        </p>

                                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">
                                            Recent Projects
                                        </h2>
                                    </div>

                                    <Link
                                        to="/projects"
                                        className="group flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-gray-950"
                                    >
                                        View all

                                        <ArrowUpRight
                                            size={15}
                                            strokeWidth={1.6}
                                            className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                        />
                                    </Link>
                                </div>

                                <div className="mt-7 border-t border-gray-100">
                                    {loading ? (
                                        <div className="py-8 text-sm text-gray-400">
                                            Loading projects...
                                        </div>
                                    ) : recentProjects.length === 0 ? (
                                        <div className="py-8 text-sm text-gray-400">
                                            No projects added yet.
                                        </div>
                                    ) : (
                                        recentProjects.map(
                                            (project, index) => (
                                                <div
                                                    key={
                                                        project._id ||
                                                        index
                                                    }
                                                    className="flex items-center justify-between border-b border-gray-100 py-6 last:border-b-0"
                                                >
                                                    <div className="flex min-w-0 items-center gap-4">

                                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-950 text-white">
                                                            <FolderKanban
                                                                size={19}
                                                                strokeWidth={
                                                                    1.6
                                                                }
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <h3 className="truncate text-sm font-semibold text-gray-950">
                                                                {
                                                                    project.title
                                                                }
                                                            </h3>

                                                            <p className="mt-1 max-w-xl truncate text-sm text-gray-500">
                                                                {
                                                                    project.description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="ml-6 flex shrink-0 items-center gap-4">
                                                        <span className="text-xs text-gray-400">
                                                            {formatMonth(
                                                                project.createdAt
                                                            )}
                                                        </span>

                                                        <ArrowUpRight
                                                            size={17}
                                                            strokeWidth={
                                                                1.5
                                                            }
                                                            className="text-gray-300"
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        )
                                    )}
                                </div>
                            </div>

                            {/* ================================
                                RECENT CONTENT
                            ================================= */}

                            <div className="rounded-2xl border border-gray-200 bg-white p-7">

                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                                        Activity
                                    </p>

                                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">
                                        Recent Content
                                    </h2>
                                </div>

                                <div className="mt-7 border-t border-gray-100">
                                    {loading ? (
                                        <div className="py-8 text-sm text-gray-400">
                                            Loading content...
                                        </div>
                                    ) : recentContent.length === 0 ? (
                                        <div className="py-8 text-sm text-gray-400">
                                            No recent content available.
                                        </div>
                                    ) : (
                                        recentContent.map(
                                            (item, index) => {
                                                const Icon = item.icon;

                                                return (
                                                    <Link
                                                        key={
                                                            item.id ||
                                                            index
                                                        }
                                                        to={item.path}
                                                        className="group flex items-center justify-between border-b border-gray-100 py-6 last:border-b-0"
                                                    >
                                                        <div className="flex min-w-0 items-center gap-4">

                                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                                                                <Icon
                                                                    size={
                                                                        18
                                                                    }
                                                                    strokeWidth={
                                                                        1.6
                                                                    }
                                                                    className="text-gray-500"
                                                                />
                                                            </div>

                                                            <div className="min-w-0">
                                                                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                                                                    {
                                                                        item.type
                                                                    }
                                                                </p>

                                                                <h3 className="mt-1 truncate text-sm font-semibold text-gray-950">
                                                                    {
                                                                        item.title
                                                                    }
                                                                </h3>

                                                                {item.subtitle && (
                                                                    <p className="mt-1 truncate text-sm text-gray-500">
                                                                        {
                                                                            item.subtitle
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <ArrowUpRight
                                                            size={17}
                                                            strokeWidth={
                                                                1.5
                                                            }
                                                            className="ml-6 shrink-0 text-gray-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gray-950"
                                                        />
                                                    </Link>
                                                );
                                            }
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            RIGHT COLUMN
                        ================================================= */}

                        <div className="flex flex-col gap-6 xl:col-span-4">

                            {/* ================================
                                CONTENT STATISTICS
                            ================================= */}

                            <div className="rounded-2xl border border-gray-200 bg-white p-7">

                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                                            Overview
                                        </p>

                                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">
                                            Content Statistics
                                        </h2>
                                    </div>

                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-950 text-sm font-semibold text-white">
                                        IV
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="mt-7 rounded-xl bg-gray-950 p-6 text-white">

                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                                        Total Content
                                    </p>

                                    <div className="mt-2 flex items-end justify-between">
                                        <span className="text-4xl font-semibold tracking-tight">
                                            {loading
                                                ? "—"
                                                : totalContent}
                                        </span>

                                        <span className="text-xs text-gray-400">
                                            across portfolio
                                        </span>
                                    </div>
                                </div>

                                {/* Statistics */}
                                <div className="mt-6 grid grid-cols-2">

                                    {/* Projects */}
                                    <Link
                                        to="/projects"
                                        className="group flex items-center justify-between border-b border-r border-gray-100 px-1 py-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FolderKanban
                                                size={17}
                                                strokeWidth={1.6}
                                                className="text-gray-400"
                                            />

                                            <span className="text-sm text-gray-600">
                                                Projects
                                            </span>
                                        </div>

                                        <span className="text-sm font-semibold text-gray-950">
                                            {loading
                                                ? "—"
                                                : String(
                                                    content.projects
                                                        .length
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                        </span>
                                    </Link>

                                    {/* Skills */}
                                    <Link
                                        to="/skills"
                                        className="group flex items-center justify-between border-b border-gray-100 px-4 py-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Code2
                                                size={17}
                                                strokeWidth={1.6}
                                                className="text-gray-400"
                                            />

                                            <span className="text-sm text-gray-600">
                                                Skills
                                            </span>
                                        </div>

                                        <span className="text-sm font-semibold text-gray-950">
                                            {loading
                                                ? "—"
                                                : String(
                                                    content.skills
                                                        .length
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                        </span>
                                    </Link>

                                    {/* Blogs */}
                                    <Link
                                        to="/blogs"
                                        className="group flex items-center justify-between border-b border-r border-gray-100 px-1 py-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText
                                                size={17}
                                                strokeWidth={1.6}
                                                className="text-gray-400"
                                            />

                                            <span className="text-sm text-gray-600">
                                                Blogs
                                            </span>
                                        </div>

                                        <span className="text-sm font-semibold text-gray-950">
                                            {loading
                                                ? "—"
                                                : String(
                                                    content.blogs
                                                        .length
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                        </span>
                                    </Link>

                                    {/* Experience */}
                                    <Link
                                        to="/experience"
                                        className="group flex items-center justify-between border-b border-gray-100 px-4 py-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Briefcase
                                                size={17}
                                                strokeWidth={1.6}
                                                className="text-gray-400"
                                            />

                                            <span className="text-sm text-gray-600">
                                                Experience
                                            </span>
                                        </div>

                                        <span className="text-sm font-semibold text-gray-950">
                                            {loading
                                                ? "—"
                                                : String(
                                                    content
                                                        .experience
                                                        .length
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                        </span>
                                    </Link>

                                    {/* Testimonials */}
                                    <Link
                                        to="/testimonials"
                                        className="group flex items-center justify-between border-r border-gray-100 px-1 py-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <MessageSquareQuote
                                                size={17}
                                                strokeWidth={1.6}
                                                className="text-gray-400"
                                            />

                                            <span className="text-sm text-gray-600">
                                                Testimonials
                                            </span>
                                        </div>

                                        <span className="text-sm font-semibold text-gray-950">
                                            {loading
                                                ? "—"
                                                : String(
                                                    content
                                                        .testimonials
                                                        .length
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                        </span>
                                    </Link>

                                    {/* Services */}
                                    <Link
                                        to="/services"
                                        className="group flex items-center justify-between px-4 py-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Wrench
                                                size={17}
                                                strokeWidth={1.6}
                                                className="text-gray-400"
                                            />

                                            <span className="text-sm text-gray-600">
                                                Services
                                            </span>
                                        </div>

                                        <span className="text-sm font-semibold text-gray-950">
                                            {loading
                                                ? "—"
                                                : String(
                                                    content
                                                        .services
                                                        .length
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                        </span>
                                    </Link>
                                </div>
                            </div>

                            {/* ================================
                                QUICK MODULES
                            ================================= */}

                            <div className="grid grid-cols-2 gap-4">

                                <Link
                                    to="/projects"
                                    className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:bg-gray-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-950 text-white">
                                            <FolderKanban
                                                size={16}
                                                strokeWidth={1.6}
                                            />
                                        </div>

                                        <ArrowUpRight
                                            size={15}
                                            strokeWidth={1.5}
                                            className="text-gray-300 transition group-hover:text-gray-950"
                                        />
                                    </div>

                                    <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                                        Projects
                                    </p>

                                    <p className="mt-1 text-2xl font-semibold text-gray-950">
                                        {loading
                                            ? "—"
                                            : content.projects.length}
                                    </p>
                                </Link>

                                <Link
                                    to="/skills"
                                    className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:bg-gray-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                                            <Code2
                                                size={16}
                                                strokeWidth={1.6}
                                                className="text-gray-600"
                                            />
                                        </div>

                                        <ArrowUpRight
                                            size={15}
                                            strokeWidth={1.5}
                                            className="text-gray-300 transition group-hover:text-gray-950"
                                        />
                                    </div>

                                    <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                                        Skills
                                    </p>

                                    <p className="mt-1 text-2xl font-semibold text-gray-950">
                                        {loading
                                            ? "—"
                                            : content.skills.length}
                                    </p>
                                </Link>

                                <Link
                                    to="/services"
                                    className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:bg-gray-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                                            <Wrench
                                                size={16}
                                                strokeWidth={1.6}
                                                className="text-gray-600"
                                            />
                                        </div>

                                        <ArrowUpRight
                                            size={15}
                                            strokeWidth={1.5}
                                            className="text-gray-300 transition group-hover:text-gray-950"
                                        />
                                    </div>

                                    <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                                        Services
                                    </p>

                                    <p className="mt-1 text-2xl font-semibold text-gray-950">
                                        {loading
                                            ? "—"
                                            : content.services.length}
                                    </p>
                                </Link>

                                <Link
                                    to="/testimonials"
                                    className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:bg-gray-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                                            <MessageSquareQuote
                                                size={16}
                                                strokeWidth={1.6}
                                                className="text-gray-600"
                                            />
                                        </div>

                                        <ArrowUpRight
                                            size={15}
                                            strokeWidth={1.5}
                                            className="text-gray-300 transition group-hover:text-gray-950"
                                        />
                                    </div>

                                    <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                                        Testimonials
                                    </p>

                                    <p className="mt-1 text-2xl font-semibold text-gray-950">
                                        {loading
                                            ? "—"
                                            : content.testimonials
                                                .length}
                                    </p>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                            I.V STUDIO CTA
                        ================================================= */}

                    <div className="relative overflow-hidden rounded-2xl bg-gray-950 px-7 py-7 text-white xl:col-span-12">
                        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                                    I.V Studio
                                </p>

                                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                                    Your portfolio, your story.
                                </h2>

                                <p className="mt-2 max-w-lg text-sm leading-6 text-gray-400">
                                    Keep your projects, experience
                                    and professional content
                                    up to date.
                                </p>
                            </div>

                            <Link
                                to="/projects"
                                className="group inline-flex w-fit items-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-semibold text-gray-950 transition hover:bg-gray-200"
                            >
                                Manage portfolio

                                <ArrowUpRight
                                    size={15}
                                    strokeWidth={1.8}
                                    className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                            </Link>
                        </div>

                        {/* Decorative circle */}
                        <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/10" />

                        <div className="absolute -bottom-32 right-24 h-56 w-56 rounded-full border border-white/5" />
                    </div>

                </main>
            </div>
        </div>
    );
}

export default Dashboard;