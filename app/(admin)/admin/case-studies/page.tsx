import { createClient } from "@/lib/supabase/server";
import {
  CaseStudiesEditor,
  type CaseStudy,
} from "../../components/case-studies-editor";

export default async function CaseStudiesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching case studies:", error);
  }

  const caseStudies: CaseStudy[] = data ?? [];

  return (
    <div className="flex flex-1 flex-col h-[calc(100vh-var(--header-height)-32px)]">
      <CaseStudiesEditor initialCaseStudies={caseStudies} />
    </div>
  );
}
