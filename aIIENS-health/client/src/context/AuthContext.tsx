import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { AuthState, AuthUser } from '@/types';
import { setAccessToken } from '@/api/axiosInstance';
import { authApi } from '@/api/authApi';

interface AuthContextValue extends AuthState {
  login: (user: AuthUser, accessToken: string) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start in loading state
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to fetch me. If we have a valid refresh token cookie, the axios interceptor
        // will automatically get an access token and retry this request if it initially 401s.
        // We need to bypass the default 401 redirect behavior for the initial load though,
        // but since this is just getting /me, the interceptor redirect is acceptable.
        // Actually, the interceptor redirects to /login on failure.
        const data = await authApi.getMe();
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        // Not authenticated
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };
    initAuth();
  }, []);

  const login = useCallback((user: AuthUser, accessToken: string) => {
    setAccessToken(accessToken);
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore errors on logout
    }
    setAccessToken(null);
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const setUser = useCallback((user: AuthUser | null) => {
    setAuthState((prev) => ({
      ...prev,
      user,
      isAuthenticated: user !== null,
    }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

