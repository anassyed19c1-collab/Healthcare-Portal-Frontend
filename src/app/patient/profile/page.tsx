"use client";

import { useState } from "react";
import Toggle from "@/components/Toggle";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Eleanor Marsh",
    email: "eleanor.marsh@example.com",
    phone: "(555) 248-1190",
    dateOfBirth: "1951-08-14",
    address: "42 Linden Avenue, Portland, OR 97204",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    confirmations: true,
  });

  const handleSaveProfile = () => {
    // backend se wire karte waqt yahan PUT /api/users/me call hoga
    console.log("Saving profile:", profile);
    setIsEditing(false);
  };

  const handleUpdatePassword = () => {
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match");
      return;
    }
    // backend se wire karte waqt yahan PUT /api/users/me (currentPassword + newPassword) call hoga
    console.log("Updating password");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Profile</h1>

      {/* Header card */}
      <div className="bg-card rounded-2xl shadow-sm p-6 flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xl">
            EM
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{profile.name}</p>
            <p className="text-sm text-muted">Patient ID · PT-049213</p>
            <p className="text-sm text-muted">Member since March 2026</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-lg"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Personal Information */}
      <div className="bg-card rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-bold text-foreground mb-5">Personal Information</h2>

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
              <p className="font-semibold text-foreground">{profile.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted mb-1">Date of birth</p>
              <p className="font-semibold text-foreground">
                {new Date(profile.dateOfBirth).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted mb-1">Address</p>
              <p className="font-semibold text-foreground">{profile.address}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Full name
              </label>
              <input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Email address
              </label>
              <input
                value={profile.email}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-muted"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Phone number
              </label>
              <input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Date of birth
              </label>
              <input
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Address
              </label>
              <input
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="col-span-2">
              <button
                onClick={handleSaveProfile}
                className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-card rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-bold text-foreground mb-5">Change Password</h2>
        <div className="space-y-4 max-w-sm">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Current password
            </label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              placeholder="Enter current password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              New password
            </label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              placeholder="Create a new password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Confirm new password
            </label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              placeholder="Re-enter your new password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={handleUpdatePassword}
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-lg"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-card rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-foreground mb-5">Notification Preferences</h2>
        <div className="divide-y divide-gray-100">
          <div className="flex items-center justify-between py-4 first:pt-0">
            <div>
              <p className="font-semibold text-foreground">Email reminders</p>
              <p className="text-sm text-muted">Get appointment reminders by email</p>
            </div>
            <Toggle
              checked={notifications.email}
              onChange={(v) => setNotifications({ ...notifications, email: v })}
            />
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-semibold text-foreground">SMS reminders</p>
              <p className="text-sm text-muted">Get text-message reminders before visits</p>
            </div>
            <Toggle
              checked={notifications.sms}
              onChange={(v) => setNotifications({ ...notifications, sms: v })}
            />
          </div>
          <div className="flex items-center justify-between py-4 last:pb-0">
            <div>
              <p className="font-semibold text-foreground">Appointment confirmations</p>
              <p className="text-sm text-muted">
                Receive confirmation when a booking is made or changed
              </p>
            </div>
            <Toggle
              checked={notifications.confirmations}
              onChange={(v) => setNotifications({ ...notifications, confirmations: v })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}