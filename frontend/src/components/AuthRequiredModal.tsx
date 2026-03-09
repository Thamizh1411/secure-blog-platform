"use client";

import Link from "next/link";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AuthRequiredModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg space-y-4">

        <h2 className="text-xl font-semibold">
          Login Required
        </h2>

        <p className="text-gray-600 text-sm">
          You must sign in to like or comment on blogs.
        </p>

        <div className="flex gap-3 pt-2">

          <Link
            href="/login"
            className="flex-1 bg-blue-600 text-white py-2 rounded text-center"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="flex-1 border py-2 rounded text-center"
          >
            Register
          </Link>

        </div>

        <button
          onClick={onClose}
          className="text-sm text-gray-500"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}