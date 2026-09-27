import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Skills() {
  const [skills, setSkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    level: "",
    icon: "",
    order: 0,
  });

  const fetchSkills = async () => {
    try {
      const response = await api.get("/skills");
      setSkills(response.data);
    } catch (error) {
      console.error("Fetch skills error:", error);
      setError("Failed to load skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      level: "",
      icon: "",
      order: 0,
    });

    setEditingSkill(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (editingSkill) {
        await api.put(`/skills/${editingSkill._id}`, formData);

        setMessage("Skill updated successfully.");
      } else {
        await api.post("/skills", formData);

        setMessage("Skill created successfully.");
      }

      resetForm();
      await fetchSkills();
    } catch (error) {
      console.error("Save skill error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to save skill."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);

    setFormData({
      name: skill.name || "",
      category: skill.category || "",
      level: skill.level || "",
      icon: skill.icon || "",
      order: skill.order ?? 0,
    });

    setMessage("");
    setError("");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await api.delete(`/skills/${id}`);

      setMessage("Skill deleted successfully.");

      await fetchSkills();
    } catch (error) {
      console.error("Delete skill error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete skill."
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
                Skills
              </h1>

              <p className="mt-2 text-gray-500">
                Manage your technical skills and expertise.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingSkill(null);

                setFormData({
                  name: "",
                  category: "",
                  level: "",
                  icon: "",
                  order: 0,
                });

                setMessage("");
                setError("");
                setShowForm(true);
              }}
              className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              + Add Skill
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

          {/* Add / Edit Form */}
          {showForm && (
            <div className="mb-8 max-w-4xl rounded-xl bg-white p-8 shadow-sm">

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingSkill ? "Edit Skill" : "Add Skill"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingSkill
                    ? "Update the selected skill."
                    : "Add a new skill to your portfolio."}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Skill Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. React"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Frontend"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                {/* Level */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Level
                  </label>

                  <input
                    type="text"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    placeholder="e.g. Advanced"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                {/* Icon */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Icon URL
                  </label>

                  <input
                    type="url"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    placeholder="https://example.com/icon.svg"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                {/* Order */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Display Order
                  </label>

                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    min="0"
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
                      : editingSkill
                      ? "Update Skill"
                      : "Create Skill"}
                  </button>

                </div>

              </form>
            </div>
          )}

          {/* Skills Table */}
          <div className="rounded-xl bg-white shadow-sm">

            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-lg font-semibold text-gray-900">
                All Skills
              </h2>
            </div>

            {loading ? (
              <div className="px-6 py-10 text-center text-gray-500">
                Loading skills...
              </div>
            ) : skills.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-500">
                No skills found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">

                  <thead>
                    <tr className="border-b border-gray-100 text-left text-sm text-gray-500">

                      <th className="px-6 py-4 font-medium">
                        Name
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Category
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Level
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Order
                      </th>

                      <th className="px-6 py-4 text-right font-medium">
                        Actions
                      </th>

                    </tr>
                  </thead>

                  <tbody>
                    {skills.map((skill) => (
                      <tr
                        key={skill._id}
                        className="border-b border-gray-50 last:border-0"
                      >

                        <td className="px-6 py-4 font-medium text-gray-900">
                          {skill.name}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {skill.category}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {skill.level || "—"}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {skill.order}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">

                            <button
                              onClick={() => handleEdit(skill)}
                              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(skill._id)
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

export default Skills;