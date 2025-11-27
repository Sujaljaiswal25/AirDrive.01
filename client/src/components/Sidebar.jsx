import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
} from "lucide-react";
import { authAPI } from "../services/auth.service";
import { logout } from "../store/slices/authSlice";
import { setCurrentFolder } from "../store/slices/fileSlice";
import { toggleSidebar } from "../store/slices/uiSlice";
import toast from "react-hot-toast";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { currentFolder } = useSelector((state) => state.files);
  const { sidebarOpen } = useSelector((state) => state.ui);

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

  const handleFolderChange = (value) => {
    dispatch(setCurrentFolder(value));
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      dispatch(toggleSidebar());
    }
  };

  const menuItems = [
    {
      icon: Home,
      label: "All Files",
      value: "root",
      color: "text-accent-primary",
    },
    {
      icon: FolderOpen,
      label: "My Folders",
      value: "folders",
      color: "text-accent-warning",
    },
    {
      icon: Star,
      label: "Starred",
      value: "starred",
      color: "text-accent-warning",
    },
    {
      icon: Trash2,
      label: "Trash",
      value: "trash",
      color: "text-accent-error",
    },
  ];

  const categoryItems = [
    {
      icon: Image,
      label: "Images",
      value: "images",
      color: "text-accent-success",
    },
    {
      icon: Video,
      label: "Videos",
      value: "videos",
      color: "text-accent-secondary",
    },
    { icon: Music, label: "Audio", value: "audio", color: "text-pink-500" },
    {
      icon: FileText,
      label: "Documents",
      value: "documents",
      color: "text-accent-primary",
    },
  ];

  const sidebarContent = (
    <>
      {/* Logo & Close Button */}
      <div className="p-6 border-b border-dark-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 bg-gradient-to-br from-accent-primary/20 to-accent-primary/10 rounded-2xl flex items-center justify-center border border-accent-primary/30">
            <Cloud className="w-5 h-5 text-accent-primary" />
          </div>
          <div>
            <h1
              className="text-lg font-semibold text-dark-text-primary"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Air<span className="text-accent-primary">Drive</span>
            </h1>
            <p className="text-xs text-dark-text-muted">your cloud space</p>
          </div>
        </div>
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="lg:hidden p-2 hover:bg-dark-hover rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-dark-text-secondary" />
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-dark-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-hover/50 hover:bg-dark-hover transition-colors">
          <div className="relative">
            <img
              src={
                user?.avatar ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(user?.name || "User") +
                  "&background=3b82f6&color=fff"
              }
              alt={user?.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-accent-primary/20"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent-success rounded-full border-2 border-dark-card"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-dark-text-primary truncate">
              {user?.name}
            </p>
            <p className="text-xs text-dark-text-muted truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.value}
              onClick={() => handleFolderChange(item.value)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentFolder === item.value
                  ? "bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 text-accent-primary shadow-dark-sm"
                  : "text-dark-text-secondary hover:bg-dark-hover hover:text-dark-text-primary"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${
                  currentFolder === item.value
                    ? "text-accent-primary"
                    : item.color
                }`}
              />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="mt-6">
          <h3 className="px-4 text-xs font-bold text-dark-text-muted uppercase tracking-wider mb-3">
            Categories
          </h3>
          <div className="space-y-1">
            {categoryItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleFolderChange(item.value)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  currentFolder === item.value
                    ? "bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 text-accent-primary shadow-dark-sm"
                    : "text-dark-text-secondary hover:bg-dark-hover hover:text-dark-text-primary"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    currentFolder === item.value
                      ? "text-accent-primary"
                      : item.color
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-dark-border space-y-1">
        <button
          onClick={() => {
            navigate("/profile");
            if (window.innerWidth < 1024) {
              dispatch(toggleSidebar());
            }
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-dark-text-secondary hover:bg-dark-hover hover:text-dark-text-primary transition-all"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-accent-error hover:bg-accent-error/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="hidden lg:flex w-72 bg-dark-card border-r border-dark-border flex-col shadow-dark-lg"
      >
        {sidebarContent}
      </motion.div>

      {/* Mobile Sidebar with Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch(toggleSidebar())}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-dark-card border-r border-dark-border flex flex-col shadow-dark-xl z-50"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
