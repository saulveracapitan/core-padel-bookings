import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, MapPin, User, Check, Share2, Copy, Home, Sun, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BookingDetails {
    id: string;
    booking_date: string;
    start_time: string;
    duration_minutes: number;
    status: string;
    payment_type: "full" | "split";
    share_token: string;
    court: {
        id: number;
        name: string;
        type: "indoor" | "outdoor";
        price_cents: number;
    };
}

interface Participant {
    id: string;
    user_id: string;
    role: "owner" | "player";
    payment_status: "paid" | "pending";
    user: {
        email: string;
        user_metadata: {
            full_name?: string;
        };
    };
}

const BookingPage = () => {
    const { token } = useParams<{ token: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<BookingDetails | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        const fetchBooking = async () => {
            if (!token) return;

            try {
                // Fetch booking details
                const { data: bookingData, error: bookingError } = await supabase
                    .from("bookings")
                    .select(`
            *,
            court:courts(*)
          `)
                    .eq("share_token", token)
                    .single();

                if (bookingError) throw bookingError;
                setBooking(bookingData as unknown as BookingDetails);

                // Fetch participants
                const { data: participantsData, error: participantsError } = await supabase
                    .from("booking_participants")
                    .select(`
            *,
            user:user_id(email, user_metadata)
          `)
                    .eq("booking_id", bookingData.id);

                if (participantsError) {
                    console.error("Error fetching participants:", participantsError);
                    // Don't throw, just show empty list if table doesn't exist yet or RLS fails
                } else {
                    setParticipants(participantsData as unknown as Participant[]);
                }

            } catch (error) {
                console.error("Error loading booking:", error);
                toast.error("No se pudo cargar la reserva");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [token, navigate]);

    const handleJoin = async () => {
        if (!user) {
            toast.error("Debes iniciar sesión para unirte");
            navigate("/login", { state: { from: `/booking/${token}` } });
            return;
        }

        if (!booking) return;

        setJoining(true);
        try {
            const { error } = await supabase.from("booking_participants").insert({
                booking_id: booking.id,
                user_id: user.id,
                role: "player",
                payment_status: booking.payment_type === "full" ? "paid" : "pending" // If full payment, guests don't pay. If split, they do.
            });

            if (error) throw error;

            toast.success("¡Te has unido al partido!");

            // Refresh participants
            const { data: participantsData } = await supabase
                .from("booking_participants")
                .select(`
            *,
            user:user_id(email, user_metadata)
          `)
                .eq("booking_id", booking.id);

            if (participantsData) {
                setParticipants(participantsData as unknown as Participant[]);
            }

        } catch (error) {
            console.error("Error joining:", error);
            toast.error("Error al unirse al partido");
        } finally {
            setJoining(false);
        }
    };

    const handleCancelBooking = async () => {
        if (!booking) return;

        const confirmed = window.confirm("¿Estás seguro de que quieres cancelar esta reserva? Esta acción no se puede deshacer.");
        if (!confirmed) return;

        try {
            const { error } = await supabase
                .from("bookings")
                .update({ status: "cancelled" })
                .eq("id", booking.id);

            if (error) throw error;

            setBooking({ ...booking, status: "cancelled" });
            toast.success("Reserva cancelada correctamente");
        } catch (error) {
            console.error("Error cancelling:", error);
            toast.error("Error al cancelar la reserva");
        }
    };

    const handleModifyBooking = () => {
        toast.info("Para modificar la reserva, por favor cancélala y crea una nueva con los datos correctos.", {
            duration: 5000,
        });
    };

    const copyToClipboard = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.success("Enlace copiado");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
        );
    }

    if (!booking) return null;

    const isParticipant = user && participants.some(p => p.user_id === user.id);
    const isOwner = user && participants.some(p => p.user_id === user.id && p.role === "owner");
    const isFull = participants.length >= 4; // Assuming 4 players max for Padel

    return (
        <>
            <Helmet>
                <title>Detalles de Reserva | Core Padel</title>
            </Helmet>

            <div className="min-h-screen bg-background">
                <Header />

                <main className="pt-20 md:pt-24 pb-12">
                    <div className="container mx-auto max-w-3xl">
                        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
                            {/* Header */}
                            <div className="bg-primary p-6 md:p-8 text-primary-foreground">
                                <div className="flex items-center justify-between mb-4">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                                        booking.court.type === "indoor" ? "bg-court-indoor text-white" : "bg-court-outdoor text-white"
                                    )}>
                                        {booking.court.type === "indoor" ? "Indoor" : "Outdoor"}
                                    </span>
                                    <span className="text-sm opacity-80">
                                        Reserva #{booking.id.slice(0, 8)}
                                    </span>
                                </div>
                                <h1 className="font-heading text-3xl font-bold mb-2">
                                    Partido de Padel
                                </h1>
                                <div className="flex flex-wrap gap-4 text-sm opacity-90">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {format(new Date(booking.booking_date), "EEEE, d 'de' MMMM", { locale: es })}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {booking.start_time.slice(0, 5)} (75 min)
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        {booking.court.name}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 md:p-8">
                                {/* Status Banner */}
                                <div className={cn(
                                    "mb-8 flex items-center justify-between p-4 rounded-xl border",
                                    booking.status === "cancelled"
                                        ? "bg-destructive/10 border-destructive/20"
                                        : "bg-muted/50 border-border"
                                )}>
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center",
                                            booking.status === "cancelled"
                                                ? "bg-destructive/20 text-destructive"
                                                : "bg-green-100 text-green-600"
                                        )}>
                                            {booking.status === "cancelled" ? <XCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold">
                                                {booking.status === "cancelled" ? "Reserva Cancelada" : "Reserva Confirmada"}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {booking.payment_type === "split" ? "Pago dividido" : "Pago completo"}
                                            </p>
                                        </div>
                                    </div>
                                    {booking.status !== "cancelled" && (
                                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                                            <Share2 className="w-4 h-4 mr-2" />
                                            Compartir
                                        </Button>
                                    )}
                                </div>

                                {/* Participants */}
                                <div className="mb-8">
                                    <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                                        <User className="w-5 h-5 text-accent" />
                                        Jugadores ({participants.length}/4)
                                    </h2>

                                    <div className="grid gap-3">
                                        {participants.map((p) => (
                                            <div key={p.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                        {p.user.email[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">
                                                            {p.user.user_metadata?.full_name || p.user.email.split('@')[0]}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground capitalize">
                                                            {p.role === "owner" ? "Organizador" : "Jugador"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "text-xs px-2 py-1 rounded-full",
                                                        p.payment_status === "paid"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                    )}>
                                                        {p.payment_status === "paid" ? "Pagado" : "Pendiente"}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Empty Slots */}
                                        {Array.from({ length: Math.max(0, 4 - participants.length) }).map((_, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 border border-dashed border-border rounded-xl opacity-50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                                        <User className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">Espacio disponible</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {!isParticipant && !isFull && (
                                    <Button
                                        className="w-full"
                                        size="lg"
                                        variant="accent"
                                        onClick={handleJoin}
                                        disabled={joining}
                                    >
                                        {joining ? "Uniéndote..." : "Unirme al Partido"}
                                    </Button>
                                )}

                                {isParticipant && booking.payment_type === "split" && participants.find(p => p.user_id === user?.id)?.payment_status === "pending" && (
                                    <Button className="w-full" size="lg" variant="default">
                                        Pagar mi parte (6,00 €)
                                    </Button>
                                )}

                                {isParticipant && (
                                    <div className="mt-4 text-center">
                                        <p className="text-sm text-muted-foreground">Ya estás apuntado a este partido.</p>
                                        <Button variant="link" asChild className="mt-2">
                                            <Link to="/perfil">Ver mis reservas</Link>
                                        </Button>
                                    </div>
                                )}

                                {/* Owner Actions */}
                                {isOwner && booking.status !== "cancelled" && (
                                    <div className="mt-8 pt-8 border-t border-border">
                                        <h3 className="font-semibold mb-4">Gestionar Reserva</h3>
                                        <div className="flex gap-3">
                                            <Button variant="outline" className="flex-1" onClick={handleModifyBooking}>
                                                Modificar
                                            </Button>
                                            <Button variant="destructive" className="flex-1" onClick={handleCancelBooking}>
                                                Cancelar Reserva
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default BookingPage;
