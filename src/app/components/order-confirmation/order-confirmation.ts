import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/dessert.model';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.css'
})
export class OrderConfirmationComponent {
  private cartService = inject(CartService);

  readonly startNewOrder = output<void>();

  // Snapshot of items at confirmation time
  readonly confirmedItems: CartItem[];
  readonly confirmedTotal: number;

  constructor() {
    this.confirmedItems = [...this.cartService.items()];
    this.confirmedTotal = this.cartService.orderTotal();
  }

  onStartNewOrder(): void {
    this.cartService.clearCart();
    this.startNewOrder.emit();
  }
}
