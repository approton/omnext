import Link from "next/link";
import BrandMark from "../components/brand-mark/brand-mark";
import SectionHeading from "../components/section-heading/section-heading";
import ServiceCard from "../components/service-card/service-card";
import ArticleCard from "../components/article-card/article-card";
import ApproachArtwork from "../components/approach-artwork/approach-artwork";
import CtaBand from "../components/cta-band/cta-band";
import { articles } from "../features/articles/content";
import styles from "./home.module.css";

export const metadata = {
  title: "Website, Software & Web App Development",
  description:
    "Omnext Technologies designs and develops business websites, custom software and web applications, from discovery and UX through engineering and launch.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Website, Software & Web App Development | Omnext Technologies",
    description:
      "Business website development, custom software and web application engineering shaped around your goals.",
  },
};

const capabilities = [
  [
    "01",
    "Digital product engineering",
    "Design and build dependable products around the people who use them.",
  ],
  [
    "02",
    "Cloud & platform foundations",
    "Create secure, adaptable foundations that help teams deliver with confidence.",
  ],
  [
    "03",
    "Data & intelligent systems",
    "Make information more useful through connected data experiences and practical automation.",
  ],
];

export default function Home() {
  return (
    <main id="main-content">
      <section className={styles.hero} data-page-chapter>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <span className={styles.kicker}>
              <i /> Technology, thoughtfully applied
            </span>
            <h1>
              Build digital.
              <br />
              <em>Grow beyond.</em>
            </h1>
            <p>
              We design and develop business websites, custom software and web applications that
              turn complex challenges into clear, capable digital experiences.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primary} href="/contact">
                Start a conversation <b aria-hidden="true">↗</b>
              </Link>
              <Link className={styles.secondary} href="/products">
                Explore what we do <b aria-hidden="true">→</b>
              </Link>
            </div>
            <div className={styles.note}>
              <span /> Strategy, design & engineering in one thoughtful partnership
            </div>
          </div>
          <div
            className={styles.visual}
            data-interactive
            data-tilt
            role="img"
            aria-label="Abstract illustration representing connected digital ideas"
          >
            <div className={styles.visualTop}>
              <span>IDEA / IN MOTION</span>
              <span>01 — 03</span>
            </div>
            <div className={styles.orbitA} />
            <div className={styles.orbitB} />
            <div className={styles.core}>
              <BrandMark className={styles.coreMark} />
              <i />
            </div>
            <span className={styles.nodeA} />
            <span className={styles.nodeB} />
            <span className={styles.nodeC} />
            <span className={styles.visualLabel}>
              <span>DIGITAL</span>
              <span>SYSTEMS</span>
            </span>
            <span className={styles.signalChip}>
              <i />
              DATA FLOW <b>LIVE</b>
            </span>
            <span className={styles.signalChipSecondary}>
              <i />
              CLOUD <b>READY</b>
            </span>
            <div className={styles.visualBottom}>
              <span>FROM AMBITION</span>
              <b>→</b>
              <span>TO ADVANTAGE</span>
            </div>
          </div>
        </div>
        <div className={styles.heroFoot}>
          <div className="container">
            <span>Good technology starts with the right question.</span>
            <a className={styles.scrollCue} href="#intro">
              Scroll to explore <i>↓</i>
            </a>
          </div>
        </div>
      </section>
      <section id="intro" className={styles.intro} data-reveal>
        <div className={`container ${styles.introGrid}`}>
          <span className="eyebrow">A better way forward</span>
          <div>
            <h2>
              Technology should move your business <em>forward.</em>
            </h2>
            <p>
              We bring clarity to the hard parts: finding the right opportunity, shaping a solution,
              and building the digital capability to take it further.
            </p>
          </div>
        </div>
      </section>
      <section className={styles.capabilities} data-reveal>
        <div className="container">
          <div className={styles.sectionTop}>
            <SectionHeading
              eyebrow="What we do"
              title="Make your next move a confident one."
              description="From the first question to the system in production, we help teams make technology work harder for people and business."
            />
            <Link className={styles.viewLink} href="/products">
              View all capabilities <span>↗</span>
            </Link>
          </div>
          <div className={styles.cards}>
            {capabilities.map(([number, title, description]) => (
              <ServiceCard key={number} number={number} title={title} description={description} />
            ))}
          </div>
          <p className={styles.serviceLinks}>
            Need a specific service? Explore our <Link href="/website-development">website design and development</Link> and{" "}
            <Link href="/software-development">custom software and web app development</Link>.
          </p>
        </div>
      </section>
      <section className={styles.approach} data-reveal>
        <div className={`container ${styles.approachGrid}`}>
          <ApproachArtwork className={styles.approachArt}>
            <div className={styles.approachScene}>
              <span className={styles.approachLabel}>
                THE OMNEXT APPROACH <b>↗</b>
              </span>
              <div className={styles.stack}>
                <span>Understand</span>
                <span>Shape</span>
                <span>Build</span>
                <span>Grow</span>
              </div>
              <span className={styles.caption}>Progress, by design.</span>
            </div>
          </ApproachArtwork>
          <div className={styles.approachCopy}>
            <span className="eyebrow">Built around your context</span>
            <h2>
              Start with what matters.
              <br />
              <em>Make progress visible.</em>
            </h2>
            <p>
              Every organization has its own constraints, goals and people. We take time to
              understand the context, then work in focused steps that make outcomes tangible.
            </p>
            <ul>
              <li>
                <b>01</b> Align on the outcome before the technology
              </li>
              <li>
                <b>02</b> Bring design and engineering together early
              </li>
              <li>
                <b>03</b> Learn, adapt and build for what comes next
              </li>
            </ul>
            <Link href="/about" className={styles.darkLink}>
              Get to know our approach <span>→</span>
            </Link>
          </div>
        </div>
      </section>
      <section className={styles.solutions} data-reveal>
        <div className="container">
          <SectionHeading
            eyebrow="Where we help"
            title="Complexity, meet clarity."
            description="Bring a business challenge. We’ll help make the next step practical."
            centered
          />
          <div className={styles.solutionGrid}>
            <Link
              href="/solutions#modernize"
              data-reveal-delay="1"
              data-interactive
              data-tilt
              data-depth="2"
            >
              <small>01 / MODERNIZE</small>
              <i>↗</i>
              <h3>Move beyond legacy constraints</h3>
              <p>Improve systems and workflows your people rely on every day.</p>
            </Link>
            <Link
              href="/solutions#launch"
              data-reveal-delay="2"
              data-interactive
              data-tilt
              data-depth="3"
            >
              <small>02 / LAUNCH</small>
              <i>✳</i>
              <h3>Bring a digital idea to life</h3>
              <p>Shape a clear direction and deliver a first release with purpose.</p>
            </Link>
            <Link
              href="/solutions#scale"
              data-reveal-delay="3"
              data-interactive
              data-tilt
              data-depth="4"
            >
              <small>03 / SCALE</small>
              <i>⌁</i>
              <h3>Make technology ready to grow</h3>
              <p>Build architecture and practices that support change.</p>
            </Link>
          </div>
        </div>
      </section>
      <section className={styles.insights} data-reveal>
        <div className="container">
          <div className={styles.sectionTop}>
            <SectionHeading
              eyebrow="Ideas & insights"
              title="Thoughts for what’s next."
              description="Notes on building technology with intent, from strategy through delivery."
            />
            <Link className={styles.viewLink} href="/blog">
              Visit the journal <span>↗</span>
            </Link>
          </div>
          <div className={styles.articles}>
            {articles.slice(0, 2).map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </main>
  );
}
