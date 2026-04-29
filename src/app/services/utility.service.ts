import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtilityService {
  /**
   * Formats a number as a locale-aware currency string.
   * @example formatCurrency(4.5)  → "$4.50"
   */
  formatCurrency(value: number, currency = 'USD', locale = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  /**
   * Rounds a number to the specified number of decimal places.
   * @example round(4.555, 2) → 4.56
   */
  round(value: number, decimals = 2): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  // ── String helpers ─────────────────────────────────────────────────────────

  /**
   * Title-cases a string: "chocolate cake" → "Chocolate Cake".
   */
  toTitleCase(value: string): string {
    return value
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Truncates a string to `maxLength` characters, appending `…` if truncated.
   * @example truncate("Hello World", 7) → "Hello W…"
   */
  truncate(value: string, maxLength: number): string {
    if (value.length <= maxLength) return value;
    return value.slice(0, maxLength) + '…';
  }

  // ── Array helpers ──────────────────────────────────────────────────────────

  /**
   * Sums a numeric property across an array of objects.
   * @example sumBy([{qty:2},{qty:3}], 'qty') → 5
   */
  sumBy<T>(items: T[], key: keyof T): number {
    return items.reduce((acc, item) => {
      const v = item[key];
      return acc + (typeof v === 'number' ? v : 0);
    }, 0);
  }

  /**
   * Groups an array of objects by a string key.
   * @example groupBy(desserts, 'category')
   */
  groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
    return items.reduce(
      (acc, item) => {
        const groupKey = String(item[key]);
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(item);
        return acc;
      },
      {} as Record<string, T[]>,
    );
  }

  //  Date helpers

  /** Returns a human-readable date/time string for "now". */
  formatNow(locale = 'en-US'): string {
    return new Date().toLocaleString(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }
}
