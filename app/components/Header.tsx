"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { Search, ShoppingCart, User, Menu, X, MapPin } from "lucide-react";
import LoginModal from '@/components/LoginModal';
import LocationModal from '@/components/LocationModal';
import ServicesModal from '@/components/ServicesModal';
import { logout } from "@/app/store/features/auth/authSlice";
import { loadSelectedLocationFromStorage } from "@/app/store/features/location/locationSlice";
import { setCartFromStorage } from "@/app/store/features/cart/cartSlice";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const selectedLocation = useAppSelector((state) => state.location.selectedLocation);
  const cartItems = useAppSelector((state) => state.cart.items);

  const isOnServicesPage = pathname === '/services';

  useEffect(() => {
    dispatch(loadSelectedLocationFromStorage());
    try {
        const localCartData = localStorage.getItem('metroclap_cart');
        if (localCartData) {
            const parsedData = JSON.parse(localCartData);
            if (Date.now() < parsedData.expiry) {
                dispatch(setCartFromStorage(parsedData.cart));
            } else {
                localStorage.removeItem('metroclap_cart');
            }
        }
    } catch (error) {
        console.error("Could not load cart from storage:", error);
    }
  }, [dispatch]);

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
  }

  const handleMobileLogin = () => {
    setIsLoginModalOpen(true);
    setIsMenuOpen(false);
  }

  const profileLinks = useMemo(() => {
    if (!user) return [];
    switch (user.role) {
      case 'customer':
        return [
          { href: '/customer/profile', label: 'My Profile' },
          { href: '/customer/bookings', label: 'My Bookings' },
        ];
      case 'partner':
        return [{ href: '/pro', label: 'Partner Dashboard' }];
      case 'admin':
        return [{ href: '/admin', label: 'Admin Dashboard' }];
      default:
        return [];
    }
  }, [user]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-8">
              <Link href="/">
                <img src="/Logo.jpg" alt="Metroclap Logo" className="h-12 w-auto" />
              </Link>
              {!isOnServicesPage && (
                <nav className="hidden md:flex items-center space-x-8">
                  <Link href="/" className="text-neutral-800 font-medium hover:text-red-500 transition-colors">Home</Link>
                  <Link href="/services" className="text-neutral-800 font-medium hover:text-red-500 transition-colors">All Services</Link>
                </nav>
              )}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center border border-neutral-300 rounded-lg px-3 py-2 w-48 text-left"
              >
                <MapPin className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                <span className="truncate text-sm text-neutral-800">
                  {selectedLocation ? `${selectedLocation.city} - ${selectedLocation.pincode}` : "Select Location"}
                </span>
              </button>

              <button
                onClick={() => setIsServicesModalOpen(true)}
                className="flex items-center border border-neutral-300 rounded-lg px-3 py-2 w-48 text-left"
              >
                <Search className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-neutral-500">Search for services</span>
              </button>

              {!isOnServicesPage && (
                <>
                  <Link
                    href="/partner"
                    className="border border-red-500 text-red-500 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors whitespace-nowrap"
                  >
                    Become a Partner
                  </Link>

                  <Link href="/services" className="p-2 relative">
                    <ShoppingCart className="w-6 h-6 text-red-500" />
                    {cartItemCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              <div className="relative">
                {user ? (
                  <>
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="p-2"
                    >
                      <User className="w-6 h-6 text-red-500" />
                    </button>
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        {profileLinks.map(link => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {link.label}
                          </Link>
                        ))}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button onClick={() => setIsLoginModalOpen(true)} className="p-2">
                    <User className="w-6 h-6 text-red-500" />
                  </button>
                )}
              </div>
            </div>

            <div className="md:hidden flex items-center">
              {!isOnServicesPage && (
                <Link href="/services" className="p-2 relative mr-2">
                  <ShoppingCart className="w-6 h-6 text-red-500" />
                  {cartItemCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{cartItemCount}</span>}
                </Link>
              )}
              <button className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <nav className="flex flex-col space-y-4">
                {!isOnServicesPage && (
                  <>
                    <Link href="/" className="text-neutral-700 hover:text-red-500">Home</Link>
                    <Link href="/services" className="text-neutral-700 hover:text-red-500">All Services</Link>
                  </>
                )}
                 <button
                  onClick={() => {
                    setIsLocationModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="text-neutral-700 hover:text-red-500 text-left"
                >
                  {selectedLocation ? `Location: ${selectedLocation.city}` : "Select Location"}
                </button>
                {!isOnServicesPage && (
                  <Link
                    href="/partner"
                    className="border border-red-500 text-red-500 px-4 py-2 rounded-lg font-medium text-center"
                  >
                    Become a Partner
                  </Link>
                )}
                {user ? (
                   <>
                    {profileLinks.map(link => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-neutral-700 hover:text-red-500"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <button onClick={handleLogout} className="text-neutral-700 hover:text-red-500 text-left">Logout</button>
                   </>
                ) : (
                   <button onClick={handleMobileLogin} className="text-neutral-700 hover:text-red-500 text-left">Login / Signup</button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
      {isLocationModalOpen && <LocationModal onClose={() => setIsLocationModalOpen(false)} />}
      {isServicesModalOpen && <ServicesModal onClose={() => setIsServicesModalOpen(false)} />}
    </>
  );
}