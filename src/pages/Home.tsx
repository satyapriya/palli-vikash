import { Link } from "react-router-dom";
import { Heart, Users, ChevronRight, Leaf, GraduationCap, Stethoscope, Home as HomeIcon, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Counter from "@/components/ui/Counter";
import heroImage from "@/assets/hero-community.jpg";
import womenImage from "@/assets/women-empowerment.jpg";
import educationImage from "@/assets/education-children.jpg";
import healthImage from "@/assets/health-camp.jpg";
import environmentImage from "@/assets/tree-plantation.jpg";

const focusAreas = [
  {
    icon: HomeIcon,
    title: "Community Development",
    description: "Skill development, SHGs, livelihood projects, and awareness drives for holistic community growth.",
  },
  {
    icon: Stethoscope,
    title: "Health & Hygiene",
    description: "Free medical camps, blood donation drives, sanitation awareness, and nutrition programs.",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Evening tuition, scholarships, digital literacy, and back-to-school enrollment drives.",
  },
  {
    icon: Leaf,
    title: "Environment",
    description: "Tree plantation, clean village campaigns, waste management, and water conservation.",
  },
  {
    icon: HandHeart,
    title: "Women Welfare",
    description: "Self-defense training, skill development, girl child education, and widow support.",
  },
  {
    icon: Users,
    title: "Rural Development",
    description: "Clean drinking water, toilet construction, organic farming, and farmer training.",
  },
];

const impactStats = [
  { value: 10, suffix: "+", label: "Years of Service" },
  { value: 50, suffix: "+", label: "Villages Reached" },
  { value: 5000, suffix: "+", label: "Families Supported" },
  { value: 100, suffix: "+", label: "Programs Conducted" },
];

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Rural community development"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
              🌾 Serving Rural Communities Since 2014
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in-up delay-100">
              Empowering Rural Lives,{" "}
              <span className="text-secondary">Building Brighter Futures</span>
            </h1>
            <p className="text-primary-foreground/90 text-lg md:text-xl leading-relaxed mb-8 animate-fade-in-up delay-200">
              PALLI VIKASH is committed to bringing peace, prosperity, and progress to rural communities through sustainable development, education, healthcare, and women empowerment.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up delay-300">
              <Link to="/donate">
                <Button variant="donate" size="xl">
                  <Heart className="w-5 h-5" />
                  Donate Now
                </Button>
              </Link>
              <Link to="/programs">
                <Button variant="hero" size="xl">
                  Explore Our Work
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Tagline */}
            <div className="mt-12 flex items-center gap-6 animate-fade-in-up delay-400">
              <div className="h-px bg-primary-foreground/30 w-12" />
              <p className="text-primary-foreground/80 font-heading text-lg tracking-wider">
                Peace | Prosperity | Progress
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/50 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary-foreground/70 rounded-full animate-pulse-gentle" />
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-card py-12 relative z-10 -mt-20 mx-4 md:mx-8 lg:mx-auto lg:max-w-6xl rounded-2xl shadow-elevated">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 px-8">
          {impactStats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-4xl md:text-5xl font-bold text-primary mb-2">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-muted-foreground text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Focus Areas */}
      <Section variant="muted">
        <SectionHeader
          subtitle="What We Do"
          title="Our Focus Areas"
          description="We work across multiple domains to create holistic and sustainable development in rural communities."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {focusAreas.map((area, index) => (
            <div
              key={area.title}
              className="bg-card rounded-xl p-6 md:p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <area.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                {area.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {area.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/programs">
            <Button variant="default" size="lg">
              View All Programs
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </Section>

      {/* About Preview */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-3">
              About PALLI VIKASH
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              A Decade of Dedicated Service to Rural Communities
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Founded with a vision to transform rural Odisha, PALLI VIKASH has been at the forefront of community development, working tirelessly to uplift the lives of thousands of families across Ganjam district.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our grassroots approach, combined with community participation and sustainable practices, has created lasting impact in healthcare, education, women empowerment, and environmental conservation.
            </p>
            <Link to="/about">
              <Button variant="outline" size="lg">
                Learn Our Story
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src={womenImage}
                alt="Women empowerment program"
                className="rounded-xl shadow-card w-full h-48 object-cover"
              />
              <img
                src={healthImage}
                alt="Health camp"
                className="rounded-xl shadow-card w-full h-64 object-cover"
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                src={educationImage}
                alt="Children education"
                className="rounded-xl shadow-card w-full h-64 object-cover"
              />
              <img
                src={environmentImage}
                alt="Tree plantation"
                className="rounded-xl shadow-card w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Be a Part of the Change
          </h2>
          <p className="text-primary-foreground/90 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Your support can help us reach more villages, support more families, and create a lasting impact on rural communities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/donate">
              <Button variant="donate" size="xl">
                <Heart className="w-5 h-5" />
                Donate Now
              </Button>
            </Link>
            <Link to="/volunteer">
              <Button variant="hero" size="xl">
                <Users className="w-5 h-5" />
                Volunteer With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
