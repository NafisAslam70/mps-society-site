import React from 'react';
import "./globals.css";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticlesBackground from "@/components/ParticlesBackground";

export const metadata = {
  title: "Meed Public School Society",
  description: "Serving humanity through over 2000 completed social projects across India.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-gray-900 to-gray-800 text-white font-sans relative" suppressHydrationWarning>
        <ParticlesBackground />
        <div className="relative z-10">
          <TopBar />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
};