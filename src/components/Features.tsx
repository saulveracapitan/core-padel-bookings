import { Calendar, Zap, Shield, Clock, MapPin, Star } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Reserva en 3 Pasos",
    description: "Selecciona fecha, pista y hora. Confirma en segundos.",
  },
  {
    icon: Zap,
    title: "Disponibilidad Real",
    description: "Consulta horarios actualizados al instante.",
  },
  {
    icon: Shield,
    title: "Pago Seguro",
    description: "Transacciones protegidas y confirmación inmediata.",
  },
  {
    icon: Clock,
    title: "Cancela Fácilmente",
    description: "Modifica o cancela tu reserva sin complicaciones.",
  },
  {
    icon: MapPin,
    title: "8 Pistas Premium",
    description: "4 interiores y 4 exteriores de primera calidad.",
  },
  {
    icon: Star,
    title: "Experiencia Premium",
    description: "Instalaciones de alto nivel para todos los jugadores.",
  },
];

const Features = () => {
  return (
    <section className="py-20 md:py-32 bg-secondary/50">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent-foreground font-semibold text-sm mb-4">
            ¿Por qué Core Padel?
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
            La mejor experiencia de reserva
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Diseñado para que disfrutes del pádel sin preocupaciones. 
            Reserva tu pista en segundos desde cualquier dispositivo.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-heading font-bold text-xl text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
