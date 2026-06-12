import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { useSettingsStore } from '@/stores/settingsStore';
import { useStatsStore, type DailyStats, type StatsHistory } from '@/stores/statsStore';

// ── データヘルパー ────────────────────────────────────────────────────────

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

/** 今日を含む過去 n 日の YYYY-MM-DD 配列（古い順） */
function getLastNDays(n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toISOString().slice(0, 10);
  });
}

/** ある日付のデータを取得。なければ 0 埋め */
function getDayStats(
  date: string,
  today: DailyStats,
  history: StatsHistory
): { pomosCount: number; focusMinutes: number } {
  if (date === today.date) {
    return { pomosCount: today.pomosCount, focusMinutes: today.focusMinutes };
  }
  const h = history[date];
  return h ? { pomosCount: h.pomosCount, focusMinutes: h.focusMinutes } : { pomosCount: 0, focusMinutes: 0 };
}

/** ポモドーロ数 → アクティビティカラー */
function activityColor(pomos: number): string {
  if (pomos === 0) return Colors.creamDk;
  if (pomos <= 2) return Colors.peach;
  if (pomos <= 4) return Colors.pinkSoft;
  return Colors.pink;
}

/** 猫のセリフ */
function buildCatMessage(pomos: number, todos: number, catName: string) {
  if (pomos === 0 && todos === 0) {
    return { main: 'まだ今日は始まってないにゃ…', sub: `さあ、${catName}と一緒にがんばろう🐾` };
  }
  if (pomos >= 4) {
    return { main: 'すごい！今日はたくさん集中したね！', sub: 'よく頑張ったご褒美に一休みして🧡' };
  }
  if (todos >= 3) {
    return { main: 'タスクをいっぱい終わらせたね！', sub: `${catName}も誇らしいにゃ🎉` };
  }
  return { main: '今日もよく頑張ったね！', sub: '明日も一緒にがんばろ🐾' };
}

// ── メイン画面 ───────────────────────────────────────────────────────────

export default function StatsScreen() {
  const { catName } = useSettingsStore();
  const { today, streak, history } = useStatsStore();

  const last7  = getLastNDays(7);
  const last35 = getLastNDays(35);
  const todayStr = today.date;

  const week7Data = last7.map((date) => ({
    date,
    label: DAY_LABELS[new Date(date + 'T00:00:00').getDay()],
    isToday: date === todayStr,
    ...getDayStats(date, today, history),
  }));

  const maxFocusMinutes = Math.max(...week7Data.map((d) => d.focusMinutes), 1);

  const catMessage = buildCatMessage(today.pomosCount, today.todosDone, catName);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>きろく</Text>

        {/* 2×2 統計グリッド */}
        <View style={styles.grid}>
          <StatCard emoji="🍅" value={String(today.pomosCount)} label="今日のポモドーロ" />
          <StatCard emoji="✅" value={String(today.todosDone)}    label="完了タスク" />
          <StatCard emoji="⏰" value={String(today.focusMinutes)} label="集中時間（分）" />
          <StatCard emoji="🔥" value={String(streak.currentStreak)} label="連続日数" />
        </View>

        {/* 週間バーチャート */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>📊 今週の集中時間（分）</Text>
          <View style={styles.barChart}>
            {week7Data.map((d) => {
              const barHeight = d.focusMinutes === 0
                ? 4
                : Math.max(12, Math.round((d.focusMinutes / maxFocusMinutes) * 80));
              return (
                <View key={d.date} style={styles.barCol}>
                  {d.focusMinutes > 0 && (
                    <Text style={styles.barValue}>{d.focusMinutes}</Text>
                  )}
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor: d.isToday ? Colors.pink : Colors.pinkSoft,
                        opacity: d.focusMinutes === 0 ? 0.3 : 1,
                      },
                    ]}
                  />
                  <Text style={[styles.barLabel, d.isToday && styles.barLabelToday]}>
                    {d.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* アクティビティカレンダー（過去35日） */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>📅 アクティビティ（過去35日）</Text>
          <View style={styles.calendarGrid}>
            {last35.map((date) => {
              const { pomosCount } = getDayStats(date, today, history);
              const isToday = date === todayStr;
              return (
                <View
                  key={date}
                  style={[
                    styles.calCell,
                    { backgroundColor: activityColor(pomosCount) },
                    isToday && styles.calCellToday,
                  ]}
                />
              );
            })}
          </View>
          {/* 凡例 */}
          <View style={styles.legend}>
            <Text style={styles.legendText}>少ない</Text>
            {[0, 1, 3, 5].map((level) => (
              <View
                key={level}
                style={[styles.legendCell, { backgroundColor: activityColor(level) }]}
              />
            ))}
            <Text style={styles.legendText}>多い</Text>
          </View>
        </View>

        {/* 猫の一言カード */}
        <View style={[styles.card, styles.commentCard]}>
          <Text style={styles.cardHeader}>{catName}の一言</Text>
          <View style={styles.commentBody}>
            <Text style={styles.commentEmoji}>🐱</Text>
            <Text style={styles.commentText}>{catMessage.main}</Text>
            <Text style={styles.commentSubText}>{catMessage.sub}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ── サブコンポーネント ────────────────────────────────────────────────────

function StatCard({ emoji, value, label }: { emoji: string; value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ── スタイル ─────────────────────────────────────────────────────────────

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

  // 共通カード
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
    marginBottom: 16,
  },

  // 2×2グリッド
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: '47%',
    backgroundColor: Colors.cream,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 6,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  statEmoji:  { fontSize: 36 },
  statValue:  { fontSize: 32, fontWeight: '800', color: Colors.brown },
  statLabel:  { fontSize: 12, fontWeight: '600', color: Colors.brownMid, textAlign: 'center' },

  // 週間バーチャート
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 110,
    gap: 6,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  barValue: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.brownMid,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.brownLt,
  },
  barLabelToday: {
    color: Colors.pink,
    fontWeight: '800',
  },

  // アクティビティカレンダー
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  calCell: {
    width: '12%',    // 7列 × 約12% ≈ 84%（残り余白）
    aspectRatio: 1,
    borderRadius: 4,
  },
  calCellToday: {
    borderWidth: 2,
    borderColor: Colors.pink,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 10,
  },
  legendCell: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 10,
    color: Colors.brownLt,
    marginHorizontal: 2,
  },

  // 猫の一言
  commentCard: {
    marginBottom: 32,
  },
  commentBody: {
    alignItems: 'center',
    gap: 8,
  },
  commentEmoji:   { fontSize: 48 },
  commentText:    { fontSize: 16, fontWeight: '700', color: Colors.brown, textAlign: 'center' },
  commentSubText: { fontSize: 13, color: Colors.brownMid, textAlign: 'center' },
});
