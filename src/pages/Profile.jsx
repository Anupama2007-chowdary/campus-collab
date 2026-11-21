import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User, Mail, GraduationCap, Code, Heart,
  Pencil, Save, X, LogOut, Plus
} from 'lucide-react'
import { supabase } from '../services/supabase'

function Profile() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    department: '',
    academicYear: '',
    skills: [],
    interests: []
  })

  const [newSkill, setNewSkill] = useState('')
  const [newInterest, setNewInterest] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const { data, error } = await supabase.auth.getUser()

    if (error || !data.user) {
      navigate('/login')
      return
    }

    const user = data.user
    const metadata = user.user_metadata || {}

    setProfile({
      fullName: metadata.full_name || '',
      email: user.email || '',
      department: metadata.department || '',
      academicYear: metadata.academic_year || '',
      skills: metadata.skills || [],
      interests: metadata.interests || []
    })

    setLoading(false)
  }

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    })
  }

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      })
      setNewSkill('')
    }
  }

  const addInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile({
        ...profile,
        interests: [...profile.interests, newInterest.trim()]
      })
      setNewInterest('')
    }
  }

  const removeSkill = (skill) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(item => item !== skill)
    })
  }

  const removeInterest = (interest) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter(item => item !== interest)
    })
  }

  const saveProfile = async () => {
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: profile.fullName,
        department: profile.department,
        academic_year: profile.academicYear,
        skills: profile.skills,
        interests: profile.interests
      }
    })

    if (error) {
      alert(error.message)
      return
    }

    setEditing(false)
    alert('Profile updated successfully!')
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      alert(error.message)
      return
    }

    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading profile...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">

          <div>
            <h1 className="text-3xl font-bold">
              My Profile
            </h1>

            <p className="text-slate-400 mt-2">
              Manage your Campus Collab profile
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-4 py-3 rounded-xl"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

        {/* Profile Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10">

          {/* Profile Heading */}
          <div className="flex flex-col sm:flex-row items-center gap-5 mb-10">

            <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center">
              <User size={45} />
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">
                {profile.fullName || 'Student Name'}
              </h2>

              <p className="text-slate-400 mt-1">
                Campus Collab Student
              </p>

              <p className="text-indigo-400 text-sm mt-1">
                {profile.department}
              </p>
            </div>

            <div className="sm:ml-auto">

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-5 py-3 rounded-xl"
                >
                  <Pencil size={17} />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-xl"
                >
                  <X size={17} />
                  Cancel
                </button>
              )}

            </div>

          </div>

          {/* Personal Information */}
          <h3 className="text-xl font-semibold mb-6">
            Personal Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6">

            <ProfileField
              icon={<User />}
              label="Full Name"
              name="fullName"
              value={profile.fullName}
              editing={editing}
              onChange={handleChange}
            />

            <ProfileField
              icon={<Mail />}
              label="Email Address"
              name="email"
              value={profile.email}
              editing={false}
            />

            <ProfileField
              icon={<GraduationCap />}
              label="Department"
              name="department"
              value={profile.department}
              editing={editing}
              onChange={handleChange}
            />

            <ProfileField
              icon={<GraduationCap />}
              label="Academic Year"
              name="academicYear"
              value={profile.academicYear}
              editing={editing}
              onChange={handleChange}
            />

          </div>

          {/* Skills */}
          <div className="mt-10">

            <h3 className="text-xl font-semibold flex items-center gap-2 mb-5">
              <Code className="text-indigo-400" />
              Technical Skills
            </h3>

            <div className="flex flex-wrap gap-3">

              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  {skill}

                  {editing && (
                    <button onClick={() => removeSkill(skill)}>
                      <X size={15} />
                    </button>
                  )}
                </span>
              ))}

              {profile.skills.length === 0 && (
                <p className="text-slate-500">
                  No skills added yet.
                </p>
              )}

            </div>

            {editing && (
              <div className="flex gap-2 mt-4">

                <input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Enter a technical skill"
                  className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 outline-none flex-1"
                />

                <button
                  onClick={addSkill}
                  className="bg-indigo-600 px-4 rounded-lg"
                >
                  <Plus size={20} />
                </button>

              </div>
            )}

          </div>

          {/* Interests */}
          <div className="mt-10">

            <h3 className="text-xl font-semibold flex items-center gap-2 mb-5">
              <Heart className="text-pink-400" />
              Areas of Interest
            </h3>

            <div className="flex flex-wrap gap-3">

              {profile.interests.map((interest, index) => (
                <span
                  key={index}
                  className="bg-pink-500/20 text-pink-300 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  {interest}

                  {editing && (
                    <button onClick={() => removeInterest(interest)}>
                      <X size={15} />
                    </button>
                  )}
                </span>
              ))}

              {profile.interests.length === 0 && (
                <p className="text-slate-500">
                  No interests added yet.
                </p>
              )}

            </div>

            {editing && (
              <div className="flex gap-2 mt-4">

                <input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Enter an area of interest"
                  className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 outline-none flex-1"
                />

                <button
                  onClick={addInterest}
                  className="bg-pink-600 px-4 rounded-lg"
                >
                  <Plus size={20} />
                </button>

              </div>
            )}

          </div>

          {/* Save Button */}
          {editing && (
            <button
              onClick={saveProfile}
              className="mt-10 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-xl font-semibold"
            >
              <Save size={18} />
              Save Changes
            </button>
          )}

        </div>

      </div>

    </div>
  )
}

function ProfileField({ icon, label, name, value, editing, onChange }) {
  return (
    <div>

      <label className="text-slate-400 text-sm mb-2 block">
        {label}
      </label>

      <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 p-4 rounded-xl">

        <span className="text-indigo-400">
          {icon}
        </span>

        {editing ? (
          name === 'academicYear' ? (
            <select
              name={name}
              value={value}
              onChange={onChange}
              className="bg-transparent outline-none w-full text-white"
            >
              <option value="" className="bg-slate-900">Select Year</option>
              <option value="1st Year" className="bg-slate-900">1st Year</option>
              <option value="2nd Year" className="bg-slate-900">2nd Year</option>
              <option value="3rd Year" className="bg-slate-900">3rd Year</option>
              <option value="4th Year" className="bg-slate-900">4th Year</option>
            </select>
          ) : (
            <input
              name={name}
              value={value}
              onChange={onChange}
              className="bg-transparent outline-none w-full text-white"
            />
          )
        ) : (
          <span className="break-all">
            {value || 'Not provided'}
          </span>
        )}

      </div>

    </div>
  )
}

export default Profile
