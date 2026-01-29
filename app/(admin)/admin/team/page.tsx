import { createClient } from "@/lib/supabase/server";
import { TeamTable } from "../../components/team-table";

export default async function TeamPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching team members:", error);
  }

  const teamMembers = data ?? [];

  return (
    <div className="px-4 lg:px-6">
      <TeamTable initialTeamMembers={teamMembers} />
    </div>
  );
}
