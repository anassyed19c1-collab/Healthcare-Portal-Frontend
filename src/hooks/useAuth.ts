"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { getToken, removeToken, decodeToken } from "@/lib/auth";

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: "PATIENT" | "PROVIDER" | "ADMIN";
  phone?: string;
  specialization?: string;
}

export function useAuth(requiredRole?: CurrentUser["role"]) {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    const payload = decodeToken(token);
    if (!payload) {
      removeToken();
      router.push("/login");
      return;
    }

    if (requiredRole && payload.role !== requiredRole) {
      const dashboards: Record<string, string> = {
        PATIENT: "/patient/dashboard",
        PROVIDER: "/provider/dashboard",
        ADMIN: "/admin/dashboard",
      };
      router.push(dashboards[payload.role]);
      return;
    }

    // Token valid hai aur role match karta hai
    // Immediately loading false kar do taake page render ho
    // Placeholder name set karo (API se update hoga)
    setUser({
      id: payload.userId,
      name: "...",
      email: "",
      role: payload.role,
    });
    setLoading(false);

    // Background mein real user data fetch karo
    apiFetch<{ user: CurrentUser }>("/users/me", { token })
      .then((response) => {
        setUser(response.user);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          removeToken();
          router.push("/login");
        }
      });
  }, [router, requiredRole]);

  return { user, loading };
}