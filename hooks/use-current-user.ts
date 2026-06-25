import { aa2Client } from "@/api/aa2Client";
import { apsClient } from "@/api/apsClient";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import { useEffect } from "react";
import { ME_QUERY } from "./use-me";

export type GetUserQuery = {
  employeeWithUUIDRaw: {
    id: number;
    name: string;
    division: string;
    isProxy: boolean;
    isApprover: boolean;
    isManager: boolean;
    hasDashboardAccess: boolean;
    isSiteAdmin: boolean;
    levelGrade: string | number;
    isBigOne: boolean;
    odi_team: string | null;
    odi_team_position: string | null;
    roles: { role_id: number }[];
    workflows: {
      id: number;
      type_id: number;
      workflow_id: number;
    }[];
  };
};

type GetUserVars = {};

export const GET_USER_QUERY: TypedDocumentNode<
  GetUserQuery,
  GetUserVars
> = gql`
  query getUser {
    employeeWithUUIDRaw {
      id
      name
      division
      isProxy
      isApprover
      isManager
      hasDashboardAccess
      isSiteAdmin
      levelGrade
      roles {
        role_id
      }
      workflows {
        id
        type_id
        workflow_id
      }
      isBigOne
      odi_team
      odi_team_position
    }
  }
`;

export function useCurrentUser({
  setUser,
  setAppLoading,
  setLoggedOut,
  logout,
  router,
}: any) {

  const { data, loading, error, refetch } = useQuery(GET_USER_QUERY, {
    client: apsClient,
    fetchPolicy: "cache-first",
  });

  const user = data?.employeeWithUUIDRaw;

  const [fetchMe, { data: meData, loading: meLoading, error: meError }] = useLazyQuery(ME_QUERY, {
    client: aa2Client,
    fetchPolicy: "cache-and-network",
  });

  // Set user in context when fetched
  useEffect(() => {

    if (!user) return;

    console.log('useCurrentUser.user', user?.id, user?.name, user?.division);

    setUser((prev: any) => ({
      ...prev,
      id: user.id,
      name: user.name,
      division: user.division,
      isApprover: user.isApprover,
      isManager: user.isManager,
      isProxy: user.isProxy || [5291, 5669].includes(user.id),
      hasDashboardAccess: user.hasDashboardAccess,
      isSiteAdmin: user.isSiteAdmin,
      levelGrade: user.levelGrade,
      roles: user.roles?.map((r: any) => r.role_id),
      workflows: user.workflows,
      isBigOne: user.isBigOne,
      odi_team: user.odi_team,
      odi_team_position: user.odi_team_position,
    }));

    fetchMe();

    setAppLoading(false);
    setLoggedOut(false);
  }, [user]);

  useEffect(() => {
    if (meData?.me) {

      console.log('useCurrentUser.meData', meData?.me?.id, meData?.me?.fullName, meData?.me?.rcno);

      setUser((prev: any) => ({
        ...prev,
        ...meData.me,
        id: prev.id,
        permissions: meData.me.permissions,
      }));
    }

  }, [meData])

  // Handle errors (e.g. token expired, user not found, etc.)
  useEffect(() => {
    if (!error) return;

    const message = (error as any)?.graphQLErrors?.[0]?.message;

    if (message === "User not found.") {
      logout();
      return;
    }

    router.replace("/(auth)/login");

    setLoggedOut(true);
    setAppLoading(false);
  }, [error]);

  return {
    // user,
    loading: loading || meLoading,
    error,
    refetch,
  };
}