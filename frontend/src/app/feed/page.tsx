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
    <div className="container space-y-6">

      <h1 className="text-3xl font-bold text-center">
        Public Feed
      </h1>

      {loading && (
        <p className="text-gray-500">
          Loading blogs...
        </p>
      )}

      {error && (
        <p className="text-red-500">
          {error}
        </p>
      )}

      {!loading && blogs.length === 0 && (
        <p className="text-gray-500 text-center">
          No blogs yet.
        </p>
      )}

      {!loading &&
        blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
          />
        ))}

      {!loading && totalPages > 1 && (

        <div className="flex justify-center gap-4 mt-6">

          <button
            disabled={page === 1}
            onClick={() =>
              setPage((p) => p - 1)
            }
            className="btn btn-secondary"
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() =>
              setPage((p) => p + 1)
            }
            className="btn btn-primary"
          >
            Next
          </button>

        </div>
      )}
    </div>
  );
}