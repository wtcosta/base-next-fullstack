import type { UserRoleType } from "@prisma/client";

export type NavItemProps = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  restricted?: UserRoleType[];
};