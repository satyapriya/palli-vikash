import { Link } from "react-router-dom";
import { Calendar, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import healthImage from "@/assets/health-camp.jpg";
import educationImage from "@/assets/education-children.jpg";
import environmentImage from "@/assets/tree-plantation.jpg";

const newsItems = [
  {
    id: 1,
    title: "Free Eye Camp Successfully Conducted in Podangi Village",
    excerpt: "Over 150 villagers received free eye check-ups and 50 were provided with spectacles during our recent eye camp.",
    date: "December 28, 2024",
    image: healthImage,
    category: "Healthcare",
  },
  {
    id: 2,
    title: "Annual Tree Plantation Drive Plants 1000 Saplings",
    excerpt: "Community volunteers joined hands to plant 1000 saplings across 5 villages as part of our Green Village initiative.",
    date: "December 20, 2024",
    image: environmentImage,
    category: "Environment",
  },
  {
    id: 3,
    title: "New Evening Tuition Center Inaugurated",
    excerpt: "A new evening tuition center was inaugurated in Pitala village, benefiting over 50 children from underprivileged families.",
    date: "December 15, 2024",
    image: educationImage,
    category: "Education",
  },
];

const upcomingEvents = [
  {
    title: "Health Awareness Camp",
    date: "January 15, 2025",
    location: "Podangi Village",
  },
  {
    title: "Women's Day Celebration",
    date: "March 8, 2025",
    location: "Community Hall, Pitala",
  },
  {
    title: "Annual General Meeting",
    date: "April 2, 2025",
    location: "PALLI VIKASH Office",
  },
];

const News = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-primary-foreground/10 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              News & Updates
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Latest from PALLI VIKASH
            </h1>
            <p className="text-primary-foreground/90 text-lg md:text-xl leading-relaxed">
              Stay updated with our latest programs, events, and announcements.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid lg:grid-cols-3 gap-12">
          {/* News Articles */}
          <div className="lg:col-span-2">
            <SectionHeader
              title="Recent News"
              description="Updates from our programs and activities."
              align="left"
            />

            <div className="space-y-8">
              {newsItems.map((item) => (
                <article
                  key={item.id}
                  className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 group"
                >
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative h-56 md:h-auto overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                        <Calendar className="w-4 h-4" />
                        {item.date}
                      </div>
                      <h2 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {item.title}
                      </h2>
                      <p className="text-muted-foreground mb-4">{item.excerpt}</p>
                      <button className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Upcoming Events */}
            <div className="bg-card rounded-2xl p-6 shadow-card mb-8">
              <h3 className="font-heading text-xl font-bold text-foreground mb-6">
                Upcoming Events
              </h3>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
                  >
                    <h4 className="font-semibold text-foreground mb-2">{event.title}</h4>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">{event.location}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
              <h3 className="font-heading text-xl font-bold mb-3">Stay Connected</h3>
              <p className="text-primary-foreground/80 text-sm mb-4">
                Get updates on our work directly in your inbox.
              </p>
              <Link to="/contact">
                <Button variant="hero" size="lg" className="w-full">
                  Contact Us
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default News;
