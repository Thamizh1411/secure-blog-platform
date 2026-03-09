"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { removeToken } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogs, setBlogs] = useState<any[]>([]);
  const [error, setError] = useState("");

  const [user, setUser] = useState<any>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  async function fetchBlogs() {
    try {
      const data = await apiFetch("/blogs/me");
      setBlogs(data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function fetchProfile() {
    try {
      const data = await apiFetch("/auth/profile");
      setUser(data);
    } catch {}
  }

  useEffect(() => {
    fetchBlogs();
    fetchProfile();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    try {
      const newBlog = await apiFetch("/blogs", {
        method: "POST",
        body: JSON.stringify({ title, content }),
      });

      setBlogs((prev) => [newBlog, ...prev]);
      setTitle("");
      setContent("");
    } catch (err: any) {
      setError(err.message);
    }
  }

  function handleEditClick(blog: any) {
    setEditingId(blog.id);
    setEditTitle(blog.title);
    setEditContent(blog.content);
  }

  async function handleUpdate(blogId: string) {
    const updatedBlog = await apiFetch(`/blogs/${blogId}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: editTitle,
        content: editContent,
      }),
    });

    setBlogs((prev) =>
      prev.map((blog) =>
        blog.id === blogId ? updatedBlog : blog
      )
    );

    setEditingId(null);
  }

  async function handleDelete(blogId: string) {

  const confirmDelete = confirm("Are you sure you want to delete this blog?");

  if (!confirmDelete) return;

  await apiFetch(`/blogs/${blogId}`, {
    method: "DELETE",
  });

  setBlogs((prev) =>
    prev.filter((b) => b.id !== blogId)
  );
}

 async function handleTogglePublish(blog: any) {
  const updated = await apiFetch(`/blogs/${blog.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      isPublished: !blog.isPublished,
    }),
  });

  setBlogs((prev) =>
    prev.map((b) =>
      b.id === blog.id
        ? { ...b, isPublished: updated.isPublished }
        : b
    )
  );
}

  async function handleLike(blogId: string) {
    const res = await apiFetch(`/blogs/${blogId}/like`, {
      method: "POST",
    });

    setBlogs((prev) =>
      prev.map((b) =>
        b.id === blogId
          ? { ...b, totalLikes: res.totalLikes }
          : b
      )
    );
  }

  async function handleUnlike(blogId: string) {
    const res = await apiFetch(`/blogs/${blogId}/like`, {
      method: "DELETE",
    });

    setBlogs((prev) =>
      prev.map((b) =>
        b.id === blogId
          ? { ...b, totalLikes: res.totalLikes }
          : b
      )
    );
  }

  function handleLogout() {
    removeToken();
    router.push("/login");
  }

  return (
    <div className="container space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="btn btn-danger"
        >
          Logout
        </button>
      </div>

      {/* CREATE BLOG */}
      <form
        onSubmit={handleCreate}
        className="card space-y-3"
      >
        <h2 className="text-lg font-semibold">
          Create Blog
        </h2>

        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Blog Title"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Blog Content"
          className="input"
          rows={4}
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          required
        />

        <button className="btn btn-primary">
          Create Blog
        </button>
      </form>

      {/* BLOG LIST */}
      <div className="space-y-4">

        <h2 className="text-xl font-semibold">
          Your Blogs
        </h2>

        {blogs.length === 0 && (
          <p className="text-gray-500">
            No blogs yet.
          </p>
        )}

        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="card space-y-3"
          >

            <p
              className={`text-xs font-semibold ${
                blog.isPublished
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {blog.isPublished
                ? "Published"
                : "Draft"}
            </p>

            {editingId === blog.id ? (
              <>
                <input
                  className="input"
                  value={editTitle}
                  onChange={(e) =>
                    setEditTitle(e.target.value)
                  }
                />

                <textarea
                  className="input"
                  value={editContent}
                  onChange={(e) =>
                    setEditContent(e.target.value)
                  }
                />

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleUpdate(blog.id)
                    }
                    className="btn btn-primary"
                  >
                    Save
                  </button>

                  <button
                    onClick={() =>
                      setEditingId(null)
                    }
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold">
                  {blog.title}
                </h3>

                <p>{blog.content}</p>
              </>
            )}

            <p className="text-sm text-gray-600">
              Likes: {blog.totalLikes ?? 0}
            </p>

            <div className="flex flex-wrap gap-2">

              {user &&
                blog.user?.id === user.id && (
                  <>
                    <button
                      onClick={() =>
                        handleEditClick(blog)
                      }
                      className="btn btn-secondary"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(blog.id)
                      }
                      className="btn btn-danger"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() =>
                        handleTogglePublish(blog)
                      }
                      className="btn btn-primary"
                    >
                      {blog.isPublished
                        ? "Unpublish"
                        : "Publish"}
                    </button>
                  </>
                )}

              <button
                onClick={() =>
                  handleLike(blog.id)
                }
                className="btn btn-primary"
              >
                Like
              </button>

              <button
                onClick={() =>
                  handleUnlike(blog.id)
                }
                className="btn btn-secondary"
              >
                Unlike
              </button>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}