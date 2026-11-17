
import { useState } from 'react'
import { Menu, Bell, Search } from 'lucide-react'
import Sidebar from './Sidebar'

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">

        {/* Top Navigation */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">

          <div className="flex items-center gap-4">

            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu size={23} />
            </button>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Welcome to Campus Collab
              </h2>
              <p className="hidden text-xs text-slate-400 sm:block">
                Find your people. Build your ideas.
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <button
              className="rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <button
              className="relative rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" />
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              S
            </div>

          </div>

        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  )
}

export default AppLayout
