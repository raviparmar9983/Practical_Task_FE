"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const publicRoutes = ["/login", "/register"];

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (isAuthenticated && publicRoutes.includes(path)) {
      router.push("/dashboard");
    } else if (!isAuthenticated && !publicRoutes.includes(path)) {
      router.push("/login");
    }
  }, [isAuthenticated, path, router]);

  return children;
}
