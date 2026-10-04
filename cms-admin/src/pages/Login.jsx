import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowUpRight,
  ShieldCheck,
  LayoutDashboard,
  FolderKanban,
  FileText,
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
      newErrors.password =
        "Password must be at least 6 characters";
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
      localStorage.setItem(
        "cmsAdmin",
        JSON.stringify(user)
      );

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
    <div className="h-screen overflow-hidden bg-[#dcdcd9] flex items-center justify-center p-4 sm:p-6">

      {/* =====================================================
          MAIN LOGIN FRAME
      ====================================================== */}

      <div className="w-full max-w-6xl h-full max-h-[680px] overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.08)] flex">

        {/* =================================================
            LEFT SIDE
        ================================================== */}

        <div className="relative hidden lg:flex lg:w-1/2 bg-[#e9e9e6] border-r border-gray-200">

          {/* Decorative structure */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-gray-200" />

            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-gray-200" />

            <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full border border-gray-200" />

            <div className="absolute bottom-10 right-10 h-2 w-2 rounded-full bg-gray-950" />

            <div className="absolute top-24 right-24 h-1.5 w-1.5 rounded-full bg-gray-300" />

          </div>

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">

            {/* Brand */}

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-950">
                  I.V Studio
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-gray-600">
                  Portfolio CMS
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-950 text-xs font-semibold text-white">
                IV
              </div>

            </div>

            {/* Main content */}

            <div className="relative max-w-lg">

              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Content Management
              </p>

              <h1 className="text-5xl xl:text-6xl font-semibold leading-[0.95] tracking-[-0.045em] text-gray-950">
                Your portfolio,
                <br />
                <span className="text-gray-400">
                  your story.
                </span>
              </h1>

              <p className="mt-7 max-w-md text-sm leading-7 text-gray-600">
                Manage your professional presence from one
                centralized workspace. Projects, skills,
                experience and content — all in one place.
              </p>

              {/* Module cards */}

              <div className="mt-10 grid max-w-md grid-cols-3 gap-3">

                <div className="rounded-2xl border border-gray-200 bg-[#f7f7f5] p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-950 text-white">
                    <LayoutDashboard
                      size={16}
                      strokeWidth={1.6}
                    />
                  </div>

                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                    Dashboard
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                    <FolderKanban
                      size={16}
                      strokeWidth={1.6}
                    />
                  </div>

                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                    Projects
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                    <FileText
                      size={16}
                      strokeWidth={1.6}
                    />
                  </div>

                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                    Content
                  </p>
                </div>

              </div>

            </div>

            {/* Bottom */}

            <div className="flex items-center justify-between border-t border-gray-200 pt-5">

              <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400">
                Admin Workspace
              </p>

              <p className="text-[10px] text-gray-400">
                v1.0
              </p>

            </div>

          </div>
        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================== */}

        <div className="flex w-full items-center justify-center bg-white p-6 sm:p-10 lg:w-1/2 lg:p-14">

          <div className="w-full max-w-md">

            {/* Mobile branding */}

            <div className="mb-10 lg:hidden">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-950">
                    I.V Studio
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-gray-400">
                    Portfolio CMS
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-950 text-xs font-semibold text-white">
                  IV
                </div>

              </div>

            </div>

            {/* =================================================
                LOGIN CARD
            ================================================== */}

            <div className="rounded-[26px] border border-gray-200 bg-white p-7 shadow-[0_15px_45px_rgba(0,0,0,0.06)] sm:p-9">

              {/* Card header */}

              <div className="mb-8">

                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-950 text-white">
                  <ShieldCheck
                    size={19}
                    strokeWidth={1.7}
                  />
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Admin Portal
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-gray-950">
                  Welcome back.
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Sign in to manage your portfolio.
                </p>

              </div>

              {/* Server error */}

              {serverError && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {serverError}
                </div>
              )}

              {/* Form */}

              <form
                onSubmit={handleLogin}
                className="space-y-6"
              >

                {/* Email */}

                <div>

                  <label className="mb-2 block text-xs font-semibold text-gray-600">
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
                    className={`w-full rounded-xl border bg-[#fafafa] px-4 py-3.5 text-sm text-gray-950 placeholder-gray-400 outline-none transition focus:bg-white focus:ring-4 focus:ring-gray-950/5 ${
                      errors.email
                        ? "border-red-400"
                        : "border-gray-200 focus:border-gray-950"
                    }`}
                  />

                  {errors.email && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.email}
                    </p>
                  )}

                </div>

                {/* Password */}

                <div>

                  <label className="mb-2 block text-xs font-semibold text-gray-600">
                    Password
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
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
                      className={`w-full rounded-xl border bg-[#fafafa] px-4 py-3.5 pr-12 text-sm text-gray-950 placeholder-gray-400 outline-none transition focus:bg-white focus:ring-4 focus:ring-gray-950/5 ${
                        errors.password
                          ? "border-red-400"
                          : "border-gray-200 focus:border-gray-950"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-950"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                  {errors.password && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.password}
                    </p>
                  )}

                </div>

                {/* Button */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-between rounded-xl bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-gray-950/10 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>
                    {loading
                      ? "Signing in..."
                      : "Sign in"}
                  </span>

                  {!loading && (
                    <ArrowUpRight
                      size={17}
                      strokeWidth={1.7}
                      className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  )}
                </button>

              </form>

              {/* Security */}

              <div className="mt-7 flex items-center justify-center gap-2 border-t border-gray-100 pt-5">

                <ShieldCheck
                  size={15}
                  strokeWidth={1.6}
                  className="text-gray-400"
                />

                <span className="text-[11px] text-gray-400">
                  Secure administrator access
                </span>

              </div>

            </div>

            {/* Footer */}

            <p className="mt-6 text-center text-[10px] uppercase tracking-[0.16em] text-gray-600">
              I.V Studio • Portfolio CMS
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;