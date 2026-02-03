'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: 'login' | 'register';
}

export function LoginModal({ open, onOpenChange, initialTab = 'login' }: LoginModalProps) {
  const { loginUser, registerUser } = useAuth();
  const { toast } = useToast();

  // Active tab state
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Update active tab when modal opens or initialTab changes
  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  const resetForms = () => {
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
    setRegisterName('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterConfirmPassword('');
    setRegisterError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    const result = await loginUser(loginEmail, loginPassword);

    if (result.success) {
      toast({
        title: 'Zalogowano',
        description: 'Witaj ponownie!',
      });
      resetForms();
      onOpenChange(false);
    } else {
      setLoginError(result.error || 'Wystapil blad podczas logowania');
    }

    setLoginLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    // Validation
    if (registerPassword.length < 6) {
      setRegisterError('Haslo musi miec co najmniej 6 znakow');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('Hasla nie sa identyczne');
      return;
    }

    setRegisterLoading(true);

    const result = await registerUser(registerName, registerEmail, registerPassword);

    if (result.success) {
      toast({
        title: 'Konto utworzone',
        description: 'Witaj w WaterLife! Twoje konto zostalo utworzone.',
      });
      resetForms();
      onOpenChange(false);
    } else {
      setRegisterError(result.error || 'Wystapil blad podczas rejestracji');
    }

    setRegisterLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Konto klienta</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Logowanie</TabsTrigger>
            <TabsTrigger value="register">Rejestracja</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              {loginError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="jan@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={loginLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Haslo</Label>
                  <Link 
                    href="/reset-password"
                    onClick={() => onOpenChange(false)}
                    className="text-sm text-primary hover:underline"
                  >
                    Zapomniałeś hasła?
                  </Link>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="********"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={loginLoading}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loginLoading}>
                {loginLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logowanie...
                  </>
                ) : (
                  'Zaloguj sie'
                )}
              </Button>
            </form>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
              {registerError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{registerError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="register-name">Imie i nazwisko</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Jan Kowalski"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  disabled={registerLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="jan@example.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  disabled={registerLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Haslo</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Min. 6 znakow"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  disabled={registerLoading}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm">Powtorz haslo</Label>
                <Input
                  id="register-confirm"
                  type="password"
                  placeholder="********"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  disabled={registerLoading}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={registerLoading}>
                {registerLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rejestracja...
                  </>
                ) : (
                  'Zaloz konto'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
