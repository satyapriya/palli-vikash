import { Link } from "react-router-dom";
import { Quote, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Counter from "@/components/ui/Counter";
import womenImage from "@/assets/women-empowerment.jpg";
import educationImage from "@/assets/education-children.jpg";
import healthImage from "@/assets/health-camp.jpg";

const impactStats = [
  { value: 50, suffix: "+", label: "Villages Reached" },
  { value: 5000, suffix: "+", label: "Families Supported" },
  { value: 200, suffix: "+", label: "Women Empowered" },
  { value: 1000, suffix: "+", label: "Children Educated" },
  { value: 50, suffix: "+", label: "Health Camps" },
  { value: 5000, suffix: "+", label: "Trees Planted" },
];

const stories = [
  {
    name: "Sunita Devi",
    location: "Podangi Village",
    image: womenImage,
    story: "After joining the Self-Help Group, I learned tailoring skills and started my own small business. Today, I support my family and even employ two other women from my village.",
    category: "Women Empowerment",
  },
  {
    name: "Raju & Manju",
    location: "Pitala Village",
    image: educationImage,
    story: "The evening tuition center changed our lives. We were falling behind in school, but now we're among the top students in our class. Thank you, PALLI VIKASH!",
    category: "Education",
  },
  {
    name: "Elderly Villagers",
    location: "Multiple Villages",
    image: healthImage,
    story: "The free eye camp helped over 100 elderly villagers get their vision checked. Many received free spectacles and some were referred for cataract surgery.",
    category: "Healthcare",
  },
];

const testimonials = [
  {
    quote: "PALLI VIKASH has transformed our village. The clean water initiative and health awareness programs have made a real difference in our daily lives.",
    author: "Sarpanch, Podangi Village",
  },
  {
    quote: "The women's empowerment programs gave me the confidence and skills to become financially independent. I'm grateful for their support.",
    author: "Lakshmi, SHG Member",
  },
  {
    quote: "Their dedication to rural development is inspiring. We've seen real change in education and healthcare access in our community.",
    author: "Block Development Officer",
  },
];

const Impact = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-primary-foreground/10 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              Our Impact
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Stories of Change & Transformation
            </h1>
            <p className="text-primary-foreground/90 text-lg md:text-xl leading-relaxed">
              Real impact, real stories. See how our programs have transformed lives and communities across rural Odisha.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-card py-16 relative z-10 -mt-12 mx-4 md:mx-8 lg:mx-auto lg:max-w-6xl rounded-2xl shadow-elevated">
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Our Impact in Numbers
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 px-8">
          {impactStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-3xl md:text-4xl font-bold text-primary mb-2">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Success Stories */}
      <Section>
        <SectionHeader
          subtitle="Success Stories"
          title="Lives Transformed"
          description="Every story represents a life changed, a family uplifted, and a community empowered."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div
              key={story.name}
              className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    {story.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <blockquote className="text-foreground italic mb-4 leading-relaxed">
                  "{story.story}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {story.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{story.name}</p>
                    <p className="text-muted-foreground text-xs">{story.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section variant="muted">
        <SectionHeader
          subtitle="Testimonials"
          title="What People Say"
          description="Words from community members, officials, and partners about our work."
        />

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-8 shadow-card relative"
            >
              <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
              <blockquote className="text-foreground italic mb-6 leading-relaxed relative z-10">
                "{testimonial.quote}"
              </blockquote>
              <p className="text-muted-foreground text-sm font-medium">
                — {testimonial.author}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section variant="primary">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Help Us Create More Success Stories
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Your support enables us to reach more communities and transform more lives. Join us in our mission.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/donate">
              <Button variant="donate" size="lg">
                <Heart className="w-5 h-5" />
                Donate Now
              </Button>
            </Link>
            {/* <Link to="/volunteer">
              <Button variant="hero" size="lg">
                Volunteer With Us
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link> */}
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default Impact;
