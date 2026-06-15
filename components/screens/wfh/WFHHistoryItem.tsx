import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
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
}

const WFHHistoryItem = ({ item, isFirst, isLast }: Props) => {
  return (
    <ThemedView style={[
      styles(item).container,
      isFirst && styles(item).containerFirst,
      isLast && styles(item).containerLast,
      !isFirst && !isLast && styles(item).containerMiddle
    ]}>

      <View style={styles(item).innerContainer}>

        {/* Icon */}
        <View style={styles(item).iconContainer}>
          {item.checkTypeRevised.name === "In" && (
            <Feather name="log-in" size={16} color="#158cba" />
          )}
          {item.checkTypeRevised.name === "Out" && (
            <Feather name="log-out" size={16} color="#ff851b" />
          )}
        </View>

        {/* Meta */}
        <View style={styles(item).metaContainer}>

          {/* Left */}
          <View style={styles(item).metaLeft}>
            <ThemedText style={styles(item).dateText}>{dayjs(item.check_time).format('DD MMM YY')}</ThemedText>
            <ThemedText style={styles(item).typeText}>{item.checkTypeRevised.name}</ThemedText>
          </View>

          {/* Right */}
          <View style={styles(item).metaRight}>
            <ThemedText style={styles(item).timeText}>{dayjs(item.check_time).format('HH:mm')}</ThemedText>
            <ThemedText style={styles(item).statusText}>
              {item.processed ? '' : 'Pending'}
            </ThemedText>
          </View>

        </View>

      </View>

    </ThemedView>
  )
}

export default WFHHistoryItem

const styles = (item: WFHHistoryItemType) => StyleSheet.create({
  container: {
    padding: 12, borderRadius: 0, borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#141b1e', backgroundColor: '#0a0e10'
  },
  containerFirst: {
    borderTopStartRadius: 12, borderTopEndRadius: 12, borderTopWidth: 1, borderColor: '#141b1e'
  },
  containerLast: {
    borderBottomStartRadius: 12, borderBottomEndRadius: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#141b1e'
  },
  containerMiddle: {
    borderTopWidth: 1, borderColor: '#141b1e'
  },
  innerContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12
  },
  iconContainer: {
    flexDirection: 'row', alignItems: 'center', padding: 8, width: 40, height: 40, borderRadius: 12, justifyContent: 'center', backgroundColor: '#191b21'
  },
  metaContainer: {
    flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center'
  },
  metaLeft: {
    flex: 1
  },
  metaRight: {
    alignSelf: 'flex-end', alignItems: 'flex-end'
  },
  dateText: {
    color: '#979797',
    fontSize: 14,
  },
  typeText: {
    fontSize: 16
  },
  timeText: {
    fontSize: 16
  },
  statusText: {
    color: item.processed ? '#158cba' : '#ff851b',
    fontSize: 14,
  }
})