import { hapticLight, hapticMedium } from '@/utils/haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  visible: boolean;
  onClose: () => void;
  value?: Date;
  onApply: (date: Date) => void;
  theme: any;
}

const TimePicker = ({
  visible,
  onClose,
  value,
  onApply,
  theme,
}: Props) => {

  const insets = useSafeAreaInsets();

  // Local state to hold the selected date/time
  const [pickerValue, setPickerValue] = useState(value ? new Date(value) : new Date());

  const updatePickerValue = (date: Date) => {
    setPickerValue(date);
  }

  const handleApplyChange = () => {
    hapticMedium();
    onApply(pickerValue);
    onClose();
  }

  // Reset the value to the value when the picker was opened
  const onResetValue = () => {
    hapticLight();
    setPickerValue(value ? new Date(value) : new Date());
  }

  // Update pickerValue whenever the value prop changes
  useEffect(() => {
    if (value) {
      setPickerValue(new Date(value));
    }
  }, [value]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.65)",
          justifyContent: "flex-end",
        }}
        onPress={onClose}
      >
        {/* Sheet container */}
        <View style={{ backgroundColor: theme.backgroundSecondary, borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: insets.bottom }} >
          <Pressable
            style={{
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: 16,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: theme.backgroundTertiary, paddingBottom: 16 }}>
              <Pressable onPress={onResetValue} style={{ paddingHorizontal: 4, paddingVertical: 4, alignItems: "center", justifyContent: "center", }}>
                <Text style={{ color: theme.textSecondary }}>
                  Reset
                </Text>
              </Pressable>

              <Pressable onPress={handleApplyChange} style={{ borderRadius: 8, paddingHorizontal: 4, paddingVertical: 4, alignItems: "center", justifyContent: "center", }}>
                <Text style={{ color: theme.primary, fontSize: 16 }}>
                  Done
                </Text>
              </Pressable>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              <DateTimePicker
                value={pickerValue}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (event.type === "set" && selectedDate) {
                    updatePickerValue(selectedDate);
                  }
                }}
              />
            </View>

          </Pressable>
        </View>
      </Pressable>
    </Modal>
  )
}

export default TimePicker

const styles = StyleSheet.create({})