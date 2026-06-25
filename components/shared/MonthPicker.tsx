import { useTheme } from '@/hooks/use-theme-color'
import { hapticLight, hapticMedium } from '@/utils/haptics'
import { Ionicons } from '@expo/vector-icons'
import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'

type MonthPickerProps = {
  visible: boolean
  value?: Dayjs
  onCancel: () => void
  onOk: (value: Dayjs) => void
}

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export function MonthPicker({
  visible,
  value,
  onCancel,
  onOk,
}: MonthPickerProps) {
  const theme = useTheme()

  const baseValue = (value ?? dayjs()).startOf('month')

  const [selectedMonth, setSelectedMonth] = useState<number>(
    baseValue.month() + 1
  )

  const [selectedYear, setSelectedYear] = useState<number>(
    baseValue.year()
  )

  // Sync state whenever modal opens OR value changes
  useEffect(() => {
    if (!visible) return

    const base = (value ?? dayjs()).startOf('month')

    setSelectedMonth(base.month() + 1)
    setSelectedYear(base.year())
  }, [visible, value])

  const goPrevYear = () => {
    hapticLight()
    setSelectedYear(prev => prev - 1)
  }

  const goNextYear = () => {
    hapticLight()
    setSelectedYear(prev => prev + 1)
  }

  if (!visible) return null

  const handleOk = () => {
    hapticMedium()

    const result = dayjs()
      .year(selectedYear)
      .month(selectedMonth - 1)
      .startOf('month') // 🔥 IMPORTANT: matches Ant Design behavior

    onOk(result)
    onCancel()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalBox,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          {/* Year Switcher */}
          <View style={styles.yearHeader}>
            <Pressable
              onPress={goPrevYear}
              style={[
                styles.iconBtn,
                { backgroundColor: theme.backgroundTertiary },
              ]}
            >
              <Ionicons name="chevron-back" size={22} color={theme.text} />
            </Pressable>

            <Text style={[styles.yearText, { color: theme.text }]}>
              {selectedYear}
            </Text>

            <Pressable
              onPress={goNextYear}
              style={[
                styles.iconBtn,
                { backgroundColor: theme.backgroundTertiary },
              ]}
            >
              <Ionicons name="chevron-forward" size={22} color={theme.text} />
            </Pressable>
          </View>

          {/* Months grid */}
          <View style={styles.grid}>
            {months.map((month, index) => {
              const monthNumber = index + 1
              const isSelected = monthNumber === selectedMonth

              return (
                <Pressable
                  key={month}
                  onPress={() => {
                    hapticLight()
                    setSelectedMonth(monthNumber)
                  }}
                  style={[
                    styles.monthItem,
                    {
                      backgroundColor: isSelected
                        ? theme.primary
                        : theme.backgroundTertiary,
                      borderWidth: 1,
                      borderColor: isSelected
                        ? theme.primary
                        : theme.backgroundTertiary,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: isSelected
                        ? theme.text
                        : theme.textSecondary,
                    }}
                  >
                    {month}
                  </Text>
                </Pressable>
              )
            })}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              onPress={onCancel}
              style={[
                styles.cancelBtn,
                { backgroundColor: theme.backgroundTertiary },
              ]}
            >
              <Text style={{ color: theme.textSecondary }}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleOk}
              style={[
                styles.okBtn,
                { backgroundColor: theme.primary },
              ]}
            >
              <Text style={{ color: theme.text }}>Filter</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    minWidth: 320,
  },

  yearHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  yearText: {
    fontSize: 18,
    fontWeight: '600',
  },
  iconBtn: {
    padding: 8,
    borderRadius: 50,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  monthItem: {
    width: '30%',
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 12,
    borderRadius: 8,
  },
  okBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
})