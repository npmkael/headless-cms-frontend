import { createClient } from "@/lib/supabase/server";
import { ContactSubmissionsTable } from "../../components/contact-submissions-table";

export default async function ContactSubmissionsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching contact submissions:", error);
  }

  const submissions = data ?? [];

  return (
    <div className="px-4 lg:px-6">
      <ContactSubmissionsTable initialSubmissions={submissions} />
    </div>
  );
}
