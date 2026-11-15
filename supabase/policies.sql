
-- CAMPUS COLLAB: ROW LEVEL SECURITY POLICIES

-- Remove old policies if they exist, so this script can be safely reapplied.
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own student profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Projects are viewable by authenticated users" ON public.projects;
DROP POLICY IF EXISTS "Project owners can create projects" ON public.projects;
DROP POLICY IF EXISTS "Project owners can update projects" ON public.projects;
DROP POLICY IF EXISTS "Project owners can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Requests visible to applicant or project owner" ON public.project_requests;
DROP POLICY IF EXISTS "Students can request to join projects" ON public.project_requests;
DROP POLICY IF EXISTS "Project owners can update request status" ON public.project_requests;
DROP POLICY IF EXISTS "Team members can view their teams" ON public.teams;
DROP POLICY IF EXISTS "Users can create teams" ON public.teams;
DROP POLICY IF EXISTS "Team creators can update teams" ON public.teams;
DROP POLICY IF EXISTS "Team creators can delete teams" ON public.teams;
DROP POLICY IF EXISTS "Team members can view memberships" ON public.team_members;
DROP POLICY IF EXISTS "Team creators can add members" ON public.team_members;
DROP POLICY IF EXISTS "Members can leave or creators can remove members" ON public.team_members;
DROP POLICY IF EXISTS "Hackathons are viewable by authenticated users" ON public.hackathons;
DROP POLICY IF EXISTS "Faculty can create hackathons" ON public.hackathons;
DROP POLICY IF EXISTS "Faculty creators can update hackathons" ON public.hackathons;
DROP POLICY IF EXISTS "Faculty creators can delete hackathons" ON public.hackathons;

-- PROFILES

CREATE POLICY "Profiles are viewable by authenticated users"
ON public.profiles FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can create their own student profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (id = (SELECT auth.uid()) AND role = 'student');

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (id = (SELECT auth.uid()))
WITH CHECK (id = (SELECT auth.uid()) AND role = 'student');

-- PROJECTS

CREATE POLICY "Projects are viewable by authenticated users"
ON public.projects FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Project owners can create projects"
ON public.projects FOR INSERT TO authenticated
WITH CHECK (owner_id = (SELECT auth.uid()));

CREATE POLICY "Project owners can update projects"
ON public.projects FOR UPDATE TO authenticated
USING (owner_id = (SELECT auth.uid()))
WITH CHECK (owner_id = (SELECT auth.uid()));

CREATE POLICY "Project owners can delete projects"
ON public.projects FOR DELETE TO authenticated
USING (owner_id = (SELECT auth.uid()));

-- PROJECT REQUESTS

CREATE POLICY "Requests visible to applicant or project owner"
ON public.project_requests FOR SELECT TO authenticated
USING (
    student_id = (SELECT auth.uid())
    OR EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id
        AND p.owner_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Students can request to join projects"
ON public.project_requests FOR INSERT TO authenticated
WITH CHECK (
    student_id = (SELECT auth.uid())
    AND EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id
        AND p.owner_id <> (SELECT auth.uid())
        AND p.status = 'open'
    )
);

CREATE POLICY "Project owners can update request status"
ON public.project_requests FOR UPDATE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id
        AND p.owner_id = (SELECT auth.uid())
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id
        AND p.owner_id = (SELECT auth.uid())
    )
);

-- TEAMS

CREATE POLICY "Team members can view their teams"
ON public.teams FOR SELECT TO authenticated
USING (
    created_by = (SELECT auth.uid())
    OR EXISTS (
        SELECT 1 FROM public.team_members tm
        WHERE tm.team_id = id
        AND tm.student_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Users can create teams"
ON public.teams FOR INSERT TO authenticated
WITH CHECK (created_by = (SELECT auth.uid()));

CREATE POLICY "Team creators can update teams"
ON public.teams FOR UPDATE TO authenticated
USING (created_by = (SELECT auth.uid()))
WITH CHECK (created_by = (SELECT auth.uid()));

CREATE POLICY "Team creators can delete teams"
ON public.teams FOR DELETE TO authenticated
USING (created_by = (SELECT auth.uid()));

-- TEAM MEMBERS

CREATE POLICY "Team members can view memberships"
ON public.team_members FOR SELECT TO authenticated
USING (
    student_id = (SELECT auth.uid())
    OR EXISTS (
        SELECT 1 FROM public.teams t
        WHERE t.id = team_id
        AND t.created_by = (SELECT auth.uid())
    )
    OR EXISTS (
        SELECT 1 FROM public.team_members tm
        WHERE tm.team_id = team_id
        AND tm.student_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Team creators can add members"
ON public.team_members FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.teams t
        WHERE t.id = team_id
        AND t.created_by = (SELECT auth.uid())
    )
);

CREATE POLICY "Members can leave or creators can remove members"
ON public.team_members FOR DELETE TO authenticated
USING (
    student_id = (SELECT auth.uid())
    OR EXISTS (
        SELECT 1 FROM public.teams t
        WHERE t.id = team_id
        AND t.created_by = (SELECT auth.uid())
    )
);

-- HACKATHONS

CREATE POLICY "Hackathons are viewable by authenticated users"
ON public.hackathons FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Faculty can create hackathons"
ON public.hackathons FOR INSERT TO authenticated
WITH CHECK (
    created_by = (SELECT auth.uid())
    AND EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = (SELECT auth.uid())
        AND p.role = 'faculty'
    )
);

CREATE POLICY "Faculty creators can update hackathons"
ON public.hackathons FOR UPDATE TO authenticated
USING (
    created_by = (SELECT auth.uid())
    AND EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = (SELECT auth.uid())
        AND p.role = 'faculty'
    )
)
WITH CHECK (
    created_by = (SELECT auth.uid())
    AND EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = (SELECT auth.uid())
        AND p.role = 'faculty'
    )
);

CREATE POLICY "Faculty creators can delete hackathons"
ON public.hackathons FOR DELETE TO authenticated
USING (
    created_by = (SELECT auth.uid())
    AND EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = (SELECT auth.uid())
        AND p.role = 'faculty'
    )
);
