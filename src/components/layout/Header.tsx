import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart, Instagram, Facebook, Youtube, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";


const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Programs", path: "/programs" },
  { name: "Impact", path: "/impact" },
  { name: "Gallery", path: "/gallery" },
  { name: "News", path: "/news" },
  { name: "Contact", path: "/contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-30">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold text-xl"><img src={logo} /></span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-heading font-bold text-lg text-foreground leading-tight">
                PALLI VIKASH
              </h1>
              <p className="text-xs text-muted-foregroun tracking-wider">
                Peace | Prosperity | Progress
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-primary bg-primary/10"
                    : "text-muted-foregroun hover:text-foreground hover:bg-muted header-text-shadow"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* <Link to="/volunteer" className="hide">
              <Button variant="outline" size="sm">
                Volunteer
              </Button>
            </Link> */}
            <Link to="/donate">
              <Button variant="donate" size="sm">
                <Heart className="w-4 h-4" />
                Donate Now
              </Button>
            </Link>

            {/* Social links */}
            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/pallivikash_podingi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/share/18e9meNbtt/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://aratt.ai/@palli_vikash_podangi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="aratt.ai"
                className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@PALLIVIKASHPATHAGARA/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex gap-3 mt-4 pt-4 border-t border-border">
              {/* <Link to="/volunteer" className="hide flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Volunteer
                </Button>
              </Link> */}
              <Link to="/donate" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="donate" className="w-full">
                  <Heart className="w-4 h-4" />
                  Donate
                </Button>
              </Link>

              {/* Social links */}
              <div className="flex items-center gap-2">
                <a
                  href="https://www.instagram.com/pallivikash_podingi"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/share/18e9meNbtt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://aratt.ai/@palli_vikash_podangi"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="aratt.ai"
                  className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <a
                  href="https://www.youtube.com/@PALLIVIKASHPATHAGARA/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
