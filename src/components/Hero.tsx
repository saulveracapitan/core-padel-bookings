import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full border-2 border-primary-foreground/30" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full border-2 border-primary-foreground/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary-foreground/10" />
      </div>

      {/* Floating Ball */}
      <div className="absolute top-1/4 right-[15%] w-20 h-20 md:w-32 md:h-32 rounded-full bg-accent shadow-accent animate-float hidden lg:block" />
      <div className="absolute bottom-1/4 left-[10%] w-12 h-12 md:w-16 md:h-16 rounded-full bg-accent/80 shadow-accent animate-float hidden lg:block" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto relative z-10 pt-20 md:pt-0">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm mb-6 animate-slide-up">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm text-primary-foreground/90 font-medium">
              8 pistas disponibles · Reserva online 24/7
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold text-primary-foreground mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Tu próxima
            <br />
            <span className="text-gradient">partida de pádel</span>
            <br />
            empieza aquí
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Reserva tu pista en segundos. Disfruta de nuestras instalaciones premium 
            con 4 pistas interiores y 4 exteriores.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/reservar">
                <Calendar className="w-5 h-5 mr-2" />
                Reservar Pista
                <ChevronRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/pistas">
                Ver Pistas
              </Link>
            </Button>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-primary-foreground/60">Horario</p>
                <p className="font-semibold text-primary-foreground">09:00 - 23:00</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-primary-foreground/60">Ubicación</p>
                <p className="font-semibold text-primary-foreground">Corbera de Llobregat</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-primary-foreground/60">Duración</p>
                <p className="font-semibold text-primary-foreground">75 minutos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
