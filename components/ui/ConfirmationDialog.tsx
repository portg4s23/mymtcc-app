import { useTheme } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
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
  loading?: boolean;
  loadingMessage?: string;
  clockType?: 'In' | 'Out';
  time?: string
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmLoadingDialog: React.FC<Props> = ({
  visible,
  loading = false,
  loadingMessage = 'Processing...',
  clockType,
  time,
  onConfirm,
  onCancel,
}) => {

  const theme = useTheme();

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.backdrop}>
        <View style={{ ...styles.container, backgroundColor: theme.backgroundSecondary }}>

          <View style={{ marginBottom: 12 }}>
            <Ionicons name="checkmark-circle-outline" size={40} color={theme.text} />
          </View>

          {!loading ? (
            <>
              <Text style={{ ...styles.title, color: theme.text }}>Confirm Action</Text>
              <Text style={{ ...styles.message, color: theme.textSecondary }}>
                Are you sure you want to{"\n"}
                <Text style={{ fontWeight: "bold", color: theme.textSecondary }}>
                  Clock {clockType}
                </Text>{" "}
                at{" "}
                <Text style={{ fontWeight: "bold", color: theme.textSecondary }}>
                  {time}
                </Text>
                ?
              </Text>

              <View style={styles.buttonRow}>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{ ...styles.button, backgroundColor: theme.primaryActive }}
                  onPress={onConfirm}
                >
                  <Text style={{ ...styles.confirmText, color: theme.text }}>Confirm</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{ ...styles.button, backgroundColor: theme.background }}
                  onPress={onCancel}
                >
                  <Text style={{ ...styles.cancelText, color: theme.text }}>Cancel</Text>
                </TouchableOpacity>

              </View>
            </>
          ) : (
            <>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={{ ...styles.loadingText, color: theme.text }}>{loadingMessage}</Text>
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
    padding: 24,
    borderRadius: 16,
    width: '85%',
    maxWidth: 360,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  message: {
    lineHeight: 20,
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 32,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  buttonRow: {
    width: '100%',
    flexDirection: 'column',
    gap: 12,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#2f3441',
  },
  cancelText: {
    fontWeight: '600',
  },
  confirmText: {
    fontWeight: '600',
  },
});