import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";


import { useCurrentUser } from "@/hooks/use-current-user";
import { User } from "@/models/User.model";
import { clearToken, getToken } from "@/storage/secureStore";
import { useRouter } from "expo-router";


interface AuthContextType {
  initializingToken: boolean;
  loading: boolean;
  token: string | null;
  setToken: (token: string | null) => void;
  ready: boolean;
  user: User | null;
  logout: () => Promise<void>;
}

// MARK: - Auth Context

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  // const [initialized, setInitialized] = useState(false);
  const [token, setToken] = useState<string | null>(null); // set by login
  const [user, setUser] = useState<User | null>(null); // set by useCurrentUser
  const [initializingToken, setInitializingToken] = useState(true); // set by bootstrap

  // const [appLoading, setAppLoading] = useState(true);

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout = async () => {
    await clearToken();

    setToken(null);
    setUser(null);

    router.replace("/(auth)/logout");
  };

  // -----------------------------
  // LOAD TOKEN
  // -----------------------------
  useEffect(() => {

    const bootstrap = async () => {
      setInitializingToken(true);
      const storedToken = await getToken();
      setToken(storedToken);
      setInitializingToken(false);
    };

    // In case of user being already logged in but cold start app
    if (!token) {
      bootstrap();
    }

  }, []);

  // -----------------------------
  // FETCH USER (only if token exists)
  // -----------------------------
  const {
    loading: userLoading,
    error: userError,
  } = useCurrentUser({
    skip: !token,
    setUser,
    logout,
    router,
  });

  // -----------------------------
  const ready = useMemo(() => {
    if (!token) return true; // no auth needed → ready to go login

    return !!token && !userLoading && user !== undefined;
  }, [token, userLoading, user]);

  // -----------------------------
  // CONTEXT VALUE
  // -----------------------------
  const value = useMemo<AuthContextType>(() => ({
    initializingToken,
    loading: userLoading,
    ready,
    token,
    setToken,
    user,
    logout,
  }), [
    initializingToken,
    ready,
    token,
    user,
    userLoading,
  ]);

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