import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import CustomSpinner from '@/components/ui/Spinner';
import { getTintColors, ThemeType } from '@/constants/theme';
import Feather from '@expo/vector-icons/Feather';
import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type WFHHistoryItemType = {
  id: string;
  source: string;
  checkTypeRevised: {
    name: string;
  };
  check_time: string;
  processed: boolean;
}

interface Props {
  item: WFHHistoryItemType;
  isFirst: boolean;
  isLast: boolean;
  theme: ThemeType
}

const WFHHistoryItem = ({ item, isFirst, isLast, theme }: Props) => {

  const inTintColor = getTintColors("purple")
  const outTintColor = getTintColors("warning")

  const isIn = item.checkTypeRevised.name === "In"
  const isOut = item.checkTypeRevised.name === "Out"

  return (
    <ThemedView style={[
      styles(item).container,
      { backgroundColor: theme.backgroundSecondary },
      // isFirst && styles(item).containerFirst,
      // isLast && styles(item).containerLast,
      // !isFirst && !isLast && styles(item).containerMiddle
    ]}>

      <View style={styles(item).innerContainer}>

        {/* Icon */}
        <View style={{ ...styles(item).iconContainer, backgroundColor: isIn ? inTintColor.bg : isOut ? outTintColor.bg : theme.backgroundTertiary }}>
          {item.checkTypeRevised.name === "In" && (
            <Feather name="log-in" size={16} color={inTintColor.fg} />
          )}
          {item.checkTypeRevised.name === "Out" && (
            <Feather name="log-out" size={16} color={outTintColor.fg} />
          )}
        </View>

        {/* Meta */}
        <View style={styles(item).metaContainer}>

          {/* Left */}
          <View style={styles(item).metaLeft}>
            <ThemedText style={{ ...styles(item).typeText, color: theme.text }}>{item.checkTypeRevised.name}</ThemedText>
            <ThemedText style={{ ...styles(item).dateText, color: theme.textTertiary }}>{dayjs(item.check_time).format('DD MMM YY')}</ThemedText>
          </View>

          {/* Right */}
          <View style={styles(item).metaRight}>
            <ThemedText style={{
              ...styles(item).timeText,
              color: theme.text,
            }}>{dayjs(item.check_time).format('HH:mm')}</ThemedText>
            {!item.processed && <CustomSpinner size={16} />}
          </View>

        </View>

      </View>

    </ThemedView>
  )
}

export default WFHHistoryItem

const styles = (item: WFHHistoryItemType) => StyleSheet.create({
  container: {
    paddingHorizontal: 12, paddingVertical: 12, borderRadius: 12,
  },
  // containerFirst: {
  //   borderTopStartRadius: 12, borderTopEndRadius: 12,
  // },
  // containerLast: {
  //   borderTopWidth: 1, borderColor: '#141b1e',
  //   borderBottomStartRadius: 12, borderBottomEndRadius: 12,
  // },
  // containerMiddle: {
  //   borderTopWidth: 1, borderColor: '#141b1e'
  // },
  innerContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12
  },
  iconContainer: {
    flexDirection: 'row', alignItems: 'center', padding: 8, width: 40, height: 40, borderRadius: 12, justifyContent: 'center'
  },
  metaContainer: {
    flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center'
  },
  metaLeft: {
    flex: 1
  },
  metaRight: {
    flexDirection: 'row', gap: 16, alignItems: 'center',
  },
  dateText: {
    color: '#979797',
    fontSize: 16,
  },
  typeText: {
    fontSize: 16
  },
  timeText: {
    fontSize: 16,
  },
  statusText: {
    color: item.processed ? '#158cba' : '#ff851b',
    fontSize: 14,
  }
})