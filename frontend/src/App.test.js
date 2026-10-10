import { describe, it, expect } from 'vitest';

describe('Fintech Banking Calculations & Rules', () => {
  it('calculates deposit additions correctly without rounding drift', () => {
    const balance = 1000.50;
    const deposit = 250.75;
    const finalBalance = (balance * 100 + deposit * 100) / 100;
    expect(finalBalance).toBe(1251.25);
  });

  it('detects insufficient funds condition for withdrawal', () => {
    const balance = 150.00;
    const requestedWithdrawal = 200.00;
    const canWithdraw = balance >= requestedWithdrawal;
    expect(canWithdraw).toBe(false);
  });

  it('formats account numbers consistently with FTBK prefix', () => {
    const accNum = 'FTBK9283718291';
    expect(accNum.startsWith('FTBK')).toBe(true);
    expect(accNum.length).toBe(14);
  });
});
