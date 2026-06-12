import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { TimerMode } from '@/stores/timerStore';

/**
 * @postcondition フォアグラウンド中も通知をバナー表示するようハンドラーを設定する
 * @invariant Webでは何もしない（expo-notificationsが未対応のため）
 */
export function configureNotificationHandler(): void {
  if (Platform.OS === 'web') return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/**
 * @postcondition 未許可ならネイティブの通知許可ダイアログを表示する。Webでは何もしない
 */
export async function requestNotificationPermissionAsync(): Promise<void> {
  if (Platform.OS === 'web') return;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }
}

const TIMER_END_MESSAGES: Record<'focus' | 'rest', (catName: string) => { title: string; body: string }> = {
  focus: (catName) => ({
    title: `${catName}が呼んでいるよ！`,
    body: '集中タイム終了！少し休憩しよう🍅',
  }),
  rest: (catName) => ({
    title: 'さあ、また頑張ろう！',
    body: `${catName}も応援してるよ🐱`,
  }),
};

/**
 * @precondition endAt はこれから迎える終了予定時刻（Unix ms、未来の時刻）
 * @postcondition ネイティブ環境でendAt時刻ちょうどに届く通知を予約し、識別子を返す
 * @invariant Webではnullを返し、何も予約しない（バックグラウンド通知が未対応のため）
 */
export async function scheduleTimerEndNotificationAsync(
  endAt: number,
  endingMode: TimerMode,
  catName: string
): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  const messageKey = endingMode === 'focus' ? 'focus' : 'rest';
  const { title, body } = TIMER_END_MESSAGES[messageKey](catName);

  return Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: endAt },
  });
}

/**
 * @precondition notificationId は scheduleTimerEndNotificationAsync が返した識別子
 * @postcondition ネイティブ環境で予約済み通知をキャンセルする。Webでは何もしない
 */
export async function cancelTimerNotificationAsync(notificationId: string): Promise<void> {
  if (Platform.OS === 'web') return;

  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
