'use client';

import { AuthProvider } from '@/contexts/AuthContext';

export default function AuthClientProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
