import { getTintColors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  title: string;
  isMock?: boolean
  left?: React.ReactNode
}

const DashboardSectionHeader = ({ title, isMock, left }: Props) => {

  const theme = useTheme();
  const mockTintColor = getTintColors("warning");

  return (
    <View style={{ ...styles.container, }}>
      <View style={{ ...styles.titleContainer, }}>
        <Text style={{ ...styles.titleText, color: theme.text }}>{title}</Text>
        {isMock && (
          <View style={{ ...styles.mockTagContainer, backgroundColor: mockTintColor.bg2 }}>
            <Text style={{ ...styles.mockTagText, color: mockTintColor.fg }}>Mock</Text>
          </View>
        )}
      </View>
      {left && (
        <View>
          {left}
        </View>
      )}
    </View>
  )
}

export default DashboardSectionHeader

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '500',
  },
  mockTagContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  mockTagText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
})