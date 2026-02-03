'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogIn, UserPlus, LogOut, ShoppingBag } from 'lucide-react';
import { LoginModal } from '@/components/LoginModal';
import Link from 'next/link';

interface UserDropdownProps {
  className?: string;
}

export function UserDropdown({ className = '' }: UserDropdownProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const { toast } = useToast();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<'login' | 'register'>('login');

  const handleLogout = () => {
    logout();
    toast({
      title: 'Wylogowano',
      description: 'Do zobaczenia!',
    });
  };

  // Helper do pobierania inicjalow
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={className}>
            {isAuthenticated && user ? (
              <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                {getInitials(user.name)}
              </div>
            ) : (
              <User className="h-5 w-5" />
            )}
            <span className="sr-only">Konto</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          {isAuthenticated && user ? (
            <>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profil/zamowienia">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Moje zamowienia
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Wyloguj sie
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuLabel>Konto klienta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                setModalInitialTab('login');
                setLoginModalOpen(true);
              }}>
                <LogIn className="mr-2 h-4 w-4" />
                Zaloguj sie
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setModalInitialTab('register');
                setLoginModalOpen(true);
              }}>
                <UserPlus className="mr-2 h-4 w-4" />
                Zaloz konto
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <LoginModal 
        open={loginModalOpen} 
        onOpenChange={setLoginModalOpen}
        initialTab={modalInitialTab}
      />
    </>
  );
}
