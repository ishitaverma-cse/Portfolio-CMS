import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function About() {
    const [formData, setFormData] = useState({
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

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const response = await api.get("/about");

                setFormData({
                    title: response.data.title || "",
                    description: response.data.description || "",
                    profileImage: response.data.profileImage || "",
                    resumeUrl: response.data.resumeUrl || "",
                    location: response.data.location || "",
                });
            } catch (error) {
                if (error.response?.status === 404) {
                    setMessage("No About content found. You can create it below.");
                } else {
                    setError("Failed to load About content.");
                    console.error("Fetch about error:", error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAbout();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {
            const response = await api.put("/about", formData);

            setFormData({
                title: response.data.about.title || "",
                description: response.data.about.description || "",
                profileImage: response.data.about.profileImage || "",
                resumeUrl: response.data.about.resumeUrl || "",
                location: response.data.about.location || "",
            });

            setMessage("About content updated successfully.");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update About content."
            );

            console.error("Update about error:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Sidebar />

                <div className="ml-64">
                    <Navbar />

                    <main className="p-8">
                        <p className="text-gray-500">
                            Loading About content...
                        </p>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar />

            <div className="ml-64">
                <Navbar />

                <main className="p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            About
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Manage your profile information and introduction.
                        </p>
                    </div>

                    {/* Messages */}
                    {message && (
                        <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <div className="max-w-4xl rounded-xl bg-white p-8 shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Title */}
                            <div>
                                <label
                                    htmlFor="title"
                                    className="mb-2 block text-sm font-medium text-gray-700"
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
                                    placeholder="Enter your title"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Description
                                </label>

                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="6"
                                    placeholder="Write your introduction..."
                                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                />
                            </div>

                            {/* Profile Image */}
                            <div>
                                <label
                                    htmlFor="profileImage"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Profile Image URL
                                </label>

                                <input
                                    id="profileImage"
                                    name="profileImage"
                                    type="url"
                                    value={formData.profileImage}
                                    onChange={handleChange}
                                    placeholder="https://example.com/profile.jpg"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                />
                            </div>

                            {/* Resume */}
                            <div>
                                <label
                                    htmlFor="resumeUrl"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Resume URL
                                </label>

                                <input
                                    id="resumeUrl"
                                    name="resumeUrl"
                                    type="url"
                                    value={formData.resumeUrl}
                                    onChange={handleChange}
                                    placeholder="https://example.com/resume.pdf"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label
                                    htmlFor="location"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Location
                                </label>

                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Enter your location"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                />
                            </div>

                            {/* Save */}
                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>

                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default About;