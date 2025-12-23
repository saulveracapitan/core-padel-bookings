import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Core Padel | Reserva tu pista de pádel en Madrid</title>
        <meta
          name="description"
          content="Reserva tu pista de pádel online en Core Padel. 8 pistas premium en Madrid, 4 interiores y 4 exteriores. Reserva en 3 pasos, disponibilidad en tiempo real."
        />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <Features />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
