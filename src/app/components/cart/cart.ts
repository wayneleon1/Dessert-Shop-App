import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent {
  private cartService = inject(CartService);

  readonly confirmOrder = output<void>();

  get items() { return this.cartService.items(); }
  get totalItems() { return this.cartService.totalItems(); }
  get orderTotal() { return this.cartService.orderTotal(); }

  removeItem(dessertId: number): void {
    this.cartService.removeItem(dessertId);
  }

  onConfirmOrder(): void {
    this.confirmOrder.emit();
  }
}
