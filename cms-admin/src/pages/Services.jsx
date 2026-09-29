import { useEffect, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Wrench,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [deletingService, setDeletingService] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        icon: "",
    });

    const fetchServices = async () => {
        try {
            const response = await api.get("/services");
            setServices(response.data);
        } catch (error) {
            console.error("Fetch services error:", error);
            toast.error("Failed to load services.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
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
            title: "",
            description: "",
            icon: "",
        });

        setEditingService(null);
        setShowForm(false);
    };

    const handleAddService = () => {
        setEditingService(null);

        setFormData({
            title: "",
            description: "",
            icon: "",
        });

        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);

        try {
            if (editingService) {
                await api.put(
                    `/services/${editingService._id}`,
                    formData
                );

                toast.success("Service updated successfully.");
            } else {
                await api.post("/services", formData);

                toast.success("Service created successfully.");
            }

            resetForm();
            await fetchServices();
        } catch (error) {
            console.error("Save service error:", error);

            toast.error(
                error.response?.data?.message ||
                    "Failed to save service."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);

        setFormData({
            title: service.title || "",
            description: service.description || "",
            icon: service.icon || "",
        });

        setShowForm(true);
    };

    const handleDelete = (service) => {
        setShowForm(false);
        setDeletingService(service);
    };

    const confirmDelete = async () => {
        if (!deletingService) return;

        try {
            await api.delete(
                `/services/${deletingService._id}`
            );

            toast.success("Service deleted successfully.");

            setDeletingService(null);

            if (
                editingService?._id ===
                deletingService._id
            ) {
                resetForm();
            }

            await fetchServices();
        } catch (error) {
            console.error("Delete service error:", error);

            toast.error(
                error.response?.data?.message ||
                    "Failed to delete service."
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
                                Services
                            </h1>

                            <p className="mt-2 text-sm text-gray-500">
                                Manage the services displayed on your
                                portfolio.
                            </p>
                        </div>

                        <button
                            onClick={handleAddService}
                            className="group flex items-center gap-2 rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800"
                        >
                            <Plus
                                size={17}
                                className="transition-transform duration-200 group-hover:rotate-90"
                            />
                            Add Service
                        </button>
                    </div>

                    {/* Services Table */}
                    <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white">
                        <div className="flex items-center justify-between border-b border-gray-300 px-6 py-5">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Wrench
                                        size={19}
                                        className="text-gray-500"
                                        strokeWidth={1.8}
                                    />

                                    <h2 className="text-base font-semibold text-gray-950">
                                        All Services
                                    </h2>
                                </div>

                                <p className="mt-1 text-sm text-gray-500">
                                    {services.length}{" "}
                                    {services.length === 1
                                        ? "service"
                                        : "services"}
                                </p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="px-6 py-14 text-center text-sm text-gray-500">
                                Loading services...
                            </div>
                        ) : services.length === 0 ? (
                            <div className="px-6 py-14 text-center">
                                <Wrench
                                    size={28}
                                    className="mx-auto mb-3 text-gray-300"
                                    strokeWidth={1.5}
                                />

                                <p className="text-sm font-medium text-gray-700">
                                    No services found
                                </p>

                                <p className="mt-1 text-sm text-gray-400">
                                    Add your first service to get
                                    started.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-300 text-left text-xs uppercase tracking-wide text-gray-500">
                                            <th className="px-6 py-4 font-semibold">
                                                Service
                                            </th>

                                            <th className="px-6 py-4 font-semibold">
                                                Description
                                            </th>

                                            <th className="px-6 py-4 font-semibold">
                                                Icon
                                            </th>

                                            <th className="px-6 py-4 text-right font-semibold">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {services.map((service) => (
                                            <tr
                                                key={service._id}
                                                className="border-b border-gray-100 last:border-0"
                                            >
                                                {/* Service */}
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-gray-950">
                                                        {service.title}
                                                    </p>
                                                </td>

                                                {/* Description */}
                                                <td className="max-w-xl px-6 py-4">
                                                    <p className="line-clamp-2 text-sm leading-6 text-gray-600">
                                                        {
                                                            service.description
                                                        }
                                                    </p>
                                                </td>

                                                {/* Icon */}
                                                <td className="px-6 py-4">
                                                    {service.icon ? (
                                                        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                                            {
                                                                service.icon
                                                            }
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">
                                                            —
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    service
                                                                )
                                                            }
                                                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-gray-950"
                                                            title="Edit service"
                                                        >
                                                            <Pencil
                                                                size={16}
                                                                strokeWidth={
                                                                    1.8
                                                                }
                                                            />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    service
                                                                )
                                                            }
                                                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-500 transition hover:bg-red-50 hover:text-red-600"
                                                            title="Delete service"
                                                        >
                                                            <Trash2
                                                                size={16}
                                                                strokeWidth={
                                                                    1.8
                                                                }
                                                            />
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

            {/* Add / Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
                            <div>
                                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                                    {editingService
                                        ? "Edit"
                                        : "New"}
                                </p>

                                <h2 className="text-xl font-semibold tracking-tight text-gray-950">
                                    {editingService
                                        ? "Edit Service"
                                        : "Add Service"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {editingService
                                        ? "Update the selected service."
                                        : "Add a new service to your portfolio."}
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
                            {/* Title */}
                            <div className="max-w-xl">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Full Stack Development"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                                />
                            </div>

                            {/* Description */}
                            <div className="max-w-2xl">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    placeholder="Describe the service you provide..."
                                    className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                                />
                            </div>

                            {/* Icon */}
                            <div className="max-w-xl">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Icon
                                </label>

                                <input
                                    type="text"
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleChange}
                                    placeholder="e.g. code, layout, database"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                                />

                                <p className="mt-2 text-xs leading-5 text-gray-400">
                                    Enter the icon name or identifier
                                    used by your portfolio.
                                </p>
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
                                        : editingService
                                          ? "Update Service"
                                          : "Create Service"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingService && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-6">
                    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                            <Trash2 size={20} />
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-gray-950">
                            Delete Service?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-gray-700">
                                {deletingService.title}
                            </span>
                            ? This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setDeletingService(null)
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
                                Delete Service
                            </button>
                        </div>
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

export default Services;