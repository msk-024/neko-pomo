import { View, Text, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors } from '@/constants/colors';
import { CatHeader } from '@/components/cat/CatHeader';

const TAB_ICONS: Record<string, string> = {
  index:    '🏠',
  stats:    '📊',
  settings: '⚙️',
};

export default function TabLayout() {
  return (
    // PC表示時：画面中央に最大430pxで収める。モバイルはflex:1のまま
    <View style={styles.outer}>
      <View style={styles.inner}>
        {/* 全タブ共通の猫エリア（背景画像はここのみ） */}
        <CatHeader />

        {/* 各タブのコンテンツ（下半分） */}
        <Tabs
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: Colors.pink,
          tabBarInactiveTintColor: Colors.brownMid,
          tabBarStyle: {
            backgroundColor: Colors.cream,
            borderTopWidth: 1,
            borderTopColor: Colors.peach,
            height: 60,
            paddingBottom: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>
              {TAB_ICONS[route.name] ?? '●'}
            </Text>
          ),
          headerShown: false,
        })}
      >
        <Tabs.Screen name="index"    options={{ tabBarLabel: 'ホーム' }} />
        <Tabs.Screen name="stats"    options={{ tabBarLabel: 'きろく' }} />
        <Tabs.Screen name="settings" options={{ tabBarLabel: 'せってい' }} />
      </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#C4A882', // アプリ外側の木目調背景（PC用）
    ...Platform.select({ web: { alignItems: 'center' as const }, default: {} }),
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    backgroundColor: Colors.creamDk,
    // Webのみ影をつけてスマホ感を演出
    ...Platform.select({
      web: {
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 0 },
      } as object,
      default: {},
    }),
  },
});
