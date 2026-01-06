import { Link } from "react-router-dom";
import {
  Home,
  Stethoscope,
  GraduationCap,
  Leaf,
  Users,
  HandHeart,
  Brain,
  Umbrella,
  Palette,
  Briefcase,
  ChevronRight,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import womenImage from "@/assets/women-empowerment.jpg";
import educationImage from "@/assets/education-children.jpg";
import healthImage from "@/assets/health-camp.jpg";
import environmentImage from "@/assets/tree-plantation.jpg";

const programs = [
  {
    id: "community",
    icon: Home,
    title: "Community Development",
    image: womenImage,
    description: "Building stronger, self-reliant communities through skill development and empowerment.",
    initiatives: [
      "Skill development & vocational training",
      "Self-Help Groups for women and youth",
      "Awareness drives on child rights & domestic violence",
      "Livelihood projects (handicrafts, agriculture, micro-enterprises)",
    ],
  },
  {
    id: "health",
    icon: Stethoscope,
    title: "Health & Hygiene",
    image: healthImage,
    description: "Ensuring access to healthcare and promoting healthy living practices.",
    initiatives: [
      "Free medical, eye & dental camps",
      "Blood donation drives",
      "Menstrual hygiene & sanitation awareness",
      "Nutrition programs for mothers & children",
    ],
  },
  {
    id: "education",
    icon: GraduationCap,
    title: "Education",
    image: educationImage,
    description: "Empowering the next generation through quality education and learning opportunities.",
    initiatives: [
      "Evening tuition & remedial classes",
      '"Back to School" enrollment drives',
      "Scholarship & stationery distribution",
      "Digital literacy & adult education",
    ],
  },
  {
    id: "rural",
    icon: Users,
    title: "Rural Development",
    image: womenImage,
    description: "Infrastructure and sustainable development for rural transformation.",
    initiatives: [
      "Clean drinking water initiatives",
      "Toilet construction & hygiene promotion",
      "Organic & sustainable farming",
      "Farmer training on modern techniques",
    ],
  },
  {
    id: "environment",
    icon: Leaf,
    title: "Environment & Sustainability",
    image: environmentImage,
    description: "Protecting our planet through conservation and sustainable practices.",
    initiatives: [
      "Tree plantation drives",
      "Clean Village & plastic-free campaigns",
      "Waste management awareness",
      "Water conservation projects",
    ],
  },
  {
    id: "women",
    icon: HandHeart,
    title: "Women & Child Welfare",
    image: womenImage,
    description: "Empowering women and protecting children for a brighter future.",
    initiatives: [
      "Women self-defense & empowerment programs",
      "Skill training (tailoring, handicrafts)",
      "Girl child education awareness",
      "Support for widows & single mothers",
    ],
  },
  {
    id: "mental",
    icon: Brain,
    title: "Mental Health & Disability Support",
    image: healthImage,
    description: "Promoting mental wellness and inclusive support for all.",
    initiatives: [
      "Counseling & mental wellness programs",
      "Support for differently-abled individuals",
      "Inclusion & accessibility initiatives",
      "Community awareness on mental health",
    ],
  },
  {
    id: "disaster",
    icon: Umbrella,
    title: "Disaster Relief & Humanitarian Aid",
    image: womenImage,
    description: "Rapid response and support during times of crisis.",
    initiatives: [
      "Flood & cyclone relief operations",
      "Food, clothing & emergency medical aid",
      "Rehabilitation support",
      "Emergency preparedness training",
    ],
  },
  {
    id: "culture",
    icon: Palette,
    title: "Culture & Heritage",
    image: educationImage,
    description: "Preserving and promoting our rich cultural traditions.",
    initiatives: [
      "Promotion of traditional arts & crafts",
      "Cultural festivals & community programs",
      "Youth participation initiatives",
      "Documentation of local heritage",
    ],
  },
  {
    id: "employment",
    icon: Briefcase,
    title: "Employment & Skill Building",
    image: womenImage,
    description: "Creating pathways to sustainable livelihoods and careers.",
    initiatives: [
      "Career guidance programs",
      "Entrepreneurship workshops",
      "Job fairs & placement support",
      "Vocational skill certifications",
    ],
  },
];

const Programs = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-primary-foreground/10 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              Our Programs
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Creating Impact Across Multiple Domains
            </h1>
            <p className="text-primary-foreground/90 text-lg md:text-xl leading-relaxed">
              Our comprehensive programs address the diverse needs of rural communities, from healthcare and education to environment and livelihoods.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <Section>
        <SectionHeader
          subtitle="10 Focus Areas"
          title="Holistic Development Programs"
          description="Each program is designed with community participation to ensure relevance, sustainability, and lasting impact."
        />

        <div className="space-y-16">
          {programs.map((program, index) => (
            <div
              key={program.id}
              id={program.id}
              className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="relative">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="rounded-2xl shadow-card w-full h-72 md:h-96 object-cover"
                  />
                  <div className="absolute top-4 left-4 w-14 h-14 rounded-xl bg-card/95 backdrop-blur-sm flex items-center justify-center shadow-card">
                    <program.icon className="w-7 h-7 text-primary" />
                  </div>
                </div>
              </div>

              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {program.title}
                </h3>
                <p className="text-muted-foreground text-lg mb-6">
                  {program.description}
                </p>
                <ul className="space-y-3 mb-6">
                  {program.initiatives.map((initiative, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ChevronRight className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground">{initiative}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section variant="secondary">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
            Support Our Programs
          </h2>
          <p className="text-secondary-foreground/80 text-lg mb-8">
            Your contribution helps us expand our reach and deepen our impact. Every donation directly supports rural families.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/donate">
              <Button variant="donate" size="lg">
                <Heart className="w-5 h-5" />
                Donate Now
              </Button>
            </Link>
            {/* <Link to="/volunteer">
              <Button variant="hero" size="lg" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
                Become a Volunteer
              </Button>
            </Link> */}
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default Programs;
