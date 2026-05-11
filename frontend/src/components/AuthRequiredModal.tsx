"use client";

import Link from "next/link";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AuthRequiredModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="card w-full max-w-md space-y-6 mx-4">

        <h2 className="text-2xl font-bold text-slate-100">
          Login Required
        </h2>

        <p className="text-slate-400">
          You must sign in to like or comment on blogs. Join our community today!
        </p>

        <div className="flex gap-4 pt-2">

          <Link
            href="/login"
            className="flex-1 btn btn-primary"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="flex-1 btn btn-secondary"
          >
            Register
          </Link>

        </div>

        <button
          onClick={onClose}
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors w-full pt-2"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}