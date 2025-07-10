"use client";
  import { useState } from "react";
  import { useRouter } from "next/navigation";
  import { motion } from "framer-motion";
  import { useAppContext } from "@/context/AppContext";

  export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { setIsAdminLoggedIn } = useAppContext();

    const handleSubmit = (e) => {
      e.preventDefault();
      if (username === "admin" && password === "admin123") {
        setIsAdminLoggedIn(true);
        router.push("/admin");
      } else {
        setError("Invalid credentials");
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-screen bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md transform hover:shadow-xl transition-shadow">
          <div className="flex justify-center mb-6">
            <motion.img
              src="/logo.png"
              alt="MEED Public School Society Logo"
              className="h-16 w-auto"
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <h1 className="text-3xl font-bold text-center text-emerald-800 mb-6">Admin Login</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 p-2 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 p-2 transition"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-3 rounded-lg hover:from-emerald-700 hover:to-teal-800 transition-all duration-300 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.button>
          </form>
        </div>
      </motion.div>
    );
  }