/**
 * Landing Footer 1
 * Simple footer with copyright and links
 */

"use client";

import React from "react";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

interface FooterLink {
  label: string;
  url: string;
}

interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
}

interface LandingFooter1Settings {
  showLogo?: boolean;
  showSocialLinks?: boolean;
  socialLinks?: SocialLinks;
  links?: FooterLink[];
  copyrightText?: string;
  backgroundColor?: string;
  textColor?: string;
  linkColor?: string;
  fontFamily?: string;
  viewMode?: "desktop" | "tablet" | "mobile" | null;
}

interface LandingFooter1Props {
  settings: LandingFooter1Settings;
  shopLogo?: string;
  shopName?: string;
}

const defaultLinks: FooterLink[] = [
  { label: "Privacy Policy", url: "/privacy" },
  { label: "Terms of Service", url: "/terms" },
  { label: "Contact", url: "/contact" },
];

export default function LandingFooter1({
  settings,
  shopLogo,
  shopName = "Store",
}: LandingFooter1Props) {
  const {
    showLogo = true,
    showSocialLinks = true,
    socialLinks = {},
    links = defaultLinks,
    copyrightText = `© ${new Date().getFullYear()} Your Store. All rights reserved.`,
    backgroundColor = "#111827",
    textColor = "#9CA3AF",
    linkColor = "#FFFFFF",
    fontFamily = "inherit",
  } = settings;

  const socialIconClass =
    "w-5 h-5 transition-colors hover:text-white cursor-pointer";

  return (
    <footer
      className="py-12 px-4"
      style={{ backgroundColor, fontFamily }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          {showLogo && (
            <div>
              {shopLogo ? (
                <Image
                  src={shopLogo}
                  alt={shopName}
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain brightness-0 invert"
                />
              ) : (
                <span
                  className="text-xl font-bold"
                  style={{ color: linkColor }}
                >
                  {shopName}
                </span>
              )}
            </div>
          )}

          {/* Links */}
          {links && links.length > 0 && (
            <nav className="flex flex-wrap justify-center gap-6">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: linkColor }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Social Links */}
          {showSocialLinks && (
            <div
              className="flex items-center gap-4"
              style={{ color: textColor }}
            >
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook className={socialIconClass} />
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className={socialIconClass} />
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter className={socialIconClass} />
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <Youtube className={socialIconClass} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Copyright */}
        <div
          className="mt-8 pt-8 border-t border-gray-700 text-center text-sm"
          style={{ color: textColor }}
        >
          {copyrightText}
        </div>
      </div>
    </footer>
  );
}
