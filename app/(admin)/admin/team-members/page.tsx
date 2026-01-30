import { createClient } from "@/lib/supabase/server";
import {
  TeamMembersEditor,
  type TeamMember,
} from "../../components/team-members-editor";

export default async function TeamMembersPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching team members:", error);
  }

  const teamMembers: TeamMember[] = data ?? [];

  return (
    <div className="flex flex-1 flex-col h-[calc(100vh-var(--header-height)-32px)]">
      <TeamMembersEditor initialTeamMembers={teamMembers} />
    </div>
  );
}
