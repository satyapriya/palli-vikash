import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import womenImage from "@/assets/women-empowerment.jpg";
import educationImage from "@/assets/education-children.jpg";
import healthImage from "@/assets/health-camp.jpg";
import environmentImage from "@/assets/tree-plantation.jpg";
import heroImage from "@/assets/hero-community.jpg";

const galleryImages = [
  { src: heroImage, alt: "Community development program", category: "Community" },
  { src: womenImage, alt: "Women self-help group meeting", category: "Women Empowerment" },
  { src: educationImage, alt: "Children in evening tuition class", category: "Education" },
  { src: healthImage, alt: "Free health camp", category: "Healthcare" },
  { src: environmentImage, alt: "Tree plantation drive", category: "Environment" },
  { src: womenImage, alt: "Skill training program", category: "Women Empowerment" },
  { src: educationImage, alt: "School enrollment drive", category: "Education" },
  { src: healthImage, alt: "Medical awareness camp", category: "Healthcare" },
  { src: environmentImage, alt: "Clean village campaign", category: "Environment" },
];

const categories = ["All", "Community", "Women Empowerment", "Education", "Healthcare", "Environment"];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredImages =
    activeCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-primary-foreground/10 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              Gallery
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Our Work in Pictures
            </h1>
            <p className="text-primary-foreground/90 text-lg md:text-xl leading-relaxed">
              A visual journey through our programs, events, and the communities we serve.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeader
          subtitle="Photo Gallery"
          title="Capturing Moments of Change"
          description="Browse through photos from our health camps, education programs, women empowerment initiatives, and more."
        />

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={index}
              onClick={() => openLightbox(index)}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-card text-sm font-medium">{image.category}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-card hover:text-card/80 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 p-2 text-card hover:text-card/80 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 p-2 text-card hover:text-card/80 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <img
            src={filteredImages[currentImageIndex].src}
            alt={filteredImages[currentImageIndex].alt}
            className="max-w-full max-h-[80vh] rounded-lg"
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-card text-center">
            <p className="font-medium">{filteredImages[currentImageIndex].alt}</p>
            <p className="text-sm text-card/70">
              {currentImageIndex + 1} / {filteredImages.length}
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Gallery;
