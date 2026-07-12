import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { Colors } from "@/constants/colors";
import { useSettingsStore } from "@/stores/settingsStore";
import {
  useStatsStore,
  type DailyStats,
  type StatsHistory,
} from "@/stores/statsStore";
import { getTodayString, toDateString } from "@/utils/time";

// ── データヘルパー ────────────────────────────────────────────────────────

const DAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

/** 履歴の保持が30日分なので、さかのぼれるのは4週間前まで */
const MAX_WEEK_OFFSET = 4;

/** 今日を含む過去 n 日の YYYY-MM-DD 配列（古い順・端末ローカル基準） */
function getLastNDays(n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return toDateString(d);
  });
}

/**
 * weekOffset週前の月曜始まりの1週間（YYYY-MM-DD×7、古い順）
 * @precondition weekOffset >= 0（0=今週、1=先週…）
 */
function getWeekDates(weekOffset: number): string[] {
  const today = new Date(getTodayString() + "T00:00:00");
  const daysSinceMonday = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysSinceMonday - weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return toDateString(d);
  });
}

/** 週送りヘッダー用ラベル（今週 / 先週 / n週間前） */
function weekOffsetLabel(weekOffset: number): string {
  if (weekOffset === 0) return "今週";
  if (weekOffset === 1) return "先週";
  return `${weekOffset}週間前`;
}

/** 「M/D〜M/D」形式の週範囲ラベル */
function weekRangeLabel(dates: string[]): string {
  const format = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };
  return `${format(dates[0])}〜${format(dates[6])}`;
}

/** ある日付のデータを取得。なければ 0 埋め */
function getDayStats(
  date: string,
  today: DailyStats,
  history: StatsHistory,
): { pomosCount: number; focusMinutes: number } {
  if (date === today.date) {
    return { pomosCount: today.pomosCount, focusMinutes: today.focusMinutes };
  }
  const h = history[date];
  return h
    ? { pomosCount: h.pomosCount, focusMinutes: h.focusMinutes }
    : { pomosCount: 0, focusMinutes: 0 };
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
    return {
      main: "まだ今日は始まってないにゃ…",
      sub: `さあ、${catName}と一緒にがんばろう🐾`,
    };
  }
  if (pomos >= 4) {
    return {
      main: "すごい！今日はたくさん集中したね！",
      sub: "よく頑張ったご褒美に一休みして🧡",
    };
  }
  if (todos >= 3) {
    return {
      main: "タスクをいっぱい終わらせたね！",
      sub: `${catName}も誇らしいにゃ🎉`,
    };
  }
  return { main: "今日もよく頑張ったね！", sub: "明日も一緒にがんばろ🐾" };
}

// ── メイン画面 ───────────────────────────────────────────────────────────

export default function StatsScreen() {
  const { catName } = useSettingsStore();
  const { today, streak, history } = useStatsStore();
  // 週間チャートの表示週（0=今週、1=先週…）
  const [weekOffset, setWeekOffset] = useState(0);

  const last35 = getLastNDays(35);
  const todayStr = today.date;

  const weekDates = getWeekDates(weekOffset);
  const week7Data = weekDates.map((date) => ({
    date,
    label: DAY_LABELS[new Date(date + "T00:00:00").getDay()],
    isToday: date === todayStr,
    ...getDayStats(date, today, history),
  }));

  const maxFocusMinutes = Math.max(...week7Data.map((d) => d.focusMinutes), 1);

  const catMessage = buildCatMessage(
    today.pomosCount,
    today.todosDone,
    catName,
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>きろく</Text>

        {/* 2×2 統計グリッド */}
        <View style={styles.grid}>
          <StatCard
            emoji="🍅"
            value={String(today.pomosCount)}
            label="今日のポモドーロ"
          />
          <StatCard
            emoji="✅"
            value={String(today.todosDone)}
            label="完了タスク"
          />
          <StatCard
            emoji="⏰"
            value={String(today.focusMinutes)}
            label="集中時間（分）"
          />
          <StatCard
            emoji="🔥"
            value={String(streak.currentStreak)}
            label="連続日数"
          />
        </View>

        {/* 週間バーチャート（矢印で週送り） */}
        <View style={styles.card}>
          <View style={styles.weekNavRow}>
            <Text style={styles.cardHeaderNoMargin}>📊 集中時間（分）</Text>
            <View style={styles.weekNav}>
              <TouchableOpacity
                style={[
                  styles.weekNavButton,
                  weekOffset >= MAX_WEEK_OFFSET && styles.weekNavButtonDisabled,
                ]}
                onPress={() =>
                  setWeekOffset((w) => Math.min(w + 1, MAX_WEEK_OFFSET))
                }
                disabled={weekOffset >= MAX_WEEK_OFFSET}
              >
                <Text style={styles.weekNavArrow}>‹</Text>
              </TouchableOpacity>
              <View style={styles.weekNavLabelBox}>
                <Text style={styles.weekNavLabel}>
                  {weekOffsetLabel(weekOffset)}
                </Text>
                <Text style={styles.weekNavRange}>
                  {weekRangeLabel(weekDates)}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.weekNavButton,
                  weekOffset === 0 && styles.weekNavButtonDisabled,
                ]}
                onPress={() => setWeekOffset((w) => Math.max(w - 1, 0))}
                disabled={weekOffset === 0}
              >
                <Text style={styles.weekNavArrow}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.barChart}>
            {week7Data.map((d) => {
              const barHeight =
                d.focusMinutes === 0
                  ? 4
                  : Math.max(
                      12,
                      Math.round((d.focusMinutes / maxFocusMinutes) * 80),
                    );
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
                        backgroundColor: d.isToday
                          ? Colors.pink
                          : Colors.pinkSoft,
                        opacity: d.focusMinutes === 0 ? 0.3 : 1,
                      },
                    ]}
                  />
                  <Text
                    style={[styles.barLabel, d.isToday && styles.barLabelToday]}
                  >
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
                style={[
                  styles.legendCell,
                  { backgroundColor: activityColor(level) },
                ]}
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

function StatCard({
  emoji,
  value,
  label,
}: {
  emoji: string;
  value: string;
  label: string;
}) {
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
    fontWeight: "800",
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
    fontWeight: "700",
    color: Colors.brownMid,
    marginBottom: 16,
  },
  cardHeaderNoMargin: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.brownMid,
  },

  // 週送りナビゲーション
  weekNavRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 8,
  },
  weekNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  weekNavButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.creamDk,
    alignItems: "center",
    justifyContent: "center",
  },
  weekNavButtonDisabled: {
    opacity: 0.35,
  },
  weekNavArrow: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.brown,
    lineHeight: 20,
  },
  weekNavLabelBox: {
    alignItems: "center",
    minWidth: 76,
  },
  weekNavLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.brown,
  },
  weekNavRange: {
    fontSize: 10,
    color: Colors.brownLt,
  },

  // 2×2グリッド
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: "47%",
    backgroundColor: Colors.cream,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    gap: 6,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  statEmoji: { fontSize: 36 },
  statValue: { fontSize: 32, fontWeight: "800", color: Colors.brown },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.brownMid,
    textAlign: "center",
  },

  // 週間バーチャート
  barChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 110,
    gap: 6,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  barValue: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.brownMid,
  },
  bar: {
    width: "100%",
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.brownLt,
  },
  barLabelToday: {
    color: Colors.pink,
    fontWeight: "800",
  },

  // アクティビティカレンダー
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  calCell: {
    width: "12%", // 7列 × 約12% ≈ 84%（残り余白）
    aspectRatio: 1,
    borderRadius: 4,
  },
  calCellToday: {
    borderWidth: 2,
    borderColor: Colors.pink,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
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
    alignItems: "center",
    gap: 8,
  },
  commentEmoji: { fontSize: 48 },
  commentText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.brown,
    textAlign: "center",
  },
  commentSubText: { fontSize: 13, color: Colors.brownMid, textAlign: "center" },
});
