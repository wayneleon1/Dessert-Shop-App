import { Component, inject, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent {
  private cartService = inject(CartService);
  private utility = inject(UtilityService);

  formatPrice(amount: number): string {
    return this.utility.formatCurrency(amount);
  }

  readonly confirmOrder = output<void>();

  /** True for 4 s after the app starts with a non-empty restored cart. */
  readonly cartRestored = signal(false);

  constructor() {
    // Show a "cart restored" banner if items were loaded from localStorage
    if (this.cartService.totalItems() > 0) {
      this.cartRestored.set(true);
      setTimeout(() => this.cartRestored.set(false), 4000);
    }
  }

  get items() {
    return this.cartService.items();
  }
  get totalItems() {
    return this.cartService.totalItems();
  }

  get formattedOrderTotal() {
    return this.formatPrice(this.cartService.orderTotal());
  }

  removeItem(dessertId: number): void {
    this.cartService.removeItem(dessertId);
  }

  clearStoredCart(): void {
    this.cartService.clearStoredCart();
  }

  onConfirmOrder(): void {
    this.confirmOrder.emit();
  }
}
