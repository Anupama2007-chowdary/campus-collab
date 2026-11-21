import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { Eye, EyeOff } from 'lucide-react'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setError(error.message)
        return
      }

      const user = data.user

      // Faculty accounts must be assigned the faculty role
      // by an administrator in Supabase app_metadata.
      const actualRole =
        user.app_metadata?.role ||
        user.user_metadata?.role

      if (role === 'faculty' && user.app_metadata?.role !== 'faculty') {
        await supabase.auth.signOut()
        setError('This account is not authorized for Faculty Login.')
        return
      }

      if (role === 'student' && actualRole !== 'student') {
        await supabase.auth.signOut()
        setError('Please use the correct login option for your account.')
        return
      }

      navigate('/dashboard')

    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle =
    'w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500'

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8">

      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800">

        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Campus Collab
        </h1>

        <p className="text-center text-slate-400 mb-8">
          Welcome back! Login to your account
        </p>

        {/* Role Selection */}
        <div className="flex gap-3 mb-6">

          <button
            type="button"
            onClick={() => {
              setRole('student')
              setError('')
            }}
            className={`w-1/2 py-3 rounded-lg font-semibold transition ${
              role === 'student'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            Student
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('faculty')
              setError('')
            }}
            className={`w-1/2 py-3 rounded-lg font-semibold transition ${
              role === 'faculty'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            Faculty
          </button>

        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block text-slate-300 mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputStyle} pr-12`}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
          >
            {loading
              ? 'Logging in...'
              : `Login as ${role === 'student' ? 'Student' : 'Faculty'}`}
          </button>

        </form>

        <p className="text-center text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link
            to="/"
            className="text-indigo-400 font-semibold hover:text-indigo-300"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login