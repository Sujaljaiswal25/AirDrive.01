import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, User, Mail, Save } from "lucide-react";
import toast from "react-hot-toast";
import { profileAPI } from "../services/profile.service";
import { updateUser } from "../store/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const response = await profileAPI.updateProfile(formData);
      dispatch(updateUser(response));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-dark-text-secondary hover:text-dark-text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-dark-text-secondary mt-2">
            Manage your account information
          </p>
        </div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-dark overflow-hidden"
        >
          <form onSubmit={handleSubmit}>
            {/* Avatar Section */}
            <div className="bg-gradient-to-r from-accent-primary to-accent-secondary p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <img
                    src={
                      avatarPreview ||
                      "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(user?.name || "User") +
                        "&background=3b82f6&color=fff&size=128"
                    }
                    alt="Avatar"
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-dark-lg"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2.5 bg-white rounded-full shadow-dark-md hover:bg-gray-100 transition-colors"
                  >
                    <Camera className="w-5 h-5 text-dark-bg" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <div className="text-white text-center sm:text-left">
                  <h2 className="text-2xl font-bold">{user?.name}</h2>
                  <p className="text-white/80">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-6 lg:p-8 space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-dark-text-primary mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted w-5 h-5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 input-dark rounded-lg outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email Field (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-dark-text-primary mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted w-5 h-5" />
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-dark-hover border border-dark-border text-dark-text-muted rounded-lg cursor-not-allowed"
                  />
                </div>
                <p className="mt-2 text-xs text-dark-text-muted">
                  Email cannot be changed
                </p>
              </div>

              {/* Account Info */}
              <div className="pt-6 border-t border-dark-border">
                <h3 className="font-semibold text-dark-text-primary mb-4">
                  Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-dark-hover rounded-lg">
                    <p className="text-dark-text-muted">Account Created</p>
                    <p className="font-medium text-dark-text-primary mt-1">
                      {new Date(user?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-4 bg-dark-hover rounded-lg">
                    <p className="text-dark-text-muted">User ID</p>
                    <p className="font-medium text-dark-text-primary truncate mt-1">
                      {user?._id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-6 border-t border-dark-border bg-dark-hover/50">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="w-full sm:w-auto px-6 py-2.5 border border-dark-border rounded-lg font-medium text-dark-text-primary hover:bg-dark-card transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium"
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
