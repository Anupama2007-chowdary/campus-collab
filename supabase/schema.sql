
-- CAMPUS COLLAB DATABASE SCHEMA

-- 1. Student and Faculty Profiles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'student'
        CHECK (role IN ('student', 'faculty')),
    department TEXT,
    academic_year INTEGER,
    skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    github_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Projects
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    required_skills TEXT[] DEFAULT '{}',
    positions_available INTEGER DEFAULT 1,
    status TEXT DEFAULT 'open'
        CHECK (status IN ('open', 'in_progress', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Project Join Requests
CREATE TABLE public.project_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id),
    message TEXT,
    status TEXT DEFAULT 'pending'
        CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (project_id, student_id)
);

-- 4. Teams
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    hackathon_id UUID,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Team Members
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id),
    member_role TEXT DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (team_id, student_id)
);

-- 6. Hackathons
CREATE TABLE public.hackathons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    registration_deadline DATE,
    venue TEXT,
    is_online BOOLEAN DEFAULT FALSE,
    eligibility TEXT,
    team_size INTEGER,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Connect Teams to Hackathons
ALTER TABLE public.teams
ADD CONSTRAINT teams_hackathon_id_fkey
FOREIGN KEY (hackathon_id)
REFERENCES public.hackathons(id)
ON DELETE SET NULL;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;
