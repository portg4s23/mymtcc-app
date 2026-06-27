import React, { useEffect, useState } from 'react'
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

type Period = 'month' | 'year'

type MonthYearPickerProps = {
  period: Period
  visible: boolean
  initialYear?: number
  initialMonth?: number // 1-12
  onCancel: () => void
  onOk: (startDate: Date, endDate: Date, year: number, month?: number) => void
}

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

export function MonthYearPicker({
  period,
  visible,
  initialYear,
  initialMonth,
  onCancel,
  onOk,
}: MonthYearPickerProps) {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(initialYear || currentYear)
  const [selectedMonth, setSelectedMonth] = useState(initialMonth ?? 1)

  // Sync internal state with props when modal opens or props change
  useEffect(() => {
    if (visible) {
      setSelectedYear(initialYear || currentYear)
      setSelectedMonth(initialMonth ?? 1)
    }
  }, [visible, initialYear, initialMonth])

  // For year mode: show 30-year window
  const years = Array.from({ length: currentYear - 2023 + 1 }, (_, i) => 2023 + i)

  const handleOk = () => {
    let startDate: Date
    let endDate: Date

    if (period === 'month') {
      // Start: first day of the selected month
      startDate = new Date(selectedYear, selectedMonth - 1, 1)
      // End: last day of the selected month
      endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999)
      onOk(startDate, endDate, selectedYear, selectedMonth)
    } else {
      // period === 'year'
      // Start: January 1st of the selected year
      startDate = new Date(selectedYear, 0, 1)
      // End: December 31st of the selected year
      endDate = new Date(selectedYear, 11, 31, 23, 59, 59, 999)
      onOk(startDate, endDate, selectedYear)
    }
  }

  if (!visible) return null

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {period === 'month' && (
            <>
              {/* Year Navigator */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Pressable style={styles.yearChangeBtn} onPress={() => setSelectedYear(selectedYear - 1)}>
                  <Text style={{ fontSize: 18 }}>{'‹'}</Text>
                </Pressable>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>{selectedYear}</Text>
                <Pressable style={styles.yearChangeBtn} onPress={() => setSelectedYear(selectedYear + 1)}>
                  <Text style={{ fontSize: 18 }}>{'›'}</Text>
                </Pressable>
              </View>

              {/* Month Grid */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {months.map((m, index) => {
                  const monthNumber = index + 1 // Convert to 1-based
                  const isSelected = monthNumber === selectedMonth
                  return (
                    <Pressable
                      key={m}
                      onPress={() => setSelectedMonth(monthNumber)}
                      style={{
                        width: '30%',
                        marginVertical: 8,
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: isSelected ? '#2563EB' : '#E5E7EB',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: isSelected ? 'white' : '#111827' }}>{m}</Text>
                    </Pressable>
                  )
                })}
              </View>
            </>
          )}

          {period === 'year' && (
            <FlatList
              data={years}
              keyExtractor={(y) => y.toString()}
              numColumns={3}
              contentContainerStyle={{ paddingVertical: 8 }}
              renderItem={({ item }) => {
                const isSelected = item === selectedYear
                return (
                  <Pressable
                    onPress={() => setSelectedYear(item)}
                    style={{
                      width: '30%',
                      margin: '1.66%',
                      padding: 12,
                      borderRadius: 8,
                      backgroundColor: isSelected ? '#2563EB' : '#E5E7EB',
                      alignItems: 'center',
                      marginVertical: 8,
                    }}
                  >
                    <Text style={{ color: isSelected ? 'white' : '#111827' }}>{item}</Text>
                  </Pressable>
                )
              }}
            />
          )}

          {/* OK / Cancel Buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 24 }}>
            <Pressable
              onPress={onCancel}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginRight: 12,
                borderRadius: 8,
                backgroundColor: '#E5E7EB',
              }}
            >
              <Text style={{ color: '#111827' }}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleOk}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
                backgroundColor: '#2563EB',
              }}
            >
              <Text style={{ color: 'white' }}>OK</Text>
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
    zIndex: 999,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    minWidth: 320,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  yearChangeBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
})
