import ServiceLanding from "../../features/seo/service-landing";

export const metadata = {
  title: "Website Design & Development Services",
  description:
    "Plan, design and develop fast, accessible business websites with responsive user experiences, clear content and maintainable technology.",
  alternates: { canonical: "/website-development" },
  openGraph: {
    title: "Website Design & Development Services | Omnext Technologies",
    description:
      "Business website design and development focused on accessibility, performance and clear customer journeys.",
  },
};

export default function WebsiteDevelopmentPage() {
  return (
    <ServiceLanding
      eyebrow="Website development"
      title="Business websites built for real people and real goals."
      description="Omnext plans, designs and develops responsive websites that help businesses explain what they do, reach the right audience and make the next step clear. From a company website to a portfolio website, we shape the experience around your customers and your goals."
      searchPhrase="website design and development"
      points={[
        {
          title: "Plan the customer journey",
          description:
            "Organize information around what visitors need to understand, compare and do next.",
        },
        {
          title: "Design for every screen",
          description:
            "Create responsive layouts with readable type, clear navigation and accessible interactions.",
        },
        {
          title: "Build for speed and growth",
          description:
            "Develop maintainable website foundations with performance, search discovery and future updates in mind.",
        },
      ]}
    />
  );
}
