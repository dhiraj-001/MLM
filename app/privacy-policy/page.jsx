"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown, Moon, Sun, Menu } from "lucide-react";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function PrivacyPolicy() {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/90 backdrop-blur-lg shadow-lg border-b border-border/20"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 bg-primary rounded-full opacity-20 blur-md animate-pulse"></div>
              <Image
                src="/logo.png"
                alt="LevelUptrade Logo"
                fill
                className="dark:invert relative z-10"
              />
            </div>
            <span className="text-xl font-bold">
              <span className="text-primary">LevelUptrade</span>
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center gap-8"
          >
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#stats"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Stats
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Testimonials
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="sm:inline-block hidden rounded-full p-2 bg-background/80 border border-border/30 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-yellow-400" />
              ) : (
                <Moon className="h-4 w-4 text-primary" />
              )}
            </button>

            <Link href="/sign-in">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 border border-border/30 text-sm font-medium hover:bg-background/90 hover:border-primary/30 transition-all duration-300"
              >
                Sign In
              </motion.button>
            </Link>

            <Link href="/sign-up">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="sm:inline-flex hidden items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20"
              >
                Join Now
              </motion.button>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden rounded-full p-2 bg-background/80 border border-border/30 shadow-sm"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-16 mt-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-8 font-serif">
              Privacy Policy
            </h1>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Last Updated: {new Date().toLocaleDateString()}
              </p>

              <h2>1. Introduction</h2>
              <p>
                At LevelUptrade, we take your privacy seriously. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you visit our website or use our services.
              </p>

              <h2>2. Information We Collect</h2>
              <p>
                We may collect personal information that you voluntarily provide
                when registering on our platform, including but not limited to:
              </p>
              <ul>
                <li>Contact information (name, email address, phone number)</li>
                <li>Account credentials</li>
                <li>Payment and banking information</li>
                <li>Identification documents</li>
                <li>Profile information</li>
                <li>Network and referral data</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>
                We may use the information we collect for various purposes,
                including:
              </p>
              <ul>
                <li>Providing and maintaining our services</li>
                <li>Processing transactions and managing your account</li>
                <li>Calculating and distributing commissions</li>
                <li>Verifying your identity and preventing fraud</li>
                <li>
                  Sending you updates, notifications, and promotional materials
                </li>
                <li>Improving our website and services</li>
                <li>Complying with legal obligations</li>
              </ul>

              <h2>4. Sharing Your Information</h2>
              <p>
                We may share your information with third parties in certain
                situations, including:
              </p>
              <ul>
                <li>
                  With your upline and downline partners as necessary for
                  network operations
                </li>
                <li>With service providers who help us operate our business</li>
                <li>To comply with legal requirements</li>
                <li>
                  In connection with a business transaction such as a merger or
                  acquisition
                </li>
              </ul>

              <h2>5. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your
                personal information. However, no method of transmission over
                the Internet or electronic storage is 100% secure.
              </p>

              <h2>6. Your Privacy Rights</h2>
              <p>
                Depending on your location, you may have certain rights
                regarding your personal information, such as the right to
                access, correct, or delete your data. To exercise these rights,
                please contact us using the information provided below.
              </p>

              <h2>7. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to collect
                information about your browsing activities. You can instruct
                your browser to refuse all cookies or to indicate when a cookie
                is being sent.
              </p>

              <h2>8. Children's Privacy</h2>
              <p>
                Our services are not intended for individuals under the age of
                18. We do not knowingly collect personal information from
                children.
              </p>

              <h2>9. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last Updated" date.
              </p>

              <h2>10. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at privacy@leveluptrade.com.
              </p>
            </div>
          </motion.div>
        </div>
        {/* Footer */}
        <footer className="border-t border-border/30 py-16 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background/0 via-background to-background/0"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 mb-6"
                >
                  <div className="relative h-10 w-10">
                    <div className="absolute inset-0 bg-primary rounded-full opacity-20 blur-md"></div>
                    <Image
                      src="/logo.png"
                      alt="LevelUptrade Logo"
                      fill
                      className="dark:invert relative z-10"
                    />
                  </div>
                  <span className="text-xl font-bold">
                    <span className="text-primary">leveluptrade</span>
                  </span>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-muted-foreground mb-6"
                >
                  Building financial freedom through community, systems, and
                  proven strategies.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex space-x-4"
                >
                  {["twitter", "facebook", "instagram"].map((social, i) => (
                    <motion.a
                      key={social}
                      href="#"
                      whileHover={{ y: -5, color: "hsl(var(--primary))" }}
                      className="p-2 rounded-full bg-background/80 border border-border/30 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {social === "twitter" && (
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                        </svg>
                      )}
                      {social === "facebook" && (
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                        </svg>
                      )}
                      {social === "instagram" && (
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                        </svg>
                      )}
                    </motion.a>
                  ))}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h3 className="font-bold text-lg mb-6">Quick Links</h3>
                <ul className="space-y-4">
                  {[
                    "Home",
                    "Features",
                    "Stats",
                    "Testimonials",
                    "Sign In",
                    "Join Now",
                  ].map((link, i) => (
                    <motion.li
                      key={link}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link
                        href={
                          link === "Home"
                            ? "/"
                            : link === "Sign In"
                            ? "/sign-in"
                            : link === "Join Now"
                            ? "/sign-up"
                            : `#${link.toLowerCase()}`
                        }
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                      >
                        <span className="h-px w-4 bg-primary/50"></span>
                        {link}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h3 className="font-bold text-lg mb-6">Legal</h3>
                <ul className="space-y-4">
                  {[
                    { name: "Terms & Conditions", path: "/terms-conditions" },
                    { name: "Privacy Policy", path: "/privacy-policy" },
                    { name: "Refund Policy", path: "/refund-policy" },
                    { name: "Disclaimer", path: "/disclaimer" },
                    { name: "Contact Us", path: "/contact-us" },
                    { name: "About Us", path: "/about-us" },
                  ].map((link) => (
                    <motion.li
                      key={link.name}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link
                        href={link.path}
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                      >
                        <span className="h-px w-4 bg-primary/50"></span>
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-16 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center"
            >
              <p className="text-sm text-muted-foreground mb-4 md:mb-0">
                © {new Date().getFullYear()} LevelUptrade. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-full bg-background/80 border border-border/30 text-muted-foreground hover:text-primary transition-colors"
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </button>

                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 border border-border/30 text-sm font-medium">
                  English (US) <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </footer>
      </div>
    </div>
  );
}
