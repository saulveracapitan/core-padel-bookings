import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-foreground flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-accent" />
              </div>
              <span className="font-heading font-bold text-xl">Core Padel</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Tu club de pádel de referencia en Corbera de Llobregat. 
              8 pistas premium para disfrutar del mejor deporte.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Navegación</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/reservar" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Reservar Pista
                </Link>
              </li>
              <li>
                <Link to="/pistas" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Nuestras Pistas
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Mi Cuenta
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Horario</h4>
            <ul className="space-y-3 text-primary-foreground/70">
              <li className="flex justify-between">
                <span>Lunes - Viernes</span>
                <span className="font-semibold text-primary-foreground">09:00 - 23:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sábados</span>
                <span className="font-semibold text-primary-foreground">09:00 - 23:00</span>
              </li>
              <li className="flex justify-between">
                <span>Domingos</span>
                <span className="font-semibold text-primary-foreground">09:00 - 22:00</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5 mt-0.5 text-accent shrink-0" />
                <span>Lloc Ampliacio del Casc, 29A<br />08757 Corbera de Llobregat</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <a href="tel:+34912345678" className="hover:text-accent transition-colors">
                  +34 912 345 678
                </a>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <a href="mailto:info@corepadel.es" className="hover:text-accent transition-colors">
                  info@corepadel.es
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-primary-foreground/50 text-sm">
          <p>© {new Date().getFullYear()} Core Padel. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
