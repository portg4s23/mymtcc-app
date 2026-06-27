import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  usedDays: number;
  totalDays: number;
  color?: string;
};

export default function LeaveProgressBar({
  usedDays,
  totalDays,
  color = '#2664EB',
}: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    const ratio = totalDays === 0 ? 0 : usedDays / totalDays;
    progress.value = withTiming(ratio, {
      duration: 700,
    });
  }, [usedDays, totalDays]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  return (
    <View style={styles.track}>
      <Animated.View
        style={[
          styles.fill,
          { backgroundColor: color },
          animatedStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    width: '100%',
    backgroundColor: '#2A2A2A',
    borderRadius: 99,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 99,
  },
});