"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/store/hooks";
import { logout } from "@/app/store/features/auth/authSlice";
import { LayoutDashboard, BookMarked, Calendar, Wallet, User, Star, LogOut, X } from "lucide-react";

const navLinks = [
  { href: "/pro", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pro/bookings", label: "My Bookings", icon: BookMarked },
  { href: "/pro/availability", label: "Availability", icon: Calendar },
  { href: "/pro/earnings", label: "Earnings", icon: Wallet },
  { href: "/pro/profile", label: "My Profile", icon: User },
  { href: "/pro/reviews", label: "Ratings & Reviews", icon: Star },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function ProSidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <>
      <aside className={`fixed top-0 left-0 z-50 w-64 h-screen bg-gray-800 text-white flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700 h-16">
            <Link href="/pro" className="font-bold text-xl">Partner Panel</Link>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-1"><X className="w-6 h-6" /></button>
        </div>
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul>
              {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                  <li key={link.href} className="mb-2">
                      <Link href={link.href} onClick={() => setIsOpen(false)} className={`flex items-center p-3 rounded-lg transition-colors ${isActive ? "bg-red-500 text-white" : "text-gray-300 hover:bg-gray-700"}`}>
                        <Icon className="w-5 h-5 mr-3" />
                        <span>{link.label}</span>
                      </Link>
                  </li>
                  );
              })}
            </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
             <button onClick={handleLogout} className="flex items-center p-3 rounded-lg w-full text-left text-gray-300 hover:bg-gray-700">
                <LogOut className="w-5 h-5 mr-3" /><span>Logout</span>
            </button>
        </div>
      </aside>
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden"></div>}
    </>
  );
}