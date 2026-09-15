import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ReactNode } from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { UserRole } from '@/types';

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  return (
    <ProtectedRoute>
      {/* We wait for loading to finish in ProtectedRoute, so if we're here and have no user, something is wrong */}
      {(!isLoading && user) && (
        allowedRoles.some((role) => user.roles.includes(role)) ? (
          <>{children}</>
        ) : (
          <Navigate to="/unauthorized" state={{ from: location }} replace />
        )
      )}
    </ProtectedRoute>
  );
}
