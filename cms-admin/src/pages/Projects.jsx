import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  FolderKanban,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    featured: false,
  });

  // =================================================
  // FETCH PROJECTS
  // =================================================

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");

      setProjects(response.data);
    } catch (error) {
      console.error("Fetch projects error:", error);

      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // =================================================
  // HANDLE INPUT
  // =================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =================================================
  // OPEN ADD MODAL
  // =================================================

  const openAddModal = () => {
    setEditingProject(null);

    setFormData({
      title: "",
      description: "",
      image: "",
      technologies: "",
      githubUrl: "",
      liveUrl: "",
      featured: false,
    });

    setMessage("");
    setError("");
    setShowForm(true);
  };

  // =================================================
  // OPEN EDIT MODAL
  // =================================================

  const handleEdit = (project) => {
    setEditingProject(project);

    setFormData({
      title: project.title || "",
      description: project.description || "",
      image: project.image || "",
      technologies:
        project.technologies?.join(", ") || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      featured: project.featured || false,
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
      title: "",
      description: "",
      image: "",
      technologies: "",
      githubUrl: "",
      liveUrl: "",
      featured: false,
    });

    setEditingProject(null);
    setShowForm(false);
  };

  // =================================================
  // SAVE PROJECT
  // =================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const projectData = {
        ...formData,

        technologies: formData.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter((tech) => tech !== ""),
      };

      if (editingProject) {
        await api.put(
          `/projects/${editingProject._id}`,
          projectData
        );

        toast.success("Project updated successfully.");
      } else {
        await api.post("/projects", projectData);

        toast.success("Project created successfully.");
      }

      resetForm();

      await fetchProjects();
    } catch (error) {
      console.error("Save project error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to save project."
      );
    } finally {
      setSaving(false);
    }
  };

  // =================================================
  // DELETE PROJECT
  // =================================================

  const handleDelete = (project) => {
    // Close add/edit modal if it happens to be open
    setShowForm(false);

    // Open delete confirmation modal
    setDeletingProject(project);
  };

  // =================================================
  // CONFIRM DELETE
  // =================================================

  const confirmDelete = async () => {
    if (!deletingProject) {
      return;
    }

    try {
      await api.delete(
        `/projects/${deletingProject._id}`
      );

      toast.success("Project deleted successfully.");

      setDeletingProject(null);

      await fetchProjects();
    } catch (error) {
      console.error("Delete project error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to delete project."
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
                Projects
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Manage the projects displayed on your
                portfolio.
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

              Add Project

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
              PROJECTS TABLE
          ================================================= */}

          <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white">

            {/* TABLE HEADER */}

            <div className="flex items-center justify-between border-b border-gray-200 px-7 py-5">

              <div>

                <h2 className="text-lg font-semibold text-gray-950">
                  All Projects
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {projects.length}{" "}
                  {projects.length === 1
                    ? "project"
                    : "projects"}{" "}
                  in your portfolio
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">

                <FolderKanban
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
                  Loading projects...
                </p>

              </div>

            ) : projects.length === 0 ? (

              /* =================================================
                 EMPTY STATE
              ================================================= */

              <div className="px-7 py-16 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">

                  <FolderKanban
                    size={20}
                    strokeWidth={1.5}
                    className="text-gray-400"
                  />

                </div>

                <p className="mt-4 text-sm font-medium text-gray-700">
                  No projects added yet
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Add your first project using the
                  button above.
                </p>

              </div>

            ) : (

              /* =================================================
                 TABLE
              ================================================= */

              <div className="overflow-x-auto">

                <table className="w-full min-w-[950px]">

                  <thead>

                    <tr className="border-b border-gray-200 bg-gray-50/70 text-left">

                      <th className="px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Project
                      </th>

                      <th className="px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Technologies
                      </th>

                      <th className="px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Links
                      </th>

                      <th className="px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Featured
                      </th>

                      <th className="px-7 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {projects.map((project) => (

                      <tr
                        key={project._id}
                        className="border-b border-gray-200 last:border-b-0 transition hover:bg-gray-50/80"
                      >

                        {/* =================================================
                            PROJECT
                        ================================================= */}

                        <td className="px-7 py-5">

                          <div className="flex items-center gap-3">

                            {/* PROJECT IMAGE */}

                            {project.image ? (

                              <img
                                src={project.image}
                                alt=""
                                className="h-12 w-16 rounded-lg border border-gray-200 object-cover"
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

                            {/* FALLBACK */}

                            <div
                              className={`h-12 w-16 items-center justify-center rounded-lg bg-gray-100 ${project.image
                                ? "hidden"
                                : "flex"
                                }`}
                            >

                              <FolderKanban
                                size={18}
                                strokeWidth={1.5}
                                className="text-gray-400"
                              />

                            </div>

                            <div className="min-w-0">

                              <p className="truncate text-sm font-semibold text-gray-900">
                                {project.title}
                              </p>

                              <p className="mt-1 max-w-sm truncate text-xs text-gray-400">
                                {project.description}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* =================================================
                            TECHNOLOGIES
                        ================================================= */}

                        <td className="px-7 py-5">

                          <div className="flex max-w-xs flex-wrap gap-1.5">

                            {project.technologies?.length ? (

                              project.technologies.map(
                                (tech, index) => (

                                  <span
                                    key={index}
                                    className="inline-flex rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-600"
                                  >
                                    {tech}
                                  </span>

                                )
                              )

                            ) : (

                              <span className="text-xs text-gray-400">
                                —
                              </span>

                            )}

                          </div>

                        </td>

                        {/* =================================================
                            LINKS
                        ================================================= */}

                        <td className="px-7 py-5">

                          <div className="flex items-center gap-2">

                            {project.githubUrl ? (

                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950"
                                title="GitHub"
                              >

                                <FolderKanban size={16} />

                              </a>

                            ) : null}

                            {project.liveUrl ? (

                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950"
                                title="Live Project"
                              >

                                <FolderKanban size={16} />

                              </a>

                            ) : null}

                            {!project.githubUrl &&
                              !project.liveUrl && (

                                <span className="text-xs text-gray-400">
                                  No links
                                </span>

                              )}

                          </div>

                        </td>

                        {/* =================================================
                            FEATURED
                        ================================================= */}

                        <td className="px-7 py-5">

                          {project.featured ? (

                            <span className="inline-flex rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                              Featured
                            </span>

                          ) : (

                            <span className="inline-flex rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-500">
                              Standard
                            </span>

                          )}

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
                                handleEdit(project)
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
                                handleDelete(project)
                              }
                              className="flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-red-500 transition hover:bg-red-50 hover:text-red-600"
                              title="Delete project"
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

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 px-4 py-6 backdrop-blur-[2px]">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between border-b border-gray-200 px-7 py-6">

              <div>

                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Portfolio
                </p>

                <h2 className="text-xl font-semibold tracking-tight text-gray-950">
                  {editingProject
                    ? "Edit Project"
                    : "Add Project"}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {editingProject
                    ? "Update the selected project."
                    : "Add a new project to your portfolio."}
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

              {/* TITLE */}

              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Project Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. VaultDrive"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-1 focus:ring-gray-950"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Describe your project..."
                  className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-1 focus:ring-gray-950"
                />

              </div>

              {/* IMAGE */}
              <div className="max-w-2xl">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Project Image URL
                </label>

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/project.jpg"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-1 focus:ring-gray-950"
                />

                {formData.image && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={formData.image}
                      alt=""
                      className="h-16 w-24 rounded-lg border border-gray-200 bg-gray-100 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling.style.display =
                          "flex";
                      }}
                    />

                    <div className="hidden h-16 w-24 items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
                      <FolderKanban
                        size={20}
                        className="text-gray-400"
                      />
                    </div>

                    <p className="text-xs text-gray-400">
                      Image preview
                    </p>
                  </div>
                )}
              </div>

              {/* TECHNOLOGIES */}

              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Technologies
                </label>

                <input
                  type="text"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-1 focus:ring-gray-950"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Separate technologies with commas.
                </p>

              </div>

              {/* GITHUB + LIVE URL */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    GitHub URL
                  </label>

                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-1 focus:ring-gray-950"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Live Project URL
                  </label>

                  <input
                    type="url"
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-1 focus:ring-gray-950"
                  />

                </div>

              </div>

              {/* FEATURED */}

              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">

                <label className="flex cursor-pointer items-center gap-3">

                  <input
                    id="featured"
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-gray-950 focus:ring-gray-950"
                  />

                  <div>

                    <p className="text-sm font-medium text-gray-800">
                      Mark as featured project
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      Featured projects can be highlighted
                      on your public portfolio.
                    </p>

                  </div>

                </label>

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
                    : editingProject
                      ? "Update Project"
                      : "Create Project"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =========================================================
          DELETE CONFIRMATION MODAL
      ========================================================= */}

      {deletingProject && (

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
                Delete Project?
              </h2>

              {/* DESCRIPTION */}

              <p className="mt-2 text-sm leading-6 text-gray-500">

                Are you sure you want to delete{" "}

                <span className="font-semibold text-gray-900">
                  {deletingProject.title}
                </span>

                ? This action cannot be undone.

              </p>

              {/* BUTTONS */}

              <div className="mt-7 flex justify-end gap-3">

                {/* CANCEL */}

                <button
                  type="button"
                  onClick={() =>
                    setDeletingProject(null)
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

                  Delete Project

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Projects;