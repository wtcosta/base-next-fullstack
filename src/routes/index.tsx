import type { NavItemProps } from "@/_types/NavItens";
import { BoxCubeIcon, GridIcon, UserCircleIcon } from "@/icons";

export const menuItems: NavItemProps[] = [
  {
    icon: <GridIcon />,
    name: "Home",
    path: "/",
  },
  {
    icon: <UserCircleIcon />,
    name: "Usuários",
    path: "/users",
    restricted: ["SUPERADMIN", "ADMINISTRADOR"],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Calendário", path: "/calendar" },
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
      { name: "Blank Page", path: "/blank", pro: false },
      { name: "404 Error", path: "/error-404", pro: false },
      { name: "Basic Tables", path: "/basic-tables", pro: false },
      { name: "Form Elements", path: "/form-elements", pro: false },
      { name: "Calendar", path: "/calendar", pro: false },
      { name: "User Profile", path: "/profile", pro: false },
    ],
  },
];