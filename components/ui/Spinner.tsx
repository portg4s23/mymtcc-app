import { useTheme } from '@/hooks/use-theme-color';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

interface SpinnerProps {
  size?: number;
  color?: string;
}

export default function CustomSpinner({ size = 48, color }: SpinnerProps) {

  const theme = useTheme()
  const spinnerColor = color || theme.primary;

  const rotation = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true, // Crucial for 60FPS performance
      })
    ).start();
  }, [rotation]);

  // Interpolate the 0-1 progress value into 360-degree rotation angles
  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: size * 0.1, // Dynamic thickness based on size
            borderColor: 'transparent',
            borderTopColor: spinnerColor, // Creates the spinning arc effect
            transform: [{ rotate: spin }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    borderStyle: 'solid',
  },
});