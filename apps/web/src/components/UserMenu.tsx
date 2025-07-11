import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import { t } from "@lingui/core/macro";
import { Fragment } from "react";

import { authClient } from "@kan/auth/client";

import { useTheme } from "~/providers/theme";
import { getAvatarUrl } from "~/utils/helpers";

interface UserMenuProps {
  imageUrl: string | undefined;
  email: string;
  isLoading: boolean;
  collapsed?: boolean;
}

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function UserMenu({
  imageUrl,
  email,
  isLoading,
  collapsed = false,
}: UserMenuProps) {
  const router = useRouter();
  const { themePreference, switchTheme } = useTheme();

  const handleLogout = async () => {
    await authClient.signOut();

    router.push("/login");
  };

  const avatarUrl = imageUrl ? getAvatarUrl(imageUrl) : null;

  return (
    <Menu as="div" className={classNames("relative inline-block text-left", collapsed ? "w-auto" : "w-full") }>
      <div>
        {isLoading ? (
          <div className="flex">
            <div className={collapsed ? "h-7 w-7" : "h-[30px] w-[30px]" + " animate-pulse rounded-full bg-light-200 dark:bg-dark-200"} />
            {!collapsed && <div className="mx-2 h-[30px] w-[175px] animate-pulse rounded-md bg-light-200 dark:bg-dark-200" />}
          </div>
        ) : (
          <Menu.Button className={classNames(
            "flex items-center rounded-full focus:outline-none",
            collapsed ? "justify-center h-7 w-7 p-0 bg-light-200 dark:bg-dark-200" : "w-full rounded-md p-1.5 text-neutral-900 hover:bg-light-200 dark:text-dark-900 dark:hover:bg-dark-200 dark:hover:text-dark-1000"
          )}>
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                className="rounded-full bg-gray-50"
                width={collapsed ? 28 : 24}
                height={collapsed ? 28 : 24}
                alt=""
              />
            ) : (
              <span className={collapsed ? "inline-block h-7 w-7 overflow-hidden rounded-full bg-light-400 dark:bg-dark-400" : "inline-block h-6 w-6 overflow-hidden rounded-full bg-light-400 dark:bg-dark-400"}>
                <svg
                  className="h-full w-full text-dark-700"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
            )}
            {!collapsed && <span className="mx-2 truncate text-sm">{email}</span>}
          </Menu.Button>
        )}
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className={classNames(
          "absolute bottom-[40px] left-0 z-10 mt-2 origin-top-left rounded-md border shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
          collapsed ? "min-w-[140px] border-light-600 bg-light-50 dark:border-dark-600 dark:bg-dark-300" : "w-full border-light-600 bg-light-50 dark:border-dark-600 dark:bg-dark-300"
        )}>
          <div className="flex flex-col text-neutral-900 dark:text-dark-1000">
            <div className="p-1">
              <div className="flex w-full items-center px-3 py-2 text-left text-xs">
                <span>{t`Theme`}</span>
              </div>
              <Menu.Item>
                <button
                  onClick={() => switchTheme("system")}
                  className="flex w-full items-center rounded-[5px] px-3 py-2 text-left text-xs hover:bg-light-200 dark:hover:bg-dark-400"
                >
                  <span
                    className={classNames(
                      themePreference === "system" ? "visible" : "invisible",
                      "mr-4 h-[6px] w-[6px] rounded-full bg-light-900 dark:bg-dark-900",
                    )}
                  />
                  {t`System`}
                </button>
              </Menu.Item>
              <Menu.Item>
                <button
                  onClick={() => switchTheme("dark")}
                  className="flex w-full items-center rounded-[5px] px-3 py-2 text-left text-xs hover:bg-light-200 dark:hover:bg-dark-400"
                >
                  <span
                    className={classNames(
                      themePreference === "dark" ? "visible" : "invisible",
                      "mr-4 h-[6px] w-[6px] rounded-full bg-light-900 dark:bg-dark-900",
                    )}
                  />
                  {t`Dark`}
                </button>
              </Menu.Item>
              <Menu.Item>
                <button
                  onClick={() => switchTheme("light")}
                  className="flex w-full items-center rounded-[5px] px-3 py-2 text-left text-xs hover:bg-light-200 dark:hover:bg-dark-400"
                >
                  <span
                    className={classNames(
                      themePreference === "light" ? "visible" : "invisible",
                      "mr-4 h-[6px] w-[6px] rounded-full bg-light-900 dark:bg-dark-900",
                    )}
                  />
                  {t`Light`}
                </button>
              </Menu.Item>
            </div>
            <div className="light-border-600 border-t-[1px] p-1 dark:border-dark-600">
              <Menu.Item>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center rounded-[5px] px-3 py-2 text-left text-xs hover:bg-light-200 dark:hover:bg-dark-400"
                >
                  {t`Logout`}
                </button>
              </Menu.Item>
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
