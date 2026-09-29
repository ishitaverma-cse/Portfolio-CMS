import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  FileText,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deletingBlog, setDeletingBlog] = useState(null);

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

        toast.success("Blog updated successfully.");
      } else {
        await api.post("/blogs", payload);

        toast.success("Blog created successfully.");
      }

      resetForm();
      await fetchBlogs();
    } catch (error) {
      console.error("Save blog error:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Failed to save blog.";

      setError(errorMessage);
      toast.error(errorMessage);
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

  const handleDelete = (blog) => {
    setShowForm(false);
    setDeletingBlog(blog);
  };

  const confirmDelete = async () => {
    if (!deletingBlog) return;

    try {
      setMessage("");
      setError("");

      await api.delete(`/blogs/${deletingBlog._id}`);

      toast.success("Blog deleted successfully.");

      setDeletingBlog(null);

      if (editingBlog?._id === deletingBlog._id) {
        resetForm();
      }

      await fetchBlogs();
    } catch (error) {
      console.error("Delete blog error:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Failed to delete blog.";

      setError(errorMessage);
      toast.error(errorMessage);
    }
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
                Content
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
                Blogs
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Create and manage your portfolio blog posts.
              </p>
            </div>

            <button
              onClick={handleAddBlog}
              className="group flex items-center gap-2 rounded-lg bg-gray-950 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800"
            >
              <Plus
                size={17}
                className="transition-transform duration-200 group-hover:rotate-90"
              />

              Add Blog
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

          {/* Blogs Table */}
          <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white">
            {/* Table Header */}
            <div className="flex items-center justify-between border-b border-gray-300 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                  <FileText
                    size={18}
                    className="text-gray-700"
                  />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-gray-950">
                    All Blogs
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {blogs.length}{" "}
                    {blogs.length === 1
                      ? "blog"
                      : "blogs"}
                  </p>
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="px-6 py-14 text-center text-sm text-gray-500">
                Loading blogs...
              </div>
            ) : blogs.length === 0 ? (
              /* Empty */
              <div className="px-6 py-14 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                  <FileText
                    size={21}
                    className="text-gray-500"
                  />
                </div>

                <h3 className="text-sm font-semibold text-gray-900">
                  No blogs found
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Create your first blog post.
                </p>
              </div>
            ) : (
              /* Table */
              <div className="overflow-x-auto">
                <table className="min-w-[1000px] w-full">
                  <thead>
                    <tr className="border-b border-gray-300 bg-gray-50/70 text-left">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Blog
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Slug
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Published At
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {blogs.map((blog) => (
                      <tr
                        key={blog._id}
                        className="border-b border-gray-200 last:border-0 transition hover:bg-gray-50/60"
                      >
                        {/* Blog */}
<td className="px-6 py-5 align-top">
    <div className="flex items-start gap-4">
        {blog.coverImage && (
            <img
                src={blog.coverImage}
                alt=""
                className="h-12 w-16 rounded-lg border border-gray-200 object-cover"
                onError={(e) => {
                    e.currentTarget.style.display = "none";
                }}
            />
        )}

        <div className="min-w-0">
            <p className="font-semibold text-gray-950">
                {blog.title}
            </p>

            {blog.excerpt && (
                <p className="mt-1 max-w-md truncate text-sm text-gray-500">
                    {blog.excerpt}
                </p>
            )}
        </div>
    </div>
</td>

                        {/* Slug */}
                        <td className="px-6 py-5 align-top">
                          <span className="text-sm text-gray-600">
                            {blog.slug}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5 align-top">
                          {blog.published ? (
                            <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                              Draft
                            </span>
                          )}
                        </td>

                        {/* Published At */}
                        <td className="px-6 py-5 align-top">
                          <span className="text-sm text-gray-600">
                            {blog.publishedAt
                              ? new Date(
                                blog.publishedAt
                              ).toLocaleString()
                              : "—"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5 align-top">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                handleEdit(blog)
                              }
                              title="Edit blog"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:border-gray-400 hover:bg-gray-100 hover:text-gray-950"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(blog)
                              }
                              title="Delete blog"
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
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gray-300 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Content
                </p>

                <h2 className="text-xl font-semibold tracking-tight text-gray-950">
                  {editingBlog
                    ? "Edit Blog"
                    : "Add Blog"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingBlog
                    ? "Update the selected blog post."
                    : "Create a new blog post for your portfolio."}
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
              {/* Title + Slug */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                  />
                </div>

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
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                  />
                </div>
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
                  rows={3}
                  placeholder="Short description of the blog..."
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                />
              </div>

              {/* Content */}
              <div className="max-w-2xl">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Content
                </label>

                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={7}
                  required
                  placeholder="Write your blog content..."
                  className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                />
              </div>

              {/* Cover Image */}
              <div className="max-w-2xl">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Cover Image URL
                </label>

                <input
                  type="url"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                />

                {formData.coverImage && (
                  <div className="mt-3 overflow-hidden rounded-lg border border-gray-300 bg-gray-50">
                    <img
                      src={formData.coverImage}
                      alt="Cover preview"
                      className="h-40 w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Published */}
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300"
                />

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Publish this blog
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Published posts can appear on the public portfolio.
                  </p>
                </div>
              </label>

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
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Leave empty if you do not want to set a publication date.
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
                    : editingBlog
                      ? "Update Blog"
                      : "Create Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBlog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-300 bg-white p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 size={20} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-950">
              Delete blog?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                {deletingBlog.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingBlog(null)}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Delete Blog
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

export default Blogs;