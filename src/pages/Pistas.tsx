import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Sun, Home, ArrowRight, Wifi, Lightbulb, ShowerHead, Car } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const courts = [
  { id: 1, name: "Pista 1", type: "indoor" as const },
  { id: 2, name: "Pista 2", type: "indoor" as const },
  { id: 3, name: "Pista 3", type: "indoor" as const },
  { id: 4, name: "Pista 4", type: "indoor" as const },
  { id: 5, name: "Pista 5", type: "outdoor" as const },
  { id: 6, name: "Pista 6", type: "outdoor" as const },
  { id: 7, name: "Pista 7", type: "outdoor" as const },
  { id: 8, name: "Pista 8", type: "outdoor" as const },
];

const amenities = [
  { icon: Wifi, label: "WiFi gratuito" },
  { icon: Lightbulb, label: "Iluminación LED" },
  { icon: ShowerHead, label: "Vestuarios" },
  { icon: Car, label: "Parking gratuito" },
];

const Pistas = () => {
  const indoorCourts = courts.filter((c) => c.type === "indoor");
  const outdoorCourts = courts.filter((c) => c.type === "outdoor");

  return (
    <>
      <Helmet>
        <title>Nuestras Pistas | Core Padel</title>
        <meta
          name="description"
          content="Descubre nuestras 8 pistas de pádel premium. 4 pistas interiores y 4 exteriores con las mejores instalaciones en Corbera de Llobregat."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-20 md:pt-24">
          {/* Hero Section */}
          <section className="py-12 md:py-20 gradient-hero text-primary-foreground">
            <div className="container mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Nuestras Pistas
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                8 pistas de pádel premium con las mejores condiciones 
                para que disfrutes de cada partido.
              </p>
            </div>
          </section>

          {/* Courts Overview */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto">
              {/* Indoor Courts */}
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-court-indoor/10 flex items-center justify-center">
                    <Home className="w-6 h-6 text-court-indoor" />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                      Pistas Interiores
                    </h2>
                    <p className="text-muted-foreground">
                      Juega sin importar el clima
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {indoorCourts.map((court) => (
                    <div
                      key={court.id}
                      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-court-indoor/10 to-court-indoor/5 border border-court-indoor/20 p-6 hover:shadow-medium transition-all duration-300"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-court-indoor/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                      
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-court-indoor/20 text-court-indoor text-xs font-semibold mb-4">
                        <Home className="w-3 h-3" />
                        Interior
                      </span>

                      <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                        {court.name}
                      </h3>

                      <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                        <li className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          Iluminación LED
                        </li>
                      </ul>

                      <Button variant="outline" size="sm" className="w-full group-hover:bg-court-indoor group-hover:text-primary-foreground group-hover:border-court-indoor transition-all" asChild>
                        <Link to="/reservar">
                          Reservar
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outdoor Courts */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-court-outdoor/10 flex items-center justify-center">
                    <Sun className="w-6 h-6 text-court-outdoor" />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                      Pistas Exteriores
                    </h2>
                    <p className="text-muted-foreground">
                      Disfruta del buen tiempo
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {outdoorCourts.map((court) => (
                    <div
                      key={court.id}
                      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-court-outdoor/10 to-court-outdoor/5 border border-court-outdoor/20 p-6 hover:shadow-medium transition-all duration-300"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-court-outdoor/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                      
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-court-outdoor/20 text-court-outdoor text-xs font-semibold mb-4">
                        <Sun className="w-3 h-3" />
                        Exterior
                      </span>

                      <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                        {court.name}
                      </h3>

                      <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                        <li className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          Iluminación nocturna
                        </li>
                      </ul>

                      <Button variant="outline" size="sm" className="w-full group-hover:bg-court-outdoor group-hover:text-primary-foreground group-hover:border-court-outdoor transition-all" asChild>
                        <Link to="/reservar">
                          Reservar
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Amenities */}
          <section className="py-16 md:py-24 bg-secondary/50">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Servicios Incluidos
                </h2>
                <p className="text-muted-foreground text-lg">
                  Todo lo que necesitas para disfrutar de tu partida
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {amenities.map((amenity) => (
                  <div
                    key={amenity.label}
                    className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border"
                  >
                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                      <amenity.icon className="w-7 h-7 text-accent" />
                    </div>
                    <span className="font-medium text-foreground">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto">
              <div className="bg-primary rounded-3xl p-8 md:p-16 text-center">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                  ¿Listo para jugar?
                </h2>
                <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                  Reserva tu pista ahora y disfruta del mejor pádel en Corbera de Llobregat
                </p>
                <Button variant="hero" size="xl" asChild>
                  <Link to="/reservar">
                    Reservar Pista
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Pistas;
