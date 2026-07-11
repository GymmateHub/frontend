import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  GridIcon,
  ChevronDownIcon,
  UserCircleIcon,
  PieChartIcon,
} from "../icons";
import {
  Users,
  Dumbbell,
  CreditCard,
  ShoppingCart,
  MessageSquare,
  Bell,
  Settings,
  Building2,
  Shield,
  Box,
  BadgeDollarSign,
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../auth/auth.store";
import { canAccess } from "../auth/permissions";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Overview",
    path: "/admin-dashboard",
  },
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <Users className="h-5 w-5" />,
    name: "Members",
    path: "/members",
  },
  {
    icon: <BadgeDollarSign className="h-5 w-5" />,
    name: "Plans",
    path: "/plans",
  },
  {
    icon: <Dumbbell className="h-5 w-5" />,
    name: "Fitness",
    subItems: [
      { name: "Classes", path: "/classes" },
      { name: "Calendar", path: "/calendar" },
      { name: "Challenges", path: "/challenges" },
    ],
  },
  {
    icon: <ShoppingCart className="h-5 w-5" />,
    name: "Sales",
    subItems: [
      { name: "Point of Sale", path: "/pos" },
      { name: "Leads", path: "/leads" },
    ],
  },
  {
    icon: <Box className="h-5 w-5" />,
    name: "Assets",
    subItems: [
      { name: "Equipment", path: "/equipment" },
      { name: "Inventory", path: "/inventory" },
    ],
  },
  {
    icon: <PieChartIcon />,
    name: "Insights",
    subItems: [
      { name: "Analytics", path: "/analytics" },
      { name: "Reports", path: "/reports" },
    ],
  },
  {
    icon: <CreditCard className="h-5 w-5" />,
    name: "Billing",
    path: "/billing",
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    name: "Messages",
    path: "/messages",
  },
  {
    icon: <Bell className="h-5 w-5" />,
    name: "Notifications",
    path: "/notifications",
  },
];

const othersItems: NavItem[] = [
  {
    icon: <Building2 className="h-5 w-5" />,
    name: "Gym Management",
    path: "/gym-management",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    name: "Tenant Mgmt",
    path: "/tenant-management",
  },
  {
    icon: <UserCircleIcon />,
    name: "Profile",
    path: "/profile",
  },
  {
    icon: <Settings className="h-5 w-5" />,
    name: "Settings",
    path: "/settings",
  },
];

/**
 * Keep only the entries the current role may open (per SCREEN_ACCESS).
 * Groups keep the sub-entries the role can access and disappear entirely
 * when none remain.
 */
const filterNavForRole = (items: NavItem[], role?: string): NavItem[] =>
  items
    .map((item): NavItem | null => {
      if (item.subItems) {
        const subItems = item.subItems.filter((sub) =>
          canAccess(role, sub.path)
        );
        return subItems.length > 0 ? { ...item, subItems } : null;
      }
      return item.path && canAccess(role, item.path) ? item : null;
    })
    .filter((item): item is NavItem => item !== null);

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();

  // Single flat menu (no section headings), filtered for the user's role
  const mainNav = useMemo(
    () => filterNavForRole([...navItems, ...othersItems], user?.role),
    [user?.role]
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    mainNav.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ type: "main", index });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive, mainNav]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>{renderMenuItems(mainNav, "main")}</div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
