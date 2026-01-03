export interface Employee {
  id: string;
  loginId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  manager: string;
  location: string;
  profilePicture?: string;
  status: 'in-office' | 'on-leave' | 'absent';
  dateOfJoining: string;
  companyName: string;
  
  // Private Info
  dateOfBirth?: string;
  address?: string;
  nationality?: string;
  gender?: string;
  maritalStatus?: string;
  
  // Bank Details
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  panNumber?: string;
  uanNumber?: string;
  employeeCode?: string;
  
  // Resume/About
  about?: string;
  whatILoveAboutJob?: string;
  interests?: string[];
  skills?: string[];
  certifications?: string[];
  
  // Salary Info (Admin only)
  salary?: SalaryInfo;
}

export interface SalaryInfo {
  monthlyWage: number;
  yearlyWage: number;
  basicSalary: number;
  hra: number;
  standardAllowance: number;
  performanceBonus: number;
  lta: number;
  fixedAllowance: number;
  employeePF: number;
  employerPF: number;
  professionalTax: number;
  workingDays: number;
  breakTimeHrs: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  workHours?: number;
  extraHours?: number;
  status: 'present' | 'absent' | 'half-day' | 'leave';
}

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'paid' | 'sick' | 'unpaid';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  remarks?: string;
  attachment?: string;
}

export interface TimeOffBalance {
  paidLeave: number;
  sickLeave: number;
  unpaidLeave: number;
}

export interface User {
  loginId: string;
  role: 'admin' | 'employee';
  name: string;
  email: string;
  employeeId?: string;
}
