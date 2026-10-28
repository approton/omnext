import PageIntro from "../../components/page-intro/page-intro";
import ContactForm from "../../components/contact/contact-form";
import styles from "./contact-page.module.css";
export const metadata = {
  title: "Contact Omnext | Website & Software Development Enquiries",
  description:
    "Contact Omnext Technologies to discuss a business website, custom software, web app or digital product project.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Omnext | Website & Software Development Enquiries",
    description:
      "Contact Omnext Technologies to discuss a business website, custom software, web app or digital product project.",
  },
};
export default function ContactPage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="Contact"
        title="Let’s talk about what’s next."
        description="Share a little about your goals. We’ll help you think through a sensible next step."
        highlights={["Goals and opportunities", "Technical challenges", "Practical next steps"]}
        action={{ href: "#contact-enquiry", label: "Write us a note" }}
      />
      <section className={styles.section} id="contact-enquiry" data-reveal>
        <div className={`container ${styles.grid}`}>
          <div className={styles.sidebar}>
            <span className="eyebrow">Start a conversation</span>
            <h2>Good work starts with a good question.</h2>
            <p>
              Tell us what you’re exploring, what feels stuck, or where you’d like to make progress.
              A little context is enough to begin.
            </p>
            <div className={styles.steps}>
              <span>
                <b>01</b> Share what you have in mind
              </span>
              <span>
                <b>02</b> Describe the outcome you’re looking for
              </span>
              <span>
                <b>03</b> We’ll identify a practical next step together
              </span>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
