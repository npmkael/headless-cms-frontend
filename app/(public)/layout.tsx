// layouts
import Navbar from "@/app/(public)/components/layout/navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen mx-auto max-w-7xl px-4 md:px-8 xl:px-0 flex flex-col gap-28">
        {children}
      </main>
    </>
  );
}
