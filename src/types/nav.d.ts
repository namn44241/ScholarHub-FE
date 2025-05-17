import { Icons } from "@/components/icons";
import type { LucideIcon } from "lucide-react";

export interface INavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: LucideIcon;
  label?: string;
}

export interface INavItemWithChildren extends INavItem {
  items?: INavItemWithChildren[];
}

export interface IMainNavItem extends INavItemWithChildren {}
export interface ISidebarNavItem extends INavItemWithChildren {}