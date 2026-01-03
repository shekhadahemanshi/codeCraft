import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, Building2, User, Mail, Phone, Lock, 
  Upload, RefreshCw, Copy, Check, ArrowRight, X, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/auth/AuthLayout';
import DayflowLogo from '@/components/DayflowLogo';
import { toast } from '@/hooks/use-toast';
import { 
  generateLoginId, 
  generatePassword, 
  isValidEmail, 
  isValidPhone,
  validatePassword 
} from '@/lib/authUtils';

const SignUp = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyLogo: null as File | null,
  });
  
  const [generatedLoginId, setGeneratedLoginId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formData.companyName && formData.firstName && formData.lastName) {
      const loginId = generateLoginId(
        formData.companyName,
        formData.firstName,
        formData.lastName,
        1
      );
      setGeneratedLoginId(loginId);
    } else {
      setGeneratedLoginId('');
    }
  }, [formData.companyName, formData.firstName, formData.lastName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Company logo must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setFormData(prev => ({ ...prev, companyLogo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, companyLogo: null }));
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setFormData(prev => ({ 
      ...prev, 
      password: newPassword,
      confirmPassword: newPassword 
    }));
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '', confirmPassword: '' }));
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message;
      }
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      
      toast({
        title: "Employee Account Created",
        description: `Login ID: ${generatedLoginId}. An email has been sent with login credentials.`,
      });
      
      navigate('/signin');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center gap-2 mb-6">
        <DayflowLogo size="md" />
      </div>

      {/* Admin Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
        <Shield className="w-4 h-4" />
        HR/Admin Portal
      </div>

      {/* Form Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Create Employee Account</h2>
        <p className="text-muted-foreground">Register a new employee in the system</p>
      </div>

      {/* Sign Up Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Logo Upload */}
        <div className="space-y-2">
          <Label>Company Logo</Label>
          <div className="flex items-center gap-4">
            {logoPreview ? (
              <div className="relative">
                <div className="w-16 h-16 rounded-lg border border-border overflow-hidden bg-muted">
                  <img 
                    src={logoPreview} 
                    alt="Company logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors flex items-center justify-center bg-muted/50"
              >
                <Upload className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <p className="text-sm text-muted-foreground">
                Upload company logo (PNG, JPG up to 5MB)
              </p>
            </div>
          </div>
        </div>

        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            name="companyName"
            placeholder="Enter company name"
            value={formData.companyName}
            onChange={handleChange}
            icon={<Building2 className="w-4 h-4" />}
            error={!!errors.companyName}
            disabled={isLoading}
          />
          {errors.companyName && (
            <p className="text-sm text-destructive">{errors.companyName}</p>
          )}
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              icon={<User className="w-4 h-4" />}
              error={!!errors.firstName}
              disabled={isLoading}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              disabled={isLoading}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Generated Login ID */}
        {generatedLoginId && (
          <div className="space-y-2">
            <Label>Generated Login ID</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-11 px-4 rounded-lg border border-border bg-muted flex items-center justify-between">
                <span className="font-mono font-medium text-foreground">{generatedLoginId}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(generatedLoginId, 'Login ID')}
              >
                {copiedField === 'Login ID' ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Format: 2-Company + 2-First + 2-Last + Year + Serial
            </p>
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email ID</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="employee@company.com"
            value={formData.email}
            onChange={handleChange}
            icon={<Mail className="w-4 h-4" />}
            error={!!errors.email}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="10-digit phone number"
            value={formData.phone}
            onChange={handleChange}
            icon={<Phone className="w-4 h-4" />}
            error={!!errors.phone}
            disabled={isLoading}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleGeneratePassword}
              className="h-auto py-1 px-2 text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Auto-generate
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
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
            {formData.password && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(formData.password, 'Password')}
              >
                {copiedField === 'Password' ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            icon={<Lock className="w-4 h-4" />}
            error={!!errors.confirmPassword}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          variant="hero" 
          size="lg" 
          className="w-full mt-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Creating Account...
            </div>
          ) : (
            <>
              Create Employee Account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      {/* Sign In Link */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Need to sign in?{' '}
        <Link to="/signin" className="text-primary hover:underline font-medium">
          Go to Sign In
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignUp;
