import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MenuButton from "../components/MenuButton";

export default function MainLayout({ children, noRightSidebar = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-reddit-page dark:bg-reddit-dark_bg transition-colors duration-200">
      <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />

      <div className="relative flex gap-6 px-4 lg:px-8 pt-6">

        {/* Left sidebar */}
        <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
          <Sidebar sidebarOpen={sidebarOpen} />
        </div>

        {/* Divider + floating menu button */}
        <div className="relative flex flex-col items-center">
          <div className="min-h-screen w-px bg-reddit-divider dark:bg-reddit-dark_divider"></div>

          <div className="absolute -left-3 top-6 lg:-left-2 hidden lg:block">
            <MenuButton
              open={sidebarOpen}
              onClick={() => setSidebarOpen((s) => !s)}
            />
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 flex justify-center">
          <div className={`w-full ${noRightSidebar ? "max-w-[1100px]" : "max-w-[740px]"}`}>
            {children}
          </div>
        </main>

        {/* Right sidebar — hidden if community page */}
        {!noRightSidebar && (
          <aside className="hidden xl:block w-[320px]">
            {/* Right widgets */}
          </aside>
        )}
      </div>
    </div>
  );
}
