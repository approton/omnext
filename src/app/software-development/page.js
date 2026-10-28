import ServiceLanding from "../../features/seo/service-landing";

export const metadata = {
  title: "Custom Software & Web Application Development",
  description:
    "Develop custom software and web applications around your workflows, users and business goals, from discovery and UX through delivery.",
  alternates: { canonical: "/software-development" },
  openGraph: {
    title: "Custom Software & Web Application Development | Omnext Technologies",
    description:
      "Custom software and web app development designed around your workflows, users and business goals.",
  },
};

export default function SoftwareDevelopmentPage() {
  return (
    <ServiceLanding
      eyebrow="Software development"
      title="Custom software and web apps shaped around your work."
      description="When off-the-shelf software does not fit the job, custom software can connect workflows, simplify operations and create a better digital service. Omnext works with your team to define the problem, shape the product and deliver maintainable web applications."
      searchPhrase="custom software and web app development"
      points={[
        {
          title: "Understand the workflow",
          description:
            "Map user needs, existing systems and constraints before deciding what to build.",
        },
        {
          title: "Design the application",
          description:
            "Prototype important journeys and align the interface with the people using it every day.",
        },
        {
          title: "Engineer and evolve",
          description:
            "Build secure, accessible web software with a foundation your team can operate and extend.",
        },
      ]}
    />
  );
}
