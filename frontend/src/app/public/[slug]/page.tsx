"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";

import BlogHeader from "@/components/blog/BlogHeader";
import CommentForm from "@/components/blog/CommentForm";
import CommentItem from "@/components/blog/CommentItem";
import AuthRequiredModal from "@/components/AuthRequiredModal";

export default function PublicBlogPage() {

  const { slug } = useParams();

  const [blog, setBlog] = useState<any>(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [commentContent, setCommentContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  async function fetchBlog() {
    try {
      const data = await apiFetch(`/blogs/public/${slug}`);
      setBlog(data);
    } catch {
      setError("Blog not found or not published.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchProfile() {
    try {
      const data = await apiFetch("/auth/profile");
      setUser(data);
    } catch {
      setUser(null);
    }
  }

  async function addComment() {

    const token = getToken();

    // 🚫 Not logged in
    if (!token) {
      setShowModal(true);
      return;
    }

    if (!commentContent.trim()) return;

    try {

      const newComment = await apiFetch(
        `/blogs/${blog.id}/comments`,
        {
          method: "POST",
          body: JSON.stringify({
            content: commentContent,
          }),
        }
      );

      setBlog((prev: any) => ({
        ...prev,
        comments: [newComment, ...prev.comments],
      }));

      setCommentContent("");

    } catch (err: any) {
      alert(err.message);
    }
  }

  async function deleteComment(id: string) {
    try {

      await apiFetch(
        `/blogs/${blog.id}/comments/${id}`,
        { method: "DELETE" }
      );

      setBlog((prev: any) => ({
        ...prev,
        comments: prev.comments.filter(
          (c: any) => c.id !== id
        ),
      }));

    } catch (err: any) {
      alert(err.message);
    }
  }

  async function updateComment(id: string, content: string) {

    try {

      const updated = await apiFetch(
        `/blogs/${blog.id}/comments/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ content }),
        }
      );

      setBlog((prev: any) => ({
        ...prev,
        comments: prev.comments.map((c: any) =>
          c.id === id ? updated : c
        ),
      }));

    } catch (err: any) {
      alert(err.message);
    }
  }

  useEffect(() => {
    if (slug) {
      fetchBlog();
      fetchProfile();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        Loading blog...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-red-500">
        {error}
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="container space-y-6">

      <BlogHeader
        title={blog.title}
        authorEmail={blog.author.email}
        createdAt={blog.createdAt}
      />

      <div className="card space-y-4">

        <p className="text-lg leading-7 whitespace-pre-line">
          {blog.content}
        </p>

        <p className="text-sm text-gray-600">
          Likes: {blog.totalLikes}
        </p>

      </div>

      <div className="card space-y-4">

        <h2 className="text-xl font-semibold">
          Comments
        </h2>

        <CommentForm
          value={commentContent}
          onChange={setCommentContent}
          onSubmit={addComment}
        />

        {blog.comments.length === 0 && (
          <p className="text-gray-500">
            No comments yet.
          </p>
        )}

        {blog.comments.map((comment: any) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUser={user}
            onDelete={deleteComment}
            onUpdate={updateComment}
          />
        ))}

      </div>

      <AuthRequiredModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />

    </div>
  );
}