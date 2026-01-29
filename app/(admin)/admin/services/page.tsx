import { createClient } from "@/lib/supabase/server";
import { ServicesEditor, type Service } from "../../components/services-editor";

export default async function ServicesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching services:", error);
  }

  const services: Service[] = data ?? [];

  return (
    <div className="flex flex-1 flex-col h-[calc(100vh-var(--header-height)-32px)]">
      <ServicesEditor initialServices={services} />
    </div>
  );
}
