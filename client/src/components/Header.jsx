import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  Search,
  Upload,
  FolderPlus,
  Grid3x3,
  List,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import {
  toggleSidebar,
  openUploadModal,
  openCreateFolderModal,
} from "../store/slices/uiSlice";
import {
  setViewMode,
  setSortBy,
  setSortOrder,
  setSearchQuery,
} from "../store/slices/fileSlice";

const Header = ({ onRefresh }) => {
  const dispatch = useDispatch();
  const { viewMode, sortBy, sortOrder, searchQuery } = useSelector(
    (state) => state.files
  );
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setShowSortMenu(false);
      }
    };

    if (showSortMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSortMenu]);

  const sortOptions = [
    { label: "Name", value: "name" },
    { label: "Date", value: "createdAt" },
    { label: "Size", value: "size" },
    { label: "Type", value: "type" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Search files..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => dispatch(setViewMode("grid"))}
              className={`p-2 rounded transition-colors ${
                viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
              }`}
            >
              <Grid3x3 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => dispatch(setViewMode("list"))}
              className={`p-2 rounded transition-colors ${
                viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
              }`}
            >
              <List className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={sortMenuRef}>
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                Sort: {sortOptions.find((opt) => opt.value === sortBy)?.label}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      dispatch(setSortBy(option.value));
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                      sortBy === option.value
                        ? "text-blue-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={() => {
                    dispatch(
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    );
                    setShowSortMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                >
                  {sortOrder === "asc" ? "Ascending" : "Descending"}
                </button>
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>

          {/* Upload Button */}
          <button
            onClick={() => dispatch(openUploadModal())}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span className="font-medium">Upload</span>
          </button>

          {/* New Folder Button */}
          <button
            onClick={() => dispatch(openCreateFolderModal())}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-700">New Folder</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
