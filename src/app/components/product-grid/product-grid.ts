import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DessertService } from '../../services/dessert.service';
import { ProductCardComponent } from '../product-card/product-card';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.css'
})
export class ProductGridComponent {
  private dessertService = inject(DessertService);
  readonly desserts = this.dessertService.desserts;
}
