import { DOCS_CONFIG } from "@/configs/docs"
import { cn } from "@/lib/utils"
import { Link, useNavigate, type LinkProps } from "@tanstack/react-router"
import * as React from "react"
import { useState } from "react"
import ScholarHubLogo from "../common/scholarhub-logo"
import { Button } from "../ui/button"
import { DialogDescription, DialogTitle } from "../ui/dialog"
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"

const MobileNav = () => {
  const [open, setOpen] = useState(false)
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)")

  return (
    <Drawer open={open} onOpenChange={setOpen} direction={isTablet ? "left" : "bottom"}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="lg:hidden hover:bg-transparent focus-visible:bg-transparent mr-2 px-2 focus-visible:ring-0 focus-visible:ring-offset-0 h-8 text-base"
          onClick={() => setOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className={cn(
          "p-0",
          isTablet
            ? "h-[100dvh] max-h-none max-w-[350px]"
            : "max-h-[80svh]",
        )}
      >
        <DialogTitle className="flex items-center gap-2 p-6">
          <ScholarHubLogo />
        </DialogTitle>
        <DialogDescription></DialogDescription>
        <div className="p-6 overflow-auto">
          <div className="flex flex-col space-y-3">
            {DOCS_CONFIG.mainNav?.map(
              (item) =>
                item.href && (
                  <MobileLink key={item.href} href={item.href} onOpenChange={setOpen}>
                    {item.title}
                  </MobileLink>
                ),
            )}
          </div>
          <div className="flex flex-col space-y-2">
            {DOCS_CONFIG.sidebarNav.map((item, index) => (
              <div key={index} className="flex flex-col gap-4 pt-6">
                <h4 className="font-medium text-xl">{item.title}</h4>
                {item?.items?.length &&
                  item.items.map((item) => (
                    <React.Fragment key={item.href}>
                      {!item.disabled &&
                        (item.href ? (
                          <MobileLink href={item.href} onOpenChange={setOpen} className="opacity-80">
                            {item.title}
                            {item.label && (
                              <span className="bg-[#adfa1d] ml-2 px-1.5 py-0.5 rounded-md text-[#000000] text-xs no-underline group-hover:no-underline leading-none">
                                {item.label}
                              </span>
                            )}
                          </MobileLink>
                        ) : (
                          item.title
                        ))}
                    </React.Fragment>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
  const navigate = useNavigate()

  return (
    <Link
      href={href}
      onClick={() => {
        navigate({ to: href as string, search: { scrollToTop: "true" } })
        onOpenChange?.(false)
      }}
      className={cn("text-[1.15rem]", className)}
      {...props}
    >
      {children}
    </Link>
  )
}

export default MobileNav
