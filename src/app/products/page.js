import CtaBand from "../../components/cta-band/cta-band";
import PageIntro from "../../components/page-intro/page-intro";
import SectionHeading from "../../components/section-heading/section-heading";
import ServiceCard from "../../components/service-card/service-card";
import styles from "./products.module.css";

export const metadata = {
  title: "Digital Product, Web App & Cloud Engineering",
  description:
    "Explore Omnext's digital product engineering, website and web application development, custom software, cloud, data and AI capabilities.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Digital Product, Web App & Cloud Engineering | Omnext Technologies",
    description:
      "Website and web application development, custom software, cloud, data and digital product engineering.",
  },
  robots: { index: false, follow: false },
};
const capabilities = [
  [
    "01",
    "Digital product engineering",
    "From discovery and prototyping to production software, build products around the people who use them.",
  ],
  [
    "02",
    "Web platforms & applications",
    "Create responsive, accessible web experiences on a foundation your team can maintain.",
  ],
  [
    "03",
    "Cloud & platform engineering",
    "Shape secure cloud environments, delivery pipelines and platform capabilities for reliable change.",
  ],
  [
    "04",
    "Data platforms & analytics",
    "Connect data sources and make information easier to trust, understand and put to work.",
  ],
  [
    "05",
    "Applied AI & automation",
    "Explore practical automation opportunities with human oversight and clear measures of value.",
  ],
  [
    "06",
    "Technology advisory",
    "Make informed product and architecture decisions with a partner who can follow through into delivery.",
  ],
];
export default function ProductsPage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="Capabilities"
        title="Technology that earns its place."
        description="A considered set of product and engineering capabilities to help you move from ambition to real-world value."
        highlights={["Product engineering", "Cloud & platforms", "Data & applied AI"]}
        action={{ href: "#capability-catalog", label: "Explore capabilities" }}
      />
      <section className={styles.catalog} id="capability-catalog" data-reveal>
        <div className="container">
          <SectionHeading
            eyebrow="What we bring"
            title="The right expertise for your next step."
            description="Start with the outcome. Bring in the capabilities that make it achievable."
          />
          <div className={styles.grid}>
            {capabilities.map(([number, title, description]) => (
              <ServiceCard
                key={number}
                number={number}
                title={title}
                description={description}
                href="/contact"
              />
            ))}
          </div>
        </div>
      </section>
      <section className={styles.note} data-reveal>
        <div className="container">
          <div>
            <span className="eyebrow">Technology offerings</span>
            <h2>
              Useful by design.
              <br />
              <em>Ready to evolve.</em>
            </h2>
          </div>
          <p>
            Our initial catalogue is focused on services and technology capability. We’ll shape the
            right combination around your context, goals and existing systems.
          </p>
        </div>
      </section>
      <CtaBand
        title="Have a capability gap to close?"
        text="Share the challenge and we’ll explore a practical way to help."
      />
    </main>
  );
}
