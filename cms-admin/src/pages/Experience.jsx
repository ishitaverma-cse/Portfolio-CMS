import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Briefcase,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [deletingExperience, setDeletingExperience] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    description: "",
    startDate: "",
    endDate: "",
    current: false,
    technologies: "",
  });

  const fetchExperiences = async () => {
    try {
      const response = await api.get("/experience");
      setExperiences(response.data);
    } catch (error) {
      console.error("Fetch experiences error:", error);
      setError("Failed to load experiences.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      company: "",
      role: "",
      description: "",
      startDate: "",
      endDate: "",
      current: false,
      technologies: "",
    });

    setEditingExperience(null);
    setShowForm(false);
  };

  const handleAddExperience = () => {
    setEditingExperience(null);

    setFormData({
      company: "",
      role: "",
      description: "",
      startDate: "",
      endDate: "",
      current: false,
      technologies: "",
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
      const payload = {
        ...formData,
        endDate: formData.current
          ? null
          : formData.endDate || null,

        technologies: formData.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean),
      };

      if (editingExperience) {
        await api.put(
          `/experience/${editingExperience._id}`,
          payload
        );

        toast.success("Experience updated successfully.");
      } else {
        await api.post("/experience", payload);

        toast.success("Experience created successfully.");
      }

      resetForm();
      await fetchExperiences();
    } catch (error) {
      console.error("Save experience error:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Failed to save experience.";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (experience) => {
    setEditingExperience(experience);

    setFormData({
      company: experience.company || "",
      role: experience.role || "",
      description: experience.description || "",

      startDate: experience.startDate
        ? new Date(experience.startDate)
          .toISOString()
          .slice(0, 10)
        : "",

      endDate: experience.endDate
        ? new Date(experience.endDate)
          .toISOString()
          .slice(0, 10)
        : "",

      current: experience.current || false,

      technologies: experience.technologies
        ? experience.technologies.join(", ")
        : "",
    });

    setMessage("");
    setError("");
    setShowForm(true);
  };

  const handleDelete = (experience) => {
    setShowForm(false);
    setDeletingExperience(experience);
  };

  const confirmDelete = async () => {
    if (!deletingExperience) return;

    try {
      setMessage("");
      setError("");

      await api.delete(
        `/experience/${deletingExperience._id}`
      );

      toast.success("Experience deleted successfully.");

      setDeletingExperience(null);

      if (
        editingExperience?._id === deletingExperience._id
      ) {
        resetForm();
      }

      await fetchExperiences();
    } catch (error) {
      console.error("Delete experience error:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Failed to delete experience.";

      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const formatDate = (date) => {
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
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Portfolio
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
                Experience
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Manage your professional experience and career history.
              </p>
            </div>

            <button
              onClick={handleAddExperience}
              className="group flex items-center gap-2 rounded-lg bg-gray-950 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800"
            >
              <Plus
                size={17}
                className="transition-transform duration-200 group-hover:rotate-90"
              />

              Add Experience
            </button>
          </div>

          {/* Messages */}
          {message && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <span>{message}</span>

              <button
                onClick={() => setMessage("")}
                className="text-green-700 transition hover:text-green-900"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span>{error}</span>

              <button
                onClick={() => setError("")}
                className="text-red-700 transition hover:text-red-900"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Experience Table */}
          <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white">
            {/* Table Header */}
            <div className="flex items-center justify-between border-b border-gray-300 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                  <Briefcase
                    size={18}
                    className="text-gray-700"
                  />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-gray-950">
                    All Experience
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {experiences.length}{" "}
                    {experiences.length === 1
                      ? "experience"
                      : "experiences"}
                  </p>
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="px-6 py-14 text-center text-sm text-gray-500">
                Loading experience...
              </div>
            ) : experiences.length === 0 ? (
              /* Empty */
              <div className="px-6 py-14 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                  <Briefcase
                    size={21}
                    className="text-gray-500"
                  />
                </div>

                <h3 className="text-sm font-semibold text-gray-900">
                  No experience found
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Add your first professional experience.
                </p>
              </div>
            ) : (
              /* Table */
              <div className="overflow-x-auto">
                <table className="min-w-[1050px] w-full">
                  <thead>
                    <tr className="border-b border-gray-300 bg-gray-50/70 text-left">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Company
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Role
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Duration
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Technologies
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {experiences.map((experience) => (
                      <tr
                        key={experience._id}
                        className="border-b border-gray-200 last:border-0 transition hover:bg-gray-50/60"
                      >
                        {/* Company */}
                        <td className="px-6 py-5 align-top">
                          <p className="font-semibold text-gray-950">
                            {experience.company}
                          </p>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-5 align-top">
                          <p className="text-sm text-gray-700">
                            {experience.role}
                          </p>
                        </td>

                        {/* Duration */}
                        <td className="px-6 py-5 align-top">
                          <p className="whitespace-nowrap text-sm text-gray-700">
                            {formatDate(
                              experience.startDate
                            )}{" "}
                            —{" "}
                            {experience.current
                              ? "Present"
                              : formatDate(
                                experience.endDate
                              )}
                          </p>

                          {experience.current && (
                            <span className="mt-2 inline-flex rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                              Current
                            </span>
                          )}
                        </td>

                        {/* Technologies */}
                        <td className="px-6 py-5 align-top">
                          <div className="flex max-w-[360px] flex-wrap gap-1.5">
                            {experience.technologies?.length > 0 ? (
                              experience.technologies.map(
                                (tech, index) => (
                                  <span
                                    key={index}
                                    className="rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
                                  >
                                    {tech}
                                  </span>
                                )
                              )
                            ) : (
                              <span className="text-sm text-gray-400">
                                —
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5 align-top">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                handleEdit(experience)
                              }
                              title="Edit experience"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:border-gray-400 hover:bg-gray-100 hover:text-gray-950"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(experience)
                              }
                              title="Delete experience"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-500 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={16} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-300 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Portfolio
                </p>

                <h2 className="text-xl font-semibold tracking-tight text-gray-950">
                  {editingExperience
                    ? "Edit Experience"
                    : "Add Experience"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingExperience
                    ? "Update the selected professional experience."
                    : "Add a new professional experience to your portfolio."}
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={19} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 px-6 py-6"
            >
              {/* Company + Role */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Company
                  </label>

                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    placeholder="e.g. O7 Services"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Role
                  </label>

                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Full Stack Developer Intern"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Describe your responsibilities and achievements..."
                  className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    End Date
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    disabled={formData.current}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>
              </div>

              {/* Current */}
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <input
                  type="checkbox"
                  name="current"
                  checked={formData.current}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300"
                />

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    I currently work here
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    End date will automatically be set to Present.
                  </p>
                </div>
              </label>

              {/* Technologies */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Technologies
                </label>

                <input
                  type="text"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB, Express"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Separate technologies with commas.
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
                  className="rounded-lg bg-gray-950 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingExperience
                      ? "Update Experience"
                      : "Create Experience"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingExperience && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-300 bg-white p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 size={20} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-950">
              Delete experience?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                {deletingExperience.company}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingExperience(null)}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Delete Experience
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default Experience;