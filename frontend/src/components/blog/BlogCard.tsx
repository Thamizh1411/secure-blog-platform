"use client";

import Link from "next/link";
import LikeButton from "./LikeButton";
import { MessageCircle } from "lucide-react";

interface BlogCardProps {
  blog: any;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const formattedDate = new Date(
    blog.createdAt
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="card group relative overflow-hidden">
      
      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-400/20 transition-all duration-500"></div>

      <div className="relative z-10 space-y-4">
        {/* Title */}
        <Link
          href={`/public/${blog.slug}`}
          className="text-2xl font-bold text-slate-100 hover:text-blue-400 transition-colors inline-block line-clamp-2"
        >
          {blog.title}
        </Link>

        {/* Author + Date */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">
            By{" "}
            <span className="font-semibold text-blue-300">
              {blog.author?.email}
            </span>
          </span>

          <span className="text-slate-500 font-medium">{formattedDate}</span>
        </div>

        {/* Summary */}
        {blog.summary && (
          <p className="text-slate-300 leading-relaxed opacity-90 line-clamp-3">
            {blog.summary}
          </p>
        )}

        {/* Engagement */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-2">
          <div className="flex gap-6 items-center">
            <LikeButton
              blogId={blog.id}
              initialLikes={blog.totalLikes ?? 0}
            />

            <span className="flex items-center gap-2 text-slate-400 group-hover:text-slate-300 transition-colors cursor-default">
              <MessageCircle size={18} />
              <span className="font-medium">{blog.totalComments ?? 0}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}