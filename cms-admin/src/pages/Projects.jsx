import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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

        setMessage("Project updated successfully.");
      } else {
        await api.post("/projects", projectData);

        setMessage("Project created successfully.");
      }

      resetForm();

      await fetchProjects();
    } catch (error) {
      console.error("Save project error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to save project."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);

    setFormData({
      title: project.title || "",
      description: project.description || "",
      image: project.image || "",
      technologies: project.technologies?.join(", ") || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      featured: project.featured || false,
    });

    setMessage("");
    setError("");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await api.delete(`/projects/${id}`);

      setMessage("Project deleted successfully.");

      await fetchProjects();
    } catch (error) {
      console.error("Delete project error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete project."
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
                Projects
              </h1>

              <p className="mt-2 text-gray-500">
                Manage the projects displayed on your portfolio.
              </p>
            </div>

            <button
              onClick={() => {
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
              }}
              className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              + Add Project
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
                  {editingProject
                    ? "Edit Project"
                    : "Add Project"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingProject
                    ? "Update the selected project."
                    : "Add a new project to your portfolio."}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Title */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Project Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. VaultDrive"
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
                    rows="5"
                    placeholder="Describe your project..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Project Image URL
                  </label>

                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/project.jpg"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
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
                    placeholder="React, Node.js, MongoDB"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Separate technologies with commas.
                  </p>
                </div>

                {/* GitHub */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    GitHub URL
                  </label>

                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                {/* Live URL */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Live Project URL
                  </label>

                  <input
                    type="url"
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                {/* Featured */}
                <div className="flex items-center gap-3">
                  <input
                    id="featured"
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />

                  <label
                    htmlFor="featured"
                    className="text-sm font-medium text-gray-700"
                  >
                    Mark as featured project
                  </label>
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
                      : editingProject
                      ? "Update Project"
                      : "Create Project"}
                  </button>

                </div>

              </form>
            </div>
          )}

          {/* Projects Table */}
          <div className="rounded-xl bg-white shadow-sm">

            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-lg font-semibold text-gray-900">
                All Projects
              </h2>
            </div>

            {loading ? (
              <div className="px-6 py-10 text-center text-gray-500">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-500">
                No projects found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">

                  <thead>
                    <tr className="border-b border-gray-100 text-left text-sm text-gray-500">

                      <th className="px-6 py-4 font-medium">
                        Project
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Technologies
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Featured
                      </th>

                      <th className="px-6 py-4 text-right font-medium">
                        Actions
                      </th>

                    </tr>
                  </thead>

                  <tbody>
                    {projects.map((project) => (
                      <tr
                        key={project._id}
                        className="border-b border-gray-50 last:border-0"
                      >

                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {project.title}
                            </p>

                            <p className="mt-1 max-w-md truncate text-sm text-gray-500">
                              {project.description}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {project.technologies?.map(
                              (tech, index) => (
                                <span
                                  key={index}
                                  className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                                >
                                  {tech}
                                </span>
                              )
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {project.featured ? (
                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                              Featured
                            </span>
                          ) : (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                              No
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">

                            <button
                              onClick={() =>
                                handleEdit(project)
                              }
                              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(project._id)
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

export default Projects;