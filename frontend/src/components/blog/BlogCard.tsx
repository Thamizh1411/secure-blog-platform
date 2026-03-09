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
    <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition duration-200 bg-white space-y-4">

      {/* Title */}
      <Link
        href={`/public/${blog.slug}`}
        className="text-2xl font-semibold text-blue-600 hover:underline"
      >
        {blog.title}
      </Link>

      {/* Author + Date */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>
          By{" "}
          <span className="font-medium text-gray-700">
            {blog.author?.email}
          </span>
        </span>

        <span>{formattedDate}</span>
      </div>

      {/* Summary */}
      {blog.summary && (
        <p className="text-gray-700 leading-relaxed">
          {blog.summary}
        </p>
      )}

      {/* Engagement */}
      <div className="flex justify-between items-center pt-2 border-t text-sm text-gray-600">
        <div className="flex gap-6 items-center">

          <LikeButton
            blogId={blog.id}
            initialLikes={blog.totalLikes ?? 0}
          />

          <span className="flex items-center gap-2 text-gray-500">
            <MessageCircle size={18} />
            {blog.totalComments ?? 0}
          </span>

        </div>
      </div>

    </div>
  );
}