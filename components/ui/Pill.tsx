import { tintedColors, TintedColorType } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

type Props = {
  variant?: TintedColorType;
  label?: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
};

export const Pill: React.FC<Props> = ({
  variant = "neutral",
  label,
  icon,
  style,
  textStyle,
  children,
}) => {
  const colors = tintedColors[variant];

  return (
    <View
      style={[
        baseStyles.container,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {icon ? <View style={baseStyles.icon}>{icon}</View> : null}

      <Text style={[baseStyles.text, { color: colors.fg }, textStyle]}>
        {children || label}
      </Text>
    </View>
  );
};

const baseStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
    gap: 6,

    borderWidth: 1,
  },
  text: {
    fontSize: 11,
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
  },
});