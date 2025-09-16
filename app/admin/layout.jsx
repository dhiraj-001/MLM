"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  Database,
  CreditCard,
  FileText,
  Network,
  LogOut,
  Menu,
  X,
  Home,
  ChevronRight,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import Router from "next/router";

// Admin layout protector component
function AdminGuard({ children }) {
  const { user, isLoading, isAdmin } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      // Skip auth check for the sign-in page
      if (pathname === "/admin/sign-in") {
        setIsAuthorized(true);
        setAuthCheckComplete(true);
        return;
      }

      setDebugInfo({
        userExists: !!user,
        isAdmin: user?.isAdmin,
        userType: user?.type,
        userRole: user?.role,
        userPhone: user?.phone,
        userEmail: user?.email,
        contextIsAdmin: isAdmin,
      });

      if (user && user.isAdmin) {
        setIsAuthorized(true);
      }

      setAuthCheckComplete(true);
    }
  }, [user, isLoading, isAdmin, pathname, router]);

  if ((isLoading || !authCheckComplete) && pathname !== "/admin/sign-in") {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <div>Loading authentication data...</div>
      </div>
    );
  }

  if (!isAuthorized && pathname !== "/admin/sign-in") {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col">
        <div className="text-red-500 mb-4">Unauthorized Access</div>
        <div className="bg-muted/20 p-4 rounded mb-4 text-sm">
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
        <Link href="/admin/sign-in" className="text-primary hover:underline">
          Go to Admin Sign In
        </Link>
      </div>
    );
  }

  return children;
}

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  // If we're on the sign-in page, just render the children without the admin layout
  if (pathname === "/admin/sign-in") {
    return <AdminGuard>{children}</AdminGuard>;
  }

  const navItems = [
    { title: "Dashboard", href: "/admin", icon: Home },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "Deposits", href: "/admin/deposits", icon: Database },
    { title: "Withdrawals", href: "/admin/withdrawals", icon: CreditCard },
    { title: "Accounts", href: "/admin/account", icon: CreditCard },
    { title: "Contacts", href: "/admin/contacts", icon: FileText },
    { title: "Network", href: "/admin/network", icon: Network },
    { title: "Change Password", href: "/admin/change-password", icon: Lock },
  ];

  const logoutUser = async () => {

    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
    }

  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0 border-r border-border/40 bg-background 
            ${desktopCollapsed ? "md:w-16" : "md:w-64"} 
            w-64 md:sticky`}
        >
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b border-border/40 px-4 justify-between">
              <div
                className={`flex items-center gap-2 ${
                  desktopCollapsed ? "md:justify-center" : ""
                }`}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary rounded-full opacity-20 blur-md"></div>
                  <Image
                    src="/logo.png"
                    alt="leveluptrade Admin"
                    width={32}
                    height={32}
                    className="dark:invert relative z-10"
                  />
                </div>
                {!desktopCollapsed && (
                  <span className="text-lg font-bold md:block">
                    leveluptrade <span className="text-primary">Admin</span>
                  </span>
                )}
              </div>
              <button
                onClick={() => setDesktopCollapsed(!desktopCollapsed)}
                className="hidden md:flex items-center justify-center rounded-md p-1.5 text-primary hover:bg-muted/80"
                title={desktopCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {desktopCollapsed ? (
                  <ChevronRight size={18} />
                ) : (
                  <Menu size={18} />
                )}
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center rounded-md px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted/80"
                        } ${
                          desktopCollapsed ? "md:justify-center md:px-2" : ""
                        }`}
                        title={desktopCollapsed ? item.title : ""}
                      >
                        <item.icon
                          className={`${
                            desktopCollapsed ? "md:mr-0" : "mr-2"
                          } h-4 w-4`}
                        />
                        {(!desktopCollapsed || !item.title) && (
                          <span>{item.title}</span>
                        )}
                        {isActive && !desktopCollapsed && (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="border-t border-border/40 p-4">
              <button
                onClick={() => logoutUser()}
                className={`flex ${
                  desktopCollapsed ? "md:justify-center" : "w-full"
                } items-center rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-100/50 dark:hover:bg-red-900/20 transition-colors`}
                title={desktopCollapsed ? "Logout" : ""}
              >
                <LogOut
                  className={`${desktopCollapsed ? "md:mr-0" : "mr-2"} h-4 w-4`}
                />
                {!desktopCollapsed && <span>Logout</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div
          className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${
            desktopCollapsed ? "md:ml-16" : "md:ml-0"
          }`}
        >
          <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60 px-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-md p-1.5 text-primary md:hidden"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm font-medium">Admin Panel</span>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          ></div>
        )}
      </div>
    </AdminGuard>
  );
}
