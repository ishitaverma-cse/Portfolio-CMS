import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
      setError("Failed to load services.");
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
      if (editingService) {
        await api.put(
          `/services/${editingService._id}`,
          formData
        );

        setMessage("Service updated successfully.");
      } else {
        await api.post("/services", formData);

        setMessage("Service created successfully.");
      }

      resetForm();
      await fetchServices();
    } catch (error) {
      console.error("Save service error:", error);

      setError(
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

    setMessage("");
    setError("");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) return;

    try {
      setMessage("");
      setError("");

      await api.delete(`/services/${id}`);

      setMessage("Service deleted successfully.");

      if (editingService?._id === id) {
        resetForm();
      }

      await fetchServices();
    } catch (error) {
      console.error("Delete service error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete service."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-64">
        <Navbar />

        <main className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Services
              </h1>

              <p className="mt-2 text-gray-500">
                Manage the services displayed on your portfolio.
              </p>
            </div>

            <button
              onClick={handleAddService}
              className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              + Add Service
            </button>
          </div>

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

          {showForm && (
            <div className="mb-8 max-w-4xl rounded-xl bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
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
                  className="text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Describe the service you provide..."
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Icon
                  </label>

                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    placeholder="e.g. code, layout, database"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Enter an icon name or icon identifier for the
                    portfolio.
                  </p>
                </div>

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
                      : editingService
                      ? "Update Service"
                      : "Create Service"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="rounded-xl bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-lg font-semibold text-gray-900">
                All Services
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                View and manage your portfolio services.
              </p>
            </div>

            {loading ? (
              <div className="px-6 py-10 text-center text-gray-500">
                Loading services...
              </div>
            ) : services.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-500">
                No services found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
                      <th className="px-6 py-4 font-medium">
                        Title
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Description
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Icon
                      </th>

                      <th className="px-6 py-4 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {services.map((service) => (
                      <tr
                        key={service._id}
                        className="border-b border-gray-50 last:border-0"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">
                            {service.title}
                          </p>
                        </td>

                        <td className="max-w-xl px-6 py-4 text-sm text-gray-600">
                          <p className="line-clamp-2">
                            {service.description}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          {service.icon ? (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                              {service.icon}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                handleEdit(service)
                              }
                              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(service._id)
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
    </div>
  );
}

export default Services;