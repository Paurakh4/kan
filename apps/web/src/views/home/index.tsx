import Image from "next/image";
import Link from "next/link";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { IoLogoGithub, IoLogoHackernews } from "react-icons/io";

import Button from "~/components/Button";
import { PageHead } from "~/components/PageHead";
import { useTheme } from "~/providers/theme";
import Cta from "./components/Cta";
import FAQs from "./components/Faqs";
import Features from "./components/Features";
import Layout from "./components/Layout";
import Pricing from "./components/Pricing";

export default function HomeView() {
  const theme = useTheme();

  const isDarkMode = theme.activeTheme === "dark";
  return (
    <Layout>
      <PageHead title="vibeplanify | Modern project management for teams" />
      <div className="flex h-full w-full flex-col lg:pt-[5rem]">
        <div className="w-full pb-10 pt-32 lg:py-32">
          <div className="my-10 flex h-full w-full animate-fade-down flex-col items-center justify-center px-4">
            <div className="flex items-center gap-2">
              {/* Star on Github button removed */}
            </div>

            <p className="mt-2 text-center text-4xl font-bold text-light-1000 dark:text-dark-1000 lg:text-5xl">
              <Trans>
                The modern way to manage your work
              </Trans>
            </p>

            <p className="text-md mt-3 max-w-[450px] text-center text-dark-900 lg:max-w-[600px] lg:text-lg">
              {t`vibeplanify is a powerful, flexible kanban and project management platform for teams of all sizes. Organize work, track progress, and deliver results—all in one place.`}
            </p>

            <div className="mt-6 flex gap-2">
              <Button href="/signup">{t`Get started on Cloud`}</Button>
              {/* Self host with Github button removed */}
            </div>
            <p className="mt-4 text-center text-sm text-dark-900">
              {t`No credit card required`}
            </p>
          </div>
        </div>
        <div className="px-4">
          <div className="mb-24 rounded-[16px] border border-light-300 bg-light-50 p-1 shadow-md dark:border-dark-300 dark:bg-dark-100 lg:rounded-[24px] lg:p-2">
            <div className="overflow-hidden rounded-[12px] border border-light-300 shadow-sm dark:border-dark-300 lg:rounded-[16px]">
              <Image
                src={`/hero-${isDarkMode ? "dark" : "light"}.png`}
                alt="kanban"
                width={1100}
                height={1000}
              />
            </div>
          </div>
        </div>
        <div className="relative pt-10">
          <div id="features" className="absolute -top-20" />
          <Features theme={theme.activeTheme} />
        </div>
        <div className="relative pt-10">
          <div id="pricing" className="absolute -top-20" />
          <Pricing />
        </div>
        <div className="relative pt-10">
          <div id="faq" className="absolute -top-20" />
          <FAQs />
        </div>
        <div className="relative">
          <Cta theme={theme.activeTheme} />
        </div>
      </div>
    </Layout>
  );
}
