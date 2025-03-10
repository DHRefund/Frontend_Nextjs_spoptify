"use client";

import { Nav } from "react-bootstrap";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Library from "./Library";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const pathname = usePathname();

  const routes = useMemo(
    () => [
      {
        icon: HiHome,
        label: "Home",
        active: pathname !== "/search",
        href: "/",
      },
      {
        icon: BiSearch,
        label: "Search",
        active: pathname === "/search",
        href: "/search",
      },
    ],
    [pathname]
  );

  return (
    <div className="d-flex h-100">
      <div className="sidebar d-none d-md-flex flex-column">
        <Nav className="flex-column">
          {routes.map((item) => (
            <Nav.Link
              key={item.label}
              href={item.href}
              className={item.active ? "active d-flex align-items-center" : "d-flex align-items-center"}
            >
              <item.icon size={24} className="me-3" />
              {item.label}
            </Nav.Link>
          ))}
        </Nav>
        <div className="library-section flex-grow-1">
          <Library />
        </div>
      </div>
      <main className="flex-grow-1 overflow-auto py-2">{children}</main>
    </div>
  );
};

export default Sidebar;
