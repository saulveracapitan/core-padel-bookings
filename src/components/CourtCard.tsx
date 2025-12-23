import { Sun, Home, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourtCardProps {
  id: number;
  name: string;
  type: "indoor" | "outdoor";
  isAvailable: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

const CourtCard = ({ id, name, type, isAvailable, isSelected, onClick }: CourtCardProps) => {
  const isIndoor = type === "indoor";

  return (
    <button
      onClick={onClick}
      disabled={!isAvailable}
      className={cn(
        "relative w-full p-4 md:p-6 rounded-2xl border-2 transition-all duration-300 text-left group",
        isAvailable
          ? "hover:shadow-medium hover:-translate-y-1 cursor-pointer"
          : "opacity-50 cursor-not-allowed",
        isSelected
          ? "border-accent bg-accent/10 shadow-accent"
          : "border-border bg-card hover:border-primary/30"
      )}
    >
      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-accent animate-scale-in">
          <Check className="w-4 h-4 text-accent-foreground" />
        </div>
      )}

      {/* Type Badge */}
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3",
          isIndoor
            ? "bg-court-indoor/10 text-court-indoor"
            : "bg-court-outdoor/10 text-court-outdoor"
        )}
      >
        {isIndoor ? (
          <>
            <Home className="w-3 h-3" />
            Interior
          </>
        ) : (
          <>
            <Sun className="w-3 h-3" />
            Exterior
          </>
        )}
      </div>

      {/* Court Name */}
      <h3 className="font-heading font-bold text-lg text-foreground mb-2">{name}</h3>

      {/* Availability */}
      <div className="mt-4 pt-4 border-t border-border">
        <div
          className={cn(
            "flex items-center gap-2 text-sm font-medium",
            isAvailable ? "text-court-outdoor" : "text-destructive"
          )}
        >
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              isAvailable ? "bg-court-outdoor animate-pulse" : "bg-destructive"
            )}
          />
          {isAvailable ? "Disponible" : "Ocupada"}
        </div>
      </div>

      {/* Hover Effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300",
          isAvailable && "group-hover:opacity-100"
        )}
        style={{
          background: isIndoor
            ? "linear-gradient(135deg, hsl(200 60% 50% / 0.05) 0%, transparent 100%)"
            : "linear-gradient(135deg, hsl(140 60% 45% / 0.05) 0%, transparent 100%)",
        }}
      />
    </button>
  );
};

export default CourtCard;
