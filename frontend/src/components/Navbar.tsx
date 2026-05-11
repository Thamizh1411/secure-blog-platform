"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken, removeToken } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, []);

  function logout() {
    removeToken();
    setIsLoggedIn(false);
    router.push("/login");
  }

  return (
    <nav className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10 shadow-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          href="/feed"
          className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 transition-all duration-300"
        >
          SecureBlog
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6 text-sm font-medium">

          <Link
            href="/feed"
            className="text-slate-300 hover:text-blue-400 transition"
          >
            Feed
          </Link>

          {isLoggedIn && (
            <Link
              href="/dashboard"
              className="text-slate-300 hover:text-blue-400 transition"
            >
              Dashboard
            </Link>
          )}

          {!isLoggedIn && (
            <>
              <Link
                href="/login"
                className="text-slate-300 hover:text-blue-400 transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="btn btn-primary text-sm px-4 py-1.5"
              >
                Register
              </Link>
            </>
          )}

          {isLoggedIn && (
            <button
              onClick={logout}
              className="text-red-400 hover:text-red-300 transition"
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}