import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/auth/AuthLayout';
import DayflowLogo from '@/components/DayflowLogo';
import { toast } from '@/hooks/use-toast';

const SignIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.loginId.trim()) {
      newErrors.loginId = 'Login ID is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Integrate with FastAPI backend
      // Simulate role detection - in production this comes from backend
      const isAdmin = formData.loginId.toLowerCase().includes('admin') || 
                      formData.loginId.toLowerCase().includes('hr');
      
      // Store mock user data
      localStorage.setItem('dayflow_user', JSON.stringify({
        loginId: formData.loginId,
        role: isAdmin ? 'admin' : 'employee',
        name: 'John Doe',
        email: 'john.doe@company.com',
      }));
      
      toast({
        title: "Login Successful",
        description: "Welcome back to Dayflow HRMS",
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <DayflowLogo size="md" />
      </div>

      {/* Form Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Welcome back</h2>
        <p className="text-muted-foreground">Sign in to your account to continue</p>
      </div>

      {/* Sign In Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Login ID */}
        <div className="space-y-2">
          <Label htmlFor="loginId">Login ID</Label>
          <Input
            id="loginId"
            name="loginId"
            placeholder="e.g., DAJOHA20240001"
            value={formData.loginId}
            onChange={handleChange}
            icon={<User className="w-4 h-4" />}
            error={!!errors.loginId}
            disabled={isLoading}
          />
          {errors.loginId && (
            <p className="text-sm text-destructive">{errors.loginId}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link 
              to="/forgot-password" 
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              icon={<Lock className="w-4 h-4" />}
              error={!!errors.password}
              disabled={isLoading}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          variant="hero" 
          size="lg" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Signing in...
            </div>
          ) : (
            <>
              Sign In
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      {/* HR/Admin Notice */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/50">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-foreground font-medium">HR/Admin Access</p>
            <p className="text-sm text-muted-foreground mt-1">
              Need to create employee accounts?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Access Admin Portal →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
