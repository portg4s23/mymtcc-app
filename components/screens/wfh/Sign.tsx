import { MonthPicker } from '@/components/shared/MonthPicker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import CustomSpinner from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';
import { getPayrollPeriod } from '@/helpers';
import { useTheme } from '@/hooks/use-theme-color';
import { hapticLight } from '@/utils/haptics';
import { gql } from '@apollo/client';
import { useLazyQuery } from '@apollo/client/react';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInUp
} from 'react-native-reanimated';
import ClockInOutHeader from './ClockInOutHeader';
import WFHHistoryItem from './WFHHistoryItem';

const WFH_HISTORY_QUERY = gql`
  query wfhHistory(
    $first: Float
    $last: Float
    $after: String
    $before: String
    $filter: ClockedInOutFilterInput!
  ) {
    clockedInOuts(
      first: $first
      last: $last
      after: $after
      before: $before
      filter: $filter
    ) {
      page {
        edges {
          node {
            id
            source
            checkTypeRevised {
              name
            }
            check_time
            processed
          }
          cursor
        }
        pageInfo {
          startCursor
          endCursor
        }
      }
      pageData {
        count
        limit
        offset
      }
    }
  }
`;

const ITEM_ENTERING = FadeInUp.duration(350);
const HEADER_ENTERING = FadeInUp.duration(300);

const SignTab = ({ inView }: { inView: boolean }) => {

  // State, Refs & Hooks

  const theme = useTheme();
  const { user } = useAuth()

  const pageLimit = 30;
  const source = "MyMTCC";


  // Animation Related
  const hasAnimatedRef = useRef(false);
  const [animateItems, setAnimateItems] = useState(false);

  const [month, setMonth] = useState(getPayrollPeriod(dayjs())[1]);
  const [pickerVisible, setPickerVisible] = useState(false)
  const [shouldAnimate, setShouldAnimate] = React.useState(true);

  // Queries & Mutations

  const [wfhHistory, { data, loading: loadingHistory, error: errorHistory }] = useLazyQuery<{
    clockedInOuts: {
      page: {
        edges: {
          node: {
            id: string;
            source: string;
            checkTypeRevised: {
              name: string;
            };
            check_time: string;
            processed: boolean;
          };
          cursor: string;
        }[];
        pageInfo: {
          startCursor: string;
          endCursor: string;
        };
      };
      pageData: {
        count: number;
        limit: number;
        offset: number;
      };
    };
  }>(WFH_HISTORY_QUERY, {
    fetchPolicy: 'cache-first',
  });

  // Effects

  useEffect(() => {
    if (!user) return;

    wfhHistory({
      variables: {
        first: pageLimit,
        filter: {
          employee_id: user?.id,
          start_date: getPayrollPeriod(month)[0],
          end_date: getPayrollPeriod(month)[1],
          source,
        },
      },
    });
  }, [user, month]);

  useEffect(() => {
    if (!data?.clockedInOuts.page.edges.length) return;

    if (hasAnimatedRef.current) return;

    hasAnimatedRef.current = true;
    setAnimateItems(true);
  }, [data]);

  // Handlers

  return (
    <ThemedView style={styles.container}>

      {/* Header */}
      <ClockInOutHeader
        month={month}
        refetchQueries={[
          {
            query: WFH_HISTORY_QUERY,
            variables: {
              first: pageLimit,
              filter: {
                employee_id: user?.id,
                start_date: getPayrollPeriod(month)[0],
                end_date: getPayrollPeriod(month)[1],
                source: source,
              },
            },
          },
        ]}
      />

      {errorHistory && (
        <View style={{ padding: 20 }}>
          <ThemedText style={{ textAlign: 'center', color: '#666' }}>
            An error occurred while loading history. Please try again.
          </ThemedText>
        </View>
      )}

      {/* History */}
      <View style={styles.history}>

        {loadingHistory ? (
          <View style={{ padding: 20 }}>
            <CustomSpinner size={36} />
          </View>
        ) : (
          <Animated.FlatList
            data={data?.clockedInOuts.page.edges || []}
            keyExtractor={(item) => item.node.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
            ListHeaderComponent={() => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: theme.textTertiary }}>
                  History
                </Text>

                <View>
                  <Pressable
                    onPress={() => {
                      hapticLight();
                      setPickerVisible(true);
                    }}
                    style={({ pressed }) => [
                      {
                        paddingVertical: 4,
                        paddingLeft: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                      },
                      pressed && { opacity: 0.75 },
                    ]}
                  >
                    <Text style={{ color: theme.primary }}>
                      {dayjs(month).format('MMMM YYYY')}
                    </Text>
                  </Pressable>

                  <MonthPicker
                    visible={pickerVisible}
                    value={month}
                    onCancel={() => setPickerVisible(false)}
                    onOk={(value) => {
                      setMonth(value);
                      setPickerVisible(false);
                    }}
                  />
                </View>
              </View>
            )}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, marginVertical: 2 }} />
            )}
            renderItem={({ item, index }) => {
              const isLast =
                index === (data?.clockedInOuts.page.edges.length || 1) - 1;

              return (
                <Animated.View
                  entering={false ? ITEM_ENTERING.delay(index * 50) : undefined}
                >
                  <WFHHistoryItem
                    item={item.node}
                    isFirst={index === 0}
                    isLast={isLast}
                    theme={theme}
                  />
                </Animated.View>
              );
            }}
            ListEmptyComponent={() => (
              <Animated.View entering={shouldAnimate ? FadeInUp.duration(300) : undefined}>
                <ThemedView style={{ padding: 20 }}>
                  <ThemedText style={{ textAlign: 'center', color: theme.textSecondary }}>
                    No records found for this period.
                  </ThemedText>
                </ThemedView>
              </Animated.View>
            )}
          />
        )}

      </View>

    </ThemedView>
  )
}

export default SignTab

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 0,
  },
  history: {
    flex: 1,
    marginTop: 16,
  },
})