import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isAdminEmail } from '@/lib/auth/admin';

describe('isAdminEmail', () => {
  beforeEach(() => {
    process.env.ADMIN_EMAILS = 'admin@waterlife.pl,support@waterlife.pl';
  });

  afterEach(() => {
    delete process.env.ADMIN_EMAILS;
  });

  it('returns false for undefined', () => {
    expect(isAdminEmail(undefined)).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isAdminEmail('')).toBe(false);
  });

  it('returns false for unknown email', () => {
    expect(isAdminEmail('random@gmail.com')).toBe(false);
  });

  it('returns true for admin email', () => {
    expect(isAdminEmail('admin@waterlife.pl')).toBe(true);
  });

  it('returns true for second admin email', () => {
    expect(isAdminEmail('support@waterlife.pl')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isAdminEmail('ADMIN@WATERLIFE.PL')).toBe(true);
    expect(isAdminEmail('Admin@Waterlife.Pl')).toBe(true);
  });

  it('returns false and warns when ADMIN_EMAILS is not set', () => {
    delete process.env.ADMIN_EMAILS;
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(isAdminEmail('admin@waterlife.pl')).toBe(false);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('ADMIN_EMAILS'));
    warn.mockRestore();
  });
});
