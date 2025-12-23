import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface TimeSlotProps {
  time: string;
  isAvailable: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

const TimeSlot = ({ time, isAvailable, isSelected, onClick }: TimeSlotProps) => {
  return (
    <button
      onClick={onClick}
      disabled={!isAvailable}
      className={cn(
        "relative px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200",
        isAvailable
          ? "cursor-pointer"
          : "opacity-40 cursor-not-allowed bg-muted text-muted-foreground line-through",
        isSelected
          ? "bg-accent text-accent-foreground shadow-accent scale-105"
          : isAvailable && "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
      )}
    >
      {isSelected && (
        <Check className="absolute -top-1 -right-1 w-4 h-4 text-accent-foreground bg-accent rounded-full p-0.5" />
      )}
      {time}
    </button>
  );
};

export default TimeSlot;
