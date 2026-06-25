import { gql } from "@apollo/client";

// Introspection query to discover available queries
export const INTROSPECTION_QUERY = gql`
  query IntrospectionQuery {
    __schema {
      queryType {
        fields {
          name
          description
        }
      }
    }
  }
`;

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

// Alternative query names (uncomment and try if 'me' doesn't work)
export const CURRENT_USER_QUERY = gql`
  query currentUser {
    currentUser {
      id
      rcno
      fullName
      email
      division
      divisionId
      divisionCode
      phoneMobile
      phoneOffice
    }
  }
`;

export const USER_QUERY = gql`
  query user {
    user {
      id
      rcno
      fullName
      email
      division
      divisionId
      divisionCode
      phoneMobile
      phoneOffice
    }
  }
`;

export const PROFILE_QUERY = gql`
  query profile {
    profile {
      id
      rcno
      fullName
      email
      division
      divisionId
      divisionCode
      phoneMobile
      phoneOffice
    }
  }
`;