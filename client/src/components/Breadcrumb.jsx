import { useDispatch, useSelector } from "react-redux";
import { ChevronRight, Home } from "lucide-react";
import { setCurrentFolder } from "../store/slices/fileSlice";

const Breadcrumb = () => {
  const dispatch = useDispatch();
  const { currentFolder, files } = useSelector((state) => state.files);

  // Build breadcrumb path
  const buildBreadcrumbPath = () => {
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

  return (
    <div className="flex items-center gap-2 text-sm bg-white px-6 py-3 border-b border-gray-200">
      {breadcrumbPath.map((item, index) => (
        <div key={item.id} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
          <button
            onClick={() => handleNavigate(item.id)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
              index === breadcrumbPath.length - 1
                ? "text-blue-600 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {index === 0 && <Home className="w-4 h-4" />}
            <span>{item.name}</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
