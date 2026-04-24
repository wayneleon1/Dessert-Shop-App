import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGridComponent } from './components/product-grid/product-grid';
import { CartComponent } from './components/cart/cart';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProductGridComponent, CartComponent, OrderConfirmationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  showConfirmation = signal(false);

  onConfirmOrder(): void {
    this.showConfirmation.set(true);
  }

  onStartNewOrder(): void {
    this.showConfirmation.set(false);
  }
}
