import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import CustomSpinner from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/use-theme-color';
import { gql, NetworkStatus, TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import WFHRequestItem from './WFHRequestItem';

export type WorkFromHomeSchedulesNodeType = {
  id: string;
  details: string;
  requestedFor: {
    full_name: string;
  };
  from_date: string;
  to_date: string;
  status: "Approved" | "Rejected" | "Cancelled" | "Pending";
}

type WorkFromHomeRequestsQuery = {
  workFromHomeSchedules: {
    pageData: {
      count: number;
      limit: number;
      offset: number;
    };
    page: {
      edges: {
        node: WorkFromHomeSchedulesNodeType;
        cursor: string;
      }[];
      pageInfo: {
        startCursor: string | null;
        endCursor: string | null;
      };
    };
  };
};

const WFH_REQUESTS_QUERY: TypedDocumentNode<WorkFromHomeRequestsQuery> = gql`
  query getWorkFromHomeSchedules(
    $first: Float
    $last: Float
    $after: String
    $before: String
    $filter: WorkFromHomeFilterInput!
  ) {
    workFromHomeSchedules(
      first: $first
      last: $last
      after: $after
      before: $before
      filter: $filter
    ) {
      pageData {
        count
        limit
        offset
      }
      page {
        edges {
          node {
            id
            details
            requestedFor {
              full_name
            }
            from_date
            to_date
            status
          }
          cursor
        }
        pageInfo {
          startCursor
          endCursor
        }
      }
    }
  }
`;

const WFHRequests = ({ inView }: { inView: boolean }) => {

  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuth();

  const { data, loading, error, refetch, networkStatus } = useQuery(WFH_REQUESTS_QUERY, {
    skip: !user || !inView,
    variables: {
      first: 10,
      filter: {
        employeeId: user?.id,
        status: null,
      }
    },
    notifyOnNetworkStatusChange: true,
  });

  const onPress = () => {
    router.push("/request-remote-attendance")
  }

  const isInitialLoading = loading && networkStatus === NetworkStatus.loading;

  return (
    <View style={styles.container}>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.primaryActive },
          pressed && styles.pressed,
        ]}
        onPress={onPress}
      >
        <Entypo name="plus" size={16} color={theme.text} />
        <Text style={{ color: theme.text, fontSize: 14 }}>
          Request
        </Text>
      </Pressable>

      {error && (
        <View style={{ padding: 20 }}>
          <ThemedText style={{ textAlign: 'center', color: '#666' }}>
            An error occurred while loading requests. Please try again.
          </ThemedText>
        </View>
      )}

      {/* Requests */}
      <View style={styles.requests}>

        {isInitialLoading ? (
          <View style={{ padding: 20 }}>
            <CustomSpinner size={36} />
          </View>
        ) : (
          <Animated.FlatList
            data={data?.workFromHomeSchedules.page.edges || []}
            keyExtractor={(item) => item.node.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
            ListHeaderComponent={() => (
              <Animated.View
                // entering={shouldAnimate ? HEADER_ENTERING : undefined}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: theme.textTertiary }}>
                  Remote Requests
                </Text>
              </Animated.View>
            )}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, marginVertical: 2 }} />
            )}
            renderItem={({ item, index }) => {
              const isLast =
                index === (data?.workFromHomeSchedules.page.edges.length || 1) - 1;

              return (
                <Animated.View
                // entering={false ? ITEM_ENTERING.delay(index * 50) : undefined}
                >
                  <WFHRequestItem
                    item={item.node}
                    isFirst={index === 0}
                    isLast={isLast}
                    theme={theme}
                  />
                </Animated.View>
              );
            }}
            ListEmptyComponent={() => (
              <Animated.View>
                <ThemedView style={{ padding: 20 }}>
                  <ThemedText style={{ textAlign: 'center', color: theme.textSecondary }}>
                    No records found for this period.
                  </ThemedText>
                </ThemedView>
              </Animated.View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={networkStatus === NetworkStatus.refetch}
                onRefresh={() => refetch()}
              />
            }
          />
        )}

      </View>

    </View>
  )
}

export default WFHRequests

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    alignSelf: "flex-end",
    marginBottom: 16,
  },

  pressed: {
    opacity: 0.75,
  },

  requests: {
    flex: 1,
  },
})