import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Cloud,
  Home,
  FolderOpen,
  Star,
  Trash2,
  Settings,
  LogOut,
  Image,
  FileText,
  Music,
  Video,
} from "lucide-react";
import { authAPI } from "../services/auth.service";
import { logout } from "../store/slices/authSlice";
import { setCurrentFolder } from "../store/slices/fileSlice";
import toast from "react-hot-toast";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { currentFolder } = useSelector((state) => state.files);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const menuItems = [
    { icon: Home, label: "All Files", value: "root", color: "text-blue-500" },
    {
      icon: FolderOpen,
      label: "My Folders",
      value: "folders",
      color: "text-yellow-500",
    },
    {
      icon: Star,
      label: "Starred",
      value: "starred",
      color: "text-orange-500",
    },
    { icon: Trash2, label: "Trash", value: "trash", color: "text-red-500" },
  ];

  const categoryItems = [
    { icon: Image, label: "Images", value: "images", color: "text-green-500" },
    { icon: Video, label: "Videos", value: "videos", color: "text-purple-500" },
    { icon: Music, label: "Audio", value: "audio", color: "text-pink-500" },
    {
      icon: FileText,
      label: "Documents",
      value: "documents",
      color: "text-indigo-500",
    },
  ];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-64 bg-white border-r border-gray-200 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AirDrive</h1>
            <p className="text-xs text-gray-500">Cloud Storage</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || "https://via.placeholder.com/40"}
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.value}
              onClick={() => dispatch(setCurrentFolder(item.value))}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                currentFolder === item.value
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${
                  currentFolder === item.value ? "text-blue-600" : item.color
                }`}
              />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="mt-6">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Categories
          </h3>
          <div className="space-y-1">
            {categoryItems.map((item) => (
              <button
                key={item.value}
                onClick={() => dispatch(setCurrentFolder(item.value))}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  currentFolder === item.value
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    currentFolder === item.value ? "text-blue-600" : item.color
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        <button
          onClick={() => navigate("/profile")}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
