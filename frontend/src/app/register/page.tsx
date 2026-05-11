"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // save token
      setToken(data.access_token);

      // wait briefly to ensure token is stored
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);

    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="card w-[380px] space-y-6 animate-in fade-in zoom-in-95 duration-300"
      >

        <h1 className="text-3xl font-bold text-center text-slate-100">
          Create Account
        </h1>

        {error && (
          <p className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary w-full py-2.5">
          Register
        </button>

        <p className="text-sm text-center text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Login
          </Link>
        </p>

      </form>

    </div>
  );
}