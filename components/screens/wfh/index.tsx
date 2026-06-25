import { ThemedView } from '@/components/themed-view';
import { AppHeader } from '@/components/ui/AppHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SignTab from './Sign';
import WFHRequests from './WFHRequests';


const WFHScreen = () => {

  const navigation = useNavigation();

  const [index, setIndex] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ width: 200, alignSelf: 'center', marginBottom: 8 }}>
          <SegmentedControl
            tabs={["Sign", "Requests"]}
            value={index}
            onChange={setIndex}
          />
        </View>
      ),
    });
  }, []);

  return (

    <>
      <AppHeader
        title="Remote Attendance"
        right={(
          <View style={{ width: 150 }}>
            <SegmentedControl
              tabs={["Sign", "Requests"]}
              value={index}
              onChange={setIndex}
            />
          </View>
        )}
      />

      <ThemedView style={styles.container}>

        <View
          style={{
            flex: 1,
            display: index === 0 ? 'flex' : 'none',
          }}
        >
          <SignTab inView={index === 0} />
        </View>

        <View
          style={{
            flex: 1,
            display: index === 1 ? 'flex' : 'none',
          }}
        >
          <WFHRequests inView={index === 1} />
        </View>

      </ThemedView>
    </>
  )
}

export default WFHScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 0,
  },
})