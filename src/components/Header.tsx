import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Calendar, User, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/reservar", label: "Reservar" },
    { href: "/pistas", label: "Pistas" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Core Padel Logo" className="w-10 h-10 object-contain" />
            <span className="font-heading font-bold text-xl text-primary">
              Core Padel
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "font-medium transition-colors duration-200 hover:text-accent",
                  isActive(link.href)
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/perfil">
                    <User className="w-4 h-4 mr-2" />
                    Mi Perfil
                  </Link>
                </Button>
                <Button variant="accent" size="sm" asChild>
                  <Link to="/reservar">
                    <Calendar className="w-4 h-4 mr-2" />
                    Reservar
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </Link>
                </Button>
                <Button variant="accent" size="sm" asChild>
                  <Link to="/reservar">
                    <Calendar className="w-4 h-4 mr-2" />
                    Reservar Ahora
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-4 py-3 rounded-lg font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 px-4">
                {user ? (
                  <>
                    <Button variant="outline" asChild>
                      <Link to="/perfil" onClick={() => setIsMenuOpen(false)}>
                        <User className="w-4 h-4 mr-2" />
                        Mi Perfil
                      </Link>
                    </Button>
                    <Button variant="ghost" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        <LogIn className="w-4 h-4 mr-2" />
                        Iniciar Sesión
                      </Link>
                    </Button>
                    <Button variant="accent" asChild>
                      <Link to="/reservar" onClick={() => setIsMenuOpen(false)}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Reservar Ahora
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
