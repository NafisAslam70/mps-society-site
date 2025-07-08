// ------------------------------
"use client";
import { FaPhone, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaYoutube, FaInstagram, FaWikipediaW } from "react-icons/fa";
import Link from "next/link";

export default function TopBar() {
  return (
    <div className="bg-gradient-to-r from-green-700 to-green-800 text-white text-xs py-2 px-4 flex justify-between items-center">
      {/* Left: phone + address */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <FaPhone /> +91 6203601659
        </span>
        <span className="hidden sm:flex items-center gap-1">
          <FaMapMarkerAlt /> MPS Society, Shrikund, Sahibganj, Jharkhand - 816101
        </span>
      </div>

      {/* Right: socials */}
      <div className="flex items-center gap-3 text-sm">
        <Link href="#" className="hover:text-yellow-300"><FaFacebookF /></Link>
        <Link href="#" className="hover:text-yellow-300"><FaTwitter /></Link>
        <Link href="#" className="hover:text-yellow-300"><FaYoutube /></Link>
        <Link href="#" className="hover:text-yellow-300"><FaInstagram /></Link>
        <Link href="#" className="hover:text-yellow-300"><FaWikipediaW /></Link>
      </div>
    </div>
  );
}

// ------------------------------
