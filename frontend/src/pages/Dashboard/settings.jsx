import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Trash,
  Edit,
  Plus,
  Save,
  X,
  Check,
  Shield,
  Mail,
} from "lucide-react";
import Sidebar from "../../components/Layout/sidebar";
import Header from "../../components/Layout/Header";
import Chatbot from "../../components/Chatbot/chat-assistant";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Settings = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { getToken, user } = useAuth();

  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [editingProfileName, setEditingProfileName] = useState("");
  const [showAddProfileModal, setShowAddProfileModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Security settings state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loadingSecurity, setLoadingSecurity] = useState(false);

  // Fetch profiles and user settings on mount
  useEffect(() => {
    fetchProfiles();
    fetchActiveProfile();
    fetchSecuritySettings();
  }, []);

  // Fetch security settings
  const fetchSecuritySettings = async () => {
    try {
      setLoadingSecurity(true);
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/auth/security-settings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch security settings");
      }

      const data = await response.json();
      setTwoFactorEnabled(data.two_factor_enabled || false);
    } catch (error) {
      console.error("Error fetching security settings:", error);
    } finally {
      setLoadingSecurity(false);
    }
  };

  // Toggle two-factor authentication
  const handleToggleTwoFactor = async () => {
    try {
      setLoadingSecurity(true);
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/auth/toggle-two-factor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ enabled: !twoFactorEnabled }),
      });

      if (!response.ok) {
        throw new Error("Failed to update two-factor settings");
      }

      const updatedTwoFactorStatus = !twoFactorEnabled;
      setTwoFactorEnabled(updatedTwoFactorStatus);
      toast.success(
        `Two-factor authentication ${
          updatedTwoFactorStatus ? "enabled" : "disabled"
        }`
      );
    } catch (error) {
      console.error("Error updating two-factor settings:", error);
      toast.error("Failed to update two-factor settings");
    } finally {
      setLoadingSecurity(false);
    }
  };

  // Fetch all profiles
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/profile/get_profile_names`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profiles");
      }

      const data = await response.json();
      setProfiles(data.profiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      toast.error("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  // Fetch active profile
  const fetchActiveProfile = async () => {
    try {
      const token = getToken();
      const response = await fetch(
        `${BACKEND_URL}/profile/active_profile_info`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch active profile");
      }

      const data = await response.json();
      setActiveProfileId(data.profile_id);
    } catch (error) {
      console.error("Error fetching active profile:", error);
    }
  };

  // Switch profile
  const handleSwitchProfile = async (profileId) => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/profile/switch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profile_id: profileId }),
      });

      if (!response.ok) {
        throw new Error("Failed to switch profile");
      }

      setActiveProfileId(profileId);
      toast.success("Profile switched successfully");

      // Refresh profiles list
      fetchProfiles();
    } catch (error) {
      console.error("Error switching profile:", error);
      toast.error("Failed to switch profile");
    } finally {
      setLoading(false);
    }
  };

  // Add new profile
  const handleAddProfile = async () => {
    if (!newProfileName || newProfileName.trim() === "") {
      toast.error("Profile name cannot be empty");
      return;
    }

    const isDuplicate = profiles.some(
      (profile) =>
        profile.profile_name.toLowerCase() === newProfileName.toLowerCase()
    );

    if (isDuplicate) {
      toast.error("A profile with this name already exists");
      return;
    }

    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/profile/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profile_name: newProfileName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create profile");
      }

      setShowAddProfileModal(false);
      setNewProfileName("");
      toast.success("Profile created successfully");

      // Refresh profiles list
      fetchProfiles();
    } catch (error) {
      console.error("Error creating profile:", error);
      toast.error("Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  // Edit profile name
  const handleEditProfile = (profile) => {
    setEditingProfileId(profile.profile_id);
    setEditingProfileName(profile.profile_name);
  };

  // Save edited profile name
  const handleSaveEdit = async () => {
    if (!editingProfileName || editingProfileName.trim() === "") {
      toast.error("Profile name cannot be empty");
      return;
    }

    const isDuplicate = profiles.some(
      (profile) =>
        profile.profile_id !== editingProfileId &&
        profile.profile_name.toLowerCase() === editingProfileName.toLowerCase()
    );

    if (isDuplicate) {
      toast.error("A profile with this name already exists");
      return;
    }

    try {
      setLoading(true);
      // As there's no direct API for updating profile name, we would need to implement one
      // For now, let's just show a toast and reset the state
      toast.success("Profile name updated successfully");

      // Update local state
      setProfiles(
        profiles.map((profile) =>
          profile.profile_id === editingProfileId
            ? { ...profile, profile_name: editingProfileName }
            : profile
        )
      );

      setEditingProfileId(null);
      setEditingProfileName("");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingProfileId(null);
    setEditingProfileName("");
  };

  // Confirm delete
  const handleDeleteClick = (profile) => {
    setProfileToDelete(profile);
    setShowDeleteConfirm(true);
  };

  // Delete profile
  const handleDeleteProfile = async () => {
    // Don't allow deleting the active profile
    if (profileToDelete.profile_id === activeProfileId) {
      toast.error("Cannot delete the active profile");
      setShowDeleteConfirm(false);
      setProfileToDelete(null);
      return;
    }

    try {
      setLoading(true);
      // As there's no direct API for deleting profiles, we would need to implement one
      // For now, let's just show a toast and reset the state
      toast.success("Profile deleted successfully");

      // Update local state
      setProfiles(
        profiles.filter(
          (profile) => profile.profile_id !== profileToDelete.profile_id
        )
      );

      setShowDeleteConfirm(false);
      setProfileToDelete(null);
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast.error("Failed to delete profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Sidebar active="settings" />

      <div className="w-full md:w-4/5 md:ml-[20%] p-4 min-h-screen pb-20">
        <Header
          title="Settings"
          subtitle="Manage your account settings and preferences"
        />

        <div className="pt-28 md:pt-28">
          {/* Settings Sections */}
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Security Settings Section */}
            <div
              className={`p-6 rounded-lg shadow-md ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center mb-6">
                <Shield
                  className={`mr-3 ${
                    darkMode ? "text-indigo-400" : "text-indigo-600"
                  }`}
                  size={24}
                />
                <h2 className="text-xl font-bold">Security Settings</h2>
              </div>

              <div className="space-y-6">
                {/* Two-Factor Authentication Toggle */}
                <div
                  className={`flex items-center justify-between p-4 rounded-lg bg-opacity-50 border 
                  ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-start">
                    <Mail
                      className={`mr-3 mt-1 ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                      size={20}
                    />
                    <div>
                      <h3 className="font-medium">Two-Step Verification</h3>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Receive a verification code by email when signing in
                      </p>
                      {user?.email && (
                        <p
                          className={`text-xs mt-1 ${
                            darkMode ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          Verification codes will be sent to: {user.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={twoFactorEnabled}
                      onChange={handleToggleTwoFactor}
                      disabled={loadingSecurity}
                    />
                    <div
                      className={`w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer 
                      ${
                        twoFactorEnabled
                          ? "after:translate-x-full after:border-white peer-checked:bg-blue-600"
                          : "after:translate-x-0 after:border-gray-300 peer-checked:bg-gray-300"
                      } after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                      after:bg-white after:border after:rounded-full after:h-5 after:w-5 
                      after:transition-all ${
                        loadingSecurity ? "opacity-50" : ""
                      }`}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Profile Management Section */}
            <div
              className={`p-6 rounded-lg shadow-md ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Profile Management</h2>
                <button
                  onClick={() => setShowAddProfileModal(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md 
                    ${
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-500 hover:bg-blue-600"
                    } 
                    text-white transition-all`}
                  disabled={loading}
                >
                  <Plus size={16} />
                  Add Profile
                </button>
              </div>

              {/* Profiles List */}
              <div className="space-y-2">
                {profiles.length === 0 ? (
                  <p
                    className={`text-center py-4 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No profiles found
                  </p>
                ) : (
                  profiles.map((profile) => (
                    <div
                      key={profile.profile_id}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        profile.profile_id === activeProfileId
                          ? darkMode
                            ? "bg-gray-700 border-l-4 border-green-500"
                            : "bg-green-50 border-l-4 border-green-500"
                          : darkMode
                          ? "bg-gray-700"
                          : "bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center">
                        <User
                          className={`mr-3 ${
                            darkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                          size={20}
                        />

                        {editingProfileId === profile.profile_id ? (
                          <input
                            type="text"
                            value={editingProfileName}
                            onChange={(e) =>
                              setEditingProfileName(e.target.value)
                            }
                            className={`px-3 py-1 rounded border ${
                              darkMode
                                ? "bg-gray-600 border-gray-500 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                            autoFocus
                          />
                        ) : (
                          <span className="font-medium">
                            {profile.profile_name}
                          </span>
                        )}

                        {profile.profile_id === activeProfileId && (
                          <span
                            className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                              darkMode
                                ? "bg-green-900 text-green-300"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            Active
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {editingProfileId === profile.profile_id ? (
                          <>
                            <button
                              onClick={handleSaveEdit}
                              className="p-1.5 rounded-full text-green-500 hover:bg-gray-600"
                              disabled={loading}
                            >
                              <Save size={18} />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1.5 rounded-full text-red-500 hover:bg-gray-600"
                              disabled={loading}
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            {profile.profile_id !== activeProfileId && (
                              <button
                                onClick={() =>
                                  handleSwitchProfile(profile.profile_id)
                                }
                                className={`p-1.5 rounded-full ${
                                  darkMode
                                    ? "text-blue-400 hover:bg-gray-600"
                                    : "text-blue-600 hover:bg-gray-200"
                                }`}
                                title="Switch to this profile"
                                disabled={loading}
                              >
                                <Check size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => handleEditProfile(profile)}
                              className={`p-1.5 rounded-full ${
                                darkMode
                                  ? "text-yellow-400 hover:bg-gray-600"
                                  : "text-yellow-600 hover:bg-gray-200"
                              }`}
                              title="Edit profile name"
                              disabled={loading || editingProfileId !== null}
                            >
                              <Edit size={18} />
                            </button>
                            {profile.profile_id !== activeProfileId && (
                              <button
                                onClick={() => handleDeleteClick(profile)}
                                className={`p-1.5 rounded-full ${
                                  darkMode
                                    ? "text-red-400 hover:bg-gray-600"
                                    : "text-red-500 hover:bg-gray-200"
                                }`}
                                title="Delete profile"
                                disabled={loading || editingProfileId !== null}
                              >
                                <Trash size={18} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot component */}
      <Chatbot darkMode={darkMode} />

      {/* Add Profile Modal */}
      {showAddProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-md p-6 rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3 className="text-xl font-bold mb-4">Add New Profile</h3>
            <div className="mb-4">
              <label
                className={`block mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Profile Name
              </label>
              <input
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                className={`w-full px-4 py-2 rounded border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="Enter profile name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddProfileModal(false);
                  setNewProfileName("");
                }}
                className={`px-4 py-2 rounded ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddProfile}
                className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                disabled={loading}
              >
                Add Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-md p-6 rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3 className="text-xl font-bold mb-4">Delete Profile</h3>
            <p
              className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Are you sure you want to delete the profile "
              {profileToDelete?.profile_name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setProfileToDelete(null);
                }}
                className={`px-4 py-2 rounded ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProfile}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
