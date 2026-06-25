import { useTheme } from "@/hooks/use-theme-color";
import React, { useEffect, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type TabItem = {
  key: string;
  label: string;
};

type Props = {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
};

export default function Tabs({
  tabs,
  activeKey,
  onChange,
}: Props) {
  const theme = useTheme();

  const [layouts, setLayouts] = useState<
    { x: number; width: number }[]
  >([]);

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  useEffect(() => {
    const index = tabs.findIndex(
      (tab) => tab.key === activeKey
    );

    const layout = layouts[index];

    if (!layout) return;

    indicatorX.value = withTiming(layout.x, {
      duration: 250,
    });

    indicatorWidth.value = withTiming(layout.width, {
      duration: 250,
    });
  }, [activeKey, layouts]);

  const onTabLayout =
    (index: number) =>
      (e: LayoutChangeEvent) => {
        const { x, width } = e.nativeEvent.layout;

        setLayouts((prev) => {
          const next = [...prev];
          next[index] = { x, width };
          return next;
        });
      };

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
  }));

  return (
    <View
      style={[
        styles.container,
        { borderBottomColor: theme.border },
      ]}
    >
      <View style={styles.row}>
        {tabs.map((tab, index) => {
          const active = activeKey === tab.key;

          return (
            <Pressable
              key={tab.key}
              onPress={() => onChange(tab.key)}
              onLayout={onTabLayout(index)}
              style={styles.tab}
            >
              <Text
                style={[
                  styles.label,
                  {
                    color: active
                      ? theme.primary
                      : theme.textSecondary,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Animated.View
        style={[
          styles.indicator,
          indicatorStyle,
          { backgroundColor: theme.primary },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },

  row: {
    flexDirection: "row",
  },

  tab: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
  },

  indicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 2,
    borderRadius: 999,
  },
});