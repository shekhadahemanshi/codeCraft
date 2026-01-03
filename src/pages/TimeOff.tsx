import { useState } from 'react';
import { format } from 'date-fns';
import { 
  Plus, Search, Check, X, Calendar as CalendarIcon,
  Upload, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockTimeOffRequests, mockTimeOffBalance, getCurrentUser } from '@/data/mockData';
import { TimeOffRequest } from '@/types/employee';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const TimeOff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requests, setRequests] = useState<TimeOffRequest[]>(mockTimeOffRequests);
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin';

  // Form state
  const [formData, setFormData] = useState({
    type: '' as 'paid' | 'sick' | 'unpaid' | '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    remarks: '',
  });

  const filteredRequests = requests.filter(req =>
    req.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: TimeOffRequest['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success text-success-foreground">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: TimeOffRequest['type']) => {
    switch (type) {
      case 'paid':
        return <Badge variant="outline" className="border-primary text-primary">Paid Leave</Badge>;
      case 'sick':
        return <Badge variant="outline" className="border-destructive text-destructive">Sick Leave</Badge>;
      case 'unpaid':
        return <Badge variant="outline" className="border-muted-foreground text-muted-foreground">Unpaid Leave</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'approved' as const } : req
    ));
    toast({
      title: "Request Approved",
      description: "The time off request has been approved.",
    });
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'rejected' as const } : req
    ));
    toast({
      title: "Request Rejected",
      description: "The time off request has been rejected.",
    });
  };

  const handleSubmitRequest = () => {
    if (!formData.type || !formData.startDate || !formData.endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newRequest: TimeOffRequest = {
      id: String(requests.length + 1),
      employeeId: '1',
      employeeName: user?.name || 'John Anderson',
      type: formData.type,
      startDate: format(formData.startDate, 'yyyy-MM-dd'),
      endDate: format(formData.endDate, 'yyyy-MM-dd'),
      status: 'pending',
      remarks: formData.remarks,
    };

    setRequests(prev => [...prev, newRequest]);
    setIsDialogOpen(false);
    setFormData({ type: '', startDate: undefined, endDate: undefined, remarks: '' });
    
    toast({
      title: "Request Submitted",
      description: "Your time off request has been submitted for approval.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Time Off</h1>
            <p className="text-muted-foreground">
              {isAdmin ? 'Manage employee time off requests' : 'Request and view your time off'}
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="font-heading">Request Time Off</DialogTitle>
                <DialogDescription>
                  Submit a new time off request for approval.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Time Off Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: 'paid' | 'sick' | 'unpaid') => 
                      setFormData(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid Time Off</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? format(formData.startDate, "PPP") : "Pick date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? format(formData.endDate, "PPP") : "Pick date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Remarks (Optional)</Label>
                  <Textarea
                    placeholder="Add any additional notes..."
                    value={formData.remarks}
                    onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                  />
                </div>

                {formData.type === 'sick' && (
                  <div className="space-y-2">
                    <Label>Attachment (For sick leave)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Upload medical certificate (optional)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Discard
                </Button>
                <Button onClick={handleSubmitRequest}>
                  Submit Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Leave Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Paid Time Off</p>
                  <p className="text-3xl font-bold text-primary">{mockTimeOffBalance.paidLeave}</p>
                  <p className="text-xs text-muted-foreground">days available</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sick Leave</p>
                  <p className="text-3xl font-bold text-destructive">{mockTimeOffBalance.sickLeave}</p>
                  <p className="text-xs text-muted-foreground">days available</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unpaid Leave</p>
                  <p className="text-3xl font-bold text-foreground">{mockTimeOffBalance.unpaidLeave}</p>
                  <p className="text-xs text-muted-foreground">days available</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-foreground">{request.employeeName}</h3>
                      {getTypeBadge(request.type)}
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>{format(new Date(request.startDate), 'MMM d, yyyy')}</span>
                      <span className="mx-2">→</span>
                      <span>{format(new Date(request.endDate), 'MMM d, yyyy')}</span>
                    </div>
                    {request.remarks && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        "{request.remarks}"
                      </p>
                    )}
                  </div>

                  {isAdmin && request.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-success border-success hover:bg-success/10"
                        onClick={() => handleApprove(request.id)}
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-destructive border-destructive hover:bg-destructive/10"
                        onClick={() => handleReject(request.id)}
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredRequests.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No time off requests found.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TimeOff;
