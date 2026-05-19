'use client';

import { type ReactNode } from 'react';
import { WalletProvider } from '@/services/wallet';
import { I18nProvider } from '@/services/i18n';
import { ThemeProvider } from '@/services/theme';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <WalletProvider>{children}</WalletProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
