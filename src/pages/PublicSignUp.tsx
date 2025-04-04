import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from 'components/Logo';
import { EmailPasswordRegister } from 'components/EmailPasswordRegister';
import { Button } from '@/components/ui/button';

export default function PublicSignUp() {
  const navigate = useNavigate();
  
  // Scroll to top when page loads
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <div className="absolute inset-0 bg-black bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent,black)] z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black"></div>
      </div>
      
      {/* Gradient orbs */}
      <div className="absolute top-1/3 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl opacity-30"></div>
      
      <div className="mb-8 relative z-10">
        <Logo />
      </div>
      
      <Card className="w-full max-w-md border-border/40 bg-card/95 backdrop-blur relative z-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Sign up to access all PRSocials features
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <EmailPasswordRegister />
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Button 
              variant="link" 
              className="p-0 h-auto text-primary" 
              onClick={() => navigate('/public-login')}
            >
              Sign in
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full" 
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
