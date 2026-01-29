import { createClient } from "@/lib/supabase/server";
import { CaseStudiesTable } from "../../components/case-studies-table";

export default async function CaseStudiesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching case studies:", error);
  }

  const caseStudies = data ?? [];

  return (
    <div className="px-4 lg:px-6">
      <CaseStudiesTable initialCaseStudies={caseStudies} />
    </div>
  );
}
