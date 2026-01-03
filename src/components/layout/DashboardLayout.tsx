import { ReactNode, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { toast } from '@/hooks/use-toast';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const handleCheckInOut = () => {
    setIsCheckedIn(!isCheckedIn);
    toast({
      title: isCheckedIn ? "Checked Out" : "Checked In",
      description: isCheckedIn 
        ? "You have successfully checked out for the day." 
        : "You have successfully checked in. Have a great day!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isCheckedIn={isCheckedIn} onCheckInOut={handleCheckInOut} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
