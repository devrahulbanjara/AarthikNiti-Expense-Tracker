import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Check, X, Upload, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Sidebar from "../../components/Layout/sidebar";
import Header from "../../components/Layout/Header";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProfilePage = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { getToken } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Image preview state
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getToken();
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${BACKEND_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [getToken, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage({
        file,
        preview: previewUrl,
      });
    }
  };

  const handleUploadProfilePicture = async () => {
    if (!previewImage || !previewImage.file) return;

    try {
      setUploading(true);
      const token = getToken();
      const formData = new FormData();
      formData.append("profile_picture", previewImage.file);

      // This endpoint doesn't exist yet in your backend
      // You would need to implement it
      const response = await fetch(
        `${BACKEND_URL}/auth/upload-profile-picture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload profile picture");
      }

      // Update the user data with the new profile picture URL
      const updatedUserData = await response.json();
      setUserData(updatedUserData);
      setPreviewImage(null);

      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  const cancelImageUpload = () => {
    if (previewImage && previewImage.preview) {
      URL.revokeObjectURL(previewImage.preview);
    }
    setPreviewImage(null);
  };

  const togglePasswordChange = () => {
    setIsChangingPassword(!isChangingPassword);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    try {
      setIsUpdatingPassword(true);
      setPasswordUpdateSuccess(false);
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

      toast.success("Password updated successfully! 🔐", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setPasswordUpdateSuccess(true);
      setIsChangingPassword(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Refresh user data to prevent redirect
      const userResponse = await fetch(`${BACKEND_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserData(userData);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordUpdateSuccess(false);
      toast.error(
        error.message || "Failed to update password. Please try again.",
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      setErrors({
        ...errors,
        currentPassword: "Current password is incorrect",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      } min-h-screen flex flex-col md:flex-row`}
    >
      <Sidebar active="profile" />

      <div className="w-full md:w-4/5 md:ml-[20%] p-4 min-h-screen pb-20">
        <Header
          title="Profile Settings"
          subtitle="Manage your personal information"
        />

        <div className="pt-28 md:pt-28">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div
                className={`rounded-lg overflow-hidden border ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } shadow-sm`}
              >
                {/* Profile Picture Section */}
                <div className="p-6 flex flex-col items-center sm:flex-row sm:items-start gap-6">
                  <div className="relative">
                    <div
                      className={`w-32 h-32 rounded-full overflow-hidden flex items-center justify-center border-2 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600"
                          : "bg-gray-100 border-gray-200"
                      }`}
                    >
                      {previewImage ? (
                        <img
                          src={previewImage.preview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : userData?.profile_picture ? (
                        <img
                          src={userData.profile_picture}
                          alt={userData.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className={`text-4xl font-semibold ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {userData?.full_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {!previewImage && (
                      <button
                        onClick={() => fileInputRef.current.click()}
                        className={`absolute bottom-0 right-0 p-2 rounded-full border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
                            : "bg-white border-gray-300 hover:bg-gray-50"
                        }`}
                        aria-label="Change profile picture"
                      >
                        <Camera
                          size={18}
                          className={
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }
                        />
                      </button>
                    )}

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                      aria-label="Upload profile picture"
                    />
                  </div>

                  <div className="flex-1">
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

                    {previewImage && (
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={handleUploadProfilePicture}
                          disabled={uploading}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm ${
                            darkMode
                              ? "bg-green-700 hover:bg-green-600 text-white"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {uploading ? (
                            <>
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Check size={16} />
                              Save
                            </>
                          )}
                        </button>

                        <button
                          onClick={cancelImageUpload}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm ${
                            darkMode
                              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          } transition-colors`}
                          disabled={uploading}
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

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

                    {isChangingPassword ? (
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
                          <h3 className="text-lg font-medium">
                            Change Password
                          </h3>
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
                                  type={
                                    showCurrentPassword ? "text" : "password"
                                  }
                                  name="currentPassword"
                                  value={passwordForm.currentPassword}
                                  onChange={handlePasswordChange}
                                  className={`w-full px-3 py-2 rounded-md ${
                                    darkMode
                                      ? "bg-gray-700 border-gray-600 text-white"
                                      : "bg-white border-gray-300 text-black"
                                  } border ${
                                    errors.currentPassword
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
                              {errors.currentPassword && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.currentPassword}
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
                                  onChange={handlePasswordChange}
                                  className={`w-full px-3 py-2 rounded-md ${
                                    darkMode
                                      ? "bg-gray-700 border-gray-600 text-white"
                                      : "bg-white border-gray-300 text-black"
                                  } border ${
                                    errors.newPassword
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
                              {errors.newPassword && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.newPassword}
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
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  name="confirmPassword"
                                  value={passwordForm.confirmPassword}
                                  onChange={handlePasswordChange}
                                  className={`w-full px-3 py-2 rounded-md ${
                                    darkMode
                                      ? "bg-gray-700 border-gray-600 text-white"
                                      : "bg-white border-gray-300 text-black"
                                  } border ${
                                    errors.confirmPassword
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
                              {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.confirmPassword}
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
                              Password has been successfully updated
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
