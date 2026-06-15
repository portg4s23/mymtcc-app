import { StyleSheet, Text, View } from 'react-native';

type AppHeaderProps = {
  title: string;
};

export const AppHeader = ({ title }: AppHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
});