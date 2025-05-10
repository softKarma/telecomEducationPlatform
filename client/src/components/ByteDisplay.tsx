import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ByteDisplayProps {
  value: string;
  color: string;
  tooltip?: string;
}

export default function ByteDisplay({ value, color, tooltip }: ByteDisplayProps) {
  // Map color string to Tailwind class combination
  const getColorClasses = (colorName: string) => {
    switch (colorName) {
      case 'primary':
        return 'bg-primary/20 border-primary/30';
      case 'secondary':
        return 'bg-secondary/20 border-secondary/30';
      case 'accent':
        return 'bg-accent/20 border-accent/30';
      case 'danger':
      case 'destructive':
        return 'bg-destructive/20 border-destructive/30';
      case 'neutral':
      default:
        return 'bg-muted border border-muted-foreground/30';
    }
  };

  const colorClasses = getColorClasses(color);

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className={`min-w-8 h-8 inline-flex items-center justify-center ${colorClasses} rounded text-xs font-mono cursor-help`}
            >
              {value}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div 
      className={`min-w-8 h-8 inline-flex items-center justify-center ${colorClasses} rounded text-xs font-mono`}
    >
      {value}
    </div>
  );
}
