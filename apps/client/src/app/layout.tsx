"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Provider  } from "react-redux";
import { store } from "@/redux/store";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@/components/theme-provider";
import { usePathname } from "next/navigation";
import { dark } from "@clerk/themes";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  return (
    <ClerkProvider appearance={dark}>
      <Provider store={store}> 
        <html lang="en" suppressHydrationWarning>
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {hideLayout ? (
                <div className="min-h-[100dvh] grid place-items-center p-4">
                  {children}
                </div>
              ) : (
                <div className="mx-auto p-4 sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-7xl">
                  <Navbar />
                  {children}
                  <Footer />
                </div>
              )}
            </ThemeProvider>
            <ToastContainer position="bottom-right" />
          </body>
        </html>
      </Provider>
    </ClerkProvider>
  );
}
