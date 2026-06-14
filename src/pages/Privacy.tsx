import Layout from "@/components/layout/Layout";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";

const Privacy = () => {
  return (
    <Layout>
      <section className="relative pt-32 pb-10 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-primary-foreground/10 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              Privacy Policy
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              How We Handle Your Information
            </h1>
            <p className="text-primary-foreground/90 text-lg md:text-xl leading-relaxed">
              This Privacy Policy explains how PALLI VIKASH collects, uses, and protects information when you visit this website.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <div className="max-w-4xl mx-auto text-left">
          <SectionHeader
            subtitle="Overview"
            title="Your Privacy Matters"
            description="We respect your privacy and are committed to protecting any personal information you share with us."
            align="left"
          />

          <div className="space-y-8 text-muted-foreground">
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                1. Information We Collect
              </h3>
              <p className="leading-relaxed">
                We may collect information you provide directly, such as your name, email address, phone number, and message when you contact us or submit forms on this website.
              </p>
              <p className="leading-relaxed mt-3">
                If you make donations, we may also receive payment-related information from payment processors. Payment processing is handled by third-party services, and we do not control their privacy practices.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                2. How We Use Information
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>To respond to inquiries and provide requested information.</li>
                <li>To process donations and related communications.</li>
                <li>To improve our website and services.</li>
                <li>To maintain records for program and organizational administration.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                3. Data Sharing
              </h3>
              <p className="leading-relaxed">
                We may share information with trusted service providers that help us operate the website or deliver services (for example, analytics, hosting, and payment processors). These providers are expected to protect information.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                4. Security
              </h3>
              <p className="leading-relaxed">
                We use reasonable technical and organizational measures to protect personal information. No method of transmission or storage is 100% secure, however.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                5. Cookies and Similar Technologies
              </h3>
              <p className="leading-relaxed">
                Our website may use cookies or similar technologies to enhance user experience and understand how visitors interact with the site. You can control cookies through your browser settings.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                6. Your Choices
              </h3>
              <p className="leading-relaxed">
                You may contact us to request access to, correction of, or deletion of your personal information where applicable. You may also opt out of certain communications.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                7. Contact Us
              </h3>
              <p className="leading-relaxed">
                If you have questions about this Privacy Policy, please contact us via the website contact page or at:
              </p>
              <p className="leading-relaxed mt-2">
                <span className="font-semibold">PALLI VIKASH</span>
                <br />
                Email: pallivikashp@gmail.com
              </p>
            </div>

            <div className="bg-muted rounded-2xl p-6 border border-border/60">
              <p className="text-sm leading-relaxed">
                <span className="font-semibold text-foreground">Note:</span> This document is a general privacy notice for informational purposes. For legal compliance, you should have it reviewed by a qualified professional and tailor it to your exact data practices.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default Privacy;

