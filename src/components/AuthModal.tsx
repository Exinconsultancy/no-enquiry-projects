import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const { login, register, resetPassword } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ email: "", password: "", name: "" });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetCooldown, setResetCooldown] = useState(0);

  // Cooldown timer effect
  useEffect(() => {
    if (resetCooldown > 0) {
      const timer = setInterval(() => {
        setResetCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resetCooldown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(loginData.email, loginData.password);
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      onClose();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(registerData.email, registerData.password, registerData.name);
      toast({
        title: "Registration Successful! 📧",
        description: "Please check your email and click the verification link before logging in. Check your spam folder if you don't see it.",
      });
      onClose();
      onSuccess?.();
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail || !forgotPasswordEmail.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      await resetPassword(forgotPasswordEmail);
      
      setResetEmailSent(true);
      setResetCooldown(60); // Start 60 second cooldown
      
      toast({
        title: "Reset Email Sent Successfully! 📧",
        description: "Check your email inbox (and spam folder) for password reset instructions.",
      });
      
      // Clear the form
      setForgotPasswordEmail("");
      
    } catch (error: any) {
      console.error('Forgot password error:', error);
      
      // Handle rate limiting specifically
      if (error.message.includes('14 seconds') || error.message.includes('60 seconds')) {
        setResetCooldown(60);
        toast({
          title: "Too Many Requests",
          description: "Please wait 60 seconds before requesting another password reset.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Reset Failed",
          description: error.message || "Unable to send reset email. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Authentication Required</DialogTitle>
          <DialogDescription>
            Please login or create an account to access premium features.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            {!showForgotPassword ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="text-right">
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-sm text-primary hover:underline"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot Password?
                    </Button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                {!resetEmailSent ? (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold">Forgot your password?</h3>
                      <p className="text-sm text-muted-foreground">
                        Enter your email address and we'll send you a link to reset your password.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Email Address</Label>
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="Enter your email address"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading || !forgotPasswordEmail || resetCooldown > 0}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Reset Email...
                        </>
                      ) : resetCooldown > 0 ? (
                        `Wait ${resetCooldown}s before requesting again`
                      ) : (
                        "Send Reset Email"
                      )}
                    </Button>
                    
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-sm text-muted-foreground hover:underline"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setForgotPasswordEmail("");
                          setResetEmailSent(false);
                        }}
                        disabled={isLoading}
                      >
                        ← Back to Login
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-green-700">Email Sent Successfully!</h3>
                      <p className="text-sm text-muted-foreground">
                        We've sent a password reset link to your email address. 
                        Click the link in the email to reset your password.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Don't see the email? Check your spam folder.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setResetEmailSent(false);
                          setShowForgotPassword(false);
                          setForgotPasswordEmail("");
                        }}
                      >
                        Back to Login
                      </Button>
                      
                      <Button
                        variant="link"
                        className="w-full h-auto p-0 text-sm"
                        onClick={() => {
                          setResetEmailSent(false);
                          setForgotPasswordEmail("");
                        }}
                      >
                        Send to different email
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Full Name</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={registerData.name}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;