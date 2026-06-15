import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useQuery } from "@apollo/client/react";


import { User } from "@/models/User.model";
import { aa2Client } from "@/services/aa2Client";
import { clearToken, getToken } from "@/storage/secureStore";
import { gql } from "@apollo/client";
import { useRouter } from "expo-router";
import { Alert, Linking } from "react-native";

// Try common alternatives for current user query
export const ME_QUERY = gql`
  query me {
    me {
      id
      rcno
      fullName
      email
      division
      divisionId
      divisionCode
      phoneMobile
      phoneOffice
      # ...UserFields
      # permissions
    }
  }
`;


interface AuthContextType {
  initialized: boolean;
  loading: boolean;
  authenticated: boolean;
  user: User | null;
  refreshUser: () => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  const router = useRouter();

  const [initialized, setInitialized] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const x = async () => {
      await clearToken()
    }

    // x();
  }, [])

  /**
   * Load token once on app startup
   */
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedToken = await getToken();

        setToken(storedToken);
      } finally {
        setInitialized(true);
      }
    };

    bootstrap();
  }, []);

  /**
   * Fetch current user
   */
  const { data, loading: userLoading, error, refetch } = useQuery<{ me: User }>(ME_QUERY, {
    client: aa2Client,
    skip: !token,
    fetchPolicy: "cache-and-network",
    errorPolicy: "none",
  });

  useEffect(() => {

    // console.log('data', data?.me?.fullName)

  }, [data, error]);

  /**
   * Invalid / expired token
   */
  useEffect(() => {
    if (!error) return;

    const handleAuthError = async () => {
      console.log("[Auth] ME query failed", error);
      Alert.alert("Authentication Error", "Your session has expired. Please log in again.");

      await clearToken();

      setToken(null);
    };

    handleAuthError();
  }, [error]);

  const logout = async () => {
    await clearToken();

    const logoutUrl = "https://id.mtcc.com.mv/logout/?returnUrl=https://my.mtcc.com.mv&type=employee&appId=9434025C-F2F3-4D93-B974-16743962AE46";

    await Linking.openURL(logoutUrl);

    router.replace("/(auth)/login");
  };

  const value = useMemo<AuthContextType>(
    () => ({
      initialized,
      loading: !initialized || (!!token && userLoading),
      authenticated: !!token && !!data?.me,
      user: data?.me ?? null,
      refreshUser: refetch,
      logout,
    }),
    [
      initialized,
      token,
      userLoading,
      data,
      refetch,
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