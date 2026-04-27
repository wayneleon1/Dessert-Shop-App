import { Injectable, signal, computed } from '@angular/core';
import { UtilityService } from './utility.service';

export type LogLevel = 'info' | 'warn' | 'error' | 'action';

export interface LogEntry {
  id: number;
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class LoggingService {
  private utility = new UtilityService(); // direct instantiation to avoid circular injection
  private _counter = 0;

  private readonly _logs = signal<LogEntry[]>([]);

  /** Public read-only view of all log entries. */
  readonly logs = this._logs.asReadonly();

  /** Total number of logged entries. */
  readonly logCount = computed(() => this._logs().length);

  /** Only error-level entries. */
  readonly errors = computed(() => this._logs().filter((e) => e.level === 'error'));

  /** Only user-action entries. */
  readonly actions = computed(() => this._logs().filter((e) => e.level === 'action'));

  // ── Logging methods ────────────────────────────────────────────────────────

  log(message: string, context?: Record<string, unknown>): void {
    this._append('info', message, context);
    console.log(`[INFO] ${message}`, context ?? '');
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this._append('warn', message, context);
    console.warn(`[WARN] ${message}`, context ?? '');
  }

  error(message: string, context?: Record<string, unknown>): void {
    this._append('error', message, context);
    console.error(`[ERROR] ${message}`, context ?? '');
  }

  /**
   * Records a user-initiated action (add-to-cart, remove, confirm order, etc.)
   * This is the primary method components should call for user interaction tracking.
   */
  action(message: string, context?: Record<string, unknown>): void {
    this._append('action', message, context);
    console.log(`[ACTION] ${message}`, context ?? '');
  }

  /** Removes all stored log entries. */
  clearLogs(): void {
    this._logs.set([]);
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private _append(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    const entry: LogEntry = {
      id: ++this._counter,
      level,
      message,
      timestamp: this.utility.formatNow(),
      context,
    };
    // Keep at most 200 entries to avoid unbounded memory growth
    this._logs.update((logs) => [...logs.slice(-199), entry]);
  }
}
