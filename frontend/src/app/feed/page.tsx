"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import BlogCard from "@/components/blog/BlogCard";

export default function FeedPage() {

  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchFeed(currentPage = 1) {

    try {
      setLoading(true);

      const data = await apiFetch(
        `/blogs/public/feed?page=${currentPage}&limit=5`
      );

      setBlogs(data.data);
      setTotalPages(data.totalPages);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFeed(page);
  }, [page]);

  return (
    <div className="space-y-10 pb-12">

      {/* Hero Section */}
      <div className="text-center space-y-4 pt-8 pb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Discover <span className="text-gradient">Great Stories</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Dive into the latest insights, ideas, and perspectives from our vibrant community of writers and thinkers.
        </p>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium">Loading stories...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center shadow-lg">
            <p className="font-semibold text-lg">Oops! Something went wrong.</p>
            <p className="text-sm opacity-80 mt-1">{error}</p>
          </div>
        )}

        {!loading && blogs.length === 0 && (
          <div className="card text-center py-24 border-dashed border-2 border-white/10">
            <p className="text-slate-400 text-lg">No stories have been published yet.</p>
            <p className="text-slate-500 text-sm mt-2">Check back later or start writing your own!</p>
          </div>
        )}

        {!loading && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
              />
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="btn btn-secondary w-28"
            >
              Previous
            </button>

            <span className="text-slate-400 font-medium bg-white/5 px-4 py-1.5 rounded-full text-sm border border-white/10">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="btn btn-primary w-28"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}