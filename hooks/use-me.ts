import { aa2Client } from "@/api/aa2Client";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

export type Me = {
  id: number;
  rcno: string;
  fullName: string;
  email: string;
  division: string;
  divisionId: number;
  divisionCode: string;
  phoneMobile?: string | null;
  phoneOffice?: string | null;
  permissions?: any
};

type MeQuery = {
  me: Me;
};

type MeVars = {};

export const ME_QUERY: TypedDocumentNode<MeQuery, MeVars> = gql`
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

type UseMeOptions = {
  token?: string | null;
};

export function useMe({ token }: UseMeOptions) {

  const { data, loading, error, refetch } = useQuery(ME_QUERY, {
    client: aa2Client,
    skip: !token,
    fetchPolicy: "cache-and-network",
  });

  return {
    me: data?.me ?? null,
    meLoading: loading,
    meError: error,
    meRefetch: refetch,
  };
}