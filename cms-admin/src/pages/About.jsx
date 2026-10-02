import { useEffect, useState } from "react";
import {
    ArrowUpRight,
    FileText,
    Image,
    MapPin,
    Save,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function About() {
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        description: "",
        profileImage: "",
        resumeUrl: "",
        location: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    /* =================================================
       FETCH ABOUT CONTENT
    ================================================= */

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const response = await api.get("/about");

                setFormData({
                    name: response.data.name || "",
                    title: response.data.title || "",
                    description: response.data.description || "",
                    profileImage: response.data.profileImage || "",
                    resumeUrl: response.data.resumeUrl || "",
                    location: response.data.location || "",
                });
            } catch (error) {
                if (error.response?.status === 404) {
                    setMessage(
                        "No About content found. You can create it below."
                    );
                } else {
                    setError(
                        "Failed to load About content."
                    );

                    console.error(
                        "Fetch about error:",
                        error
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAbout();
    }, []);

    /* =================================================
       HANDLE INPUT
    ================================================= */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setMessage("");
        setError("");
    };

    /* =================================================
       SAVE ABOUT CONTENT
    ================================================= */

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {
            const response = await api.put(
                "/about",
                formData
            );

            setFormData({
                name: response.data.about.name || "",
                title: response.data.about.title || "",
                description:
                    response.data.about.description || "",
                profileImage:
                    response.data.about.profileImage || "",
                resumeUrl:
                    response.data.about.resumeUrl || "",
                location:
                    response.data.about.location || "",
            });

            setMessage(
                "About content updated successfully."
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update About content."
            );

            console.error(
                "Update about error:",
                error
            );
        } finally {
            setSaving(false);
        }
    };

    /* =================================================
       LOADING
    ================================================= */

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f4f4f2]">
                <Sidebar />

                <div className="ml-64">
                    <Navbar />

                    <main className="p-8">
                        <div className="flex min-h-[60vh] items-center justify-center">
                            <p className="text-sm text-gray-400">
                                Loading About content...
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    /* =================================================
       PAGE
    ================================================= */

    return (
        <div className="min-h-screen bg-[#f4f4f2]">
            <Sidebar />

            <div className="ml-64">
                <Navbar />

                <main className="p-8">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="mb-8">
                        <div className="flex items-end justify-between">

                            <div>
                                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                                    Portfolio
                                </p>

                                <h1 className="text-4xl font-semibold tracking-tight text-gray-950">
                                    About
                                </h1>

                                <p className="mt-2 max-w-xl text-sm text-gray-500">
                                    Manage the personal introduction
                                    displayed on your public portfolio.
                                </p>
                            </div>

                            <div className="hidden items-center gap-2 text-xs text-gray-400 md:flex">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                Portfolio content
                            </div>

                        </div>
                    </div>

                    {/* =================================================
                        MESSAGES
                    ================================================= */}

                    {message && (
                        <div className="mb-6 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            <span>{message}</span>

                            <button
                                type="button"
                                onClick={() => setMessage("")}
                                className="text-green-500 transition hover:text-green-800"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            <span>{error}</span>

                            <button
                                type="button"
                                onClick={() => setError("")}
                                className="text-red-500 transition hover:text-red-800"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* =================================================
                        MAIN EDITOR
                    ================================================= */}

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">

                        {/* =================================================
                            EDITOR
                        ================================================= */}

                        <div className="xl:col-span-7">

                            <div className="rounded-2xl border border-gray-300 bg-white p-7">

                                <div className="border-b border-gray-100 pb-6">
                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-950 text-white">
                                            <FileText
                                                size={17}
                                                strokeWidth={1.6}
                                            />
                                        </div>

                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-950">
                                                Edit About
                                            </h2>

                                            <p className="mt-0.5 text-xs text-gray-400">
                                                Update your portfolio introduction
                                            </p>
                                        </div>

                                    </div>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6 pt-7"
                                >

                                    {/* NAME */}

                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500"
                                        >
                                            Name
                                        </label>

                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. Ishita Verma"
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-1 focus:ring-gray-950"
                                        />
                                    </div>

                                    {/* TITLE */}

                                    <div>
                                        <label
                                            htmlFor="title"
                                            className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500"
                                        >
                                            Title
                                        </label>

                                        <input
                                            id="title"
                                            name="title"
                                            type="text"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. Full Stack Developer"
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-1 focus:ring-gray-950"
                                        />
                                    </div>

                                    {/* DESCRIPTION */}

                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label
                                                htmlFor="description"
                                                className="block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500"
                                            >
                                                Description
                                            </label>

                                            <span className="text-[11px] text-gray-400">
                                                {formData.description.length}{" "}
                                                characters
                                            </span>
                                        </div>

                                        <textarea
                                            id="description"
                                            name="description"
                                            value={
                                                formData.description
                                            }
                                            onChange={handleChange}
                                            required
                                            rows="7"
                                            placeholder="Write a short introduction about yourself..."
                                            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-1 focus:ring-gray-950"
                                        />
                                    </div>

                                    {/* PROFILE IMAGE */}

                                    <div>
                                        <label
                                            htmlFor="profileImage"
                                            className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500"
                                        >
                                            Profile Image URL
                                        </label>

                                        <div className="relative">
                                            <Image
                                                size={17}
                                                strokeWidth={1.6}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                id="profileImage"
                                                name="profileImage"
                                                type="url"
                                                value={
                                                    formData.profileImage
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="https://example.com/profile.jpg"
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-1 focus:ring-gray-950"
                                            />
                                        </div>
                                    </div>

                                    {/* RESUME */}

                                    <div>
                                        <label
                                            htmlFor="resumeUrl"
                                            className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500"
                                        >
                                            Resume URL
                                        </label>

                                        <div className="relative">
                                            <FileText
                                                size={17}
                                                strokeWidth={1.6}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                id="resumeUrl"
                                                name="resumeUrl"
                                                type="url"
                                                value={
                                                    formData.resumeUrl
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="https://example.com/resume.pdf"
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-1 focus:ring-gray-950"
                                            />
                                        </div>
                                    </div>

                                    {/* LOCATION */}
                                    <div>
                                        <label
                                            htmlFor="location"
                                            className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500"
                                        >
                                            Location
                                        </label>

                                        <div className="relative">
                                            <MapPin
                                                size={17}
                                                strokeWidth={1.6}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                id="location"
                                                name="location"
                                                type="text"
                                                value={
                                                    formData.location
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="e.g. Punjab, India"
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-1 focus:ring-gray-950"
                                            />
                                        </div>
                                    </div>

                                    {/* SAVE */}

                                    <div className="flex items-center justify-between border-t border-gray-100 pt-6">

                                        <p className="text-xs text-gray-400">
                                            Changes will be reflected on
                                            your public portfolio.
                                        </p>

                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <Save
                                                size={16}
                                                strokeWidth={1.7}
                                            />

                                            {saving
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </button>

                                    </div>

                                </form>
                            </div>
                        </div>

                        {/* =================================================
                            PREVIEW
                        ================================================= */}
                        <div className="xl:col-span-5">

                            <div className="sticky top-8 rounded-2xl border border-gray-300 bg-white p-7">

                                <div className="border-b border-gray-100 pb-6">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                                        Preview
                                    </p>

                                    <h2 className="mt-2 text-lg font-semibold text-gray-950">
                                        About Section
                                    </h2>

                                    <p className="mt-1 text-xs text-gray-400">
                                        Live preview of your portfolio content
                                    </p>
                                </div>

                                {/* PROFILE IMAGE */}
                                <div className="mt-7 flex justify-center">
                                    {formData.profileImage ? (
                                        <img
                                            src={
                                                formData.profileImage
                                            }
                                            alt="Profile preview"
                                            className="h-64 w-full rounded-2xl object-contain bg-gray-50"
                                            onError={(e) => {
                                                e.currentTarget.style.display =
                                                    "none";
                                            }}
                                        />
                                    ) : (
                                        <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gray-100">
                                            <Image
                                                size={28}
                                                strokeWidth={1.4}
                                                className="text-gray-300"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* CONTENT */}

                                <div className="mt-7 text-center">

                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                                        About Me
                                    </p>

                                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-gray-950">
                                        {formData.name || "Your Name"}
                                    </h3>

                                    <p className="mt-2 text-sm font-medium text-gray-500">
                                        {formData.title || "Your Title"}
                                    </p>

                                    <p className="mt-4 text-sm leading-6 text-gray-500">
                                        {formData.description ||
                                            "Your introduction will appear here as you add it to the form."}
                                    </p>

                                </div>

                                {/* META */}

                                <div className="mt-7 space-y-3 border-t border-gray-100 pt-6">

                                    {formData.location && (
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <MapPin
                                                size={16}
                                                strokeWidth={1.6}
                                                className="text-gray-400"
                                            />

                                            <span>
                                                {formData.location}
                                            </span>
                                        </div>
                                    )}

                                    {formData.resumeUrl && (
                                        <a
                                            href={
                                                formData.resumeUrl
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group flex items-center justify-between text-sm font-medium text-gray-900 transition hover:text-gray-500"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText
                                                    size={16}
                                                    strokeWidth={
                                                        1.6
                                                    }
                                                    className="text-gray-400"
                                                />

                                                <span>
                                                    View Resume
                                                </span>
                                            </div>

                                            <ArrowUpRight
                                                size={16}
                                                strokeWidth={
                                                    1.5
                                                }
                                                className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                            />
                                        </a>
                                    )}

                                </div>

                                {!formData.location &&
                                    !formData.resumeUrl && (
                                        <p className="mt-7 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
                                            Add your location or resume
                                            URL to see them here.
                                        </p>
                                    )}

                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default About;