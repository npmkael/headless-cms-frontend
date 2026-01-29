import ServiceCard from "../ui/service-card";

type Service =
  | {
      id: string;
      title: string;
      description: string | null;
    }[]
  | null;

const variants = ["light", "green", "dark"] as const;

export default function Services({ services }: { services: Service }) {
  return (
    <section className="flex flex-col items-center justify-center px-4 md:px-8 xl:px-0">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 w-full mb-12">
        <h2 className="bg-[#B9FF66] rounded-md px-1.5 py-1 text-3xl md:text-4xl font-semibold whitespace-nowrap">
          Services
        </h2>
        <p className="text-sm md:text-base max-w-xl">
          At our digital marketing agency, we offer a range of services to help
          businesses grow and succeed online. These services include:
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {services?.map((service, index) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            variant={variants[index % 3]}
            id={""}
            description={service.description && ""}
          />
        ))}
      </div>
    </section>
  );
}
