import { createClient } from "@/lib/supabase/server";
import {
  WorkingProcessesEditor,
  type WorkingProcess,
} from "../../components/working-processes-editor";

export default async function WorkingProcessesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("working_processes")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching working processes:", error);
  }

  const workingProcesses: WorkingProcess[] = data ?? [];

  return (
    <div className="flex flex-1 flex-col h-[calc(100vh-var(--header-height)-32px)]">
      <WorkingProcessesEditor initialWorkingProcesses={workingProcesses} />
    </div>
  );
}
