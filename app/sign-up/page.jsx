"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  User,
  CheckCircle,
  ArrowRight,
  Mail,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    agreeTerms: false,
    referredBy: "",
  });
  const [refData, setRefData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");

  const { theme, setTheme } = useTheme();
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get referral code from URL if available
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setFormData((prev) => ({ ...prev, referredBy: ref }));
      setRefData(ref);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate form data
    if (!formData.email || !formData.phone) {
      setError("Email and phone number are required");
      setLoading(false);
      return;
    }

    if (!formData.username) {
      setError("Username is required");
      setLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError("You must agree to the terms and conditions");
      setLoading(false);
      return;
    }

    try {
      // Register the user

      const response = await register({
        email: formData.email,
        phone: formData.phone,
        referredBy: refData || formData.referredBy,
        agreeTerms: formData.agreeTerms,
        username: formData.username,
      });

      setGeneratedPassword(response.password);
      setSuccess(
        "Registration successful! Your password has been generated. You'll be redirected to the dashboard shortly."
      );

      // Redirect after 7 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 10000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const benefitVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: 0.6 + i * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    }),
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[60%] h-[60%] rounded-full bg-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="absolute top-4 right-4 z-50">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/30 shadow-sm hover:shadow-md transition-all duration-300"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-primary" />
          )}
        </motion.button>
      </div>

      <div className="flex-1 flex flex-col-reverse lg:flex-row">
        {/* Left side - Benefits */}
        <div className="w-full lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-background/0"></div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 lg:p-12"
          >
            <div className="max-w-md space-y-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold"
              >
                Join Our Trading Network
              </motion.h2>

              <div className="space-y-8">
                {[
                  {
                    icon: CheckCircle,
                    title: "Multi-Level Earnings",
                    description:
                      "Earn commissions from your network up to 15 levels deep",
                  },
                  {
                    icon: CheckCircle,
                    title: "Professional Training",
                    description:
                      "Access comprehensive training materials and mentorship",
                  },
                  {
                    icon: CheckCircle,
                    title: "Secure Platform",
                    description:
                      "Trade with confidence on our secure, reliable platform",
                  },
                ].map((benefit, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={benefitVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex items-start space-x-4 group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="p-3 bg-primary/10 rounded-xl text-primary mt-1"
                    >
                      <benefit.icon className="h-6 w-6" />
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors duration-300">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="pt-8"
              >
                <div className="bg-background/50 backdrop-blur-lg p-6 rounded-xl border border-border/30 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">
                      Registration Progress
                    </span>
                    <span className="text-sm font-medium">Step 1 of 2</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "50%" }}
                      transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                      className="h-full bg-primary rounded-full"
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <Link href="/" className="inline-block">
                <div className="flex items-center gap-2 mb-6 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary rounded-full opacity-20 blur-md group-hover:opacity-40 transition-opacity"></div>
                    <Image
                      src="/logo.png"
                      alt="MLM Trading Network Logo"
                      width={40}
                      height={40}
                      className="dark:invert relative z-10"
                    />
                  </div>
                  <span className="text-xl font-bold">Uptrade
                    <span className="text-primary">level</span>
                  </span>
                </div>
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-background/70 backdrop-blur-xl rounded-2xl border border-border/30 shadow-xl p-8"
            >
              <div className="space-y-2 mb-6">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-muted-foreground">
                  Join our trading network and start your journey to financial
                  independence
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 flex items-center text-red-600"
                >
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {success && generatedPassword && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4 text-green-600"
                >
                  <p className="font-medium">{success}</p>
                  <p className="mt-2">
                    Your password:{" "}
                    <span className="font-mono bg-background/70 px-2 py-1 rounded">
                      {generatedPassword}
                    </span>
                  </p>
                  <p className="text-xs mt-2">
                    Make sure to save this password. You'll be redirected to the
                    dashboard shortly.
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={itemVariants} className="space-y-2">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium"
                  >
                    Your Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="username"
                      placeholder="Enter Your Full Name"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                      required
                    />
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                      required
                    />
                  </div>
                </motion.div>

                {formData.referredBy && (
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium">
                      Referral Code
                    </label>
                    <div className="pl-3 py-2 bg-primary/10 rounded-lg text-primary font-medium">
                      Referred by: {formData.referredBy}
                    </div>
                  </motion.div>
                )}

                <motion.div
                  variants={itemVariants}
                  className="flex items-start space-x-3 pt-2"
                >
                  <div className="flex items-center h-5 mt-1">
                    <input
                      id="agreeTerms"
                      name="agreeTerms"
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                      required
                    />
                  </div>
                  <label htmlFor="agreeTerms" className="text-sm leading-tight">
                    I agree to the{" "}
                    <Link
                      href="/terms-conditions"
                      className="text-primary font-medium hover:underline"
                    >
                      terms of service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-primary font-medium hover:underline"
                    >
                      privacy policy
                    </Link>
                  </label>
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Continue"}{" "}
                  {!loading && <ArrowRight className="h-5 w-5" />}
                </motion.button>
              </form>

              <motion.div variants={itemVariants} className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="text-primary font-medium hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-6 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
