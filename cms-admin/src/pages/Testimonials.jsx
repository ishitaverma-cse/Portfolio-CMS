import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [previewImage, setPreviewImage] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        role: "",
        company: "",
        message: "",
        image: "",
    });

    const fetchTestimonials = async () => {
        try {
            const response = await api.get("/testimonials");
            setTestimonials(response.data);
        } catch (error) {
            console.error("Fetch testimonials error:", error);
            setError("Failed to load testimonials.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData({
            name: "",
            role: "",
            company: "",
            message: "",
            image: "",
        });

        setEditingTestimonial(null);
        setShowForm(false);
    };

    const handleAddTestimonial = () => {
        setEditingTestimonial(null);

        setFormData({
            name: "",
            role: "",
            company: "",
            message: "",
            image: "",
        });

        setMessage("");
        setError("");
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {
            if (editingTestimonial) {
                await api.put(
                    `/testimonials/${editingTestimonial._id}`,
                    formData
                );

                setMessage("Testimonial updated successfully.");
            } else {
                await api.post("/testimonials", formData);

                setMessage("Testimonial created successfully.");
            }

            resetForm();
            await fetchTestimonials();
        } catch (error) {
            console.error("Save testimonial error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to save testimonial."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (testimonial) => {
        setEditingTestimonial(testimonial);

        setFormData({
            name: testimonial.name || "",
            role: testimonial.role || "",
            company: testimonial.company || "",
            message: testimonial.message || "",
            image: testimonial.image || "",
        });

        setMessage("");
        setError("");
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this testimonial?"
        );

        if (!confirmed) return;

        try {
            setMessage("");
            setError("");

            await api.delete(`/testimonials/${id}`);

            setMessage("Testimonial deleted successfully.");

            if (editingTestimonial?._id === id) {
                resetForm();
            }

            await fetchTestimonials();
        } catch (error) {
            console.error("Delete testimonial error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to delete testimonial."
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar />

            <div className="ml-64">
                <Navbar />

                <main className="p-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Testimonials
                            </h1>

                            <p className="mt-2 text-gray-500">
                                Manage testimonials displayed on your portfolio.
                            </p>
                        </div>

                        <button
                            onClick={handleAddTestimonial}
                            className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                        >
                            + Add Testimonial
                        </button>
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
                    {showForm && (
                        <div className="mb-8 max-w-4xl rounded-xl bg-white p-8 shadow-sm">
                            <div className="mb-6 flex items-start justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {editingTestimonial
                                            ? "Edit Testimonial"
                                            : "Add Testimonial"}
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {editingTestimonial
                                            ? "Update the selected testimonial."
                                            : "Add a new testimonial to your portfolio."}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="text-sm font-medium text-gray-500 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Rahul Sharma"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                    />
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Role
                                    </label>

                                    <input
                                        type="text"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        placeholder="e.g. Software Engineer"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                    />
                                </div>

                                {/* Company */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Company
                                    </label>

                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        placeholder="e.g. Tech Company"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Testimonial
                                    </label>

                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="6"
                                        placeholder="Write the testimonial..."
                                        className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                    />
                                </div>

                                {/* Image */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Image URL
                                    </label>

                                    <input
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        placeholder="https://example.com/profile.jpg"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-3 pt-3">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {saving
                                            ? "Saving..."
                                            : editingTestimonial
                                                ? "Update Testimonial"
                                                : "Create Testimonial"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Testimonials Table */}
                    <div className="rounded-xl bg-white shadow-sm">
                        <div className="border-b border-gray-100 px-6 py-5">
                            <h2 className="text-lg font-semibold text-gray-900">
                                All Testimonials
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                View and manage your existing testimonials.
                            </p>
                        </div>

                        {loading ? (
                            <div className="px-6 py-10 text-center text-gray-500">
                                Loading testimonials...
                            </div>
                        ) : testimonials.length === 0 ? (
                            <div className="px-6 py-10 text-center text-gray-500">
                                No testimonials found.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
                                            <th className="px-6 py-4 font-medium">
                                                Person
                                            </th>

                                            <th className="px-6 py-4 font-medium">
                                                Company
                                            </th>

                                            <th className="px-6 py-4 font-medium">
                                                Testimonial
                                            </th>

                                            <th className="px-6 py-4 text-right font-medium">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {testimonials.map((testimonial) => (
                                            <tr
                                                key={testimonial._id}
                                                className="border-b border-gray-50 last:border-0"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {testimonial.image ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => setPreviewImage(testimonial.image)}
                                                                className="shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                                                                title="Preview image"
                                                            >
                                                                <img
                                                                    src={testimonial.image}
                                                                    alt={testimonial.name}
                                                                    className="h-10 w-10 rounded-full object-cover transition hover:opacity-80"
                                                                />
                                                            </button>
                                                        ) : (
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                                                                {testimonial.name
                                                                    ?.charAt(0)
                                                                    .toUpperCase()}
                                                            </div>
                                                        )}

                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {testimonial.name}
                                                            </p>

                                                            {testimonial.role && (
                                                                <p className="mt-1 text-sm text-gray-500">
                                                                    {testimonial.role}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-gray-600">
                                                    {testimonial.company || "—"}
                                                </td>

                                                <td className="max-w-md px-6 py-4">
                                                    <p className="truncate text-gray-600">
                                                        {testimonial.message}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(testimonial)
                                                            }
                                                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(testimonial._id)
                                                            }
                                                            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {previewImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
                    onClick={() => setPreviewImage(null)}
                >
                    <div
                        className="relative max-h-[90vh] max-w-4xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setPreviewImage(null)}
                            className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg font-semibold text-gray-700 shadow-lg hover:bg-gray-100"
                            aria-label="Close image preview"
                        >
                            ×
                        </button>

                        <img
                            src={previewImage}
                            alt="Testimonial preview"
                            className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Testimonials;