"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { logout } from "@/app/store/features/auth/authSlice";
import { LayoutDashboard, BookMarked, User, MapPin, HelpCircleIcon, LogOut, X } from "lucide-react";

const navLinks = [
  { href: "/customer", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customer/bookings", label: "My Bookings", icon: BookMarked },
  { href: "/customer/profile", label: "My Profile", icon: User },
  { href: "/customer/addresses", label: "Manage Address", icon: MapPin },
  { href: "/customer/support", label: "Support", icon: HelpCircleIcon },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const renderUserSection = () => {
    if (!user) {
      return (
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      );
    }

    const displayName = user.name || 'New User';
    
    return (
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <img
            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${displayName.replace(' ', '+')}&background=random`}
            alt={displayName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-800">{displayName}</p>
            <p className="text-sm text-gray-500">{user.email || ''}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <aside className={`fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between p-4 border-b h-16">
            <Link href="/" className="font-bold text-2xl">MetroClap</Link>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-1">
                <X className="w-6 h-6" />
            </button>
        </div>

        {renderUserSection()}

        <nav className="flex-1 px-4 py-2">
            <ul>
              {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                  <li key={link.href} className="mb-2">
                      <Link href={link.href} onClick={() => setIsOpen(false)} className={`flex items-center p-3 rounded-lg transition-colors text-gray-700 ${isActive ? "bg-red-50 text-red-600 font-semibold" : "hover:bg-gray-100"}`}>
                      <Icon className="w-5 h-5 mr-3" />
                      <span>{link.label}</span>
                      </Link>
                  </li>
                  );
              })}
            </ul>
        </nav>
        
        <div className="p-4 border-t">
             <button onClick={handleLogout} className="flex items-center p-3 rounded-lg w-full text-left text-gray-700 hover:bg-gray-100">
                <LogOut className="w-5 h-5 mr-3" />
                <span>Logout</span>
            </button>
        </div>
      </aside>
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden"></div>}
    </>
  );
}