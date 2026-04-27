import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, SortOption } from '../../services/product.service';
import { ProductCardComponent } from '../product-card/product-card';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.css',
})
export class ProductGridComponent {
  private productService = inject(ProductService);

  readonly desserts = this.productService.filteredDesserts;
  readonly categories = this.productService.categories;
  readonly selectedCategory = this.productService.selectedCategory;
  readonly searchTerm = this.productService.searchTerm;
  readonly sortOption = this.productService.sortOption;

  readonly sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Name (A–Z)', value: 'name-asc' },
    { label: 'Name (Z–A)', value: 'name-desc' },
    { label: 'Price (Low–High)', value: 'price-asc' },
    { label: 'Price (High–Low)', value: 'price-desc' },
  ];

  onSearch(event: Event): void {
    this.productService.setSearchTerm((event.target as HTMLInputElement).value);
  }

  onCategoryChange(event: Event): void {
    this.productService.setCategory((event.target as HTMLSelectElement).value);
  }

  onSortChange(event: Event): void {
    this.productService.setSortOption((event.target as HTMLSelectElement).value as SortOption);
  }

  clearFilters(): void {
    this.productService.clearFilters();
  }
}
