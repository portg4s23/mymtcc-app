import { Pill } from '@/components/ui/Pill'
import { useTheme } from '@/hooks/use-theme-color'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import DashboardSectionHeader from '../DashboardSectionHeader'
import OvertimeAnalysisCard from './OvertimeAnalysisCard'

const otMockData = [
  { id: '1', type: 'regular', label: 'Regular OT', hours: 12.5, estimatedPay: 187.5 },
  { id: '2', type: 'double', label: 'Double OT', hours: 4.5, estimatedPay: 90.0 },
]

const OvertimeAnalysisSection = () => {

  const theme = useTheme();

  return (
    <View>

      <DashboardSectionHeader title="Overtime Analysis" isMock left={<Pill variant="info" label="Current Payroll Period" useBg2 hideBorder textStyle={{ fontWeight: 'bold' }} />} />

      <View style={{ flexDirection: 'row', gap: 8 }}>
        {otMockData.map((item) => (
          <OvertimeAnalysisCard item={item} key={item.id} theme={theme} />
        ))}
      </View>

    </View>
  )
}

export default OvertimeAnalysisSection

const styles = StyleSheet.create({})