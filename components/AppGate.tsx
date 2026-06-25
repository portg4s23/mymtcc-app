import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/use-theme-color';
import React from 'react';
import { View } from 'react-native';
import CustomSpinner from './ui/Spinner';

export const AppGate = ({ children }: { children: React.ReactNode }) => {

  const theme = useTheme()
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
        <CustomSpinner />
      </View>
    );
  }

  return children;
};