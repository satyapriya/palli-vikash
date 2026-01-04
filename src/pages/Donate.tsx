import { useState } from "react";
import { Heart, Copy, Check, QrCode, Building2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import Section from "@/components/ui/Section";
import { toast } from "@/hooks/use-toast";

const bankDetails = {
  accountName: "PALLI VIKASH PODANGI",
  accountNumber: "30389059516",
  bankName: "State Bank of India (SBI)",
  branch: "Hinjilicut",
  ifsc: "SBIN0010131",
};

const upiId = "30389059516@sbi";

const Donate = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl text-center mx-auto">
            <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Make a Difference Today
            </h1>
            <p className="text-primary-foreground/90 text-lg md:text-xl leading-relaxed">
              Your contribution directly supports rural development, healthcare, education, and livelihood initiatives for thousands of families in need.
            </p>
          </div>
        </div>
      </section>

      {/* Donation Methods */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              How to Donate
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose your preferred method to make a secure donation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Bank Transfer */}
            <div className="bg-card rounded-2xl p-8 shadow-elevated border border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    Bank Transfer
                  </h3>
                  <p className="text-muted-foreground text-sm">Direct bank transfer</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Account Name", value: bankDetails.accountName, field: "Account Name" },
                  { label: "Account Number", value: bankDetails.accountNumber, field: "Account Number" },
                  { label: "Bank Name", value: bankDetails.bankName, field: "Bank Name" },
                  { label: "Branch", value: bankDetails.branch, field: "Branch" },
                  { label: "IFSC Code", value: bankDetails.ifsc, field: "IFSC Code" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                      <p className="font-semibold text-foreground">{item.value}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(item.value, item.field)}
                      className="p-2 hover:bg-background rounded-lg transition-colors"
                      aria-label={`Copy ${item.label}`}
                    >
                      {copiedField === item.field ? (
                        <Check className="w-5 h-5 text-primary" />
                      ) : (
                        <Copy className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* UPI */}
            <div className="bg-card rounded-2xl p-8 shadow-elevated border border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Smartphone className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    UPI Payment
                  </h3>
                  <p className="text-muted-foreground text-sm">Quick & easy</p>
                </div>
              </div>

              {/* UPI ID */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg mb-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">UPI ID</p>
                  <p className="font-semibold text-foreground text-lg">{upiId}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(upiId, "UPI ID")}
                  className="p-2 hover:bg-background rounded-lg transition-colors"
                  aria-label="Copy UPI ID"
                >
                  {copiedField === "UPI ID" ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : (
                    <Copy className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>

              {/* QR Code Placeholder */}
              <div className="bg-muted rounded-xl p-8 flex flex-col items-center justify-center">
                <div className="w-48 h-48 bg-card rounded-lg flex items-center justify-center border-2 border-dashed border-border mb-4">
                  <QrCode className="w-24 h-24 text-muted-foreground/50" />
                </div>
                <p className="text-muted-foreground text-sm text-center">
                  Scan QR code with any UPI app
                </p>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="mt-12 bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
            <h4 className="font-heading text-xl font-bold text-foreground mb-3">
              Your Impact Matters
            </h4>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every rupee you donate goes directly towards supporting rural development, health camps, education programs, women empowerment, and livelihood initiatives. Thank you for being a part of our mission to bring peace, prosperity, and progress to rural communities.
            </p>
          </div>

          {/* What Your Donation Supports */}
          <div className="mt-12">
            <h3 className="font-heading text-2xl font-bold text-foreground text-center mb-8">
              What Your Donation Supports
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { amount: "₹500", impact: "Provides school supplies for 5 children" },
                { amount: "₹1,000", impact: "Funds a health checkup for 10 villagers" },
                { amount: "₹2,500", impact: "Supports women's skill training for a month" },
                { amount: "₹5,000", impact: "Plants 50 trees in a village" },
              ].map((item) => (
                <div
                  key={item.amount}
                  className="bg-card rounded-xl p-6 shadow-card text-center hover:shadow-elevated transition-shadow"
                >
                  <div className="font-heading text-3xl font-bold text-primary mb-2">
                    {item.amount}
                  </div>
                  <p className="text-muted-foreground text-sm">{item.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Tax Benefits */}
      <Section variant="muted">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
            Need Assistance?
          </h2>
          <p className="text-muted-foreground mb-6">
            If you have any questions about donations or would like to discuss CSR partnerships, please reach out to us.
          </p>
          <Button variant="default" size="lg" asChild>
            <a href="/contact">Contact Us</a>
          </Button>
        </div>
      </Section>
    </Layout>
  );
};

export default Donate;
