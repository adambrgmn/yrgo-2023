import Icon from '@expo/vector-icons/Feather';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: { name: React.ComponentProps<typeof Icon>['name']; color: string }) {
  return <Icon size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#2f95dc' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Todo List',
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
          headerRight: () => (
            <Link href="/create" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Icon name="plus" size={25} color="#000" style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }} />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Settings', tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} /> }}
      />
    </Tabs>
  );
}
