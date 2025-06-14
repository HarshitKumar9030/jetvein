'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { User, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function UserAuth() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User'}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
            {session.user?.name || session.user?.email}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut()}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign out</span>
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => signIn()}
      className="flex items-center gap-2"
    >
      <LogIn className="w-4 h-4" />
      Sign in
    </Button>
  );
}
