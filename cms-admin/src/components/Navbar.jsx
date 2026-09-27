import { UserCircle } from "lucide-react";

function Navbar() {
  const admin = JSON.parse(localStorage.getItem("cmsAdmin"));

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Admin Dashboard
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Manage your portfolio content
        </p>
      </div>

      {/* Admin Info */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            {admin?.name || "Admin"}
          </p>

          <p className="text-xs text-gray-500">
            {admin?.role === "admin" ? "Administrator" : "User"}
          </p>
        </div>

        <UserCircle
          size={40}
          strokeWidth={1.5}
          className="text-gray-500"
        />
      </div>
    </header>
  );
}

export default Navbar;