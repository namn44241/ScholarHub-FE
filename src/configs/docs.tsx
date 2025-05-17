import type { IMainNavItem, ISidebarNavItem } from "@/types/nav";
import { BotMessageSquare, GraduationCap, Table2, Users, Waypoints } from "lucide-react";

export interface IDOCS_CONFIG {
    landingNav: IMainNavItem[];
    mainNav: IMainNavItem[];
    sidebarNav: ISidebarNavItem[];
}

export const DOCS_CONFIG: IDOCS_CONFIG = {
    landingNav: [
        {
            title: "Test",
            icon: GraduationCap,
            href: "/test",
        },
    ],
    mainNav: [
        {
            title: "Scholarship Search",
            icon: GraduationCap,
            href: "/scholarship-search",
        },
        {
            title: "Scholarship Management",
            icon: Table2,
            href: "/scholarship-management",
        },
        {
            title: "Community",
            icon: Users,
            href: "/community",
        },
        {
            title: "Explore Network",
            icon: Waypoints,
            href: "/explore-network",
        },
        {
            title: "Chatbot",
            icon: BotMessageSquare,
            href: "/chatbot",
        }
    ],
    sidebarNav: [
        // {
        //   title: "Getting Started",
        //   items: [
        //     {
        //       title: "Introduction",
        //       href: "/docs",
        //       items: [],
        //     },
        //   ],
        // },
    ],
};
