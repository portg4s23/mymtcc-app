import { ThemeType } from '@/constants/theme'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface Props {
  item: any
  theme: ThemeType
}

const OvertimeAnalysisCard = ({ item, theme }: Props) => {
  return (
    <View style={{ ...styles.card, backgroundColor: theme.backgroundSecondary }}>

      <Text style={{ ...styles.title, color: theme.textTertiary }}>{item.label}</Text>

      <Text style={{ ...styles.otHours, color: theme.text }}>{item.hours} hrs</Text>

      <Text style={{ ...styles.estimatedPay, color: theme.textSecondary }}>MVR {item.estimatedPay}</Text>

    </View>
  )
}

export default OvertimeAnalysisCard

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  title: {
    fontSize: 14,
    // fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12
  },
  otHours: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12
  },
  estimatedPay: {
    fontSize: 14,
  },
})