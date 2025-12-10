"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { name: "Music", href: "/music" },
      { name: "Blogs", href: "/blogs" },
      { name: "Stories", href: "/stories" },
      { name: "Podcasts", href: "/podcasts" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Careers", href: "/careers" },
      { name: "Privacy Policy", href: "/privacy" },
    ],
  },
  {
    title: "Community",
    links: [
      { name: "Contribute", href: "/contribute" },
      { name: "Creators", href: "/creators" },
      { name: "Events", href: "/events" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-background text-foreground border-t border-muted py-12 mt-32">
      <div className="w-full max-w-[1200px] mx-auto px-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo + Description */}
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Somana</h1>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Somana is your space to explore music, blogs, stories, and
              podcasts—all in one modern platform powered by creators.
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="https://instagram.com">
                <Instagram className="h-5 w-5 hover:text-primary transition" />
              </Link>
              <Link href="https://twitter.com">
                <Twitter className="h-5 w-5 hover:text-primary transition" />
              </Link>
              <Link href="https://facebook.com">
                <Facebook className="h-5 w-5 hover:text-primary transition" />
              </Link>
              <Link href="https://youtube.com">
                <Youtube className="h-5 w-5 hover:text-primary transition" />
              </Link>
              <Link href="/contact">
                <Mail className="h-5 w-5 hover:text-primary transition" />
              </Link>
            </div>
            <div className="mt-4 font-medium text-gray-600 text-sm">
              {/* <a
                href="https://www.linkedin.com/in/akarshrajput"
                target="_blank"
                rel="noopener noreferrer"
              >
                Akarsh Rajput | Founder & CEO
              </a> */}
              <p>Akarsh Rajput | Founder & CEO Somana Corp.</p>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h2 className="text-md font-medium mb-4">{section.title}</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:text-primary transition"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-muted pt-6 text-xs text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} Somana. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
