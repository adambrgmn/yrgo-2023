import { DefaultTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Platform, StyleSheet, View } from 'react-native';

import { useTodos } from '../lib/data';

export default function CreateModalScreen() {
  const router = useRouter();
  const { query, create } = useTodos();

  const disabled = create.status === 'pending';

  return (
    <View style={styles.container}>
      <Button
        title="Create new item"
        disabled={disabled}
        onPress={() => {
          create.mutate({ title: 'Todo ' + ((query.data?.items.length ?? 0) + 1) }, { onSuccess: router.back });
        }}
      />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: 48,
    gap: 16,
  },
  button: {
    height: 40,
    backgroundColor: DefaultTheme.colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: DefaultTheme.colors.background,
  },
});
