import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  StyleSheet, Platform, KeyboardAvoidingView, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useSettingsStore, type CatColor } from '@/stores/settingsStore';
import { CAT_IMAGES_BY_COLOR } from '@/constants/cats';

const CAT_COLORS: { key: CatColor; label: string }[] = [
  { key: 'tabby',  label: 'キジトラ' },
  { key: 'black',  label: '黒猫' },
  { key: 'calico', label: '三毛' },
];

export default function OnboardingScreen() {
  const { update } = useSettingsStore();
  const [name, setName] = useState('');
  const [color, setColor] = useState<CatColor>('tabby');

  function handleStart() {
    const catName = name.trim() || 'むぎ';
    update({ catName, catColor: color, hasOnboarded: true });
    router.replace('/(tabs)');
  }

  return (
    <KeyboardAvoidingView
      style={styles.outer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 選択中の猫を大きく表示 */}
        <Image
          source={CAT_IMAGES_BY_COLOR[color].happy}
          style={styles.catImage}
          resizeMode="contain"
        />

        <Text style={styles.title}>ねこポモへようこそ！</Text>
        <Text style={styles.subtitle}>
          一緒に集中するねこを{'\n'}カスタマイズしよう🐾
        </Text>

        {/* 毛色えらび */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>毛色えらび</Text>
          <View style={styles.colorRow}>
            {CAT_COLORS.map((c) => {
              const isSelected = color === c.key;
              return (
                <TouchableOpacity
                  key={c.key}
                  style={[styles.colorItem, isSelected && styles.colorItemSelected]}
                  onPress={() => setColor(c.key)}
                  activeOpacity={0.75}
                >
                  <Image
                    source={CAT_IMAGES_BY_COLOR[c.key].idle}
                    style={styles.colorCatImage}
                    resizeMode="contain"
                  />
                  <Text style={[styles.colorLabel, isSelected && styles.colorLabelSelected]}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 名前入力 */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>ねこのなまえ</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="むぎ"
            placeholderTextColor={Colors.brownLt}
            maxLength={12}
            returnKeyType="done"
            onSubmitEditing={handleStart}
          />
          <Text style={styles.inputHint}>空欄のままにすると「むぎ」になるよ</Text>
        </View>

        {/* はじめようボタン */}
        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>▶ はじめよう！</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
    gap: 20,
  },
  catImage: {
    width: 160,
    height: 160,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.brown,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Colors.brownMid,
    textAlign: 'center',
    lineHeight: 24,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.creamDk,
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.brownMid,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 10,
  },
  colorItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: Colors.cream,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 6,
  },
  colorItemSelected: {
    borderColor: Colors.pink,
    backgroundColor: Colors.pinkBg,
  },
  colorCatImage: {
    width: 56,
    height: 56,
  },
  colorLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.brownMid,
  },
  colorLabelSelected: {
    color: Colors.pink,
  },
  input: {
    backgroundColor: Colors.cream,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.brown,
    textAlign: 'center',
  },
  inputHint: {
    fontSize: 11,
    color: Colors.brownLt,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.pink,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
  },
});
