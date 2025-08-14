"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { logout } from '@/app/store/features/auth/authSlice';
import { Menu, Search, Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:text-blue-600 transition-colors"
          aria-controls="sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden lg:block relative">
          <label htmlFor="header-search" className="sr-only">Search</label>
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            id="header-search"
            type="search"
            placeholder="Search..."
            className="w-full max-w-xs bg-slate-100 border border-transparent hover:border-slate-200 focus:bg-white focus:border-blue-500 transition-colors rounded-full pl-9 pr-4 py-2 text-sm placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors">
            <Search className="w-5 h-5 lg:hidden" />
          </button>
          
          {/* <button className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors">
             <Bell className="w-5 h-5" />
             <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          </button> */}
          
          <div className="w-px h-6 bg-slate-200 hidden sm:block mx-1"></div>

          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 group">
               {/* <img className="w-9 h-9 rounded-full object-cover ring-2 ring-offset-2 ring-transparent group-hover:ring-blue-500 transition-all" src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name || 'A'}`} alt={user?.name || 'Admin'} /> */}
              <div className="hidden sm:block text-left">
                <span className="text-sm font-semibold text-slate-800">{'Admin'}</span>
                <span className="text-xs text-slate-500 block">Manager</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 hidden sm:block transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 py-1 origin-top-right animate-in fade-in-0 zoom-in-95">
                {/* <div className="px-3 py-2 border-b border-slate-100"> */}
                  {/* <p className="text-sm font-semibold text-slate-800">{user?.name || 'Admin'}</p> */}
                  {/* <p className="text-xs text-slate-500 truncate">{user?.email || 'shahiadarsh7675@gmail.com'}</p> */}
                {/* </div> */}
                <Link href="/admin/bookings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                  <User className="w-4 h-4" /> Booking
                </Link>
                <Link href="/admin/services" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                  <Settings className="w-4 h-4" /> Services
                </Link>
                <div className="my-1 h-px bg-slate-100"></div>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}