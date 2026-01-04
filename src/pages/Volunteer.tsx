import { useState } from "react";
import { Heart, Users, Briefcase, GraduationCap, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/layout/Layout";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import { toast } from "@/hooks/use-toast";

const opportunities = [
  {
    icon: Heart,
    title: "Field Volunteer",
    description: "Join our team on the ground to support health camps, education programs, and community events.",
  },
  {
    icon: GraduationCap,
    title: "Teaching Volunteer",
    description: "Help teach children in our evening tuition centers or conduct adult literacy classes.",
  },
  {
    icon: Briefcase,
    title: "Professional Skills",
    description: "Contribute your professional expertise in areas like healthcare, legal aid, or technology.",
  },
  {
    icon: Users,
    title: "CSR Partnership",
    description: "Partner with us through your organization's CSR initiatives for larger impact.",
  },
];

const Volunteer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    occupation: "",
    interest: "",
    availability: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Application Submitted!",
      description: "Thank you for your interest. We'll contact you soon.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      occupation: "",
      interest: "",
      availability: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-primary-foreground/10 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              Get Involved
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Volunteer With Us
            </h1>
            <p className="text-primary-foreground/90 text-lg md:text-xl leading-relaxed">
              Join our community of changemakers. Your time and skills can make a real difference in the lives of rural families.
            </p>
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <Section>
        <SectionHeader
          subtitle="Opportunities"
          title="Ways to Get Involved"
          description="There are many ways you can contribute to our mission. Find the opportunity that matches your skills and interests."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {opportunities.map((opp) => (
            <div
              key={opp.title}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <opp.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                {opp.title}
              </h3>
              <p className="text-muted-foreground text-sm">{opp.description}</p>
            </div>
          ))}
        </div>

        {/* Registration Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-2xl p-8 md:p-10 shadow-elevated">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
              Volunteer Registration
            </h2>
            <p className="text-muted-foreground mb-8">
              Fill out the form below to express your interest in volunteering with us.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 70195 46246"
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <label htmlFor="occupation" className="block text-sm font-medium text-foreground mb-2">
                    Occupation
                  </label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="Your current occupation"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="interest" className="block text-sm font-medium text-foreground mb-2">
                    Area of Interest *
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    required
                    className="w-full h-12 rounded-lg border border-input bg-background px-4 text-foreground"
                  >
                    <option value="">Select an area</option>
                    <option value="field">Field Volunteer</option>
                    <option value="teaching">Teaching</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="technical">Technical Skills</option>
                    <option value="csr">CSR Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="availability" className="block text-sm font-medium text-foreground mb-2">
                    Availability
                  </label>
                  <select
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    className="w-full h-12 rounded-lg border border-input bg-background px-4 text-foreground"
                  >
                    <option value="">Select availability</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekends">Weekends</option>
                    <option value="flexible">Flexible</option>
                    <option value="remote">Remote only</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Tell us about yourself
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Share your motivation, relevant experience, or any skills you'd like to contribute..."
                  rows={5}
                />
              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={isSubmitting}
                className="w-full md:w-auto"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    Submit Application
                    <Send className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </Section>

      {/* Internship Note */}
      <Section variant="muted">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
            Internship Opportunities
          </h2>
          <p className="text-muted-foreground mb-6">
            We also offer internship opportunities for students interested in social work, rural development, public health, and related fields. Gain hands-on experience while making a difference.
          </p>
          <p className="text-muted-foreground">
            For internship inquiries, please mention "Internship" in your area of interest above or contact us directly.
          </p>
        </div>
      </Section>
    </Layout>
  );
};

export default Volunteer;
