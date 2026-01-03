import { cn } from '@/lib/utils';

interface DayflowLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'light';
  showText?: boolean;
  className?: string;
}

const DayflowLogo = ({ 
  size = 'md', 
  variant = 'default',
  showText = true,
  className 
}: DayflowLogoProps) => {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-10 h-10', text: 'text-xl' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl' },
  };

  const iconColors = variant === 'light' 
    ? 'bg-primary-foreground/20 text-primary-foreground' 
    : 'bg-primary text-primary-foreground';

  const textColors = variant === 'light'
    ? 'text-primary-foreground'
    : 'text-foreground';

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn(
        'rounded-xl flex items-center justify-center',
        sizes[size].icon,
        iconColors
      )}>
        {/* Custom Dayflow Logo - Clock with flow lines */}
        <svg 
          viewBox="0 0 40 40" 
          fill="none" 
          className="w-2/3 h-2/3"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle */}
          <circle 
            cx="20" 
            cy="20" 
            r="16" 
            stroke="currentColor" 
            strokeWidth="2.5"
            fill="none"
          />
          {/* Clock hands */}
          <path 
            d="M20 12V20L26 24" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Flow dots */}
          <circle cx="8" cy="20" r="2" fill="currentColor" />
          <circle cx="32" cy="20" r="2" fill="currentColor" />
        </svg>
      </div>
      {showText && (
        <span className={cn(
          'font-heading font-bold tracking-tight',
          sizes[size].text,
          textColors
        )}>
          Dayflow
        </span>
      )}
    </div>
  );
};

export default DayflowLogo;
