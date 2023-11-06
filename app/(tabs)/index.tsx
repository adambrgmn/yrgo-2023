import Icon from '@expo/vector-icons/Feather';
import { DefaultTheme } from '@react-navigation/native';
import { Link } from 'expo-router';
import { Fragment } from 'react';
import { Pressable, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import { IconButton } from '../../lib/components/buttons';
import { useTodo, useTodos } from '../../lib/data';

export default function TodosScreen() {
  const { query } = useTodos();
  const items = query.data?.items ?? [];

  const sections = [
    { title: 'Active', data: [] as string[] },
    { title: 'Completed', data: [] as string[] },
  ] as const;

  for (const item of items) {
    sections[item.state === 'active' ? 0 : 1].data.push(item.id);
  }

  return (
    <View style={screen.container}>
      <SectionList
        sections={items.length === 0 ? [] : sections}
        keyExtractor={(item) => item}
        renderItem={({ item, index, section }) => (
          <Animated.View key={item} entering={FadeInDown} exiting={FadeOutDown}>
            <Todo id={item} first={index === 0} last={index === section.data.length - 1} />
          </Animated.View>
        )}
        renderSectionHeader={({ section }) => (
          <Fragment>
            <View style={{ height: 16 }} />
            <Text>{section.title}</Text>
            <View style={{ height: 8 }} />
          </Fragment>
        )}
        ItemSeparatorComponent={() => (
          <View style={screen.separator}>
            <View style={screen.separatorLine} />
          </View>
        )}
        ListEmptyComponent={<EmptyList />}
      />
    </View>
  );
}

const screen = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: 32,
  },
  separator: {
    position: 'relative',
    height: 1,
    width: '100%',
    backgroundColor: DefaultTheme.colors.card,
    paddingLeft: 48,
  },
  separatorLine: {
    borderBottomColor: DefaultTheme.colors.border,
    borderBottomWidth: 1,
  },
});

function Todo({ id, first, last }: { id: string; first: boolean; last: boolean }) {
  const { query, update, remove } = useTodo(id);
  if (query.status !== 'success' || query.data == null) return null;

  const todo = query.data;

  return (
    <TouchableOpacity
      style={StyleSheet.flatten([
        todoStyle.container,
        first ? todoStyle.containerTop : {},
        last ? todoStyle.containerBottom : {},
      ])}
      onPress={() => update.mutate({ state: todo.state === 'completed' ? 'active' : 'completed' })}
    >
      <Fragment>
        {todo.state === 'completed' ? (
          <Icon name="check" color="green" size={24} />
        ) : (
          <View style={{ width: 24, height: 24 }} />
        )}
        <Text style={todoStyle.title}>{todo.title}</Text>
        <IconButton icon="trash" size={16} label="Remove" onPress={() => remove.mutate()} />
      </Fragment>
    </TouchableOpacity>
  );
}

const todoStyle = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 12,
    gap: 12,
    backgroundColor: '#ffffff',
  },
  containerTop: { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  containerBottom: { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
  title: {
    fontSize: 18,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
});

function EmptyList() {
  return (
    <View>
      <Text>No items right now...</Text>
      <Link href="/create" asChild>
        <Pressable>
          <Text>Create new item</Text>
        </Pressable>
      </Link>
    </View>
  );
}
