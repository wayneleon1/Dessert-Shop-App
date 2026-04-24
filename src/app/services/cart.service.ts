import { Injectable, signal, computed } from '@angular/core';
import { Dessert, CartItem } from '../models/dessert.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();

  readonly totalItems = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly orderTotal = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity * item.dessert.price, 0)
  );

  getQuantity(dessertId: number): number {
    return this._items().find(i => i.dessert.id === dessertId)?.quantity ?? 0;
  }

  addToCart(dessert: Dessert): void {
    const current = this._items();
    const idx = current.findIndex(i => i.dessert.id === dessert.id);
    if (idx >= 0) {
      const updated = [...current];
      updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
      this._items.set(updated);
    } else {
      this._items.set([...current, { dessert, quantity: 1 }]);
    }
  }

  increment(dessertId: number): void {
    this._items.update(items =>
      items.map(i => i.dessert.id === dessertId ? { ...i, quantity: i.quantity + 1 } : i)
    );
  }

  decrement(dessertId: number): void {
    this._items.update(items => {
      const updated = items.map(i =>
        i.dessert.id === dessertId ? { ...i, quantity: i.quantity - 1 } : i
      );
      return updated.filter(i => i.quantity > 0);
    });
  }

  removeItem(dessertId: number): void {
    this._items.update(items => items.filter(i => i.dessert.id !== dessertId));
  }

  clearCart(): void {
    this._items.set([]);
  }
}
