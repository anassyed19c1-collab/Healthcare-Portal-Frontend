"use client";

import { useEffect, useState } from "react";
import Toggle from "@/components/Toggle";
import { apiFetch, ApiError } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [preferences, setPreferences] = useState({
    newUserAlerts: true,
    weeklyDigest: true,
    maintenanceNotifications: false,
  });

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    apiFetch<{ user: ApiUser }>("/users/me", { token })
      .then(({ user }) => {
        setProfile({
          name: user.name,
          email: user.email,
          phone: user.phone || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        setLoadError("Could not load your profile.");
        setLoading(false);
      });
  }, []);

  const handleSaveProfile = async () => {
    setSaveError("");
    setSaving(true);
    try {
      const token = getToken();
      await apiFetch("/users/me", {
        method: "PUT",
        token: token || undefined,
        body: {
          name: profile.name,
          phone: profile.phone || undefined,
        },
      });
      setIsEditing(false);
    } catch (err) {
      if (err instanceof ApiError) {
        setSaveError(err.message);
      } else {
        setSaveError("Could not save changes. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (passwords.new !== passwords.confirm) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (!passwords.current || !passwords.new) {
      setPasswordError("Please fill in all password fields");
      return;
    }

    setUpdatingPassword(true);
    try {
      const token = getToken();
      await apiFetch("/users/me", {
        method: "PUT",
        token: token || undefined,
        body: {
          currentPassword: passwords.current,
          newPassword: passwords.new,
        },
      });
      setPasswordSuccess("Password updated successfully.");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      if (err instanceof ApiError) {
        setPasswordError(err.message);
      } else {
        setPasswordError("Could not update password. Please try again.");
      }
    } finally {
      setUpdatingPassword(false);
    }
  };

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (loading) return <p className="text-muted">Loading profile...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Profile</h1>

      {loadError && <p className="text-red-600 mb-4">{loadError}</p>}

      {/* Header card */}
      <div className="bg-card rounded-2xl shadow-sm p-6 flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xl">
            {initials}
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{profile.name}</p>
            <p className="text-sm text-muted">Administrator</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-lg"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Account Information */}
      <div className="bg-card rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-bold text-foreground mb-5">Account Information</h2>

        {saveError && <p className="text-red-600 mb-4">{saveError}</p>}

        {!isEditing ? (
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <div>
              <p className="text-sm text-muted mb-1">Full name</p>
              <p className="font-semibold text-foreground">{profile.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted mb-1">Email address</p>
              <p className="font-semibold text-foreground">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted mb-1">Phone number</p>
              <p className="font-semibold text-foreground">{profile.phone || "—"}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Full name</label>
              <input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Email address</label>
              <input
                value={profile.email}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-muted"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Phone number</label>
              <input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="col-span-2">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-card rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-bold text-foreground mb-5">Change Password</h2>

        {passwordError && <p className="text-red-600 mb-4">{passwordError}</p>}
        {passwordSuccess && <p className="text-green-600 mb-4">{passwordSuccess}</p>}

        <div className="space-y-4 max-w-sm">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Current password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              placeholder="Enter current password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">New password</label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              placeholder="Create a new password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Confirm new password</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              placeholder="Re-enter your new password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:opacity-50"
            />
          </div>
          <button
            onClick={handleUpdatePassword}
            disabled={updatingPassword}
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50"
          >
            {updatingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>

      {/* System Preferences */}
      <div className="bg-card rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-foreground mb-5">System Preferences</h2>
        <div className="divide-y divide-gray-100">
          <div className="flex items-center justify-between py-4 first:pt-0">
            <div>
              <p className="font-semibold text-foreground">New user signup alerts</p>
              <p className="text-sm text-muted">
                Email me whenever a new patient or provider account is created
              </p>
            </div>
            <Toggle
              checked={preferences.newUserAlerts}
              onChange={(v) => setPreferences({ ...preferences, newUserAlerts: v })}
            />
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-semibold text-foreground">Weekly summary reports</p>
              <p className="text-sm text-muted">
                Send a weekly digest of portal activity and key metrics
              </p>
            </div>
            <Toggle
              checked={preferences.weeklyDigest}
              onChange={(v) => setPreferences({ ...preferences, weeklyDigest: v })}
            />
          </div>
          <div className="flex items-center justify-between py-4 last:pb-0">
            <div>
              <p className="font-semibold text-foreground">System maintenance notifications</p>
              <p className="text-sm text-muted">
                Notify me about scheduled maintenance and system status changes
              </p>
            </div>
            <Toggle
              checked={preferences.maintenanceNotifications}
              onChange={(v) => setPreferences({ ...preferences, maintenanceNotifications: v })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}