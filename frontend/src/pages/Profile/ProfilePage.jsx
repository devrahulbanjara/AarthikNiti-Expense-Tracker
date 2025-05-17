import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Check,
  X,
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  Grid,
  RefreshCw,
} from "lucide-react";
import Sidebar from "../../components/Layout/sidebar";
import Header from "../../components/Layout/Header";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProfilePage = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { user, getToken, updateUserData, loadUserData } = useAuth();
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(!user);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);

  const [availableAvatarStyles, setAvailableAvatarStyles] = useState([]);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [selectedAvatarPreviewUrl, setSelectedAvatarPreviewUrl] =
    useState(null);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData(user);
      setLoading(false);
    } else {
      const fetchData = async () => {
        setLoading(true);
        const freshUserData = await loadUserData();
        if (freshUserData) {
          setUserData(freshUserData);
        } else {
          toast.error("Failed to load profile data");
          navigate("/login");
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [user, loadUserData, navigate]);

  useEffect(() => {
    const fetchAvatarStyles = async () => {
      try {
        const token = getToken();
        const response = await fetch(`${BACKEND_URL}/auth/avatars`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch avatar styles");
        const styles = await response.json();
        setAvailableAvatarStyles(styles);
      } catch (error) {
        console.error("Error fetching avatar styles:", error);
        toast.error("Could not load avatar options.");
      }
    };
    fetchAvatarStyles();
  }, [getToken]);

  const generateAvatarUrl = (style, seed) => {
    const safeSeed = encodeURIComponent(seed || "defaultUser");
    const backgroundColorOptions = "&backgroundColor=065336,bbf7d0";
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${safeSeed}${backgroundColorOptions}`;
  };

  const handleSelectAvatar = async (style) => {
    if (!userData) return;
    const newAvatarUrl = generateAvatarUrl(
      style.style,
      userData.full_name || userData.email
    );
    setSelectedAvatarPreviewUrl(newAvatarUrl);
  };

  const handleSaveAvatar = async (avatarUrlToSave) => {
    const finalAvatarUrl = avatarUrlToSave || selectedAvatarPreviewUrl;
    if (!finalAvatarUrl) {
      toast.info("No avatar selected to save.");
      return;
    }
    setIsUpdatingAvatar(true);
    try {
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/auth/select-avatar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar_url: finalAvatarUrl }),
      });
      if (!response.ok) throw new Error("Failed to update avatar");

      const updatedUserFromResponse = await response.json();
      setUserData(updatedUserFromResponse);

      await updateUserData();

      toast.success("Avatar updated successfully!");
      setShowAvatarSelector(false);
      setSelectedAvatarPreviewUrl(null);
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Failed to update avatar.");
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const togglePasswordChange = () => {
    setIsChangingPassword(!isChangingPassword);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: null,
      });
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    if (!passwordForm.currentPassword)
      newErrors.currentPassword = "Current password is required";
    if (!passwordForm.newPassword)
      newErrors.newPassword = "New password is required";
    else if (passwordForm.newPassword.length < 8)
      newErrors.newPassword = "Password must be at least 8 characters";
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;
    setIsUpdatingPassword(true);
    setPasswordUpdateSuccess(false);
    try {
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to change password");
      }
      toast.success("Password updated! 🔐");
      setPasswordUpdateSuccess(true);
      setIsChangingPassword(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      await updateUserData();
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordErrors({
        currentPassword: error.message.includes("incorrect")
          ? error.message
          : null,
        form: !error.message.includes("incorrect") ? error.message : null,
      });
      toast.error(error.message || "Password update failed.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const renderCurrentProfilePicture = () => {
    const avatarUrl =
      selectedAvatarPreviewUrl || (userData && userData.profile_picture);
    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt="Profile Avatar"
          className="w-full h-full object-cover rounded-full"
        />
      );
    }
    return (
      <div
        className={`w-full h-full rounded-full flex items-center justify-center ${
          darkMode ? "bg-gray-700" : "bg-gray-200"
        }`}
      >
        <User
          className={`h-16 w-16 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div
        className={`flex flex-col md:flex-row min-h-screen ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <Sidebar />
        <div className="w-full md:w-4/5 md:ml-[20%] p-4 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      } min-h-screen flex flex-col md:flex-row`}
    >
      <Sidebar />
      <div className="w-full md:w-4/5 md:ml-[20%] p-4 min-h-screen pb-20">
        <Header
          title="Profile Settings"
          subtitle="Manage your personal information"
        />
        <div className="pt-28 md:pt-28">
          <div className="max-w-3xl mx-auto">
            <div
              className={`rounded-lg overflow-hidden border ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } shadow-sm`}
            >
              <div className="p-6 flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="relative group">
                  <div
                    className={`w-32 h-32 rounded-full overflow-hidden flex items-center justify-center border-2 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-100 border-gray-200"
                    }`}
                  >
                    {renderCurrentProfilePicture()}
                  </div>
                  <button
                    onClick={() => {
                      setShowAvatarSelector(true);
                      setSelectedAvatarPreviewUrl(null);
                    }}
                    className="absolute inset-0 w-full h-full bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity duration-300"
                    aria-label="Change avatar"
                  >
                    <Camera
                      size={32}
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </button>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-semibold mb-1">
                    {userData?.full_name}
                  </h2>
                  <p
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } mb-4`}
                  >
                    {userData?.email}
                  </p>
                  {selectedAvatarPreviewUrl && (
                    <div className="mt-2 flex gap-2 justify-center sm:justify-start">
                      <button
                        onClick={() =>
                          handleSaveAvatar(selectedAvatarPreviewUrl)
                        }
                        disabled={isUpdatingAvatar}
                        className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                          darkMode
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-green-500 hover:bg-green-600"
                        } text-white`}
                      >
                        {isUpdatingAvatar ? (
                          <RefreshCw className="animate-spin mr-2" size={16} />
                        ) : (
                          <Check size={16} className="mr-2" />
                        )}
                        Save Avatar
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAvatarPreviewUrl(null);
                        }}
                        className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                          darkMode
                            ? "bg-gray-600 hover:bg-gray-700"
                            : "bg-gray-200 hover:bg-gray-300"
                        } ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        <X size={16} className="mr-2" /> Cancel Preview
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {showAvatarSelector && (
                <div
                  className={`p-6 border-t ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      Choose Your Avatar
                    </h3>
                    <button
                      onClick={() => {
                        setShowAvatarSelector(false);
                        setSelectedAvatarPreviewUrl(null);
                      }}
                      className={`p-1 rounded-full ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <X size={20} />
                    </button>
                  </div>
                  {availableAvatarStyles.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-96 overflow-y-auto mb-4">
                      {availableAvatarStyles.map((style) => {
                        const avatarUrl = generateAvatarUrl(
                          style.style,
                          userData?.full_name || userData?.email || "User"
                        );
                        return (
                          <button
                            key={style.style}
                            onClick={() => handleSelectAvatar(style)}
                            title={style.name}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 ${
                              selectedAvatarPreviewUrl === avatarUrl
                                ? darkMode
                                  ? "border-green-400 ring-green-400 scale-105"
                                  : "border-green-500 ring-green-500 scale-105"
                                : darkMode
                                ? "border-gray-600 hover:border-gray-500 focus:ring-gray-500"
                                : "border-gray-300 hover:border-gray-400 focus:ring-gray-400"
                            }`}
                          >
                            <img
                              src={avatarUrl}
                              alt={style.name}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p>Loading avatar options...</p>
                  )}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleSaveAvatar(selectedAvatarPreviewUrl)}
                      disabled={isUpdatingAvatar || !selectedAvatarPreviewUrl}
                      className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                        darkMode
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-green-500 hover:bg-green-600"
                      } text-white disabled:opacity-50`}
                    >
                      {isUpdatingAvatar ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Confirm & Save
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          Confirm & Save
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div
                className={`border-t ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Security</h3>
                    {!isChangingPassword && (
                      <button
                        onClick={togglePasswordChange}
                        className={`px-4 py-1.5 rounded-md text-sm ${
                          darkMode
                            ? "bg-blue-700 hover:bg-blue-600 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        Change Password
                      </button>
                    )}
                  </div>
                  {isChangingPassword && (
                    <div
                      className={`rounded-lg ${
                        darkMode ? "bg-gray-750" : "bg-gray-50"
                      } p-4`}
                    >
                      <div className="flex items-center mb-4">
                        <button
                          onClick={togglePasswordChange}
                          className={`p-1.5 rounded mr-2 ${
                            darkMode
                              ? "hover:bg-gray-700 text-gray-400"
                              : "hover:bg-gray-200 text-gray-600"
                          }`}
                          aria-label="Go back"
                        >
                          <ArrowLeft size={18} />
                        </button>
                        <h3 className="text-lg font-medium">Change Password</h3>
                      </div>
                      <form onSubmit={handleSubmitPasswordChange}>
                        <div className="space-y-4">
                          <div>
                            <label
                              className={`block text-sm font-medium mb-1 ${
                                darkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={showCurrentPassword ? "text" : "password"}
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordInputChange}
                                className={`w-full px-3 py-2 rounded-md ${
                                  darkMode
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-300 text-black"
                                } border ${
                                  passwordErrors.currentPassword
                                    ? "border-red-500"
                                    : darkMode
                                    ? "border-gray-600"
                                    : "border-gray-300"
                                }`}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                onClick={() =>
                                  setShowCurrentPassword(!showCurrentPassword)
                                }
                                aria-label={
                                  showCurrentPassword
                                    ? "Hide password"
                                    : "Show password"
                                }
                              >
                                {showCurrentPassword ? (
                                  <EyeOff
                                    size={18}
                                    className={
                                      darkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }
                                  />
                                ) : (
                                  <Eye
                                    size={18}
                                    className={
                                      darkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }
                                  />
                                )}
                              </button>
                            </div>
                            {passwordErrors.currentPassword && (
                              <p className="text-red-500 text-sm mt-1">
                                {passwordErrors.currentPassword}
                              </p>
                            )}
                            {passwordErrors.form && (
                              <p className="text-red-500 text-sm mt-1">
                                {passwordErrors.form}
                              </p>
                            )}
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-medium mb-1 ${
                                darkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              New Password
                            </label>
                            <div className="relative">
                              <input
                                type={showNewPassword ? "text" : "password"}
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordInputChange}
                                className={`w-full px-3 py-2 rounded-md ${
                                  darkMode
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-300 text-black"
                                } border ${
                                  passwordErrors.newPassword
                                    ? "border-red-500"
                                    : darkMode
                                    ? "border-gray-600"
                                    : "border-gray-300"
                                }`}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                onClick={() =>
                                  setShowNewPassword(!showNewPassword)
                                }
                                aria-label={
                                  showNewPassword
                                    ? "Hide password"
                                    : "Show password"
                                }
                              >
                                {showNewPassword ? (
                                  <EyeOff
                                    size={18}
                                    className={
                                      darkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }
                                  />
                                ) : (
                                  <Eye
                                    size={18}
                                    className={
                                      darkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }
                                  />
                                )}
                              </button>
                            </div>
                            {passwordErrors.newPassword && (
                              <p className="text-red-500 text-sm mt-1">
                                {passwordErrors.newPassword}
                              </p>
                            )}
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-medium mb-1 ${
                                darkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              Confirm New Password
                            </label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordInputChange}
                                className={`w-full px-3 py-2 rounded-md ${
                                  darkMode
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-300 text-black"
                                } border ${
                                  passwordErrors.confirmPassword
                                    ? "border-red-500"
                                    : darkMode
                                    ? "border-gray-600"
                                    : "border-gray-300"
                                }`}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                aria-label={
                                  showConfirmPassword
                                    ? "Hide password"
                                    : "Show password"
                                }
                              >
                                {showConfirmPassword ? (
                                  <EyeOff
                                    size={18}
                                    className={
                                      darkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }
                                  />
                                ) : (
                                  <Eye
                                    size={18}
                                    className={
                                      darkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }
                                  />
                                )}
                              </button>
                            </div>
                            {passwordErrors.confirmPassword && (
                              <p className="text-red-500 text-sm mt-1">
                                {passwordErrors.confirmPassword}
                              </p>
                            )}
                          </div>
                          <div className="flex justify-end pt-2">
                            <button
                              type="submit"
                              disabled={isUpdatingPassword}
                              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                                darkMode
                                  ? "bg-green-700 hover:bg-green-600 text-white disabled:bg-green-800"
                                  : "bg-green-600 hover:bg-green-700 text-white disabled:bg-green-400"
                              } transition-colors disabled:cursor-not-allowed`}
                            >
                              {isUpdatingPassword ? (
                                <>
                                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                  Updating...
                                </>
                              ) : (
                                <>
                                  <Check size={16} />
                                  Update Password
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </form>
                      {passwordUpdateSuccess && (
                        <div
                          className={`mt-4 p-3 rounded-md ${
                            darkMode ? "bg-green-800" : "bg-green-100"
                          }`}
                        >
                          <p
                            className={`text-sm flex items-center ${
                              darkMode ? "text-green-100" : "text-green-800"
                            }`}
                          >
                            <Check size={16} className="mr-2" />
                            Password updated
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {!isChangingPassword && (
                    <div
                      className={`border rounded-lg ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <div
                        className={`px-4 py-3 flex justify-between items-center border-b ${
                          darkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <div>
                          <h4
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            Password
                          </h4>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
