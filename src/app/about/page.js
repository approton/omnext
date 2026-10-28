import CtaBand from "../../components/cta-band/cta-band";
import PageIntro from "../../components/page-intro/page-intro";
import SectionHeading from "../../components/section-heading/section-heading";
import styles from "./about.module.css";

export const metadata = {
  title: "About Omnext Technologies",
  description: "Learn about Omnext's thoughtful, outcome-focused approach to technology.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Omnext Technologies",
    description: "Learn about Omnext's thoughtful, outcome-focused approach to technology.",
  },
};
const values = [
  [
    "01",
    "Curiosity before certainty",
    "Ask better questions, listen carefully and understand context before choosing a direction.",
  ],
  [
    "02",
    "Clarity in the complex",
    "Make decisions and trade-offs understandable so everyone can move forward with confidence.",
  ],
  [
    "03",
    "Progress with purpose",
    "Focus on useful outcomes, work in meaningful steps and keep learning as we go.",
  ],
  [
    "04",
    "Craft with care",
    "Treat quality, accessibility and maintainability as part of the work from day one.",
  ],
];
export default function AboutPage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="About Omnext"
        title="Technology should open doors."
        description="Omnext Technologies is built around a simple belief: thoughtful technology can help people and businesses move beyond what’s possible today."
        highlights={["Curiosity", "Clarity", "Progress with purpose"]}
        action={{ href: "#mission", label: "Read our mission" }}
      />
      <section className={styles.story} data-reveal>
        <div className={`container ${styles.storyGrid}`}>
          <div>
            <span className="eyebrow">Our story</span>
            <h2>A focused partner for meaningful change.</h2>
          </div>
          <div>
            <p>
              We bring product thinking, design and engineering closer together. Our work begins
              with understanding the challenge, not with assuming the answer.
            </p>
            <p>
              We want to stay practical, curious and accountable: making useful things with care,
              and building trusted partnerships along the way.
            </p>
          </div>
        </div>
      </section>
      <section className={styles.mission} id="mission" data-reveal>
        <div className="container">
          <span className="eyebrow">Our mission</span>
          <p>
            Help ambitious teams turn technology into <em>meaningful progress.</em>
          </p>
        </div>
      </section>
      <section className={styles.values} data-reveal>
        <div className="container">
          <SectionHeading eyebrow="What guides us" title="Good work comes from good principles." />
          <div className={styles.grid}>
            {values.map(([number, title, description]) => (
              <article key={number} data-reveal>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className={styles.way} data-reveal>
        <div className={`container ${styles.wayGrid}`}>
          <div className={styles.art}>
            <span>01 / LISTEN</span>
            <span>02 / ALIGN</span>
            <span>03 / DELIVER</span>
          </div>
          <div>
            <span className="eyebrow">How we work</span>
            <h2>
              Collaborative by default.
              <br />
              <em>Clear about the work.</em>
            </h2>
            <p>
              We share context, surface trade-offs and work with the people closest to the
              challenge. That creates momentum without losing sight of quality or the bigger
              picture.
            </p>
          </div>
        </div>
      </section>
      <CtaBand title="Let’s find the opportunity in your challenge." />
    </main>
  );
}
