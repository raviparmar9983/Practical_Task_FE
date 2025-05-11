"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Profile from "./Profile";

export default function Header() {
  const { logout } = useAuthContext();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
      <h4 className="m-0">My App</h4>
      <div className="d-flex align-items-center gap-3">
        <Profile />
        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
