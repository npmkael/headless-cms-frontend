import { createClient } from "@/lib/supabase/server";
import { ServicesTable, type Service } from "../../components/services-table";

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
    <div className="px-4 lg:px-6">
      <ServicesTable initialServices={services} />
    </div>
  );
}
