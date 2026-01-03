import { ReactNode } from 'react';
import DayflowLogo from '@/components/DayflowLogo';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 border border-primary-foreground/20 rounded-full" />
          <div className="absolute top-40 left-40 w-96 h-96 border border-primary-foreground/10 rounded-full" />
          <div className="absolute bottom-20 right-20 w-80 h-80 border border-primary-foreground/15 rounded-full" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-primary-foreground">
          <div className="animate-slide-up">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <DayflowLogo size="lg" variant="light" />
            </div>
            
            {/* Tagline */}
            <h1 className="text-4xl xl:text-5xl font-heading font-bold leading-tight mb-6">
              Every workday,<br />
              <span className="text-primary-foreground/80">perfectly aligned.</span>
            </h1>
            
            <p className="text-lg text-primary-foreground/70 max-w-md leading-relaxed">
              Streamline your HR operations with our comprehensive management system. 
              From attendance to payroll, we've got you covered.
            </p>
            
            {/* Features */}
            <div className="mt-12 space-y-4">
              {[
                'Employee Management',
                'Attendance Tracking',
                'Leave Management',
                'Payroll Integration'
              ].map((feature, index) => (
                <div 
                  key={feature}
                  className="flex items-center gap-3 text-primary-foreground/80"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
