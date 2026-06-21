export interface JwtPayload {
  userId: number;
  role: "PATIENT" | "PROVIDER" | "ADMIN";
  exp: number;
}

const TOKEN_KEY = "healthcare_token";

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null; // server-side safety
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    return JSON.parse(payloadJson) as JwtPayload;
  } catch {
    return null;
  }
}

export function getCurrentUser(): JwtPayload | null {
  const token = getToken();
  if (!token) return null;

  const payload = decodeToken(token);
  if (!payload) return null;

  // Token expire check
  if (payload.exp * 1000 < Date.now()) {
    removeToken();
    return null;
  }

  return payload;
}

export function roleToDashboard(role: JwtPayload["role"]): string {
  switch (role) {
    case "PATIENT":
      return "/patient/dashboard";
    case "PROVIDER":
      return "/provider/dashboard";
    case "ADMIN":
      return "/admin/dashboard";
  }
}
