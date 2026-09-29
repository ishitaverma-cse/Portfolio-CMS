import { useEffect, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    MessageSquareQuote,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [deletingTestimonial, setDeletingTestimonial] = useState(null);
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
            toast.error("Failed to load testimonials.");
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

        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);

        try {
            if (editingTestimonial) {
                await api.put(
                    `/testimonials/${editingTestimonial._id}`,
                    formData
                );

                toast.success("Testimonial updated successfully.");
            } else {
                await api.post("/testimonials", formData);

                toast.success("Testimonial created successfully.");
            }

            resetForm();
            await fetchTestimonials();
        } catch (error) {
            console.error("Save testimonial error:", error);

            toast.error(
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

        setShowForm(true);
    };

    const handleDelete = (testimonial) => {
        setShowForm(false);
        setDeletingTestimonial(testimonial);
    };

    const confirmDelete = async () => {
        if (!deletingTestimonial) return;

        try {
            await api.delete(
                `/testimonials/${deletingTestimonial._id}`
            );

            toast.success("Testimonial deleted successfully.");

            setDeletingTestimonial(null);

            if (
                editingTestimonial?._id ===
                deletingTestimonial._id
            ) {
                resetForm();
            }

            await fetchTestimonials();
        } catch (error) {
            console.error("Delete testimonial error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to delete testimonial."
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f4f2]">
            <Sidebar />

            <div className="ml-64">
                <Navbar />

                <main className="p-8">
                    {/* Header */}
                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                                Content
                            </p>

                            <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
                                Testimonials
                            </h1>

                            <p className="mt-2 text-sm text-gray-500">
                                Manage testimonials displayed on your
                                portfolio.
                            </p>
                        </div>

                        <button
                            onClick={handleAddTestimonial}
                            className="group flex items-center gap-2 rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800"
                        >
                            <Plus
                                size={17}
                                className="transition-transform duration-200 group-hover:rotate-90"
                            />
                            Add Testimonial
                        </button>
                    </div>

                    {/* Testimonials Table */}
                    <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white">
                        <div className="flex items-center justify-between border-b border-gray-300 px-6 py-5">
                            <div>
                                <div className="flex items-center gap-2">
                                    <MessageSquareQuote
                                        size={19}
                                        className="text-gray-500"
                                        strokeWidth={1.8}
                                    />

                                    <h2 className="text-base font-semibold text-gray-950">
                                        All Testimonials
                                    </h2>
                                </div>

                                <p className="mt-1 text-sm text-gray-500">
                                    {testimonials.length}{" "}
                                    {testimonials.length === 1
                                        ? "testimonial"
                                        : "testimonials"}
                                </p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="px-6 py-14 text-center text-sm text-gray-500">
                                Loading testimonials...
                            </div>
                        ) : testimonials.length === 0 ? (
                            <div className="px-6 py-14 text-center">
                                <MessageSquareQuote
                                    size={28}
                                    className="mx-auto mb-3 text-gray-300"
                                    strokeWidth={1.5}
                                />

                                <p className="text-sm font-medium text-gray-700">
                                    No testimonials found
                                </p>

                                <p className="mt-1 text-sm text-gray-400">
                                    Add your first testimonial to get
                                    started.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-300 text-left text-xs uppercase tracking-wide text-gray-500">
                                            <th className="px-6 py-4 font-semibold">
                                                Person
                                            </th>

                                            <th className="px-6 py-4 font-semibold">
                                                Company
                                            </th>

                                            <th className="px-6 py-4 font-semibold">
                                                Testimonial
                                            </th>

                                            <th className="px-6 py-4 text-right font-semibold">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {testimonials.map(
                                            (testimonial) => (
                                                <tr
                                                    key={
                                                        testimonial._id
                                                    }
                                                    className="border-b border-gray-100 last:border-0"
                                                >
                                                    {/* Person */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            {testimonial.image ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setPreviewImage(
                                                                            testimonial.image
                                                                        )
                                                                    }
                                                                    className="shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2"
                                                                    title="Preview image"
                                                                >
                                                                    <img
                                                                        src={
                                                                            testimonial.image
                                                                        }
                                                                        alt=""
                                                                        className="h-10 w-10 rounded-full border border-gray-200 object-cover transition hover:opacity-80"
                                                                        onError={(
                                                                            e
                                                                        ) => {
                                                                            e.currentTarget.style.display =
                                                                                "none";
                                                                            e.currentTarget.nextElementSibling.style.display =
                                                                                "flex";
                                                                        }}
                                                                    />

                                                                    <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                                                                        {testimonial.name
                                                                            ?.charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase()}
                                                                    </div>
                                                                </button>
                                                            ) : (
                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                                                                    {testimonial.name
                                                                        ?.charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>
                                                            )}

                                                            <div>
                                                                <p className="font-medium text-gray-950">
                                                                    {
                                                                        testimonial.name
                                                                    }
                                                                </p>

                                                                {testimonial.role && (
                                                                    <p className="mt-0.5 text-sm text-gray-500">
                                                                        {
                                                                            testimonial.role
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Company */}
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {testimonial.company ||
                                                            "—"}
                                                    </td>

                                                    {/* Testimonial */}
                                                    <td className="max-w-lg px-6 py-4">
                                                        <p className="truncate text-sm text-gray-600">
                                                            {
                                                                testimonial.message
                                                            }
                                                        </p>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        testimonial
                                                                    )
                                                                }
                                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-gray-950"
                                                                title="Edit testimonial"
                                                            >
                                                                <Pencil
                                                                    size={
                                                                        16
                                                                    }
                                                                    strokeWidth={
                                                                        1.8
                                                                    }
                                                                />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        testimonial
                                                                    )
                                                                }
                                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-500 transition hover:bg-red-50 hover:text-red-600"
                                                                title="Delete testimonial"
                                                            >
                                                                <Trash2
                                                                    size={
                                                                        16
                                                                    }
                                                                    strokeWidth={
                                                                        1.8
                                                                    }
                                                                />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Add / Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
                            <div>
                                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                                    {editingTestimonial
                                        ? "Edit"
                                        : "New"}
                                </p>

                                <h2 className="text-xl font-semibold tracking-tight text-gray-950">
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
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-6"
                        >
                            {/* Name */}
                            <div className="max-w-xl">
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
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                                />
                            </div>

                            {/* Role */}
                            <div className="max-w-xl">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Role
                                </label>

                                <input
                                    type="text"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    placeholder="e.g. Software Engineer"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                                />
                            </div>

                            {/* Company */}
                            <div className="max-w-xl">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Company
                                </label>

                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="e.g. Tech Company"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                                />
                            </div>

                            {/* Message */}
                            <div className="max-w-2xl">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Testimonial
                                </label>

                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    placeholder="Write the testimonial..."
                                    className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                                />
                            </div>

                            {/* Image */}
                            <div className="max-w-2xl">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Image URL
                                </label>

                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://example.com/profile.jpg"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                                />

                                {formData.image && (
                                    <div className="mt-3 flex items-center gap-3">
                                        <img
                                            src={formData.image}
                                            alt=""
                                            className="h-14 w-14 rounded-full border border-gray-200 object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display =
                                                    "none";
                                            }}
                                        />

                                        <p className="text-xs text-gray-500">
                                            Image preview
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
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
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingTestimonial && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-6">
                    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                            <Trash2 size={20} />
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-gray-950">
                            Delete Testimonial?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Are you sure you want to delete the testimonial
                            from{" "}
                            <span className="font-medium text-gray-700">
                                {deletingTestimonial.name}
                            </span>
                            ? This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setDeletingTestimonial(null)
                                }
                                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                            >
                                Delete Testimonial
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-6"
                    onClick={() => setPreviewImage(null)}
                >
                    <div
                        className="relative max-h-[90vh] max-w-4xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setPreviewImage(null)}
                            className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition hover:bg-gray-100"
                            aria-label="Close image preview"
                        >
                            <X size={18} />
                        </button>

                        <img
                            src={previewImage}
                            alt="Testimonial preview"
                            className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
                        />
                    </div>
                </div>
            )}

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
            />
        </div>
    );
}

export default Testimonials;