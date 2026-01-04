import { Link } from "react-router-dom";
import { Target, Eye, Heart, Award, Users, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import womenImage from "@/assets/women-empowerment.jpg";

const values = [
  {
    icon: Heart,
    title: "Compassion",
    description: "We approach every initiative with empathy and care for those we serve.",
  },
  {
    icon: Users,
    title: "Community",
    description: "We believe in the power of collective action and community participation.",
  },
  {
    icon: Award,
    title: "Integrity",
    description: "Transparency and accountability guide all our operations and partnerships.",
  },
  {
    icon: Target,
    title: "Sustainability",
    description: "We focus on long-term solutions that communities can sustain independently.",
  },
];

const milestones = [
  { year: "2014", title: "Foundation", description: "PALLI VIKASH was established in Podangi village with a vision for rural development." },
  { year: "2015", title: "First Health Camp", description: "Organized our first free medical camp serving over 500 villagers." },
  { year: "2017", title: "Women SHGs", description: "Established 10 Self-Help Groups empowering rural women economically." },
  { year: "2018", title: "Education Initiative", description: "Started evening tuition centers benefiting 200+ children." },
  { year: "2020", title: "COVID-19 Relief", description: "Distributed food and essentials to 1000+ families during the pandemic." },
  { year: "2022", title: "Environment Drive", description: "Planted 5000+ trees across 15 villages in collaboration with community." },
  { year: "2024", title: "Expansion", description: "Extended our reach to 50+ villages across Ganjam district." },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-primary-foreground/10 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              About Us
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Our Story of Service & Dedication
            </h1>
            <p className="text-primary-foreground/90 text-lg md:text-xl leading-relaxed">
              For over a decade, PALLI VIKASH has been working at the grassroots level to transform rural communities through sustainable development and empowerment.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              Who We Are
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              PALLI VIKASH, meaning "Village Development" in Odia, is a registered non-governmental organization based in Ganjam district, Odisha. Since our inception in 2014, we have been dedicated to the holistic development of rural communities.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We believe that true progress happens when communities are empowered to lead their own development. Our programs are designed in collaboration with the people we serve, ensuring relevance and sustainability.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From health camps in remote villages to women's self-help groups, from children's education centers to environmental conservation drives, our work touches every aspect of rural life.
            </p>
          </div>
          <div className="relative">
            <img
              src={womenImage}
              alt="Community meeting"
              className="rounded-2xl shadow-elevated w-full"
            />
            <div className="absolute -bottom-6 -left-6 bg-secondary text-secondary-foreground p-6 rounded-xl shadow-card">
              <div className="font-heading text-4xl font-bold">10+</div>
              <div className="text-sm">Years of Service</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Vision & Mission */}
      <Section variant="muted">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-2xl p-8 md:p-10 shadow-card">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Eye className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To create self-reliant, empowered rural communities where every individual has access to quality healthcare, education, and sustainable livelihood opportunities, living with dignity and prosperity.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 md:p-10 shadow-card">
            <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To facilitate comprehensive rural development through community-driven programs in health, education, women empowerment, environment, and sustainable livelihoods, ensuring lasting impact and self-sufficiency.
            </p>
          </div>
        </div>
      </Section>

      {/* Core Values */}
      <Section>
        <SectionHeader
          subtitle="Our Values"
          title="What Drives Us"
          description="Our core values guide every decision we make and every program we implement."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <div key={value.title} className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <value.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                {value.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Timeline */}
      <Section variant="muted">
        <SectionHeader
          subtitle="Our Journey"
          title="10 Years of Progress"
          description="Key milestones that mark our journey of service and impact."
        />

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />

            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className={`relative flex flex-col md:flex-row gap-8 mb-12 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                  <div className="bg-card rounded-xl p-6 shadow-card ml-8 md:ml-0">
                    <span className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold mb-3">
                      {milestone.year}
                    </span>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                {/* Dot */}
                <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background md:-translate-x-1/2 top-6" />

                {/* Spacer */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Registration */}
      <Section>
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Award className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
            Registered & Recognized
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            PALLI VIKASH is a registered organization operating under the Societies Registration Act. We maintain complete transparency in our operations and finances, ensuring every contribution is utilized for maximum community impact.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button variant="default" size="lg">
                Get in Touch
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/donate">
              <Button variant="outline" size="lg">
                Support Our Work
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default About;
