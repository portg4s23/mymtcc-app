import { aa2Client } from "@/api/aa2Client";
import { apsClient } from "@/api/apsClient";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
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
  skip,
  setUser,
  logout,
  router,
}: any) {

  const [loadingState, setLoadingState] = useState(true);

  const { data, error, refetch } = useQuery(GET_USER_QUERY, {
    skip,
    client: apsClient,
    fetchPolicy: "cache-first",
  });

  const [fetchMe] = useLazyQuery(ME_QUERY, {
    client: aa2Client,
    fetchPolicy: "cache-and-network",
  });

  // Set user in context when fetched
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoadingState(true);

        const user = data?.employeeWithUUIDRaw;

        if (!user) return;

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

        const result = await fetchMe();
        const me = result?.data?.me;

        if (me) {
          setUser((prev: any) => ({
            ...prev,
            ...me,
            id: prev.id,
            permissions: me.permissions,
          }));
        }

      } finally {
        setLoadingState(false);
      }
    };

    if (data?.employeeWithUUIDRaw) {
      loadUser();
    }
  }, [data]);


  // Handle errors (e.g. token expired, user not found, etc.)
  useEffect(() => {
    if (!error) return;

    const message = (error as any)?.graphQLErrors?.[0]?.message || (error as any)?.message;

    if (message === "Login expired") {
      // console.log('Token expired, logging out user')
      logout();
      return;
    }

  }, [error]);

  return {
    loading: loadingState,
    error,
    refetch,
  };
}