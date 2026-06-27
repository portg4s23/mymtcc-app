import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Pill } from '@/components/ui/Pill';
import { getTintColors, ThemeType } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WorkFromHomeSchedulesNodeType } from './WFHRequests';


interface Props {
  item: WorkFromHomeSchedulesNodeType;
  isFirst: boolean;
  isLast: boolean;
  theme: ThemeType
}

const WFHRequestItem = ({ item, isFirst, isLast, theme }: Props) => {

  const inTintColor = getTintColors("neutral")

  return (
    <ThemedView style={[
      styles(item).container,
      { backgroundColor: theme.backgroundSecondary },
    ]}>

      <View style={styles(item).innerContainer}>

        {/* Icon */}
        <View style={{ ...styles(item).iconContainer, backgroundColor: inTintColor.bg }}>
          <Feather name="home" size={16} color={inTintColor.fg} />
        </View>

        {/* Meta */}
        <View style={styles(item).metaContainer}>

          {/* Left */}
          <View style={styles(item).metaLeft}>
            <ThemedText style={{ ...styles(item).typeText, color: theme.text }}>
              {`${dayjs(item.from_date).format('DD MMM YY')} - ${dayjs(item.to_date).format('DD MMM YY')}`}</ThemedText>
            <ThemedText style={{ ...styles(item).dateText, color: theme.textTertiary }}>{item.details}</ThemedText>
          </View>

          {/* Right */}
          <View style={styles(item).metaRight}>
            {/* {item.status === "Pending" && <CustomSpinner size={16} />} */}
            {item.status && <Pill variant={
              item.status === "Pending" ? "info"
                : item.status === "Approved" ? "success"
                  : item.status === "Rejected" ? "danger"
                    : "danger"}
              label={item.status}
              style={{ borderWidth: 0 }}
            />}
          </View>

        </View>

      </View>

    </ThemedView>
  )
}

export default WFHRequestItem

const styles = (item: WorkFromHomeSchedulesNodeType) => StyleSheet.create({
  container: {
    paddingHorizontal: 12, paddingVertical: 12, borderRadius: 12,
  },
  containerFirst: {
    borderTopStartRadius: 12, borderTopEndRadius: 12,
  },
  containerLast: {
    borderTopWidth: 1, borderColor: '#141b1e',
    borderBottomStartRadius: 12, borderBottomEndRadius: 12,
  },
  containerMiddle: {
    borderTopWidth: 1, borderColor: '#141b1e'
  },
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
    fontSize: 14,
  },
  typeText: {
    fontSize: 13
  },
  statusText: {
    // color: item.processed ? '#158cba' : '#ff851b',
    fontSize: 14,
  }
})