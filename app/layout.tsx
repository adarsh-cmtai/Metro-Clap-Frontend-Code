"use client"; // Step 1: Make it a client component

import type React from "react";
import { usePathname } from "next/navigation"; // Step 2: Import the hook
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StoreProvider from "@/app/store/provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Step 3: Get the current URL path

  // Step 4: Check if the current path is part of the admin panel
  const isAdminRoute = pathname.startsWith('/admin');
  const isCustomer = pathname.startsWith('/customer');
  const isPartner = pathname.startsWith('/pro');


  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          {/* Step 5: Conditionally render Header and Footer */}
          {!isAdminRoute &&  !isCustomer && !isPartner &&<Header />}
          
          <main>{children}</main>
          
          {!isAdminRoute &&  !isCustomer && !isPartner && <Footer />}
        </StoreProvider>
      </body>
    </html>
  );
}