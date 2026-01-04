import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* CTA Section */}
      <div className="bg-secondary py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-secondary-foreground mb-4">
            Join Us in Making a Difference
          </h3>
          <p className="text-secondary-foreground/80 mb-6 max-w-2xl mx-auto">
            Every contribution, big or small, helps us bring peace, prosperity, and progress to rural communities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/donate">
              <Button variant="donate" size="lg">
                <Heart className="w-5 h-5" />
                Donate Now
              </Button>
            </Link>
            <Link to="/volunteer">
              <Button variant="hero" size="lg" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
                Become a Volunteer
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* About */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <span className="font-heading font-bold text-xl">PV</span>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-lg">PALLI VIKASH</h4>
                  <p className="text-xs text-primary-foreground/70 tracking-wider">
                    Peace | Prosperity | Progress
                  </p>
                </div>
              </div>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                A registered organization dedicated to rural development, community empowerment, and sustainable progress for over 10 years.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { name: "About Us", path: "/about" },
                  { name: "Our Programs", path: "/programs" },
                  { name: "Success Stories", path: "/impact" },
                  { name: "Gallery", path: "/gallery" },
                  { name: "News & Updates", path: "/news" },
                  { name: "Contact Us", path: "/contact" },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Programs */}
            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Our Programs</h4>
              <ul className="space-y-2">
                {[
                  "Community Development",
                  "Health & Hygiene",
                  "Education",
                  "Women Empowerment",
                  "Environment",
                  "Disaster Relief",
                ].map((program) => (
                  <li key={program}>
                    <Link
                      to="/programs"
                      className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors"
                    >
                      {program}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-foreground/70 flex-shrink-0 mt-0.5" />
                  <span className="text-primary-foreground/80 text-sm">
                    At / P.O.: Podangi, Via – Pitala<br />
                    District: Ganjam, Odisha<br />
                    PIN: 761032
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary-foreground/70 flex-shrink-0" />
                  <span className="text-primary-foreground/80 text-sm">+91 XXXXX XXXXX</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary-foreground/70 flex-shrink-0" />
                  <span className="text-primary-foreground/80 text-sm">contact@pallivikash.org</span>
                </li>
              </ul>

              {/* Social Icons */}
              <div className="flex gap-3 mt-6">
                {[
                  { icon: Facebook, label: "Facebook" },
                  { icon: Twitter, label: "Twitter" },
                  { icon: Instagram, label: "Instagram" },
                  { icon: Youtube, label: "Youtube" },
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/70">
            <p>© {currentYear} PALLI VIKASH. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-primary-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
