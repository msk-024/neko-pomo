import type { TimerMode } from "@/stores/timerStore";

/** 完了メッセージの分類。break/longBreak はどちらも休憩系（'rest'）として扱う */
export type CompletedKind = "focus" | "rest";

export function completedKindOf(mode: TimerMode): CompletedKind {
  return mode === "focus" ? "focus" : "rest";
}

/** モードの表示名 */
export const MODE_LABELS: Record<TimerMode, string> = {
  focus: "集中",
  break: "休憩",
  longBreak: "長休憩",
};

/** タイマー完了時のメッセージ（完了オーバーレイとブラウザタブタイトルで共用） */
export const COMPLETION_MESSAGES = {
  focus: {
    title: "🍅 集中おわったよ！",
    sub: (catName: string) => `${catName}と一緒に頑張ったね！`,
    buttonLabel: "🫐 休憩スタート",
  },
  rest: {
    title: "☕ 休憩おわり！",
    sub: (catName: string) => `さあ、また頑張ろう！${catName}も応援してるよ`,
    buttonLabel: "🍅 集中スタート",
  },
} as const;
