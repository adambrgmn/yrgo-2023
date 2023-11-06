import { DefaultTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Button, Platform, StyleSheet, TextInput, View } from 'react-native';

import { useTodos } from '../lib/data';

export default function CreateModalScreen() {
  const router = useRouter();
  const { create } = useTodos();
  const ref = useRef<TextInput>(null);
  const [title, setTitle] = useState('');
  const disabled = create.status === 'pending' || title === '';

  function handleCreate() {
    if (title === '') return;
    create.mutate({ title }, { onSuccess: router.back });
  }

  return (
    <View style={styles.container}>
      <TextInput
        ref={ref}
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        onLayout={() => ref.current?.focus()}
        onSubmitEditing={handleCreate}
      />
      <Button title="Create new item" disabled={disabled} onPress={handleCreate} />

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
  input: {
    height: 40,
    padding: 10,
    backgroundColor: DefaultTheme.colors.card,
    borderRadius: 12,
  },
});
