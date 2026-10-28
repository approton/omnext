import Link from "next/link";
import CtaBand from "../../components/cta-band/cta-band";
import PageIntro from "../../components/page-intro/page-intro";
import SectionHeading from "../../components/section-heading/section-heading";
import styles from "./solutions.module.css";

export const metadata = {
  title: "Software Modernization & Digital Product Solutions",
  description:
    "Practical technology solutions for modernization, digital product launches and growth.",
  alternates: { canonical: "/solutions" },
  openGraph: {
    title: "Software Modernization & Digital Product Solutions | Omnext Technologies",
    description:
      "Practical technology solutions for modernization, digital product launches and growth.",
  },
  robots: { index: false, follow: false },
};
const areas = [
  {
    id: "modernize",
    no: "01",
    title: "Modernize with purpose",
    intro: "Improve what you have while protecting what already works.",
    points: [
      "Understand systems and dependencies",
      "Prioritize high-friction workflows",
      "Create a phased modernization roadmap",
    ],
  },
  {
    id: "launch",
    no: "02",
    title: "Launch a digital product",
    intro: "Move from a promising idea to a product people can use.",
    points: [
      "Clarify the audience and desired outcome",
      "Prototype the important experience early",
      "Deliver a focused first release and learn",
    ],
  },
  {
    id: "scale",
    no: "03",
    title: "Scale digital capability",
    intro: "Give teams the platform and practices to keep delivering.",
    points: [
      "Build reliable cloud foundations",
      "Improve delivery and operational visibility",
      "Develop an architecture that can evolve",
    ],
  },
];
export default function SolutionsPage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="Solutions"
        title="Make the complicated feel possible."
        description="We partner with you to turn business needs into technology solutions people can rely on."
        highlights={["Modernize systems", "Launch a product", "Scale delivery"]}
        action={{ href: "#solution-list", label: "Browse solutions" }}
      />
      <section className={styles.section} id="solution-list" data-reveal>
        <div className="container">
          <SectionHeading
            eyebrow="Business needs"
            title="Find a way forward, one clear move at a time."
          />
          <div className={styles.list}>
            {areas.map((item) => (
              <article className={styles.item} id={item.id} key={item.id} data-reveal>
                <div className={styles.number}>
                  {item.no}
                  <small> / SOLUTION</small>
                </div>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.intro}</p>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>
                        <span aria-hidden="true">↗</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link className={styles.arrow} href="/contact" aria-label={`Discuss ${item.title}`}>
                  ↗
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CtaBand title="Let’s solve the right problem first." />
    </main>
  );
}
