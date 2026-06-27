import { ThemeType } from "@/constants/theme";
import React from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

type Props = {
  label: string;

  // optional right-side value (e.g. time)
  value?: string | number;

  // row press action (edit/open picker)
  onPress?: () => void;

  // toggle support
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;

  // disable interaction (optional)
  disabled?: boolean;

  // optional subtitle/help text
  description?: string;
  theme: ThemeType;
};

export const SettingRow = ({
  label,
  value,
  onPress,
  showSwitch = false,
  switchValue = false,
  onSwitchChange,
  disabled = false,
  description,
  theme,
}: Props) => {
  const Container: any = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      style={[styles.row, disabled && { opacity: 0.5 }]}
    >
      {/* LEFT SIDE */}
      <View style={{ flex: 1 }}>
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>

        {!!description && (
          <Text style={[styles.description, { color: theme.textSecondary }]}>{description}</Text>
        )}
      </View>

      {/* RIGHT SIDE */}
      <View style={styles.right}>
        {/* value (like time) */}
        {!!value && (
          <Text style={[styles.value, { color: theme.primary }]} onPress={onPress}>
            {value}
          </Text>
        )}

        {/* toggle */}
        {showSwitch && (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
          />
        )}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
  },

  label: {
    fontSize: 14,
  },

  description: {
    fontSize: 12,
    marginTop: 2,
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  value: {
    // fontSize: 16,
    // fontWeight: "600",
  },
});