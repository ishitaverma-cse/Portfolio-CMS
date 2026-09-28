import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Blogs() {
  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    published: false,
    publishedAt: "",
  });

  const fetchBlogs = async () => {
    try {
      const response = await api.get("/blogs");

      setBlogs(response.data);
    } catch (error) {
      console.error("Fetch blogs error:", error);

      setError("Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
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
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      published: false,
      publishedAt: "",
    });

    setEditingBlog(null);
    setShowForm(false);
  };

  const handleAddBlog = () => {
    setEditingBlog(null);

    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      published: false,
      publishedAt: "",
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
        publishedAt: formData.publishedAt
          ? new Date(formData.publishedAt)
          : null,
      };

      if (editingBlog) {
        await api.put(
          `/blogs/${editingBlog._id}`,
          payload
        );

        setMessage("Blog updated successfully.");
      } else {
        await api.post("/blogs", payload);

        setMessage("Blog created successfully.");
      }

      resetForm();

      await fetchBlogs();
    } catch (error) {
      console.error("Save blog error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to save blog."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);

    setFormData({
      title: blog.title || "",
      slug: blog.slug || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      coverImage: blog.coverImage || "",
      published: blog.published || false,
      publishedAt: blog.publishedAt
        ? new Date(blog.publishedAt)
            .toISOString()
            .slice(0, 16)
        : "",
    });

    setMessage("");
    setError("");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await api.delete(`/blogs/${id}`);

      setMessage("Blog deleted successfully.");

      if (editingBlog?._id === id) {
        resetForm();
      }

      await fetchBlogs();
    } catch (error) {
      console.error("Delete blog error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete blog."
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
                Blogs
              </h1>

              <p className="mt-2 text-gray-500">
                Manage your portfolio blog posts.
              </p>
            </div>

            <button
              onClick={handleAddBlog}
              className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              + Add Blog
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

              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingBlog
                      ? "Edit Blog"
                      : "Add Blog"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {editingBlog
                      ? "Update the selected blog."
                      : "Add a new blog to your portfolio."}
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

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Title */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Blog Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. My Journey into Full Stack Development"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Slug
                  </label>

                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    placeholder="my-journey-into-full-stack-development"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Excerpt
                  </label>

                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Short description of the blog..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Content
                  </label>

                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows="8"
                    required
                    placeholder="Write your blog content..."
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                {/* Cover Image */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Cover Image URL
                  </label>

                  <input
                    type="url"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                {/* Published */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />

                  <label className="text-sm font-medium text-gray-700">
                    Publish this blog
                  </label>
                </div>

                {/* Published At */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Published At
                  </label>

                  <input
                    type="datetime-local"
                    name="publishedAt"
                    value={formData.publishedAt}
                    onChange={handleChange}
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
                      : editingBlog
                      ? "Update Blog"
                      : "Create Blog"}
                  </button>

                </div>
              </form>
            </div>
          )}

          {/* Blogs Table */}
          <div className="rounded-xl bg-white shadow-sm">

            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-lg font-semibold text-gray-900">
                All Blogs
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                View and manage your existing blog posts.
              </p>
            </div>

            {loading ? (
              <div className="px-6 py-10 text-center text-gray-500">
                Loading blogs...
              </div>
            ) : blogs.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-500">
                No blogs found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">

                  <thead>
                    <tr className="border-b border-gray-100 text-left text-sm text-gray-500">

                      <th className="px-6 py-4 font-medium">
                        Blog
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Slug
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Status
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Published At
                      </th>

                      <th className="px-6 py-4 text-right font-medium">
                        Actions
                      </th>

                    </tr>
                  </thead>

                  <tbody>
                    {blogs.map((blog) => (
                      <tr
                        key={blog._id}
                        className="border-b border-gray-50 last:border-0"
                      >

                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {blog.title}
                            </p>

                            {blog.excerpt && (
                              <p className="mt-1 max-w-md truncate text-sm text-gray-500">
                                {blog.excerpt}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {blog.slug}
                        </td>

                        <td className="px-6 py-4">
                          {blog.published ? (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                              Published
                            </span>
                          ) : (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                              Draft
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {blog.publishedAt
                            ? new Date(
                                blog.publishedAt
                              ).toLocaleString()
                            : "—"}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">

                            <button
                              onClick={() =>
                                handleEdit(blog)
                              }
                              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(blog._id)
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

export default Blogs;