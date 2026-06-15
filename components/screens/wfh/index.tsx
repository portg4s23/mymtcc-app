import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ConfirmLoadingDialog } from '@/components/ui/ConfirmationDialog';
import { useAuth } from '@/context/AuthContext';
import { getPayrollPeriod } from '@/helpers';
import { gql } from '@apollo/client';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client/react';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
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

const WFH_ALLOWED_QUERY = gql`
  query wfhIsAllowed {
    isWFHAllowed
  }
`;

const CLOCK_IN_OUT_MUTATION = gql`
  mutation createClockInOut(
    $createClockedInOutInput: CreateClockedInOutInput!
  ) {
    createClockedInOut(createClockedInOutInput: $createClockedInOutInput) {
      checkType {
        name
      }
    }
  }
`;

const WFHScreen = () => {

  // State, Refs & Hooks

  const { user } = useAuth()

  const pageLimit = 10;
  const source = "MyMTCC";

  const [page, setPage] = useState(1);
  const [month, setMonth] = useState(getPayrollPeriod(dayjs())[1]);
  const [clickedButtonType, setClickedButtonType] = useState(null);
  const [pickerVisible, setPickerVisible] = useState(false)

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
  }>(WFH_HISTORY_QUERY);

  const { data: isAllowed, loading: loadingAllowed } = useQuery<{ isWFHAllowed: boolean }>(WFH_ALLOWED_QUERY);

  const [clockInOutMutation, { data: dataClockInOut, loading, error: errorClockInOut }] = useMutation<{ createClockedInOut: { checkType: { name: string } } }>(CLOCK_IN_OUT_MUTATION, {
    refetchQueries: [
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
    ],
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
          source: source,
        },
      },
    });
    // eslint-disable-next-line
  }, [user, month]);

  useEffect(() => {
    if (errorClockInOut) {
      Alert.alert("Error", "An unexpected error has occurred. Please try again.");
      setClickedButtonType(null);
    }
  }, [errorClockInOut])

  useEffect(() => {
    if (dataClockInOut) {
      Alert.alert("Success", `Successfully clocked ${dataClockInOut.createClockedInOut.checkType.name}.`);
      setClickedButtonType(null);
    }
  }, [dataClockInOut])

  // Handlers

  const clockInOut = (type: any) => {
    setClickedButtonType(type);
  };

  const handleConfirmClockInOut = () => {
    if (clickedButtonType === null) return;

    clockInOutMutation({
      variables: {
        createClockedInOutInput: { check_in_type: clickedButtonType },
      },
    });
  };

  return (
    <ThemedView style={styles.container}>

      {/* Header */}
      <ThemedView style={styles.header}>
        {isAllowed && isAllowed?.isWFHAllowed ? (
          <ThemedView style={styles.actionButtons}>
            <Pressable
              disabled={loading && clickedButtonType === 0}
              style={({ pressed }) => [
                styles.button,
                styles.buttonClockIn,
                pressed && styles.pressed,
              ]}
              onPress={() => clockInOut(0)}
            >
              <ThemedText style={[styles.text, styles.textClockIn]}>In</ThemedText>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.buttonClockOut,
                pressed && styles.pressed,
              ]}
              disabled={loading && clickedButtonType === 1}
              onPress={() => clockInOut(1)}
            >
              <ThemedText style={[styles.text, styles.textClockOut]}>Out</ThemedText>
            </Pressable>
          </ThemedView>
        ) : (
          <ThemedText style={styles.text}>Remote work is not allowed for today.</ThemedText>
        )}

        <>

          {/* <MonthYearPicker
                        visible={pickerVisible}
                        period={localFilters.period as any}
                        initialYear={localFilters.year ?? new Date().getFullYear()}
                        initialMonth={localFilters.month ?? (new Date().getMonth() + 1)}
                        onCancel={() => setPickerVisible(false)}
                        onOk={(startDate, endDate, year, monthNumber) => {
  if (!monthNumber || !year) {
    Alert.alert('Error', 'Invalid month or year selected.')
    return
  }

  const selectedMonth = dayjs()
    .year(year)
    .month(monthNumber - 1)
    .startOf('month')

  setMonth(selectedMonth)
  setPickerVisible(false)
}}
                      /> */}
        </>

      </ThemedView>

      {/* History */}
      <ThemedView style={styles.history}>

        {loadingHistory && (
          <View style={{ padding: 20 }}>
            <ThemedText style={{ textAlign: 'center', color: '#666' }}>
              Loading history...
            </ThemedText>
          </View>
        )}

        {/* <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#3b494c' }}>
          <ThemedText style={{ fontSize: 18, }}>Activity Log</ThemedText>
        </View> */}

        {!loadingHistory && (
          <FlatList
            contentContainerStyle={{
            }}
            data={data?.clockedInOuts.page.edges || []}
            keyExtractor={(item) => item.node.id}
            renderItem={({ item, index }) => <WFHHistoryItem item={item.node} isFirst={index === 0} isLast={index === (data?.clockedInOuts.page.edges.length || 1) - 1} />}
            ListEmptyComponent={() => (
              <ThemedView style={{ padding: 20 }}>
                <ThemedText style={{ textAlign: 'center', color: '#666' }}>
                  {loadingHistory ? 'Loading history...' : 'No work from home records found for this period.'}
                </ThemedText>
              </ThemedView>
            )}
          />
        )}

      </ThemedView>

      {/* <LoadingDialog
        visible={simLoading2}
        message={'Processing your request...'}
      /> */}

      <ConfirmLoadingDialog
        visible={clickedButtonType !== null}
        title={`Clocking ${clickedButtonType === 0 ? 'In' : 'Out'}...`}
        loading={loading}
        loadingMessage={'Processing...'}
        confirmText="OK"
        cancelText="Cancel"
        onCancel={() => setClickedButtonType(null)}
        onConfirm={handleConfirmClockInOut}
      />

    </ThemedView>
  )
}

export default WFHScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  text: {
    color: 'white',
  },
  header: {

  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonClockIn: {
    borderColor: '#0e1b28',
    backgroundColor: '#081018'
  },
  buttonClockOut: {
    borderColor: '#29160e',
    backgroundColor: '#180d08'
  },
  textClockIn: {
    color: '#158cba',
    fontWeight: '500'
  },
  textClockOut: {
    color: '#ff851b',
    fontWeight: '500'
  },
  pressed: {
    opacity: 0.75,
  },
  history: {
    flex: 1,
    marginTop: 16,
    // borderWidth: 1,
    // borderColor: '#3b494c',
    // borderRadius: 8,
    // overflow: 'hidden',
  }
})