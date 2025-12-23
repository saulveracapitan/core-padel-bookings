import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { User, Calendar, Clock, MapPin, LogOut, Sun, Home, XCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  booking_date: string;
  start_time: string;
  duration_minutes: number;
  status: string;
  court: {
    id: number;
    name: string;
    type: string;
  };
}

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
}

const Perfil = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        setProfile(profileData);

        // Fetch bookings with court info
        const { data: bookingsData } = await supabase
          .from("bookings")
          .select(`
            id,
            booking_date,
            start_time,
            duration_minutes,
            status,
            court:courts(id, name, type)
          `)
          .eq("user_id", user.id)
          .order("booking_date", { ascending: false });

        if (bookingsData) {
          setBookings(bookingsData as unknown as Booking[]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Sesión cerrada");
    navigate("/");
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);

      if (error) throw error;

      setBookings(
        bookings.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
      toast.success("Reserva cancelada");
    } catch (error) {
      toast.error("Error al cancelar la reserva");
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(
    (b) => b.status === "confirmed" && new Date(b.booking_date) >= new Date()
  );
  const pastBookings = bookings.filter(
    (b) => b.status === "completed" || new Date(b.booking_date) < new Date()
  );

  return (
    <>
      <Helmet>
        <title>Mi Perfil | Core Padel</title>
        <meta name="description" content="Gestiona tu perfil y reservas en Core Padel." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-20 md:pt-24 pb-12">
          <div className="container mx-auto">
            {/* Profile Header */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                    <User className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="font-heading text-2xl font-bold text-foreground">
                      {profile?.full_name || "Usuario"}
                    </h1>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="accent" asChild>
                    <Link to="/reservar">
                      <Calendar className="w-4 h-4 mr-2" />
                      Nueva Reserva
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-accent">{upcomingBookings.length}</p>
                <p className="text-sm text-muted-foreground">Próximas reservas</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-primary">{pastBookings.length}</p>
                <p className="text-sm text-muted-foreground">Partidos jugados</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-court-indoor">
                  {bookings.filter((b) => b.court?.type === "indoor").length}
                </p>
                <p className="text-sm text-muted-foreground">Pistas interiores</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-court-outdoor">
                  {bookings.filter((b) => b.court?.type === "outdoor").length}
                </p>
                <p className="text-sm text-muted-foreground">Pistas exteriores</p>
              </div>
            </div>

            {/* Upcoming Bookings */}
            <div className="mb-8">
              <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                Próximas Reservas
              </h2>

              {loadingData ? (
                <div className="bg-card border border-border rounded-xl p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent mx-auto"></div>
                </div>
              ) : upcomingBookings.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-8 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No tienes reservas próximas</p>
                  <Button variant="accent" asChild>
                    <Link to="/reservar">Reservar Pista</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-card border border-border rounded-xl p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            booking.court?.type === "indoor"
                              ? "bg-court-indoor/10"
                              : "bg-court-outdoor/10"
                          )}
                        >
                          {booking.court?.type === "indoor" ? (
                            <Home className="w-6 h-6 text-court-indoor" />
                          ) : (
                            <Sun className="w-6 h-6 text-court-outdoor" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {booking.court?.name}
                          </h3>
                          <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(booking.booking_date), "d 'de' MMMM", {
                                locale: es,
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {booking.start_time.slice(0, 5)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  Historial de Partidos
                </h2>

                <div className="space-y-3">
                  {pastBookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-muted/50 border border-border rounded-xl p-4 flex items-center gap-4 opacity-75"
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          booking.court?.type === "indoor"
                            ? "bg-court-indoor/10"
                            : "bg-court-outdoor/10"
                        )}
                      >
                        {booking.court?.type === "indoor" ? (
                          <Home className="w-5 h-5 text-court-indoor" />
                        ) : (
                          <Sun className="w-5 h-5 text-court-outdoor" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{booking.court?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(booking.booking_date), "d MMM yyyy", {
                            locale: es,
                          })}{" "}
                          · {booking.start_time.slice(0, 5)}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          booking.status === "cancelled"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {booking.status === "cancelled" ? "Cancelada" : "Completada"}
                      </span>
                    </div>
                  ))}
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

export default Perfil;
