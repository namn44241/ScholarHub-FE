import { useNavigate } from "@tanstack/react-router"
import { LogIn } from "lucide-react"
import { ThemeToggle } from "../common/theme-toggle"
import UserMenu from "../common/user-menu"
import { Button } from "../ui/button"
import { CommandMenu } from "../ui/command-menu"
import MainNav from "./main-nav"
import MobileNav from "./mobile-nav"
import { useAuth } from "@/contexts/auth-context"

const SiteHeader = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wrapper">
        <div className="container flex h-14 items-center px-4 md:px-6">
          <MainNav />
          <MobileNav />
          <div className="ml-auto flex items-center justify-end gap-2 flex-1">
            <div className="flex-1 sm:flex-none">
              <CommandMenu />
            </div>
            <nav className="flex items-center gap-2">
              <ThemeToggle />
              {
                !isAuthenticated ? (
                  <Button size="sm" onClick={() => navigate({ to: '/auth/login' })}>
                    Login
                    <LogIn className="size-4" />
                  </Button>
                ) : user ? (
                  <UserMenu user={user} logout={logout} />
                ) : (
                  <Button size="sm" onClick={() => navigate({ to: '/auth/register' })}>
                    Register
                    <LogIn className="size-4" />
                  </Button>
                )
              }
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
