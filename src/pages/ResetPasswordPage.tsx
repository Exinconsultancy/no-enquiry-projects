import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidLink, setIsValidLink] = useState(false);
  const [isCheckingLink, setIsCheckingLink] = useState(true);
  const [resetComplete, setResetComplete] = useState(false);

  useEffect(() => {
    const checkResetLink = async () => {
      try {
        // Check if this is a password reset link
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');
        
        console.log('Reset link params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
        
        // Check for hash-based parameters (Supabase often uses hash)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hashAccessToken = hashParams.get('access_token');
        const hashRefreshToken = hashParams.get('refresh_token');
        const hashType = hashParams.get('type');
        
        const finalAccessToken = accessToken || hashAccessToken;
        const finalRefreshToken = refreshToken || hashRefreshToken;
        const finalType = type || hashType;
        
        console.log('Final params:', { finalAccessToken: !!finalAccessToken, finalRefreshToken: !!finalRefreshToken, finalType });
        
        if (!finalAccessToken || !finalRefreshToken || finalType !== 'recovery') {
          throw new Error('Invalid reset link parameters');
        }

        // Set the session using the tokens
        const { data, error } = await supabase.auth.setSession({
          access_token: finalAccessToken,
          refresh_token: finalRefreshToken
        });

        if (error) {
          console.error('Session error:', error);
          throw new Error(`Failed to verify reset link: ${error.message}`);
        }

        console.log('Session set successfully:', data);
        setIsValidLink(true);
        
      } catch (error: any) {
        console.error('Reset link validation error:', error);
        toast({
          title: "Invalid Reset Link",
          description: "This password reset link is invalid, expired, or has already been used. Please request a new password reset.",
          variant: "destructive",
        });
        
        // Redirect to home after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } finally {
        setIsCheckingLink(false);
      }
    };

    checkResetLink();
  }, [searchParams, navigate, toast]);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(pwd)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(pwd)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(pwd)) {
      return "Password must contain at least one number";
    }
    if (!/(?=.*[!@#$%^&*])/.test(pwd)) {
      return "Password must contain at least one special character (!@#$%^&*)";
    }
    return null;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast({
        title: "Invalid Password",
        description: passwordError,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting to update password...');
      
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Password update error:', error);
        throw error;
      }

      console.log('Password updated successfully:', data);
      
      setResetComplete(true);
      
      toast({
        title: "Password Updated Successfully! ✅",
        description: "Your password has been reset. You can now login with your new password.",
      });

      // Auto redirect after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      let errorMessage = "Failed to update password. Please try again.";
      
      if (error.message?.includes('same as the old password')) {
        errorMessage = "New password must be different from your current password.";
      } else if (error.message?.includes('session')) {
        errorMessage = "Your reset session has expired. Please request a new password reset link.";
      }
      
      toast({
        title: "Reset Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center space-y-4">
              <Loader2 className="mx-auto h-8 w-8 animate-spin" />
              <p className="text-muted-foreground">Verifying reset link...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValidLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8 space-y-4">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
            <div>
              <h3 className="text-lg font-semibold">Invalid Reset Link</h3>
              <p className="text-sm text-muted-foreground mt-2">
                This password reset link is invalid, expired, or has already been used.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Redirecting to home page...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (resetComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8 space-y-4">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-700">Password Reset Complete!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your password has been successfully updated. You can now login with your new password.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Redirecting to home page...
              </p>
            </div>
            <Button onClick={() => navigate('/')} className="mt-4">
              Go to Home Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create New Password</CardTitle>
          <CardDescription>
            Enter your new password below. Make sure it's strong and secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be 8+ characters with uppercase, lowercase, number, and special character
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !password || !confirmPassword}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;