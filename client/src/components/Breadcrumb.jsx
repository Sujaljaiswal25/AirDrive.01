import { useDispatch, useSelector } from "react-redux";
import {
  ChevronRight,
  Home,
  Image,
  Video,
  Music,
  FileText,
} from "lucide-react";
import { setCurrentFolder } from "../store/slices/fileSlice";

const Breadcrumb = () => {
  const dispatch = useDispatch();
  const { currentFolder, files } = useSelector((state) => state.files);

  // Category mapping
  const categoryNames = {
    root: "All Files",
    images: "Images",
    videos: "Videos",
    audio: "Audio",
    documents: "Documents",
    folders: "My Folders",
    starred: "Starred",
    trash: "Trash",
  };

  const categoryIcons = {
    images: Image,
    videos: Video,
    audio: Music,
    documents: FileText,
  };

  // Build breadcrumb path
  const buildBreadcrumbPath = () => {
    // Check if it's a category or special folder
    if (categoryNames[currentFolder]) {
      return [{ id: currentFolder, name: categoryNames[currentFolder] }];
    }

    // Default path starting with "All Files"
    const path = [{ id: "root", name: "All Files" }];

    if (currentFolder !== "root") {
      // Find the current folder in files to get its name
      const folder = files.find(
        (f) => f._id === currentFolder && f.type === "folder"
      );
      if (folder) {
        path.push({ id: folder._id, name: folder.name });
      }
    }

    return path;
  };

  const breadcrumbPath = buildBreadcrumbPath();

  const handleNavigate = (folderId) => {
    dispatch(setCurrentFolder(folderId));
  };

  // Get appropriate icon for current breadcrumb
  const getIcon = (itemId, index) => {
    if (index === 0 && breadcrumbPath.length === 1) {
      const IconComponent = categoryIcons[currentFolder] || Home;
      return <IconComponent className="w-4 h-4" />;
    }
    if (index === 0) {
      return <Home className="w-4 h-4" />;
    }
    return null;
  };

  return (
    <div className="flex items-center gap-2 text-sm bg-dark-card px-4 lg:px-6 py-3 border-b border-dark-border overflow-x-auto">
      {breadcrumbPath.map((item, index) => (
        <div key={item.id} className="flex items-center gap-2 flex-shrink-0">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-dark-text-muted" />
          )}
          <button
            onClick={() => handleNavigate(item.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              index === breadcrumbPath.length - 1
                ? "text-accent-primary font-semibold bg-accent-primary/10"
                : "text-dark-text-secondary hover:bg-dark-hover hover:text-dark-text-primary"
            }`}
          >
            {getIcon(item.id, index)}
            <span>{item.name}</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
