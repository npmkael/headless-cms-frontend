import { createClient } from "@/lib/supabase/server";
import { WorkingProcessesTable } from "../../components/working-processes-table";

export default async function WorkingProcessesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("working_processes")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching working processes:", error);
  }

  const workingProcesses = data ?? [];

  return (
    <div className="px-4 lg:px-6">
      <WorkingProcessesTable initialWorkingProcesses={workingProcesses} />
    </div>
  );
}
