import React, { useState, useEffect } from "react";
import { Search, ChevronDown, MoreHorizontal } from "lucide-react";

const Hero = () => {
  const [photos, setPhotos] = useState([]);
  const [heroImage, setHeroImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("photos"); // Default category
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Unsplash API key - in production, store this in environment variables
  const accessKey = "GPVZFZgExai1Oeb4b6zWYUXFvpelb6pqzhcQlU5ld7U";

  // Fetch initial random images
  useEffect(() => {
    fetchRandomImages();
  }, []);

  // Fetch random images for initial display
  const fetchRandomImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.unsplash.com/photos/random?count=60&client_id=${accessKey}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      const data = await response.json();
      setPhotos(data.slice(1)); // Use the remaining images for the grid
      setHeroImage(data[0]); // Use the first image for the hero background
      setLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
      setLoading(false);
    }
  };

  // Search for images based on query
  const searchImages = async (query, page = 1) => {
    if (!query) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=6&client_id=${accessKey}`
      );

      if (!response.ok) {
        throw new Error("Failed to search images");
      }

      const data = await response.json();

      // Update photos and pages info
      setPhotos(data.results || []);
      setTotalPages(data.total_pages || 1);
      setCurrentPage(page);

      // Update hero image if results are available
      if (data.results && data.results.length > 0) {
        setHeroImage(data.results[0]);
        setPhotos(data.results.slice(1)); // Use the remaining images for the grid
      }

      setLoading(false);
    } catch (error) {
      console.error("Error searching images:", error);
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    searchImages(searchQuery);
  };

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    // Auto-search when category changes (with the category as the search term)
    setSearchQuery(newCategory);
    searchImages(newCategory);
  };

  // Handle image actions
  const handleLike = (e, photoId) => {
    e.stopPropagation();
    console.log("Liked photo:", photoId);
    // You would implement actual like functionality here
  };

  const handleCopy = (e, photoUrl) => {
    e.stopPropagation();
    navigator.clipboard
      .writeText(photoUrl)
      .then(() => {
        console.log("URL copied to clipboard:", photoUrl);
        // You could show a toast notification here
      })
      .catch((err) => {
        console.error("Failed to copy URL:", err);
      });
  };

  const handleDownload = (e, photoUrl, photographer) => {
    e.stopPropagation();
    // Create a link element
    const link = document.createElement("a");
    link.href = photoUrl;
    link.download = `photo-by-${photographer
      .replace(/\s+/g, "-")
      .toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle pagination
  const loadMoreImages = () => {
    if (currentPage < totalPages) {
      searchImages(searchQuery, currentPage + 1);
    }
  };

  // Handle previous page
  const loadPreviousImages = () => {
    if (currentPage > 1) {
      searchImages(searchQuery, currentPage - 1);
    }
  };

  return (
    <div className="relative w-full">
      {/* Hero Background Image */}
      <div className="relative w-full h-screen max-h-[500px] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/30 to-gray-900/30">
          {heroImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-80"
              style={{ backgroundImage: `url(${heroImage.urls.regular})` }}
            ></div>
          ) : (
            <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-80"></div>
          )}
        </div>

        {/* Navigation Bar */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <h1 className="text-white text-2xl font-bold">pexels</h1>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-white flex items-center gap-1">
              Explore <ChevronDown className="w-4 h-4" />
            </button>
            <button className="text-white">License</button>
            <button className="text-white">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium">
              Join
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-[calc(100%-80px)] px-6">
          <h2 className="text-white text-4xl font-bold text-center max-w-3xl mb-6">
            The best free stock photos, royalty free images & videos shared by
            creators.
          </h2>

          {/* Search Bar */}
          <div className="relative w-full max-w-3xl">
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-white rounded-lg overflow-hidden"
            >
              <div className="flex items-center px-4 border-r border-gray-200 cursor-pointer">
                <span className="text-gray-600 mr-1">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
                <div className="relative group">
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                  <div className="absolute hidden group-hover:block top-full left-0 bg-white shadow-md rounded-md mt-1 w-32 z-20">
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCategoryChange("photos")}
                    >
                      Photos
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCategoryChange("nature")}
                    >
                      Nature
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCategoryChange("people")}
                    >
                      People
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCategoryChange("travel")}
                    >
                      Travel
                    </div>
                  </div>
                </div>
              </div>
              <input
                type="text"
                placeholder={`Search for free ${category}`}
                className="flex-1 py-3 px-4 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="px-4">
                <Search className="w-5 h-5 text-gray-500" />
              </button>
            </form>
          </div>

          {/* Photo credit */}
          <div className="absolute bottom-4 right-6 text-white/70 text-sm">
            {heroImage && heroImage.user
              ? `Photo by ${heroImage.user.name}`
              : "Photo by frank minjarez"}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-8">
            <button
              className={`py-4 px-2 font-medium ${
                category === "photos"
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-600"
              }`}
              onClick={() => handleCategoryChange("photos")}
            >
              Home
            </button>
            <button
              className={`py-4 px-2 font-medium ${
                category === "videos"
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-600"
              }`}
              onClick={() => handleCategoryChange("videos")}
            >
              Videos
            </button>
            <button
              className={`py-4 px-2 font-medium ${
                category === "nature"
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-600"
              }`}
              onClick={() => handleCategoryChange("nature")}
            >
              Nature
            </button>
            <button
              className={`py-4 px-2 font-medium ${
                category === "travel"
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-600"
              }`}
              onClick={() => handleCategoryChange("travel")}
            >
              Travel
            </button>
          </div>
        </div>
      </div>

      {/* Collection Header */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">
          {searchQuery
            ? `${
                searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)
              } Photos`
            : `Free ${category.charAt(0).toUpperCase() + category.slice(1)}`}
        </h3>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 font-medium text-gray-800">
            Trending <ChevronDown className="w-4 h-4" />
          </button>
          {searchQuery && totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={loadPreviousImages}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={loadMoreImages}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Grid with photos */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {loading ? (
          // Loading state
          Array(5)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="aspect-video bg-gray-200 rounded-lg animate-pulse"
              ></div>
            ))
        ) : photos.length > 0 ? (
          // Loaded photos
          photos.map((photo) => (
            <div
              key={photo.id}
              className="aspect-video bg-gray-200 rounded-lg relative overflow-hidden cursor-pointer group"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transform transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${photo.urls.regular})` }}
              ></div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>

              {/* Top-right action buttons (appear on hover) */}
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  onClick={(e) => handleLike(e, photo.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
                <button
                  className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  onClick={(e) => handleCopy(e, photo.urls.regular)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>

              {/* Bottom left expand button (appears on hover) */}
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
                  <button className="text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Bottom right area with author and download button */}
              <div className="absolute bottom-4 right-4 flex items-center space-x-3">
                {/* Download button (appears on hover) */}
                <button
                  className="bg-white text-gray-800 px-3 py-1 rounded flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100"
                  onClick={(e) =>
                    handleDownload(
                      e,
                      photo.urls.full,
                      photo.user ? photo.user.name : "unknown"
                    )
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span className="text-xs font-medium">Download</span>
                </button>

                {/* Photo credit - always visible */}
                <div className="text-white/70 text-xs">
                  {photo.user ? `Photo by ${photo.user.name}` : ""}
                </div>
              </div>
            </div>
          ))
        ) : (
          // No results found
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500 text-lg">
              No images found. Try a different search term.
            </p>
            <button
              onClick={fetchRandomImages}
              className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg"
            >
              Show random images
            </button>
          </div>
        )}
      </div>

      {/* Load more button for large result sets */}
      {!loading &&
        photos.length > 0 &&
        searchQuery &&
        currentPage < totalPages && (
          <div className="max-w-6xl mx-auto px-6 pb-12 flex justify-center">
            <button
              onClick={loadMoreImages}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Load more
            </button>
          </div>
        )}
    </div>
  );
};

export default Hero;
