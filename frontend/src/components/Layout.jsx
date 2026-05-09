import { useState } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({ children }) {

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">

          {children}

        </main>

      </div>

    </div>
  );
}

export default Layout;