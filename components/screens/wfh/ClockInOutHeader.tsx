import { ConfirmLoadingDialog } from "@/components/ui/ConfirmationDialog";
import { useLiveTime } from "@/hooks/use-live-time";
import { useTheme } from "@/hooks/use-theme-color";
import { hapticMedium } from "@/utils/haptics";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { Entypo, Octicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

type ClockInOutResponse = {
  createClockedInOut: {
    checkType: {
      name: string;
    };
  };
};

type ClockInOutVars = {
  createClockedInOutInput: {
    check_in_type: number;
  };
};

// --- GraphQL ---
const CLOCK_IN_OUT_MUTATION: TypedDocumentNode<
  ClockInOutResponse,
  ClockInOutVars
> = gql`
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

const WFH_ALLOWED_QUERY = gql`
  query wfhIsAllowed {
    isWFHAllowed
  }
`;

const ICON_SIZE = 16;

type Props = {
  month: any;
  // optional but recommended (for refetch context)
  refetchQueries?: any[];
};

export default function ClockInOutHeader({
  month,
  refetchQueries = [],
}: Props) {

  const theme = useTheme()
  const now = useLiveTime();

  const [clickedButtonType, setClickedButtonType] = useState<number | null>(null);

  const { data: isAllowed, loading: loadingAllowed } = useQuery<{ isWFHAllowed: boolean }>(WFH_ALLOWED_QUERY);

  const [clockInOutMutation, { data, loading }] = useMutation(
    CLOCK_IN_OUT_MUTATION,
    {
      refetchQueries,
    }
  );

  useEffect(() => {
    if (data) {
      Alert.alert(
        "Success",
        `Successfully clocked ${data.createClockedInOut.checkType.name}.`
      );
      setClickedButtonType(null);
    }
  }, [data]);

  const clockInOut = (type: number) => {
    hapticMedium();
    setClickedButtonType(type);
  };

  const handleConfirm = () => {
    hapticMedium();
    if (clickedButtonType === null) return;

    clockInOutMutation({
      variables: {
        createClockedInOutInput: {
          check_in_type: clickedButtonType,
        },
      },
    });
  };

  const isWFHAllowed = isAllowed?.isWFHAllowed;

  return (
    <View style={{ ...styles.container, backgroundColor: theme.backgroundSecondary }}>

      <View style={styles.statusContainer}>

        {/* Status */}
        <View style={{ ...styles.status }}>
          <Entypo name="dot-single" size={20} color={isWFHAllowed ? "#04B280" : "#ED3F3E"} />
          <Text style={{ ...styles.text, color: theme.text }}>
            {isWFHAllowed ? "Remote Allowed" : "Remote Not Allowed"}
          </Text>

        </View>

        {/* Date time */}
        <Text style={{ ...styles.text, color: theme.textSecondary, marginLeft: 8, fontVariant: ["tabular-nums"] }}>
          {dayjs(now).format("ddd, DD MMM • HH:mm:ss")}
        </Text>

      </View>

      <View style={{ ...styles.actionButtons }}>

        {/* Clock In */}
        <Pressable
          disabled={!isWFHAllowed || (loading && clickedButtonType === 0)}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.primaryActive },
            pressed && styles.pressed,
            !isWFHAllowed && { backgroundColor: theme.background, opacity: 0.5 },
          ]}
          onPress={() => clockInOut(0)}
        >
          <Octicons name="sign-in" size={ICON_SIZE} color={isWFHAllowed ? theme.text : theme.textTertiary} />
          <Text style={[styles.text, { color: isWFHAllowed ? theme.text : theme.textTertiary, fontWeight: "500" }]}>
            Sign In
          </Text>
        </Pressable>

        {/* Clock Out */}
        <Pressable
          disabled={!isWFHAllowed || (loading && clickedButtonType === 1)}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.backgroundTertiary },
            pressed && styles.pressed,
            !isWFHAllowed && { backgroundColor: theme.background, opacity: 0.5 },
          ]}
          onPress={() => clockInOut(1)}
        >
          <Octicons name="sign-out" size={ICON_SIZE} color={isWFHAllowed ? theme.text : theme.textTertiary} />
          <Text style={[styles.text, { color: isWFHAllowed ? theme.text : theme.textTertiary, fontWeight: "500" }]}>
            Sign Out
          </Text>
        </Pressable>

      </View>

      <ConfirmLoadingDialog
        visible={clickedButtonType !== null}
        loading={loading}
        loadingMessage={'Processing...'}
        clockType={clickedButtonType === 0 ? 'In' : 'Out'}
        time={dayjs(now).format("hh:mm A")}
        onCancel={() => setClickedButtonType(null)}
        onConfirm={handleConfirm}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
  },

  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },

  status: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  actionButtons: {
    flexDirection: "row",
    gap: 40,
    alignItems: "center",
    justifyContent: "space-between"
    // padding: 12,
    // borderRadius: 8
  },

  button: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  buttonDisabled: {
    borderColor: "#29160e",
    backgroundColor: "#180d08",
  },

  text: {
    color: "white",
    fontSize: 14
  },

  textClockIn: {
    color: "#158cba",
    fontWeight: "500",
  },

  textClockOut: {
    color: "#ff851b",
    fontWeight: "500",
  },

  confirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#3b494c",
    justifyContent: "center",
  },

  monthButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#3b494c",
    marginTop: 12,
  },

  pressed: {
    opacity: 0.75,
  },
});