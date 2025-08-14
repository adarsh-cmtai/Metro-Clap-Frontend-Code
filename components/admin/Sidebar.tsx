"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { logout } from "@/app/store/features/auth/authSlice";
import {
  LayoutDashboard, Users, UserCheck, Wrench, BookMarked, BarChart3, Star, ShieldCheck, X, LogOut, Settings, MoreHorizontal, FileText
} from "lucide-react";

const navGroups = [
  {
    title: "Analytics",
    links: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    ],
  },
  {
    title: "Content",
    links: [
      { href: "/admin/bookings", label: "Bookings", icon: BookMarked },
      { href: "/admin/reviews", label: "Reviews", icon: Star },
      { href: "/admin/services", label: "Services", icon: Wrench },
      { href: "/admin/blog", label: "Blog", icon: FileText },
    ],
  },
  {
    title: "Users",
    links: [
      { href: "/admin/customers", label: "Customers", icon: Users },
      { href: "/admin/partners", label: "Partners", icon: UserCheck },
      { href: "/admin/partners/applications", label: "New Partner", icon: Users },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <>
      <aside className={`fixed top-0 left-0 z-50 w-64 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700/50 flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-wide text-white">Admin Core</span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-5">
              <h3 className="px-3 mb-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">{group.title}</h3>
              <ul>
                {group.links.map((link) => {
                  const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/admin");
                  const Icon = link.icon;
                  return (
                    <li key={link.href} className="mb-1">
                      <Link 
                        href={link.href} 
                        onClick={() => setIsOpen(false)} 
                        className={`flex items-center py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                          isActive 
                            ? "bg-blue-600/20 text-blue-50" 
                            : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                        }`}
                      >
                        <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                        {isActive && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-400"></div>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-700/50">
          <div className="flex items-center justify-between w-full p-2 rounded-lg bg-slate-900/50">
            <div className="flex items-center gap-3">
              <img className="w-10 h-10 rounded-full object-cover" src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name || 'A'}`} alt="Admin" />
              <div>
                <p className="text-sm font-semibold text-white">{user?.name || 'Admin'}</p>
                <p className="text-xs text-slate-400">Manager</p>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-md transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden animate-in fade-in-0"></div>}
    </>
  );
}