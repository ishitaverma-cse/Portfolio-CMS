import { UserCircle } from "lucide-react";

function Navbar() {
  const adminData = localStorage.getItem("cmsAdmin");

  let admin = null;

  try {
    admin = adminData ? JSON.parse(adminData) : null;
  } catch (error) {
    console.error("Invalid admin data:", error);
  }

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">
      {/* Dashboard Info */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-gray-950">
          Admin Dashboard
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage your portfolio content
        </p>
      </div>

      {/* Dynamic Admin Profile */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            {admin?.name || "Admin"}
          </p>

          <p className="mt-0.5 text-xs text-gray-500">
            {admin?.email || "No email available"}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50">
          <UserCircle
            size={28}
            strokeWidth={1.6}
            className="text-gray-500"
          />
        </div>
      </div>
    </header>
  );
}

export default Navbar;