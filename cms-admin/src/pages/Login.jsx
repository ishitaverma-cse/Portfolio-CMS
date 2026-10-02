import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setServerError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("cmsToken", token);
      localStorage.setItem("cmsAdmin", JSON.stringify(user));

      navigate("/dashboard");

      navigate("/dashboard");
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden flex items-center justify-center px-6 py-10">

      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl" />
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-900 shadow-lg mb-5">
            <LockKeyhole
              size={26}
              className="text-white"
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Portfolio CMS
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your portfolio from one place.
          </p>

        </div>

        {/* Login Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">

          {/* Header */}
          <div className="mb-7">
            <h2 className="text-xl font-semibold text-gray-900">
              Welcome back
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Sign in to access your admin panel.
            </p>
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {serverError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    email: "",
                  }));

                  setServerError("");
                }}
                placeholder="admin@portfolio.com"
                className={`w-full px-4 py-3.5 rounded-xl bg-gray-50 border text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-gray-900/10 ${errors.email
                    ? "border-red-400"
                    : "border-gray-200 focus:border-gray-400"
                  }`}
              />

              {errors.email && (
                <p className="text-sm text-red-500 mt-2">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);

                    setErrors((prev) => ({
                      ...prev,
                      password: "",
                    }));

                    setServerError("");
                  }}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3.5 pr-12 rounded-xl bg-gray-50 border text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-gray-900/10 ${errors.password
                      ? "border-red-400"
                      : "border-gray-200 focus:border-gray-400"
                    }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

              {errors.password && (
                <p className="text-sm text-red-500 mt-2">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}

              {!loading && (
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition"
                />
              )}
            </button>

          </form>

          {/* Security */}
          <div className="flex items-center justify-center gap-2 mt-7 pt-6 border-t border-gray-100">
            <ShieldCheck
              size={16}
              className="text-gray-400"
            />

            <span className="text-xs text-gray-500">
              Secure admin access
            </span>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Portfolio CMS • Admin Panel
        </p>

      </div>
    </div>
  );
}

export default Login;