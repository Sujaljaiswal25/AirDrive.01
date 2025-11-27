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
  X,
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
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileSortMenu, setShowMobileSortMenu] = useState(false);
  const sortMenuRef = useRef(null);
  const mobileSortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setShowSortMenu(false);
      }
      if (
        mobileSortRef.current &&
        !mobileSortRef.current.contains(event.target)
      ) {
        setShowMobileSortMenu(false);
      }
    };

    if (showSortMenu || showMobileSortMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSortMenu, showMobileSortMenu]);

  const sortOptions = [
    { label: "Name", value: "name" },
    { label: "Date", value: "createdAt" },
    { label: "Size", value: "size" },
    { label: "Type", value: "type" },
  ];

  return (
    <header className="bg-dark-card border-b border-dark-border px-4 lg:px-6 py-3 shadow-dark-sm">
      <div className="flex items-center justify-between gap-3">
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-dark-text-secondary" />
          </button>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Search files..."
              className="w-full pl-10 pr-4 py-2 input-dark rounded-lg outline-none"
            />
          </div>

          {/* Search Button - Mobile */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden p-2 hover:bg-dark-hover rounded-lg transition-colors"
          >
            <Search className="w-5 h-5 text-dark-text-secondary" />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle - Desktop/Tablet */}
          <div className="hidden sm:flex items-center gap-1 bg-dark-hover rounded-lg p-1">
            <button
              onClick={() => dispatch(setViewMode("grid"))}
              className={`p-2 rounded transition-all ${
                viewMode === "grid"
                  ? "bg-accent-primary text-black shadow-dark-sm"
                  : "text-dark-text-secondary hover:text-dark-text-primary"
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => dispatch(setViewMode("list"))}
              className={`p-2 rounded transition-all ${
                viewMode === "list"
                  ? "bg-accent-primary text-black shadow-dark-sm"
                  : "text-dark-text-secondary hover:text-dark-text-primary"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Button - Mobile */}
          <div className="sm:hidden relative" ref={mobileSortRef}>
            <button
              onClick={() => setShowMobileSortMenu(!showMobileSortMenu)}
              className="p-2 border border-dark-border rounded-lg hover:bg-dark-hover transition-colors"
            >
              <ChevronDown className="w-5 h-5 text-dark-text-secondary" />
            </button>

            {showMobileSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-dark-lg z-50 overflow-hidden">
                <div className="px-3 py-2 border-b border-dark-border">
                  <p className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider">
                    Sort By
                  </p>
                </div>
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      dispatch(setSortBy(option.value));
                      setShowMobileSortMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 hover:bg-dark-hover transition-colors ${
                      sortBy === option.value
                        ? "text-accent-primary font-medium bg-dark-hover/50"
                        : "text-dark-text-primary"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
                <div className="border-t border-dark-border"></div>
                <button
                  onClick={() => {
                    dispatch(
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    );
                    setShowMobileSortMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-dark-hover transition-colors text-dark-text-primary"
                >
                  {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
                </button>
                <div className="border-t border-dark-border"></div>
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider mb-2">
                    View
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        dispatch(setViewMode("grid"));
                        setShowMobileSortMenu(false);
                      }}
                      className={`flex-1 p-2 rounded transition-all ${
                        viewMode === "grid"
                          ? "bg-accent-primary text-black"
                          : "border border-dark-border text-dark-text-secondary hover:text-dark-text-primary"
                      }`}
                    >
                      <Grid3x3 className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => {
                        dispatch(setViewMode("list"));
                        setShowMobileSortMenu(false);
                      }}
                      className={`flex-1 p-2 rounded transition-all ${
                        viewMode === "list"
                          ? "bg-accent-primary text-black"
                          : "border border-dark-border text-dark-text-secondary hover:text-dark-text-primary"
                      }`}
                    >
                      <List className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sort Dropdown - Desktop */}
          <div className="hidden sm:block relative" ref={sortMenuRef}>
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-3 py-2 border border-dark-border rounded-lg hover:bg-dark-hover transition-colors"
            >
              <span className="text-sm font-medium text-dark-text-primary hidden lg:inline">
                Sort: {sortOptions.find((opt) => opt.value === sortBy)?.label}
              </span>
              <span className="text-sm font-medium text-dark-text-primary lg:hidden">
                {sortOptions.find((opt) => opt.value === sortBy)?.label}
              </span>
              <ChevronDown className="w-4 h-4 text-dark-text-muted" />
            </button>

            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-dark-lg z-10 overflow-hidden">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      dispatch(setSortBy(option.value));
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 hover:bg-dark-hover transition-colors ${
                      sortBy === option.value
                        ? "text-accent-primary font-medium bg-dark-hover/50"
                        : "text-dark-text-primary"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
                <div className="border-t border-dark-border"></div>
                <button
                  onClick={() => {
                    dispatch(
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    );
                    setShowSortMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-dark-hover transition-colors text-dark-text-primary"
                >
                  {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
                </button>
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="hidden sm:block p-2 hover:bg-dark-hover rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-dark-text-secondary" />
          </button>

          {/* Upload Button */}
          <button
            onClick={() => dispatch(openUploadModal())}
            className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg"
          >
            <Upload className="w-4 h-4" />
            <span className="font-medium hidden sm:inline">Upload</span>
          </button>

          {/* New Folder Button */}
          <button
            onClick={() => dispatch(openCreateFolderModal())}
            className="hidden lg:flex items-center gap-2 px-4 py-2 border border-dark-border rounded-lg hover:bg-dark-hover transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-dark-text-secondary" />
            <span className="font-medium text-dark-text-primary">
              New Folder
            </span>
          </button>

          {/* Mobile New Folder Button */}
          <button
            onClick={() => dispatch(openCreateFolderModal())}
            className="lg:hidden p-2 border border-dark-border rounded-lg hover:bg-dark-hover transition-colors"
          >
            <FolderPlus className="w-5 h-5 text-dark-text-secondary" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="md:hidden mt-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Search files..."
              className="w-full pl-10 pr-4 py-2 input-dark rounded-lg outline-none"
              autoFocus
            />
          </div>
          <button
            onClick={() => setShowSearch(false)}
            className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-dark-text-secondary" />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
