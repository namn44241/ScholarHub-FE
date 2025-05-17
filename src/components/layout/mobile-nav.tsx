import * as React from "react"

import { DOCS_CONFIG } from "@/configs/docs"
import { cn } from "@/lib/utils"
import { Link, useNavigate, type LinkProps } from "@tanstack/react-router"
import { useState } from "react"
import ScholarHubLogo from "../common/scholarhub-logo"
import { Button } from "../ui/button"
import { DialogDescription, DialogTitle } from "../ui/dialog"
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer"

const MobileNav = () => {
    const [open, setOpen] = useState(false)

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="ghost"
                    className="mr-2 h-8 px-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
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
            <DrawerContent className="max-h-[80svh] p-0">
                <DialogTitle className="flex items-center gap-2 p-6">
                    <ScholarHubLogo />
                </DialogTitle>
                <DialogDescription></DialogDescription>
                <div className="overflow-auto p-6">
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
                                <h4 className="text-xl font-medium">{item.title}</h4>
                                {item?.items?.length &&
                                    item.items.map((item) => (
                                        <React.Fragment key={item.href}>
                                            {!item.disabled &&
                                                (item.href ? (
                                                    <MobileLink href={item.href} onOpenChange={setOpen} className="opacity-80">
                                                        {item.title}
                                                        {item.label && (
                                                            <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
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
