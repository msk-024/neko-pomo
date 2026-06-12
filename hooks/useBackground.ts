import { useState, useEffect } from 'react';
import { getBgType, BgType } from '@/constants/backgrounds';
import { getCurrentHour } from '@/utils/time';

/**
 * @postcondition 現在時刻に対応するBgTypeを返す。10分ごとに再判定する。
 */
export function useBackground(): BgType {
  const [bgType, setBgType] = useState<BgType>(() => getBgType(getCurrentHour()));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBgType(getBgType(getCurrentHour()));
    }, 10 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return bgType;
}
