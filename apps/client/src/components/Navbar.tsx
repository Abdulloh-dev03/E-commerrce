"use client"
import Image from "next/image"
import Link from "next/link"
import SearchBar from "./SearchBar"
import { Moon, Sun } from "lucide-react"
import ShoppingCartIcon from "./ShoppingCartIcon"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import ProfileButton from "./ProfileButton"
import StaggeredMenu from "./StaggeredMenu"

const menuItems = [
  { label: "Home", ariaLabel: "Go to home page", link: "/" },
  { label: "Products", ariaLabel: "Learn about products", link: "/products" },
  { label: "Orders", ariaLabel: "View your orders", link: "/orders" },
  { label: "Cart", ariaLabel: "Get in touch", link: "/cart" },
]

const socialItems = [
  { label: "Twitter", link: "https://twitter.com" },
  { label: "GitHub", link: "https://github.com" },
  { label: "LinkedIn", link: "https://linkedin.com" },
]

const Navbar = () => {
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isDark = mounted && theme === "dark"
  const menuButtonColor = isDark ? "#ffffff" : "#1f2937"

  return (
    <>
      <nav>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-6">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="TypeStore"
                width={40}
                height={40}
                className="w-8 h-8"
              />

              {/* Hide title on mobile */}
              <span className="text-lg font-mono tracking-wider hidden md:inline">
                TypeStore
              </span>
            </Link>

            {/* Home + Products (desktop only) */}
            <div className="hidden md:flex items-center gap-2 text-sm font-medium">
              <Link
                href="/"
                className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition"
              >
                Products
              </Link>
            </div>

            <div className="">
              <SearchBar />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4 mx-2">

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="hover:bg-accent cursor-pointer">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")} className='cursor-pointer'>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className='cursor-pointer'>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className='cursor-pointer'>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sign in / profile */}
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
              <ProfileButton />
            </SignedIn>
            <div className="hidden md:block">
              <ShoppingCartIcon />
            </div>
          </div>
        </div>

        <hr className="my-2" />
      </nav>

      {/* Mobile Menu (only shows after scrolling) */}
      {isScrolled && mounted && (
        <div className="fixed top-0 right-0 w-screen h-screen pointer-events-none z-50">
          <div className="pointer-events-auto">
            <StaggeredMenu
              position="right"
              items={menuItems}
              socialItems={socialItems}
              displaySocials={true}
              displayItemNumbering={false}
              menuButtonColor={menuButtonColor}
              openMenuButtonColor={"#000"}
              changeMenuColorOnOpen={true}
              colors={isDark ? ["#334155", "#1e293b"] : ["#e5e7eb", "#d1d5db"]}
              accentColor="#3b82f6"
              isFixed={true}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
