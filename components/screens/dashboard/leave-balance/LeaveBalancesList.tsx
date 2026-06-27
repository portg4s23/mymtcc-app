import { useTheme } from '@/hooks/use-theme-color';
import { AntDesign, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, FlatList, StyleSheet } from 'react-native';
import LeaveBalanceItem from './LeaveBalanceItem';

const { width } = Dimensions.get('window');

// 4 items visible
const ITEM_WIDTH = (width - 24) / 3;

export const leaveBalancesMock = [
  { id: '1', icon: <MaterialCommunityIcons name="airplane" />, type: 'annual', label: 'Annual', totalDays: 30, usedDays: 7, remainingDays: 23 },
  { id: '2', icon: <AntDesign name="medicine-box" />, type: 'sick', label: 'Sick', totalDays: 15, usedDays: 5, remainingDays: 10 },
  { id: '3', icon: <FontAwesome5 name="clinic-medical" />, type: 'sick-mc', label: 'Sick (MC)', totalDays: 15, usedDays: 3, remainingDays: 12 },
  { id: '4', icon: <MaterialIcons name="family-restroom" />, type: 'frl', label: 'FRL', totalDays: 10, usedDays: 3, remainingDays: 7 },
  { id: '5', icon: <Ionicons name="bandage-outline" />, type: 'circumcision', label: 'Circumcision', totalDays: 5, usedDays: 0, remainingDays: 5 },
  { id: '6', icon: <FontAwesome6 name="child-reaching" />, type: 'paternity', label: 'Paternity', totalDays: 30, usedDays: 0, remainingDays: 30 },
];

export default function LeaveBalanceList() {

  const theme = useTheme();

  return (
    <FlatList
      data={leaveBalancesMock}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={ITEM_WIDTH}
      decelerationRate="fast"
      contentContainerStyle={styles.container}
      renderItem={({ item }) => <LeaveBalanceItem item={item} itemWidth={ITEM_WIDTH} theme={theme} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
  },
});