import Link from "next/link";
import { FaDiscord, FaGithub } from "react-icons/fa";

const navigation = {
  documentation: [
    { name: "Getting started", href: "#" },
    { name: "Importing from Trello", href: "#" },
    { name: "API Reference", href: "#" },
  ],
  company: [
    { name: "Roadmap", href: "/kan/roadmap" },
    { name: "GitHub", href: "https://github.com/kanbn/kan" },
    { name: "Contact", href: "mailto:support@kan.bn" },
  ],
  legal: [
    { name: "Terms of service", href: "/terms" },
    { name: "Privacy policy", href: "/privacy" },
    {
      name: "License",
      href: "https://github.com/kanbn/kan?tab=GPL-3.0-1-ov-file#readme",
    },
  ],
  resources: [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "FAQs", href: "/#faq" },
  ],
};

const StatusMarker = () => (
  <Link
    href="https://openstatus.dev"
    target="_blank"
    rel="noopener noreferrer"
    className="flex w-fit items-center gap-1.5 rounded-full border border-light-300 py-2 pl-3 pr-4 text-xs text-light-950 hover:bg-light-100 dark:border-dark-300 dark:text-dark-800 dark:hover:bg-dark-100"
  >
    <span className="relative mr-1 h-2 w-2">
      <span className="absolute -inset-[1px] animate-[ping_1s_infinite] rounded-full bg-green-500/30"></span>
      <span className="absolute inset-0 rounded-full bg-green-500"></span>
    </span>
    All systems operational
  </Link>
);

const Footer = () => {
  return (
    <footer className="z-10 w-full border-t border-light-300 bg-light-50 py-8 dark:border-dark-300 dark:bg-dark-50">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:py-24">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Link href="https://github.com/kanbn/kan" target="_blank">
                <FaGithub className="h-8 w-8 rounded-lg border border-light-300 p-1.5 text-light-1000 hover:bg-light-100 dark:border-dark-300 dark:text-dark-1000 dark:hover:bg-dark-100" />
              </Link>
              <Link href="https://discord.gg/e6ejRb6CmT" target="_blank">
                <FaDiscord className="h-8 w-8 rounded-lg border border-light-300 p-1.5 text-light-1000 hover:bg-light-100 dark:border-dark-300 dark:text-dark-1000 dark:hover:bg-dark-100" />
              </Link>
            </div>

            <StatusMarker />
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm/6 font-semibold text-light-1000 dark:text-dark-1000">
                  Documentation
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.documentation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm/6 text-light-900 hover:text-light-1000 dark:text-dark-950 dark:hover:text-dark-1000"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mt-10 text-sm/6 font-semibold text-light-1000 dark:text-dark-1000 md:mt-0">
                  Company
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm/6 text-light-900 hover:text-light-1000 dark:text-dark-950 dark:hover:text-dark-1000"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm/6 font-semibold text-light-1000 dark:text-dark-1000">
                  Resources
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.resources.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm/6 text-light-900 hover:text-light-1000 dark:text-dark-950 dark:hover:text-dark-1000"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mt-10 text-sm/6 font-semibold text-light-1000 dark:text-dark-1000 md:mt-0">
                  Legal
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm/6 text-light-900 hover:text-light-1000 dark:text-dark-950 dark:hover:text-dark-1000"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
