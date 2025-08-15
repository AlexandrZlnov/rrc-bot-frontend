import { Navigate } from 'react-router-dom';
import { tokens } from '../lib/storage';

export default function Protected({ children }: { children: React.ReactNode }) {
  const hasToken = !!tokens.access;
  if (!hasToken) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
