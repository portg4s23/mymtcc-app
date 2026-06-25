import { AppHeader } from "@/components/ui/AppHeader";
import CustomSpinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/use-theme-color";
import { hapticLight, hapticMedium } from "@/utils/haptics";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller';
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';

const REQUEST_WFH_MUTATION = gql`
  mutation requestWorkFromHome(
    $createWorkFromHomeScheduleInput: CreateWorkFromHomeScheduleInput!
  ) {
    createWorkFromHomeSchedule(
      createWorkFromHomeScheduleInput: $createWorkFromHomeScheduleInput
    ) {
      id
    }
  }
`;

interface Props {
  refetchQueries?: any[];
}

export default function RequestRemoteAttendanceModal({ refetchQueries }: Props) {
  const theme = useTheme();
  const defaultStyles = useDefaultStyles();

  const { user } = useAuth()

  const [modalVisible, setModalVisible] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: DateType | null; end: DateType | null }>({
    start: dayjs().add(1, "month").startOf("month").toDate(),
    end: dayjs().add(1, "month").endOf("month").toDate(),
  });
  const [reason, setReason] = useState("");

  // MARK: GraphQL

  const [requestWFH, { loading }] = useMutation(REQUEST_WFH_MUTATION, {
    onCompleted: () => {
      // Alert.alert("Remote attendance requested!");
      onCancel();
    },
    onError: (error) => {
      Alert.alert("An error occurred while requesting.");
      console.log(error);
    },
    refetchQueries: ['getWorkFromHomeSchedules']
  });

  // MARK: Handlers

  const onCancel = () => {
    hapticLight();
    onResetDate();
    router.back();
  };

  const onSubmit = async () => {
    hapticMedium();

    if (!user?.id) {
      Alert.alert("User not found.");
      return;
    }

    if (reason && dateRange.start && dateRange.end) {
      const startDate = dayjs(dateRange.start)
        .startOf("day")
        .toISOString();

      const endDate = dayjs(dateRange.end)
        .endOf("day")
        .toISOString();

      requestWFH({
        variables: {
          createWorkFromHomeScheduleInput: {
            requested_for: user.id,
            details: reason,
            from_date: startDate,
            to_date: endDate,
          },
        },
      });
    };
    // TODO: submit
  };

  const openPicker = () => {
    hapticLight();
    setModalVisible(true);
  };

  const onResetDate = () => {
    hapticLight();
    setDateRange({
      start: dayjs().add(1, "month").startOf("month").toDate(),
      end: dayjs().add(1, "month").endOf("month").toDate(),
    });
  };


  return (
    <>
      <AppHeader
        title="Request Remote Attendance"
        right={(
          <Pressable onPress={onCancel} style={{ padding: 4, borderRadius: 8 }}>
            <MaterialIcons name="close" size={20} color={theme.textTertiary} />
          </Pressable>
        )}
      />

      <KeyboardAwareScrollView bottomOffset={0} contentContainerStyle={{
        ...styles.container,
        backgroundColor: theme.background,
      }}>

        <View style={styles.field}>
          <Text
            style={[
              styles.label,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            Date Range
          </Text>

          <Pressable
            style={{ ...styles.input, borderColor: theme.backgroundTertiary, backgroundColor: theme.backgroundSecondary }}
            onPress={openPicker}
          >
            <Text style={{ color: theme.text, }}>
              {dateRange.start && dateRange.end
                ? `${dayjs(dateRange.start).format("DD MMM YYYY")} - ${dayjs(dateRange.end).format("DD MMM YYYY")}`
                : "Select date range"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.field}>
          <Text
            style={[
              styles.label,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            Reason
          </Text>

          <TextInput
            value={reason}
            onChangeText={setReason}
            multiline
            textAlignVertical="top"
            placeholder="Enter reason"
            placeholderTextColor={theme.textTertiary}
            style={[
              styles.textArea,
              {
                color: theme.text,
                borderColor: theme.backgroundTertiary,
                backgroundColor: theme.backgroundSecondary,
              },
            ]}
          />
        </View>

        {/* Buttons */}
        <View style={styles.actions}>

          <Pressable
            style={({ pressed }) => {
              const isDisabled = !(reason && dateRange.start && dateRange.end);

              return [
                styles.button,
                {
                  backgroundColor: theme.primaryActive,
                  opacity: pressed || isDisabled ? 0.5 : 1,
                },
              ];
            }}
            onPress={onSubmit}
            disabled={!reason || !dateRange.start || !dateRange.end}
          >
            {loading && (
              <CustomSpinner size={16} color={theme.text} />
            )}
            <Text
              style={{
                color: theme.text,
                fontWeight: "600",
              }}
            >Request</Text>
          </Pressable>

        </View>

      </KeyboardAwareScrollView>
      <KeyboardToolbar />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Backdrop */}
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.65)",
            justifyContent: "flex-end",
          }}
          onPress={() => setModalVisible(false)}
        >
          {/* Sheet container */}
          <View style={{ backgroundColor: theme.backgroundSecondary, borderTopLeftRadius: 16, borderTopRightRadius: 16 }} >
            <Pressable
              style={{
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                padding: 16,
              }}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: theme.backgroundTertiary, paddingBottom: 16 }}>
                <Pressable onPress={onResetDate} style={{ paddingHorizontal: 4, paddingVertical: 4, alignItems: "center", justifyContent: "center", }}>
                  <Text style={{ color: theme.textSecondary }}>
                    Reset
                  </Text>
                </Pressable>

                <View style={{ alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: theme.textTertiary }}>{dateRange.start && dateRange.end ? `${dayjs(dateRange.start).format("DD MMM YYYY")} - ${dayjs(dateRange.end).format("DD MMM YYYY")}` : "Select date range"}</Text>
                </View>


              </View>

              <DateTimePicker
                style={{ backgroundColor: theme.backgroundSecondary, borderRadius: 16, }}
                styles={{
                  ...defaultStyles,
                  today: { borderRadius: 12, borderColor: theme.primary, borderWidth: 1, },
                  today_label: { color: theme.primary },
                  selected: { borderColor: theme.primary, backgroundColor: theme.primary, borderRadius: 12 },
                  range_fill: { backgroundColor: theme.backgroundTertiary },
                  selected_label: { color: theme.text },
                  range_start_label: { color: theme.text },
                  range_end_label: { color: theme.text },
                  range_middle_label: { color: theme.text },
                }}
                mode="range"
                startDate={dateRange.start}
                endDate={dateRange.end}
                // allowRangeReset=
                onChange={({ startDate, endDate }) => {
                  setDateRange({ start: startDate, end: endDate });
                }}
              />

            </Pressable>
          </View>
        </Pressable>
      </Modal>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    gap: 20,
    // paddingBottom: 120,
  },
  content: {
    padding: 16,
    gap: 20,
    paddingBottom: 120,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    // fontWeight: "600",
  },
  input: {
    // minHeight: 52,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  textArea: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 16,
  },
  actions: {
    marginTop: 32
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
});