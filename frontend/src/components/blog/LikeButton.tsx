"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";
import AuthRequiredModal from "@/components/AuthRequiredModal";

interface Props {
  blogId: string;
  initialLikes: number;
}

export default function LikeButton({ blogId, initialLikes }: Props) {

  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  async function toggleLike() {

    const token = getToken();

    // 🚫 Not logged in
    if (!token) {
      setShowModal(true);
      return;
    }

    if (loading) return;

    setLoading(true);

    // optimistic update
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    setLiked(!liked);

    try {

      if (!liked) {
        await apiFetch(`/blogs/${blogId}/like`, {
          method: "POST",
        });
      } else {
        await apiFetch(`/blogs/${blogId}/like`, {
          method: "DELETE",
        });
      }

    } catch {

      setLikes(initialLikes);
      setLiked(!liked);

    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={toggleLike}
        className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
      >
        👍 {likes}
      </button>

      <AuthRequiredModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}