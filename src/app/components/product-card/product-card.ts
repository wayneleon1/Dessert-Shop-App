import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dessert } from '../../models/dessert.model';
import { CartService } from '../../services/cart.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCardComponent {
  @Input({ required: true }) dessert!: Dessert;

  private cartService = inject(CartService);
  private utility = inject(UtilityService);

  formatPrice(amount: number): string {
    return this.utility.formatCurrency(amount);
  }

  get quantity(): number {
    return this.cartService.getQuantity(this.dessert.id);
  }

  get isInCart(): boolean {
    return this.quantity > 0;
  }

  addToCart(): void {
    this.cartService.addToCart(this.dessert);
  }

  increment(): void {
    this.cartService.increment(this.dessert.id);
  }

  decrement(): void {
    this.cartService.decrement(this.dessert.id);
  }
}
