import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, MapPin, Calendar, Building2,
  User, FileText, Lock, DollarSign, Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockEmployees, getCurrentUser } from '@/data/mockData';
import { cn } from '@/lib/utils';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin';
  
  const employee = mockEmployees.find(e => e.id === id);
  
  if (!employee) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Employee not found.</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Employees
        </Button>

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={employee.profilePicture} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {employee.firstName[0]}{employee.lastName[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h1 className="text-2xl font-heading font-bold text-foreground">
                    {employee.firstName} {employee.lastName}
                  </h1>
                  <Badge variant={
                    employee.status === 'in-office' ? 'default' :
                    employee.status === 'on-leave' ? 'secondary' : 'destructive'
                  }>
                    {employee.status === 'in-office' ? 'In Office' :
                     employee.status === 'on-leave' ? 'On Leave' : 'Absent'}
                  </Badge>
                </div>

                <p className="text-lg text-muted-foreground mb-4">{employee.designation}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span>{employee.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{employee.location}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Login ID</p>
                <p className="font-mono font-medium text-foreground">{employee.loginId}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="resume" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="resume" className="gap-2">
              <FileText className="w-4 h-4" />
              Resume
            </TabsTrigger>
            <TabsTrigger value="private" className="gap-2">
              <User className="w-4 h-4" />
              Private Info
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="salary" className="gap-2">
                <DollarSign className="w-4 h-4" />
                Salary Info
              </TabsTrigger>
            )}
            <TabsTrigger value="security" className="gap-2">
              <Lock className="w-4 h-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Resume Tab */}
          <TabsContent value="resume">
            <div className="grid gap-6">
              {employee.about && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-heading">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{employee.about}</p>
                  </CardContent>
                </Card>
              )}

              {employee.whatILoveAboutJob && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-heading">What I Love About My Job</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{employee.whatILoveAboutJob}</p>
                  </CardContent>
                </Card>
              )}

              {employee.interests && employee.interests.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-heading">Interests & Hobbies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {employee.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary">{interest}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {employee.skills && employee.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-heading">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {employee.skills.map((skill, index) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {employee.certifications && employee.certifications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-heading">Certifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {employee.certifications.map((cert, index) => (
                        <li key={index}>{cert}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Private Info Tab */}
          <TabsContent value="private">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heading">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoRow label="Date of Birth" value={employee.dateOfBirth || '-'} />
                  <InfoRow label="Gender" value={employee.gender || '-'} />
                  <InfoRow label="Nationality" value={employee.nationality || '-'} />
                  <InfoRow label="Marital Status" value={employee.maritalStatus || '-'} />
                  <InfoRow label="Email" value={employee.email} />
                  <InfoRow label="Address" value={employee.address || '-'} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heading">Employment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoRow label="Employee Code" value={employee.employeeCode || '-'} />
                  <InfoRow label="Date of Joining" value={employee.dateOfJoining} />
                  <InfoRow label="Department" value={employee.department} />
                  <InfoRow label="Designation" value={employee.designation} />
                  <InfoRow label="Manager" value={employee.manager} />
                  <InfoRow label="Location" value={employee.location} />
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg font-heading">Bank Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoRow label="Bank Name" value={employee.bankName || '-'} />
                    <InfoRow label="Account Number" value={employee.accountNumber || '-'} />
                    <InfoRow label="IFSC Code" value={employee.ifscCode || '-'} />
                    <InfoRow label="PAN Number" value={employee.panNumber || '-'} />
                    <InfoRow label="UAN Number" value={employee.uanNumber || '-'} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Salary Tab (Admin Only) */}
          {isAdmin && (
            <TabsContent value="salary">
              {employee.salary ? (
                <div className="grid gap-6">
                  {/* Wage Overview */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground mb-1">Monthly Wage</p>
                        <p className="text-3xl font-bold text-primary">
                          {formatCurrency(employee.salary.monthlyWage)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-success/5 border-success/20">
                      <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground mb-1">Yearly Wage</p>
                        <p className="text-3xl font-bold text-success">
                          {formatCurrency(employee.salary.yearlyWage)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Salary Components */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-heading">Salary Components</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SalaryRow 
                          label="Basic Salary" 
                          value={formatCurrency(employee.salary.basicSalary)}
                          description="50% of monthly wage"
                        />
                        <SalaryRow 
                          label="HRA" 
                          value={formatCurrency(employee.salary.hra)}
                          description="50% of basic salary"
                        />
                        <SalaryRow 
                          label="Standard Allowance" 
                          value={formatCurrency(employee.salary.standardAllowance)}
                          description="Fixed amount"
                        />
                        <SalaryRow 
                          label="Performance Bonus" 
                          value={formatCurrency(employee.salary.performanceBonus)}
                          description="% of basic salary"
                        />
                        <SalaryRow 
                          label="LTA" 
                          value={formatCurrency(employee.salary.lta)}
                          description="% of basic salary"
                        />
                        <SalaryRow 
                          label="Fixed Allowance" 
                          value={formatCurrency(employee.salary.fixedAllowance)}
                          description="Remaining portion"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Deductions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-heading">Deductions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SalaryRow 
                          label="Employee PF" 
                          value={formatCurrency(employee.salary.employeePF)}
                          description="12% of basic"
                          isDeduction
                        />
                        <SalaryRow 
                          label="Employer PF" 
                          value={formatCurrency(employee.salary.employerPF)}
                          description="12% of basic"
                        />
                        <SalaryRow 
                          label="Professional Tax" 
                          value={formatCurrency(employee.salary.professionalTax)}
                          description="Monthly deduction"
                          isDeduction
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Working Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-heading">Working Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <InfoRow label="Total Working Days" value={`${employee.salary.workingDays} days/month`} />
                        <InfoRow label="Break Time" value={`${employee.salary.breakTimeHrs} hour/day`} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    Salary information not available.
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-heading">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div>
                    <p className="font-medium text-foreground">Change Password</p>
                    <p className="text-sm text-muted-foreground">Update your account password</p>
                  </div>
                  <Button variant="outline">Change</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className="font-medium text-foreground">{value}</p>
  </div>
);

const SalaryRow = ({ 
  label, 
  value, 
  description,
  isDeduction = false 
}: { 
  label: string; 
  value: string; 
  description: string;
  isDeduction?: boolean;
}) => (
  <div className={cn(
    "p-4 rounded-lg",
    isDeduction ? "bg-destructive/5" : "bg-muted"
  )}>
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className={cn(
      "text-lg font-bold",
      isDeduction ? "text-destructive" : "text-foreground"
    )}>
      {isDeduction ? `-${value}` : value}
    </p>
    <p className="text-xs text-muted-foreground mt-1">{description}</p>
  </div>
);

export default EmployeeProfile;
