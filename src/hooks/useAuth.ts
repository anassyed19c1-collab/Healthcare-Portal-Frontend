"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";

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

        apiFetch<{ user: CurrentUser }>("/users/me", { token })
            .then((response) => {
                const data = response.user;

                if (requiredRole && data.role !== requiredRole) {
                    // Galat role ka user is page tak pohanch gaya — uske apne dashboard pe bhej do
                    const dashboards: Record<CurrentUser["role"], string> = {
                        PATIENT: "/patient/dashboard",
                        PROVIDER: "/provider/dashboard",
                        ADMIN: "/admin/dashboard",
                    };
                    router.push(dashboards[data.role]);
                    return;
                }
                setUser(data);
                setLoading(false);
            })
            .catch((err) => {
                if (err instanceof ApiError && err.status === 401) {
                    removeToken();
                }
                router.push("/login");
            });
    }, [router, requiredRole]);

    return { user, loading };
}