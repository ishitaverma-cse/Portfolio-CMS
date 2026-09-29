import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Code2,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [deletingSkill, setDeletingSkill] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    level: "",
    icon: "",
    order: 0,
  });

  // =================================================
  // FETCH SKILLS
  // =================================================

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

  // =================================================
  // HANDLE INPUT
  // =================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? Number(value) : value,
    }));
  };

  // =================================================
  // OPEN ADD MODAL
  // =================================================

  const openAddModal = () => {
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
  };

  // =================================================
  // OPEN EDIT MODAL
  // =================================================

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

  // =================================================
  // RESET FORM
  // =================================================

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

  // =================================================
  // SAVE SKILL
  // =================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (editingSkill) {
        await api.put(
          `/skills/${editingSkill._id}`,
          formData
        );

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

  // =================================================
  // DELETE SKILL
  // =================================================

  const handleDelete = (skill) => {
    // Close add/edit modal if it happens to be open
    setShowForm(false);

    // Open delete confirmation modal
    setDeletingSkill(skill);
  };

  const confirmDelete = async () => {
    if (!deletingSkill) {
      return;
    }

    try {
      await api.delete(
        `/skills/${deletingSkill._id}`
      );

      toast.success("Skill deleted successfully.");

      setDeletingSkill(null);

      await fetchSkills();
    } catch (error) {
      console.error("Delete skill error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete skill."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f2]">

      {/* =================================================
          TOAST CONTAINER
      ================================================= */}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="ml-64">

        <Navbar />

        <main className="p-8">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-8 flex items-end justify-between">

            <div>

              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                Portfolio
              </p>

              <h1 className="text-4xl font-semibold tracking-tight text-gray-950">
                Skills
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Manage the technical skills displayed
                on your portfolio.
              </p>

            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="group flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-medium text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-md"
            >
              <Plus
                size={17}
                strokeWidth={2}
                className="transition-transform duration-200 group-hover:rotate-90"
              />

              Add Skill
            </button>

          </div>

          {/* =================================================
              SUCCESS MESSAGE
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

          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

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
              SKILLS TABLE
          ================================================= */}

          <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white">

            {/* TABLE HEADER */}

            <div className="flex items-center justify-between border-b border-gray-200 px-7 py-5">

              <div>

                <h2 className="text-lg font-semibold text-gray-950">
                  All Skills
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {skills.length}{" "}
                  {skills.length === 1
                    ? "skill"
                    : "skills"}{" "}
                  in your portfolio
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">

                <Code2
                  size={17}
                  strokeWidth={1.6}
                  className="text-gray-500"
                />

              </div>

            </div>

            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

              <div className="px-7 py-16 text-center">

                <p className="text-sm text-gray-400">
                  Loading skills...
                </p>

              </div>

            ) : skills.length === 0 ? (

              /* =================================================
                 EMPTY STATE
              ================================================= */

              <div className="px-7 py-16 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">

                  <Code2
                    size={20}
                    strokeWidth={1.5}
                    className="text-gray-400"
                  />

                </div>

                <p className="mt-4 text-sm font-medium text-gray-700">
                  No skills added yet
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Add your first skill using the
                  button above.
                </p>

              </div>

            ) : (

              /* =================================================
                 TABLE
              ================================================= */

              <div className="overflow-x-auto">

                <table className="w-full min-w-[700px]">

                  <thead>

                    <tr className="border-b border-gray-200 bg-gray-50/70 text-left">

                      <th className="px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Skill
                      </th>

                      <th className="px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Category
                      </th>

                      <th className="px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Level
                      </th>

                      <th className="px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Order
                      </th>

                      <th className="px-7 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {skills.map((skill) => (

                      <tr
                        key={skill._id}
                        className="border-b border-gray-200 last:border-b-0 transition hover:bg-gray-50/80"
                      >

                        {/* =================================================
                            SKILL
                        ================================================= */}

                        <td className="px-7 py-5">

                          <div className="flex items-center gap-3">

                            {skill.icon ? (

                              <img
                                src={skill.icon}
                                alt=""
                                className="h-9 w-9 rounded-lg border border-gray-200 object-contain p-1.5"
                                onError={(e) => {
                                  e.currentTarget.style.display =
                                    "none";

                                  if (
                                    e.currentTarget
                                      .nextElementSibling
                                  ) {
                                    e.currentTarget.nextElementSibling.style.display =
                                      "flex";
                                  }
                                }}
                              />

                            ) : null}

                            {/* FALLBACK ICON */}

                            <div
                              className={`h-9 w-9 items-center justify-center rounded-lg bg-gray-100 ${
                                skill.icon
                                  ? "hidden"
                                  : "flex"
                              }`}
                            >

                              <Code2
                                size={16}
                                strokeWidth={1.6}
                                className="text-gray-400"
                              />

                            </div>

                            <span className="text-sm font-semibold text-gray-900">
                              {skill.name}
                            </span>

                          </div>

                        </td>

                        {/* =================================================
                            CATEGORY
                        ================================================= */}

                        <td className="px-7 py-5">

                          <span className="inline-flex rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
                            {skill.category}
                          </span>

                        </td>

                        {/* =================================================
                            LEVEL
                        ================================================= */}

                        <td className="px-7 py-5 text-sm text-gray-600">
                          {skill.level || "—"}
                        </td>

                        {/* =================================================
                            ORDER
                        ================================================= */}

                        <td className="px-7 py-5">

                          <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-2 text-xs font-medium text-gray-600">
                            {skill.order}
                          </span>

                        </td>

                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <td className="px-7 py-5">

                          <div className="flex justify-end gap-2">

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(skill)
                              }
                              className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 hover:text-gray-950"
                            >

                              <Pencil
                                size={14}
                                strokeWidth={1.7}
                              />

                              Edit

                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(skill)
                              }
                              className="flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-red-500 transition hover:bg-red-50 hover:text-red-600"
                              title="Delete skill"
                            >

                              <Trash2
                                size={15}
                                strokeWidth={1.7}
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

      {/* =========================================================
          ADD / EDIT MODAL
      ========================================================= */}

      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 px-4 backdrop-blur-[2px]">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between border-b border-gray-200 px-7 py-6">

              <div>

                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Portfolio
                </p>

                <h2 className="text-xl font-semibold tracking-tight text-gray-950">
                  {editingSkill
                    ? "Edit Skill"
                    : "Add Skill"}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {editingSkill
                    ? "Update the selected skill."
                    : "Add a new skill to your portfolio."}
                </p>

              </div>

              <button
                type="button"
                onClick={resetForm}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
              >

                <X
                  size={17}
                  strokeWidth={1.7}
                />

              </button>

            </div>

            {/* MODAL FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 px-7 py-7"
            >

              {/* NAME */}

              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Skill Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. React"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-1 focus:ring-gray-950"
                />

              </div>

              {/* CATEGORY */}

              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Frontend"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-1 focus:ring-gray-950"
                />

              </div>

              {/* LEVEL + ORDER */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Level
                  </label>

                  <input
                    type="text"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    placeholder="e.g. Advanced"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-1 focus:ring-gray-950"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Display Order
                  </label>

                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    min="0"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:bg-white focus:ring-1 focus:ring-gray-950"
                  />

                </div>

              </div>

              {/* ICON */}

              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Icon URL
                </label>

                <input
                  type="url"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="https://example.com/icon.svg"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-1 focus:ring-gray-950"
                />

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-950"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
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

        </div>

      )}

      {/* =========================================================
          DELETE CONFIRMATION MODAL
      ========================================================= */}

      {deletingSkill && (

        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-950/50 px-4 backdrop-blur-[2px]">

          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-2xl">

            <div className="px-7 py-7">

              {/* DELETE ICON */}

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">

                <Trash2
                  size={20}
                  strokeWidth={1.7}
                  className="text-red-500"
                />

              </div>

              {/* TITLE */}

              <h2 className="mt-5 text-xl font-semibold tracking-tight text-gray-950">
                Delete Skill?
              </h2>

              {/* DESCRIPTION */}

              <p className="mt-2 text-sm leading-6 text-gray-500">

                Are you sure you want to delete{" "}

                <span className="font-semibold text-gray-900">
                  {deletingSkill.name}
                </span>

                ? This action cannot be undone.

              </p>

              {/* BUTTONS */}

              <div className="mt-7 flex justify-end gap-3">

                {/* CANCEL */}

                <button
                  type="button"
                  onClick={() =>
                    setDeletingSkill(null)
                  }
                  className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-950"
                >
                  Cancel
                </button>

                {/* CONFIRM DELETE */}

                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700"
                >

                  <Trash2
                    size={15}
                    strokeWidth={1.8}
                  />

                  Delete Skill

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Skills;