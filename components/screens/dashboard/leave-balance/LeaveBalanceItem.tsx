import { ThemeType } from '@/constants/theme'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import LeaveProgressBar from './LeaveProgressBar'

interface Props {
  item: any
  itemWidth: number
  theme: ThemeType
}

const LeaveBalanceItem = ({ item, itemWidth, theme }: Props) => {
  return (
    <View style={{ ...styles.card, width: itemWidth, backgroundColor: theme.backgroundSecondary }}>

      {/* <View style={{ marginBottom: 12 }}>
        {React.cloneElement(item.icon, { size: 20, color: theme.textTertiary })}
      </View> */}

      <Text style={{ ...styles.title, color: theme.textTertiary }}>{item.label}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 }}>
        <Text style={{ ...styles.remainingDaysText, color: theme.text }}>{item.remainingDays}</Text>

        <Text style={{ ...styles.totalDaysText, marginBottom: 2, color: theme.textSecondary }}> / </Text>
        <Text style={{ ...styles.totalDaysText, color: theme.textSecondary }}>{item.totalDays} days</Text>
      </View>

      <LeaveProgressBar
        usedDays={item.usedDays}
        totalDays={item.totalDays}
        color={theme.text}
      />
    </View>
  )
}

export default LeaveBalanceItem

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    // fontWeight: '600',
    // textTransform: 'uppercase',
    marginBottom: 12
  },
  remainingDaysText: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  totalDaysText: {
    fontSize: 12,
  },
})