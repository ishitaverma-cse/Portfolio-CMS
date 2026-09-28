import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

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

        setMessage("Experience updated successfully.");
      } else {
        await api.post("/experience", payload);

        setMessage("Experience created successfully.");
      }

      resetForm();
      await fetchExperiences();
    } catch (error) {
      console.error("Save experience error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to save experience."
      );
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

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmed) return;

    try {
      setMessage("");
      setError("");

      await api.delete(`/experience/${id}`);

      setMessage("Experience deleted successfully.");

      if (editingExperience?._id === id) {
        resetForm();
      }

      await fetchExperiences();
    } catch (error) {
      console.error("Delete experience error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete experience."
      );
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
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-64">
        <Navbar />

        <main className="p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Experience
              </h1>

              <p className="mt-2 text-gray-500">
                Manage your professional experience.
              </p>
            </div>

            <button
              onClick={handleAddExperience}
              className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              + Add Experience
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
                    {editingExperience
                      ? "Edit Experience"
                      : "Add Experience"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {editingExperience
                      ? "Update the selected experience."
                      : "Add a new professional experience."}
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
                    required
                    placeholder="e.g. O7 Services"
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
                    required
                    placeholder="e.g. Full Stack Developer Intern"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
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
                    rows="6"
                    placeholder="Describe your responsibilities and achievements..."
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </div>
                </div>

                {/* Current */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="current"
                    checked={formData.current}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />

                  <label className="text-sm font-medium text-gray-700">
                    I currently work here
                  </label>
                </div>

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
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Separate technologies with commas.
                  </p>
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
                      : editingExperience
                      ? "Update Experience"
                      : "Create Experience"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Experience Table */}
          <div className="rounded-xl bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-lg font-semibold text-gray-900">
                All Experience
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                View and manage your professional experience.
              </p>
            </div>

            {loading ? (
              <div className="px-6 py-10 text-center text-gray-500">
                Loading experience...
              </div>
            ) : experiences.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-500">
                No experience found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
                      <th className="px-6 py-4 font-medium">
                        Company
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Role
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Duration
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Technologies
                      </th>

                      <th className="px-6 py-4 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {experiences.map((experience) => (
                      <tr
                        key={experience._id}
                        className="border-b border-gray-50 last:border-0"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">
                            {experience.company}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {experience.role}
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">
                            {formatDate(experience.startDate)}{" "}
                            —{" "}
                            {experience.current
                              ? "Present"
                              : formatDate(experience.endDate)}
                          </p>

                          {experience.current && (
                            <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                              Current
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {experience.technologies?.length > 0
                              ? experience.technologies.map(
                                  (tech, index) => (
                                    <span
                                      key={index}
                                      className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                                    >
                                      {tech}
                                    </span>
                                  )
                                )
                              : "—"}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                handleEdit(experience)
                              }
                              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(experience._id)
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

export default Experience;