import ServiceCard from "../ui/service-card";

const services = [
  {
    title: "Search engine optimization",
    illustration: "/images/services/service-1.png",
    href: "#seo",
  },
  {
    title: "Pay-per-click advertising",
    illustration: "/images/services/service-2.png",
    href: "#ppc",
  },
  {
    title: "Social Media Marketing",
    illustration: "/images/services/service-3.png",
    href: "#social-media",
  },
  {
    title: "Email Marketing",
    illustration: "/images/services/service-4.png",
    href: "#email",
  },
  {
    title: "Content Creation",
    illustration: "/images/services/service-5.png",
    href: "#content",
  },
  {
    title: "Analytics and Tracking",
    illustration: "/images/services/service-6.png",
    href: "#analytics",
  },
];

const variants = ["light", "green", "dark"] as const;

export default function Services() {
  return (
    <section className="flex flex-col items-center justify-center px-4 md:px-8 xl:px-0 max-w-7xl mx-auto py-16">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 w-full mb-12">
        <h2 className="bg-[#B9FF66] rounded-md px-4 py-2 text-3xl md:text-4xl font-semibold whitespace-nowrap">
          Services
        </h2>
        <p className="text-base md:text-lg max-w-xl">
          At our digital marketing agency, we offer a range of services to help
          businesses grow and succeed online. These services include:
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {services.map((service, index) => (
          <ServiceCard
            key={service.href}
            title={service.title}
            illustration={service.illustration}
            href={service.href}
            variant={variants[index % 3]}
          />
        ))}
      </div>
    </section>
  );
}
