import { describe, it, expect, vi } from 'vitest';
import { formatTimeAgo } from '../core/formatDate.js';

describe('formatTimeAgo', () => {
  it('秒単位のテスト (10秒前)', () => {
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - 10 * 1000);
    expect(formatTimeAgo(tenSecondsAgo)).toBe('10秒前');
  });

  it('分単位のテスト (5分前)', () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    expect(formatTimeAgo(fiveMinutesAgo)).toBe('5分前');
  });

  it('時間単位のテスト (2時間前)', () => {
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    expect(formatTimeAgo(twoHoursAgo)).toBe('2時間前');
  });

  it('日単位のテスト (3日前)', () => {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    expect(formatTimeAgo(threeDaysAgo)).toBe('3日前');
  });

  it('月単位のテスト (2ヶ月前)', () => {
    const now = new Date();
    const twoMonthsAgo = new Date(now.getTime() - 2 * 30 * 24 * 60 * 60 * 1000);
    expect(formatTimeAgo(twoMonthsAgo)).toBe('2ヶ月前');
  });

  it('年単位のテスト (1年前)', () => {
    const now = new Date();
    const oneYearAgo = new Date(now.getTime() - 12 * 30 * 24 * 60 * 60 * 1000);
    expect(formatTimeAgo(oneYearAgo)).toBe('1年前');
  });

  it('たった今のテスト (時間差なし)', () => {
    const now = new Date();
    expect(formatTimeAgo(now)).toBe('たった今');
  });
});
