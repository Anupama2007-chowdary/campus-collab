import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Users,
  Trophy,
  UserRound,
  LogOut,
  Menu,
  X,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { supabase } from '../services/supabase'

function Dashboard() {
  const navigate = useNavigate()

  const [studentName, setStudentName] = useState('Student')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    getStudentDetails()
  }, [])

  const getStudentDetails = async () => {
    const { data } = await supabase.auth.getUser()

    if (data?.user) {
      setStudentName(
        data.user.user_metadata?.full_name || 'Student'
      )
    }
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      alert(error.message)
      return
    }

    navigate('/login')
  }

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Profile', icon: User, path: '/profile' },
    { name: 'Project Hub', icon: FolderKanban, path: '/projects' },
    { name: 'Find Students', icon: Users, path: '/students' },
    { name: 'Hackathons', icon: Trophy, path: '/hackathons' },
    { name: 'My Teams', icon: UserRound, path: '/teams' }
  ]

  const cards = [
    {
      title: 'My Profile',
      description: 'Manage your personal information and technical skills.',
      icon: User,
      path: '/profile'
    },
    {
      title: 'Project Hub',
      description: 'Explore projects and find opportunities to collaborate.',
      icon: FolderKanban,
      path: '/projects'
    },
    {
      title: 'Find Teammates',
      description: 'Discover students with similar technical interests.',
      icon: Users,
      path: '/students'
    },
    {
      title: 'Hackathon Hub',
      description: 'Discover hackathons and participate in competitions.',
      icon: Trophy,
      path: '/hackathons'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 p-6 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

        <div className="flex justify-between items-center mb-12">

          <h1 className="text-2xl font-bold text-indigo-400">
            Campus Collab
          </h1>

          <button
            className="md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <X size={24} />
          </button>

        </div>

        <nav className="space-y-3">

          {navigation.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path)
                  setMenuOpen(false)
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition ${
                  item.name === 'Dashboard'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {item.name}
              </button>
            )
          })}

        </nav>

        <button
          onClick={handleLogout}
          className="absolute bottom-8 left-6 right-6 flex items-center gap-3 text-red-400 hover:bg-red-500/10 p-3 rounded-xl"
        >
          <LogOut size={20} />
          Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 md:p-10 overflow-y-auto">

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-10">

          <div className="flex items-center gap-4">

            <button
              className="md:hidden text-white"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={26} />
            </button>

            <div>
              <p className="text-slate-400 text-sm">
                Student Workspace
              </p>

              <h2 className="text-2xl font-bold">
                Dashboard
              </h2>
            </div>

          </div>

          <button
            onClick={() => navigate('/profile')}
            className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center font-bold"
          >
            {studentName.charAt(0).toUpperCase()}
          </button>

        </div>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-3xl p-8 md:p-10 mb-10">

          <div className="flex items-center gap-2 text-indigo-200 mb-3">
            <Sparkles size={20} />
            <span>Welcome to Campus Collab</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Hello, {studentName}!
          </h1>

          <p className="text-indigo-100 max-w-xl leading-relaxed">
            Connect with talented students, discover exciting projects,
            build teams and participate in hackathons.
          </p>

          <button
            onClick={() => navigate('/projects')}
            className="mt-7 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-50"
          >
            Explore Projects
            <ArrowRight size={18} />
          </button>

        </div>

        {/* Quick Access */}
        <div className="mb-6">

          <h2 className="text-2xl font-bold">
            Explore Campus Collab
          </h2>

          <p className="text-slate-400 mt-2">
            Everything you need to collaborate and grow.
          </p>

        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">

          {cards.map((card) => {
            const Icon = card.icon

            return (
              <div
                key={card.title}
                onClick={() => navigate(card.path)}
                className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500 hover:-translate-y-1 transition cursor-pointer"
              >

                <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-5">
                  <Icon size={25} />
                </div>

                <h3 className="text-lg font-semibold mb-2">
                  {card.title}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed">
                  {card.description}
                </p>

                <div className="flex items-center gap-2 text-indigo-400 mt-5 text-sm font-medium">
                  Explore
                  <ArrowRight size={16} />
                </div>

              </div>
            )
          })}

        </div>

        {/* Bottom Section */}
        <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-7">

          <h2 className="text-xl font-bold mb-3">
            Your Next Opportunity Starts Here!
          </h2>

          <p className="text-slate-400 leading-relaxed">
            Build meaningful connections, improve your technical skills
            and turn your innovative ideas into successful projects.
            Start collaborating with your campus community today.
          </p>

        </div>

      </main>

    </div>
  )
}

export default Dashboard