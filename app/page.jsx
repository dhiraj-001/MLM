"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  animate,
} from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  BarChart3,
  Users,
  Award,
  ChevronDown,
  Moon,
  Sun,
  Menu,
  X,
  Globe,
  TrendingUp,
  Shield,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);

  // Parallax effect for hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Counter component
  const Counter = ({ end, prefix = "", suffix = "" }) => {
    return (
      <>
        {prefix}
        {end.toLocaleString()}
        {suffix}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
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
                alt="Uptradelevel Logo"
                fill
                className="dark:invert relative z-10"
              />
            </div>
            <span className="text-xl font-bold">
              <span className="text-primary">Uptradelevel</span>
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

            <Sheet>
              <SheetTrigger asChild>
                <button className="md:hidden rounded-full p-2 bg-background/80 border border-border/30 shadow-sm">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                      <div className="relative h-10 w-10">
                        <Image
                          src="/logo.png"
                          alt="Uptradelevel Logo"
                          fill
                          className="dark:invert"
                        />
                      </div>
                      <span className="text-xl font-bold">
                        <span className="text-primary">Uptradelevel</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6 py-8">
                    <Link
                      href="#features"
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      Features
                    </Link>
                    <Link
                      href="#stats"
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      Stats
                    </Link>
                    <Link
                      href="#testimonials"
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      Testimonials
                    </Link>

                    <button
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="sm:hidden w-fit shadow-lg inline-block rounded-full p-2 bg-background/80 border border-border/30 hover:shadow-md transition-all duration-300"
                    >
                      {theme === "dark" ? (
                        <Sun className="h-6 w-6 text-yellow-400" />
                      ) : (
                        <Moon className="h-6 w-6 text-primary" />
                      )}
                    </button>
                  </div>

                  <div className="mt-auto flex flex-col gap-4">
                    <Link href="/sign-in">
                      <button className="w-full py-3 rounded-full bg-background border border-border/50 text-foreground font-medium">
                        Sign In
                      </button>
                    </Link>
                    <Link href="/sign-up">
                      <button className="w-full py-3 rounded-full bg-primary text-white font-medium shadow-lg shadow-primary/20">
                        Join Now
                      </button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </motion.div>
        </div>
      </nav>


      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 px-4 overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent opacity-70"></div>
          <motion.div
            className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl"
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
            className="absolute -bottom-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-3xl"
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

        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center relative z-10">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="space-y-8 max-w-xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium"
            >
              <Globe className="h-4 w-4" />
              <span>Professional Trading Network</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-5xl md:text-6xl font-bold tracking-tight leading-none"
            >
              Build Your <br />
              <span className="relative">
                <span className="relative z-10 text-primary">
                  Trading Network
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 rounded-full -z-10"></span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-muted-foreground"
            >
              Join our professional network of{" "}
              <span className="text-primary font-semibold">12,000+</span>{" "}
              partners building sustainable income through our proven
              multi-level trading system.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link href="/sign-up">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                >
                  Get Started <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-background border border-border/50 font-medium hover:border-primary/30 transition-all duration-300"
              >
                Learn More
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-x-8 gap-y-3 pt-6"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center"
              >
                <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                <span className="text-sm">No Experience Required</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center"
              >
                <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                <span className="text-sm">Complete Training</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center"
              >
                <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                <span className="text-sm">24/7 Support</span>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-2xl blur-xl opacity-70"></div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden group">
              <Image
                src="/hero-image.jpg"
                alt="MLM Success"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent"></div>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute bottom-0 left-0 right-0 p-8 z-20"
              >
                <div className="bg-background/60 backdrop-blur-xl rounded-2xl p-6 border border-border/30 shadow-xl">
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Partners
                      </p>
                      <h3 className="text-3xl font-bold">
                        <Counter end={12000} prefix="" suffix="+" />
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Active Countries
                      </p>
                      <h3 className="text-3xl font-bold">
                        <Counter end={50} prefix="" suffix="+" />
                      </h3>
                    </div>
                  </div>
                  <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-primary rounded-full"
                    ></motion.div>
                  </div>
                  <p className="text-xs mt-2 text-muted-foreground">
                    Join before we reach our 15,000 partner milestone
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Floating elements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -top-10 -right-10 p-4 bg-background/80 backdrop-blur-lg rounded-2xl border border-border/30 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium">Monthly Growth</p>
                  <p className="text-lg font-bold">+27.4%</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -bottom-10 -left-10 p-4 bg-background/80 backdrop-blur-lg rounded-2xl border border-border/30 shadow-xl hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium">Security Rating</p>
                  <p className="text-lg font-bold">A+</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="w-6 h-10 rounded-full border border-border/50 flex items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        className="py-24 relative overflow-hidden"
        id="stats"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background"></div>

        {/* Animated background elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium mb-6">
              <BarChart3 className="h-4 w-4" />
              <span>Network Growth</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
              Our Global Impact
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of successful partners who are building wealth
              through our platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                value: 12000,
                label: "Global Partners",
                suffix: "+",
                delay: 0.1,
              },
              {
                icon: Globe,
                value: 50,
                label: "Countries",
                suffix: "+",
                delay: 0.2,
              },
              {
                icon: BarChart3,
                value: 132,
                label: "Paid Commissions",
                prefix: "$",
                suffix: "M",
                delay: 0.3,
              },
              {
                icon: Award,
                value: 95,
                label: "Satisfaction Rate",
                suffix: "%",
                delay: 0.4,
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: stat.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="relative bg-background/50 backdrop-blur-lg border border-border/30 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-4xl font-bold mb-2 flex items-end">
                    <span>{stat.prefix || ""}</span>
                    <Counter end={stat.value} duration={2.5} />
                    <span>{stat.suffix || ""}</span>
                  </h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="py-24 relative overflow-hidden"
        id="features"
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

        {/* Animated background elements */}
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium mb-6">
              <Award className="h-4 w-4" />
              <span>Key Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
              Why Choose Our Network?
            </h2>
            <p className="text-muted-foreground text-lg">
              Our proven trading system provides everything you need to build a
              successful multi-level business from anywhere in the world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Users,
                title: "Professional Community",
                description:
                  "Join a network of like-minded professionals dedicated to mutual success.",
                benefits: [
                  "Exclusive mastermind groups",
                  "Weekly live training calls",
                  "24/7 private community forum",
                ],
                delay: 0.1,
              },
              {
                icon: BarChart3,
                title: "Proven System",
                description:
                  "Follow our step-by-step business model that consistently drives results.",
                benefits: [
                  "Proprietary lead generation system",
                  "Automated follow-up sequences",
                  "Done-for-you marketing materials",
                ],
                delay: 0.2,
              },
              {
                icon: Award,
                title: "Multi-Level Compensation",
                description:
                  "Earn through multiple income streams with our industry-leading plan.",
                benefits: [
                  "Up to 15 levels of commissions",
                  "Monthly leadership bonuses",
                  "Performance-based incentives",
                ],
                delay: 0.3,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl bg-background border border-border/30 shadow-xl transition-all duration-500 h-full">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>
                  <div className="p-8">
                    <div className="relative mb-6">
                      <div className="absolute -inset-3 bg-primary/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative p-4 bg-primary/10 rounded-2xl">
                        <feature.icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {feature.description}
                    </p>

                    <ul className="space-y-4">
                      {feature.benefits.map((benefit, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-start"
                        >
                          <div className="p-1 bg-primary/10 rounded-full mr-3 mt-0.5">
                            <CheckCircle className="h-4 w-4 text-primary" />
                          </div>
                          <span>{benefit}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
<section className="py-24 relative overflow-hidden" id="testimonials">
  {/* Top border gradient */}
  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

  <div className="container mx-auto px-4 relative z-10">
    {/* Section Heading */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-16 max-w-3xl mx-auto"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium mb-6">
        <Users className="h-4 w-4" />
        <span>Success Stories</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
        What Our Partners Say
      </h2>
      <p className="text-muted-foreground text-lg">
        Hear from people who have transformed their lives through our trading
        network
      </p>
    </motion.div>

    {/* Testimonial Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {[
        {
          name: "Sarah Johnson",
          role: "Executive Partner",
          image: "/testimonials/1.png",
          quote:
            "I've been with the network for 2 years and have built a team of over 500 partners. The training and support are unmatched.",
          delay: 0.1,
        },
        {
          name: "Michael Chen",
          role: "Senior Trader",
          image: "/testimonials/2.png",
          quote:
            "The compensation plan is the best I've seen in the industry. I was able to replace my full-time income within 6 months.",
          delay: 0.2,
        },
        {
          name: "Elena Rodriguez",
          role: "Regional Director",
          image: "/testimonials/3.png",
          quote:
            "What sets this network apart is the community. Everyone is genuinely invested in each other's success.",
          delay: 0.3,
        },
        {
          name: "David Kim",
          role: "Wealth Coach",
          image: "/testimonials/4.png",
          quote:
            "I started with zero experience, and now I coach others on financial freedom. The mentorship here has changed my life.",
          delay: 0.4,
        },
        {
          name: "Priya Patel",
          role: "Entrepreneur",
          image: "/testimonials/5.png",
          quote:
            "Joining this network gave me the flexibility to work from anywhere while scaling my income faster than I imagined.",
          delay: 0.5,
        },
        {
          name: "James Anderson",
          role: "Platinum Leader",
          image: "/testimonials/6.png",
          quote:
            "The leadership program pushed me beyond my limits. Now, I’m leading a thriving team across three countries.",
          delay: 0.6,
        },
      ].map((testimonial, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: testimonial.delay }}
          viewport={{ once: true }}
          whileHover={{ y: -8 }}
          className="group"
        >
          <div className="relative bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-xl border border-border/40 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full overflow-hidden">
            {/* Glow border effect on hover */}
            <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-primary/40 transition-all duration-500"></div>

            {/* Decorative Quote */}
            <div className="absolute top-0 right-6 text-[80px] opacity-10 font-serif leading-none">
              “
            </div>

            {/* Quote Text */}
            <p className="text-lg mb-8 relative z-10 italic text-foreground/90">
              {testimonial.quote}
            </p>

            {/* Person Info */}
            <div className="flex items-center gap-4 relative z-10">
              <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-primary/30 shadow-md">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <h4 className="font-bold text-lg">{testimonial.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background"></div>

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-background/70 backdrop-blur-xl rounded-2xl p-10 border border-border/30 shadow-2xl"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
                Ready to Start Your Journey?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Join thousands of successful partners who are building wealth
                through our platform
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 text-lg"
                >
                  Join Now <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>

              <Link href="/sign-in">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-background border border-border/50 font-medium hover:border-primary/30 transition-all duration-300 text-lg"
                >
                  Sign In
                </motion.button>
              </Link>

              {/* PDF download button */}
              <a
                href="/WWW.LEVELUPTRADE.US.pdf"
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-background border border-border/50 font-medium hover:border-primary/30 transition-all duration-300 text-lg"
                >
                  Download PDF
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

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
                    alt="uptradelevel Logo"
                    fill
                    className="dark:invert relative z-10"
                  />
                </div>
                <span className="text-xl font-bold">
                  <span className="text-primary">Uptradelevel</span>
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
              © {new Date().getFullYear()} Uptradelevel. All rights reserved.
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
  );
}
