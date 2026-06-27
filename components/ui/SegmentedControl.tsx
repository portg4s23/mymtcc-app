import { useTheme } from "@/hooks/use-theme-color";
import React, { useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  tabs: string[];
  value?: number;
  onChange?: (index: number) => void;
};

export const SegmentedControl = ({ tabs, value = 0, onChange }: Props) => {

  const theme = useTheme();

  const [containerWidth, setContainerWidth] = useState(0);
  const segmentWidth = useMemo(
    () => (containerWidth ? containerWidth / tabs.length : 0),
    [containerWidth, tabs.length]
  );

  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(value * segmentWidth, { duration: 250 });
  }, [value, segmentWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: segmentWidth,
  }));

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={{ ...styles.wrapper, backgroundColor: theme.backgroundSecondary }}>
      <View onLayout={onLayout} style={styles.container}>
        {/* Indicator */}
        <Animated.View style={[styles.indicator, { backgroundColor: theme.backgroundTertiary }, indicatorStyle]} />

        {tabs.map((tab, index) => {
          const active = index === value;

          return (
            <Pressable
              key={tab}
              style={styles.tab}
              onPress={() => onChange?.(index)}
            >
              <Text style={[styles.text, { color: active ? theme.text : theme.textTertiary }]}>
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 4,
    borderRadius: 12,
  },

  container: {
    flexDirection: "row",
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
  },

  indicator: {
    position: "absolute",
    height: "100%",
    // backgroundColor: "#2563EB",
    borderRadius: 10,
  },

  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  text: {
    fontSize: 14,
  },

});