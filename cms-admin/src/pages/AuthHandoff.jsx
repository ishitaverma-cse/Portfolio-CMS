import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function AuthHandoff() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");
        const adminData = searchParams.get("admin");

        if (!token || !adminData) {
            navigate("/auth-required", { replace: true });
            return;
        }

        try {
            const admin = JSON.parse(adminData);

            if (admin.role !== "admin") {
                navigate("/auth-required", { replace: true });
                return;
            }

            localStorage.setItem("cmsToken", token);
            localStorage.setItem("cmsAdmin", JSON.stringify(admin));

            navigate("/dashboard", { replace: true });
        } catch (error) {
            console.error("Admin authentication handoff failed:", error);

            localStorage.removeItem("cmsToken");
            localStorage.removeItem("cmsAdmin");

            navigate("/auth-required", { replace: true });
        }
    }, [navigate, searchParams]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <p className="text-sm text-gray-500">
                Signing you in...
            </p>
        </div>
    );
}

export default AuthHandoff;