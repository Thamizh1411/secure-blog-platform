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
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          liked 
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
            : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
        }`}
      >
        <span className={liked ? 'scale-110 transition-transform' : ''}>👍</span> {likes}
      </button>

      <AuthRequiredModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}