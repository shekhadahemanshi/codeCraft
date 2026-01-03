import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Plane, Circle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockEmployees, getCurrentUser } from '@/data/mockData';
import { Employee } from '@/types/employee';
import { cn } from '@/lib/utils';

const StatusIcon = ({ status }: { status: Employee['status'] }) => {
  switch (status) {
    case 'in-office':
      return (
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-card flex items-center justify-center">
          <Circle className="w-2 h-2 fill-success-foreground text-success-foreground" />
        </div>
      );
    case 'on-leave':
      return (
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-card flex items-center justify-center">
          <Plane className="w-2 h-2 text-primary-foreground" />
        </div>
      );
    case 'absent':
      return (
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-warning rounded-full border-2 border-card flex items-center justify-center">
          <span className="text-[8px] font-bold text-warning-foreground">!</span>
        </div>
      );
    default:
      return null;
  }
};

const EmployeeCard = ({ employee, onClick }: { employee: Employee; onClick: () => void }) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-medium transition-all duration-200 hover:-translate-y-1"
      onClick={onClick}
    >
      
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar with Status */}
          <div className="relative">
            <Avatar className="h-14 w-14">
              <AvatarImage src={employee.profilePicture} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
                {employee.firstName[0]}{employee.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <StatusIcon status={employee.status} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-foreground truncate">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{employee.designation}</p>
            <p className="text-xs text-muted-foreground mt-1">{employee.department}</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Login ID:</span>
            <p className="font-mono font-medium text-foreground truncate">{employee.loginId}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Location:</span>
            <p className="font-medium text-foreground">{employee.location}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin';

  const filteredEmployees = mockEmployees.filter(emp => 
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.loginId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusCounts = {
    inOffice: mockEmployees.filter(e => e.status === 'in-office').length,
    onLeave: mockEmployees.filter(e => e.status === 'on-leave').length,
    absent: mockEmployees.filter(e => e.status === 'absent').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Employees</h1>
            <p className="text-muted-foreground">Manage your team members</p>
          </div>

          {isAdmin && (
            <Button onClick={() => navigate('/signup')} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Employee
            </Button>
          )}
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-success/10 border-success/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                <Circle className="w-4 h-4 fill-success text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{statusCounts.inOffice}</p>
                <p className="text-xs text-muted-foreground">In Office</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Plane className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{statusCounts.onLeave}</p>
                <p className="text-xs text-muted-foreground">On Leave</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-warning/10 border-warning/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                <span className="text-warning font-bold">!</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{statusCounts.absent}</p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map(employee => (
            <EmployeeCard 
              key={employee.id} 
              employee={employee}
              onClick={() => navigate(`/employee/${employee.id}`)}
            />
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No employees found matching your search.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
