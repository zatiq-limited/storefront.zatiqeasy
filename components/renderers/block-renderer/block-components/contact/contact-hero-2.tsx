"use client";

import { convertSettingsKeys } from "@/lib/settings-utils";
import Image from "next/image";
import Link from "next/link";

interface ContactHero2Settings {
  headline?: string;
  image?: string;
  overlayOpacity?: number;
  overlayColor?: string;
  showBreadcrumb?: boolean;
}

interface ContactHero2Props {
  settings?: ContactHero2Settings;
}

export default function ContactHero2({ settings = {} }: ContactHero2Props) {
  const s = convertSettingsKeys(settings as Record<string, unknown>) as ContactHero2Settings;

  return (
    <section className="relative h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {s.image && (
          <Image
            src={s.image}
            alt={s.headline || "Contact Hero"}
            fill
            className="object-cover"
            priority
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: s.overlayColor || "#000000",
            opacity: s.overlayOpacity || 0.5,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
          {s.headline || "Get in Touch"}
        </h1>

        {/* Breadcrumb */}
        {s.showBreadcrumb && (
          <nav className="flex items-center justify-center space-x-2 text-sm mt-6">
            <Link
              href="/"
              className="hover:text-gray-300 transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-200">Contact</span>
          </nav>
        )}
      </div>
    </section>
  );
}