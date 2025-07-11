import { useRouter } from "next/router";
import { t } from "@lingui/core/macro";
import { HiSparkles } from "react-icons/hi2";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import Image from "next/image";

// Force recompilation

import boardsIconDark from "~/assets/boards-dark.json";
import boardsIconLight from "~/assets/boards-light.json";
import membersIconDark from "~/assets/members-dark.json";
import membersIconLight from "~/assets/members-light.json";
import settingsIconDark from "~/assets/settings-dark.json";
import settingsIconLight from "~/assets/settings-light.json";
import ReactiveButton from "~/components/ReactiveButton";
import UserMenu from "~/components/UserMenu";
import WorkspaceMenu from "~/components/WorkspaceMenu";
import { useModal } from "~/providers/modal";
import { useTheme } from "~/providers/theme";
import { useState } from "react";
import logoDark from "../../../docs/logo/dark.svg";
import logoLight from "../../../docs/logo/light.svg";
import Button from "./Button";
import Link from "next/link";

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

interface SideNavigationProps {
  user: UserType;
  isLoading: boolean;
}

interface UserType {
  email?: string | null | undefined;
  image?: string | null | undefined;
}

export default function SideNavigation({
  user,
  isLoading,
}: SideNavigationProps) {
  const router = useRouter();
  const { openModal } = useModal();

  const { pathname } = router;

  console.log("SideNavigation rendered with openModal:", typeof openModal);

  const { activeTheme } = useTheme();

  const isDarkMode = activeTheme === "dark";

  const navigation = [
    {
      name: t`Boards`,
      href: "/boards",
      icon: isDarkMode ? boardsIconDark : boardsIconLight,
    },
    {
      name: t`Members`,
      href: "/members",
      icon: isDarkMode ? membersIconDark : membersIconLight,
    },
    {
      name: t`Settings`,
      href: "/settings",
      icon: isDarkMode ? settingsIconDark : settingsIconLight,
    },
  ];

  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <nav className={`flex h-full ${collapsed ? "w-12 px-1" : "w-50 px-3"} flex-col justify-between border-r border-light-600 bg-light-50 pb-3 pt-5 dark:border-dark-400 dark:bg-dark-50 transition-all duration-300`}>
        <div>
          {/* Top Row: Toggle icon only */}
          <div className="flex items-center mb-6 gap-2">
            <button
              className="p-1 rounded hover:bg-light-200 dark:hover:bg-dark-200 transition-colors text-light-900 dark:text-dark-900"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <TbLayoutSidebarLeftExpand size={20} /> : <TbLayoutSidebarLeftCollapse size={20} />}
            </button>
          </div>
          {/* Generate Plan Button just above navigation */}
          <div className="mb-4">
            <button
              onClick={() => openModal("GENERATE_PLAN")}
              className={classNames(
                "group flex items-center gap-x-3 rounded-md p-1.5 text-sm font-normal leading-6 text-neutral-900 hover:bg-light-200 dark:text-dark-1000 dark:hover:bg-dark-200 w-full min-w-0 whitespace-nowrap",
                false ? "bg-light-200 dark:bg-dark-200" : "dark:bg-dark-50"
              )}
              aria-label={t`Generate Plan`}
              type="button"
            >
              <HiSparkles className={classNames(
                collapsed ? "h-5 w-5 mr-0" : "h-5 w-5 mr-30",
                "text-purple-600 transition-transform duration-300 group-hover:rotate-12 dark:text-purple-400"
              )}/>
              {!collapsed && t`Generate Plan`}
            </button>
          </div>
          <ul role="list" className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <ReactiveButton
                  href={item.href}
                  current={pathname.includes(item.href)}
                  name={collapsed ? "" : item.name}
                  json={item.icon}
                />
              </li>
            ))}
          </ul>
        </div>
        {collapsed ? (
          <div className="flex w-full justify-center pb-1">
            <UserMenu
              email={user.email ?? ""}
              imageUrl={user.image ?? undefined}
              isLoading={isLoading}
              collapsed={true}
            />
          </div>
        ) : (
          <UserMenu
            email={user.email ?? ""}
            imageUrl={user.image ?? undefined}
            isLoading={isLoading}
          />
        )}
      </nav>
    </>
  );
}
