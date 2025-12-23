import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { format, addDays, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Check, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourtCard from "@/components/CourtCard";
import TimeSlot from "@/components/TimeSlot";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock data for courts
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

// Generate time slots from 09:00 to 23:00 (75 min blocks)
const generateTimeSlots = () => {
  const slots = [];
  let hour = 9;
  let minute = 0;

  while (hour < 22 || (hour === 22 && minute === 0)) {
    const startTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    minute += 75;
    if (minute >= 60) {
      hour += Math.floor(minute / 60);
      minute = minute % 60;
    }
    slots.push(startTime);
  }

  return slots;
};

const timeSlots = generateTimeSlots();

// Mock unavailable slots (random for demo)
const getUnavailableSlots = (courtId: number, date: Date) => {
  const seed = courtId + date.getDate();
  return timeSlots.filter((_, index) => (index + seed) % 4 === 0);
};

const Reservar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCourt, setSelectedCourt] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  // Generate next 7 days
  const dates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  }, []);

  const unavailableSlots = useMemo(() => {
    if (!selectedCourt) return [];
    return getUnavailableSlots(selectedCourt, selectedDate);
  }, [selectedCourt, selectedDate]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleCourtSelect = (courtId: number) => {
    setSelectedCourt(courtId);
    setSelectedTime(null);
    setStep(2);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleConfirm = () => {
    const court = courts.find((c) => c.id === selectedCourt);
    toast.success("¡Reserva confirmada!", {
      description: `${court?.name} - ${format(selectedDate, "d 'de' MMMM", { locale: es })} a las ${selectedTime}`,
    });
    // Reset form
    setSelectedCourt(null);
    setSelectedTime(null);
    setStep(1);
  };

  const selectedCourtData = courts.find((c) => c.id === selectedCourt);

  return (
    <>
      <Helmet>
        <title>Reservar Pista | Core Padel</title>
        <meta
          name="description"
          content="Reserva tu pista de pádel en Core Padel. Selecciona fecha, pista y horario en solo 3 pasos."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-20 md:pt-24 pb-12">
          <div className="container mx-auto">
            {/* Page Header */}
            <div className="text-center mb-8 md:mb-12">
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                Reservar Pista
              </h1>
              <p className="text-muted-foreground">
                Selecciona fecha, pista y horario en solo 3 pasos
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mb-8 md:mb-12">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all",
                      step >= s
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {step > s ? <Check className="w-4 h-4" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={cn(
                        "w-8 md:w-16 h-1 mx-1",
                        step > s ? "bg-accent" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Date Selector */}
            <div className="mb-8">
              <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-accent" />
                Selecciona fecha
              </h2>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                {dates.map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => handleDateChange(date)}
                    className={cn(
                      "flex-shrink-0 px-4 py-3 rounded-xl text-center transition-all duration-200 min-w-[80px]",
                      isSameDay(date, selectedDate)
                        ? "bg-accent text-accent-foreground shadow-accent"
                        : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                    )}
                  >
                    <p className="text-xs font-medium opacity-80">
                      {format(date, "EEE", { locale: es })}
                    </p>
                    <p className="text-xl font-bold">{format(date, "d")}</p>
                    <p className="text-xs opacity-80">
                      {format(date, "MMM", { locale: es })}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Court Selection */}
            <div className="mb-8">
              <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" />
                Selecciona pista
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {courts.map((court) => (
                  <CourtCard
                    key={court.id}
                    id={court.id}
                    name={court.name}
                    type={court.type}
                    isAvailable={true}
                    isSelected={selectedCourt === court.id}
                    onClick={() => handleCourtSelect(court.id)}
                  />
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedCourt && (
              <div className="mb-8 animate-fade-in">
                <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  Selecciona horario
                  <span className="text-sm font-normal text-muted-foreground">
                    (bloques de 75 min)
                  </span>
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {timeSlots.map((time) => (
                    <TimeSlot
                      key={time}
                      time={time}
                      isAvailable={!unavailableSlots.includes(time)}
                      isSelected={selectedTime === time}
                      onClick={() => handleTimeSelect(time)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Confirmation */}
            {selectedTime && selectedCourtData && (
              <div className="animate-slide-up">
                <div className="bg-card border border-accent/30 rounded-2xl p-6 md:p-8 shadow-medium max-w-xl mx-auto">
                  <h3 className="font-heading font-bold text-xl text-center mb-6">
                    Confirma tu reserva
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Fecha</span>
                      <span className="font-semibold">
                        {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Pista</span>
                      <span className="font-semibold">
                        {selectedCourtData.name}
                        <span
                          className={cn(
                            "ml-2 text-xs px-2 py-0.5 rounded-full",
                            selectedCourtData.type === "indoor"
                              ? "bg-court-indoor/10 text-court-indoor"
                              : "bg-court-outdoor/10 text-court-outdoor"
                          )}
                        >
                          {selectedCourtData.type === "indoor" ? "Interior" : "Exterior"}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Hora</span>
                      <span className="font-semibold">{selectedTime}</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-muted-foreground">Duración</span>
                      <span className="font-semibold">75 minutos</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1"
                      onClick={() => {
                        setSelectedTime(null);
                        setStep(2);
                      }}
                    >
                      Modificar
                    </Button>
                    <Button
                      variant="accent"
                      size="lg"
                      className="flex-1"
                      onClick={handleConfirm}
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Confirmar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Reservar;
