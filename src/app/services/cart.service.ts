import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Dessert, CartItem } from '../models/dessert.model';
import { UtilityService } from './utility.service';
import { LoggingService } from './logging.service';

const CART_STORAGE_KEY = 'dessert_shop_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private utility = inject(UtilityService);
  private logger = inject(LoggingService);

  private _items = signal<CartItem[]>(this._loadFromStorage());

  readonly items = this._items.asReadonly();

  readonly totalItems = computed(() => this._items().reduce((sum, item) => sum + item.quantity, 0));

  readonly orderTotal = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity * item.dessert.price, 0),
  );

  /** Formatted order total string, e.g. "$12.50". */
  readonly formattedOrderTotal = computed(() => this.utility.formatCurrency(this.orderTotal()));

  constructor() {
    // Persist cart to localStorage whenever items change
    effect(() => {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this._items()));
      } catch (err) {
        this.logger.warn('Could not persist cart to localStorage', { err });
      }
    });
  }

  getQuantity(dessertId: number): number {
    return this._items().find((i) => i.dessert.id === dessertId)?.quantity ?? 0;
  }

  addToCart(dessert: Dessert): void {
    const current = this._items();
    const idx = current.findIndex((i) => i.dessert.id === dessert.id);
    if (idx >= 0) {
      const updated = [...current];
      updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
      this._items.set(updated);
    } else {
      this._items.set([...current, { dessert, quantity: 1 }]);
    }
    this.logger.action('Added to cart', { dessertId: dessert.id, name: dessert.name });
  }

  increment(dessertId: number): void {
    this._items.update((items) =>
      items.map((i) => (i.dessert.id === dessertId ? { ...i, quantity: i.quantity + 1 } : i)),
    );
    this.logger.action('Incremented item', { dessertId });
  }

  decrement(dessertId: number): void {
    this._items.update((items) => {
      const updated = items.map((i) =>
        i.dessert.id === dessertId ? { ...i, quantity: i.quantity - 1 } : i,
      );
      return updated.filter((i) => i.quantity > 0);
    });
    this.logger.action('Decremented item', { dessertId });
  }

  removeItem(dessertId: number): void {
    this._items.update((items) => items.filter((i) => i.dessert.id !== dessertId));
    this.logger.action('Removed item from cart', { dessertId });
  }

  clearCart(): void {
    this._items.set([]);
    this.logger.action('Cart cleared');
  }

  /** Wipes persisted cart data from localStorage and clears in-memory state. */
  clearStoredCart(): void {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // localStorage not available (e.g. SSR or private-browsing restrictions)
    }
    this.clearCart();
    this.logger.log('Stored cart data cleared');
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private _loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as CartItem[];
      // Basic shape validation
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (item) =>
          item &&
          typeof item.quantity === 'number' &&
          item.dessert &&
          typeof item.dessert.id === 'number',
      );
    } catch {
      return [];
    }
  }
}
