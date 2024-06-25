"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  return (
    <div className="shadow-sm border-b sticky top-0 bg-white z-30 p-3">
      <div className="flex justify-between max-w-6xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="hidden lg:inline-flex"
        >
          <Image
            src="/instagram-font.webp"
            alt="Logo"
            width={96}
            height={96}
          />
        </Link>
        <Link
          href="/"
          className="lg:hidden "
        >
          <Image
            src="/instagram-logo.webp"
            alt="Logo"
            width={40}
            height={40}
          />
        </Link>

        {/* Searchbar */}
        <input
          type="text"
          placeholder="Search"
          className="bg-gray-50 border border-gray-200 rounded text-sm w-full py-2 px-4 max-w-[210px]"
        />

        {/* Profile */}
        {session ? (
          <img
            src={session.user.image}
            alt={session.user.name}
            className="rounded-full w-10 h-10 cursor-pointer"
            onClick={signOut}
          />
        ) : (
          <button
            onClick={signIn}
            className="text-sm font-semibold text-blue-500"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}
