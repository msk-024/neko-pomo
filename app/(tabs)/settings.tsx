import { View, Text, TextInput, Switch, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { useSettingsStore, type CatColor } from '@/stores/settingsStore';

const CAT_COLORS: { key: CatColor; label: string; emoji: string }[] = [
  { key: 'tabby',  label: 'キジトラ', emoji: '🐱' },
  { key: 'black',  label: '黒猫',    emoji: '🐈‍⬛' },
  { key: 'calico', label: '三毛',    emoji: '🐈' },
];

export default function SettingsScreen() {
  const settings = useSettingsStore();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>せってい</Text>

        {/* ねこのなまえ */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>🐱 ねこのなまえ</Text>
          <TextInput
            style={styles.nameInput}
            value={settings.catName}
            onChangeText={(text) => settings.update({ catName: text })}
            placeholder="むぎ"
            placeholderTextColor={Colors.brownLt}
          />
        </View>

        {/* タイマー設定 */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>⏰ タイマー設定</Text>
          <TimerRow
            emoji="🍅"
            label="集中時間"
            value={settings.focusMinutes}
            onchange={(v) => settings.update({ focusMinutes: v })}
          />
          <View style={styles.divider} />
          <TimerRow
            emoji="🫐"
            label="休憩時間"
            value={settings.breakMinutes}
            onchange={(v) => settings.update({ breakMinutes: v })}
          />
          <View style={styles.divider} />
          <TimerRow
            emoji="🌿"
            label="長休憩"
            value={settings.longBreakMinutes}
            onchange={(v) => settings.update({ longBreakMinutes: v })}
          />
        </View>

        {/* 毛色えらび */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>🐱 毛色えらび</Text>
          <View style={styles.colorRow}>
            {CAT_COLORS.map((c) => {
              const isSelected = settings.catColor === c.key;
              return (
                <TouchableOpacity
                  key={c.key}
                  style={[styles.colorItem, isSelected && styles.colorItemSelected]}
                  onPress={() => settings.update({ catColor: c.key })}
                  activeOpacity={0.75}
                >
                  <Text style={styles.colorEmoji}>{c.emoji}</Text>
                  <Text style={[styles.colorLabel, isSelected && styles.colorLabelSelected]}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 通知 */}
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>🔔 通知</Text>
            <Switch
              value={settings.notificationEnabled}
              onValueChange={(v) => settings.update({ notificationEnabled: v })}
              trackColor={{ true: Colors.pink, false: Colors.peach }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function TimerRow({
  emoji, label, value, onchange,
}: {
  emoji: string;
  label: string;
  value: number;
  onchange: (v: number) => void;
}) {
  return (
    <View style={styles.timerRow}>
      <Text style={styles.timerLabel}>{emoji} {label}</Text>
      <View style={styles.stepper}>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => onchange(Math.max(1, value - 1))}
        >
          <Text style={styles.stepBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.stepValue}>{value}分</Text>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => onchange(Math.min(60, value + 1))}
        >
          <Text style={styles.stepBtnText}>＋</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamDk,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.brown,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: Colors.cream,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.brownMid,
    marginBottom: 14,
  },
  nameInput: {
    backgroundColor: Colors.creamDk,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.brown,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.creamDk,
    marginVertical: 4,
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  timerLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.brown,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.creamDk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.brownMid,
  },
  stepValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.pink,
    minWidth: 44,
    textAlign: 'center',
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colorItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: Colors.creamDk,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 6,
  },
  colorItemSelected: {
    borderColor: Colors.pink,
    backgroundColor: Colors.pinkBg,
  },
  colorEmoji: {
    fontSize: 32,
  },
  colorLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.brownMid,
  },
  colorLabelSelected: {
    color: Colors.pink,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.brown,
  },
});
