import { useTheme } from "@/hooks/use-theme-color";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AppHeaderProps = {
  title: string;
  right?: React.ReactNode;
  left?: React.ReactNode;
  style?: ViewStyle;
};

export function AppHeader({ title, right, left, style }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const hasExtraContent = !!right || !!left;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + (hasExtraContent ? 6 : 14) },
        style,
      ]}
    >
      <View style={styles.row}>
        {/* Left */}
        <View style={styles.left}>
          {left ?? <Text style={[styles.title, { color: theme.text }]}>{title}</Text>}
        </View>

        {/* Right */}
        <View style={styles.right}>{right ?? null}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flex: 1,
    justifyContent: "center",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
});