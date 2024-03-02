import { redirect } from "next/navigation";

import { auth } from "~/server/auth";

import SideNavigation from "./SideNavigation";

export default async function Layout(props: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="flex h-screen flex-col items-center bg-dark-50">
      <div className="m-auto flex h-16 w-full justify-between border-b border-dark-600 px-5 py-2 align-middle">
        <div className="my-auto flex">
          <h1 className="text-lg font-normal tracking-tight text-dark-1000">
            貫 kan
          </h1>
        </div>
      </div>

      <div className="flex h-full w-full">
        <SideNavigation user={session.user} />
        <div className="w-full overflow-hidden">{props.children}</div>
      </div>
    </main>
  );
}
