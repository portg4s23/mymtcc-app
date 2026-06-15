import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

type Props = {
  visible: boolean;
  message?: string;
};

export const LoadingDialog: React.FC<Props> = ({
  visible,
  message = 'Processing...',
}) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.text}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#1b1d25',
    paddingVertical: 32,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 160,
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
});