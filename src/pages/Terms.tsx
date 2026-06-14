import Layout from "@/components/layout/Layout";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";

const Terms = () => {
  return (
    <Layout>
      <section className="relative pt-32 pb-10 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-primary-foreground/10 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              Terms of Service
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Rules for Using This Website
            </h1>
            <p className="text-primary-foreground/90 text-lg md:text-xl leading-relaxed">
              By using this website, you agree to these Terms of Service. If you do not agree, please do not use the site.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <div className="max-w-4xl mx-auto text-left">
          <SectionHeader
            subtitle="Terms"
            title="Using Our Services"
            description="These terms apply to visitors, donors, and users of the website."
            align="left"
          />

          <div className="space-y-8 text-muted-foreground">
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                1. Acceptance of Terms
              </h3>
              <p className="leading-relaxed">
                You agree to comply with these Terms when you access or use this website.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                2. Use of the Website
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>You will use the site only for lawful purposes.</li>
                <li>You will not attempt to interfere with the website or its security.</li>
                <li>You will not upload malicious code or engage in abusive behavior.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                3. Donations
              </h3>
              <p className="leading-relaxed">
                If you donate through this website, you authorize the payment process and agree to the applicable payment processor terms.
              </p>
              <p className="leading-relaxed mt-3">
                Donation amounts and program allocations may be subject to organizational needs and operational priorities.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                4. Third-Party Services
              </h3>
              <p className="leading-relaxed">
                The website may link to third-party sites or use third-party services. We do not control those third-party services and are not responsible for their content or practices.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                5. Intellectual Property
              </h3>
              <p className="leading-relaxed">
                All content, trademarks, logos, and materials on this site are owned by PALLI VIKASH or used with permission. You may not copy, distribute, or modify content without permission.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                6. Disclaimer
              </h3>
              <p className="leading-relaxed">
                The site is provided on an "as is" and "as available" basis. We do not guarantee uninterrupted or error-free operation.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                7. Limitation of Liability
              </h3>
              <p className="leading-relaxed">
                To the maximum extent permitted by law, PALLI VIKASH will not be liable for indirect, incidental, special, or consequential damages arising from your use of the website.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                8. Changes to Terms
              </h3>
              <p className="leading-relaxed">
                We may update these Terms from time to time. Your continued use of the website after updates means you accept the revised Terms.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                9. Contact Us
              </h3>
              <p className="leading-relaxed">
                If you have questions about these Terms, please contact us via the website contact page or at:
              </p>
              <p className="leading-relaxed mt-2">
                <span className="font-semibold text-foreground">PALLI VIKASH</span>
                <br />
                Email: pallivikashp@gmail.com
              </p>
            </div>

            <div className="bg-muted rounded-2xl p-6 border border-border/60">
              <p className="text-sm leading-relaxed">
                <span className="font-semibold text-foreground">Note:</span> This document is a general set of Terms for informational purposes and should be reviewed by a qualified legal professional for compliance.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default Terms;

