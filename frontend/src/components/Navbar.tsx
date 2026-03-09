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
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          href="/feed"
          className="text-xl font-bold text-blue-600 hover:text-blue-700"
        >
          SecureBlog
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6 text-sm font-medium">

          <Link
            href="/feed"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Feed
          </Link>

          {isLoggedIn && (
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Dashboard
            </Link>
          )}

          {!isLoggedIn && (
            <>
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          )}

          {isLoggedIn && (
            <button
              onClick={logout}
              className="text-red-500 hover:text-red-600 transition"
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}