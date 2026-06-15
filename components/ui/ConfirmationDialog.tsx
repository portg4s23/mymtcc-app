import React from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  visible: boolean;
  loading?: boolean; // 👈 Apollo controls this
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loadingMessage?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmLoadingDialog: React.FC<Props> = ({
  visible,
  loading = false,
  title = 'Confirm',
  message = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loadingMessage = 'Processing...',
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {!loading ? (
            <>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onCancel}
                >
                  <Text style={styles.cancelText}>{cancelText}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={onConfirm}
                >
                  <Text style={styles.confirmText}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>{loadingMessage}</Text>
            </>
          )}
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
    padding: 24,
    borderRadius: 16,
    width: '85%',
    maxWidth: 360,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 24,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#2f3441',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  cancelText: {
    color: 'white',
    fontWeight: '500',
  },
  confirmText: {
    color: 'white',
    fontWeight: '600',
  },
});