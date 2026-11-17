
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Trophy,
  UserRound,
  LogOut,
  GraduationCap,
  X
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Projects',
    path: '/projects',
    icon: FolderKanban
  },
  {
    name: 'Find Students',
    path: '/students',
    icon: Users
  },
  {
    name: 'Hackathons',
    path: '/hackathons',
    icon: Trophy
  },
  {
    name: 'My Teams',
    path: '/teams',
    icon: UserRound
  }
]

function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-950 transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <GraduationCap size={23} className="text-white" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-white">
                Campus Collab
              </h1>
              <p className="text-xs text-slate-400">
                Find Your People. Build Your Ideas.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        <div className="px-5 pt-7">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/40'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-800 p-5">
          <button
            onClick={() => window.location.href = '/login'}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
