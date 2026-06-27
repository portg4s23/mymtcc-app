import { getToken } from "@/storage/secureStore";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

// TODO: Replace with your actual API URL
const API_URL = "https://api-aps.mtcc.com.mv/graphql";

// console.log("[Apollo Client] Initializing with API URL:", API_URL);

const httpLink = createHttpLink({
  uri: API_URL,
  // Note: credentials "same-origin" doesn't work in React Native
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getToken();

  const newHeaders = {
    ...headers,
    authorization: token ? `Bearer ${token}` : "",
  };

  return {
    headers: newHeaders,
  };
});

const errorLink = onError((errorResponse) => {
  const { graphQLErrors, networkError, operation } = errorResponse as any;

  if (graphQLErrors) {
    graphQLErrors.forEach((error: any) =>
      console.log(
        `[GraphQL error]: Message: ${error.message}, Location: ${JSON.stringify(error.locations)}, Path: ${error.path}`
      )
    );
  }

  if (networkError) {
    console.log("[Network error]:", networkError);
    console.log("[Network error] Operation:", operation.operationName);
    console.log("[Network error] Variables:", JSON.stringify(operation.variables));
  }
});

export const apsClient = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          allPosts: {
            keyArgs: false,
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
});
