import * as WebBrowser from "expo-web-browser";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";


import { APP_ID, SSO_URL } from "@/constants/app";
import { useCurrentUser } from "@/hooks/use-current-user";
import { User } from "@/models/User.model";
import { clearToken, getToken } from "@/storage/secureStore";
import { useRouter } from "expo-router";


interface AuthContextType {
  initialized: boolean;
  loading: boolean;
  authenticated: boolean;
  ready: boolean;
  user: User | null;
  refreshUser: () => Promise<any>;
  logout: () => Promise<void>;
}

// MARK: - Auth Context

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  const router = useRouter();

  const [initialized, setInitialized] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [appLoading, setAppLoading] = useState(true);
  const [loggedOut, setLoggedOut] = useState(false);

  const logout = async () => {
    await clearToken();
    setToken(null);
    setUser(null);

    router.dismissAll();

    router.replace("/(auth)/login");

    const logoutUrl =
      `${SSO_URL}/logout/?returnUrl=${SSO_URL}&type=employee&appId=${APP_ID}`;

    WebBrowser.openBrowserAsync(logoutUrl);
  };

  /**
   * Load token once on app startup
   */
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedToken = await getToken();

        setToken(storedToken);
        // console.log('Token loaded from secure storage:', storedToken);
      } finally {
        setInitialized(true);
      }
    };

    bootstrap();
  }, []);

  /**
   * Fetch user
   */
  const {
    loading: userLoading,
    error: userError,
    // refetch,
  } = useCurrentUser({
    setUser,
    setAppLoading,
    setLoggedOut,
    logout,
    router,
  });

  // console.log('authcontext.user', user?.id, user?.fullName, user?.rcno);

  const ready =
    initialized &&
    (!token || (!!token && !userLoading && !!user));

  const value = useMemo<AuthContextType>(
    () => ({
      initialized,
      loading: !initialized || (!!token && userLoading),
      ready,
      authenticated: !!token && !!user,
      user: user,
      refreshUser: async () => {
        // Placeholder for refreshUser function
      },
      logout,
    }),
    [
      initialized,
      token,
      userLoading,
      user,
      // refetch,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}