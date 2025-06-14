'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { Session } from 'next-auth';

interface ProvidersProps {
  children: ReactNode;
  session?: Session | null;
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
        storageKey="jetvein-theme"
        themes={['light', 'dark', 'system']}
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
