import React from 'react';
import { StyleSheet, View } from 'react-native';
import DashboardSectionHeader from '../DashboardSectionHeader';
import LeaveBalanceList from './LeaveBalancesList';

const leaveBalancesMock = [
  {
    id: '1',
    type: 'annual',
    label: 'Annual Leave',
    totalDays: 21,
    usedDays: 7,
    remainingDays: 14,
  },
  {
    id: '2',
    type: 'sick',
    label: 'Sick Leave',
    totalDays: 10,
    usedDays: 5,
    remainingDays: 5,
  },
  {
    id: '3',
    type: 'personal',
    label: 'Personal Leave',
    totalDays: 5,
    usedDays: 3,
    remainingDays: 2,
  },
  {
    id: '4',
    type: 'maternity',
    label: 'Maternity Leave',
    totalDays: 90,
    usedDays: 0,
    remainingDays: 90,
  },
  {
    id: '5',
    type: 'unpaid',
    label: 'Unpaid Leave',
    totalDays: 15,
    usedDays: 4,
    remainingDays: 11,
  },
];

const LeaveBalancesSection = () => {
  return (
    <View>

      <DashboardSectionHeader title="Leave Balances" isMock />

      <LeaveBalanceList />

    </View>
  )
}

export default LeaveBalancesSection

const styles = StyleSheet.create({})