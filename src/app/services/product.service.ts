import { Injectable, signal, computed } from '@angular/core';
import { Dessert } from '../models/dessert.model';
import DESSERTS from '../../../data.json';

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

@Injectable({ providedIn: 'root' })
export class ProductService {
  /** All desserts loaded from the data source. */
  private readonly _allDesserts: Dessert[] = DESSERTS;

  /** Reactive search/filter term. */
  private readonly _searchTerm = signal<string>('');

  /** Reactive sort option. */
  private readonly _sortOption = signal<SortOption>('name-asc');

  /** Reactive category filter (empty string = all). */
  private readonly _selectedCategory = signal<string>('');

  // ── Public read-only signals ────────────────────────────────────────────────
  readonly searchTerm = this._searchTerm.asReadonly();
  readonly sortOption = this._sortOption.asReadonly();
  readonly selectedCategory = this._selectedCategory.asReadonly();

  /** Derived list: filtered + sorted products. */
  readonly filteredDesserts = computed(() => {
    let result = [...this._allDesserts];

    // Filter by category
    const cat = this._selectedCategory();
    if (cat) {
      result = result.filter((d) => d.category.toLowerCase() === cat.toLowerCase());
    }

    // Filter by search term
    const term = this._searchTerm().toLowerCase().trim();
    if (term) {
      result = result.filter(
        (d) => d.name.toLowerCase().includes(term) || d.category.toLowerCase().includes(term),
      );
    }

    // Sort
    const sort = this._sortOption();
    result.sort((a, b) => {
      switch (sort) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return result;
  });

  /** All unique categories derived from the data. */
  readonly categories = computed<string[]>(() => {
    const cats = new Set(this._allDesserts.map((d) => d.category));
    return Array.from(cats).sort();
  });

  // ── Mutation methods ────────────────────────────────────────────────────────

  setSearchTerm(term: string): void {
    this._searchTerm.set(term);
  }

  setSortOption(option: SortOption): void {
    this._sortOption.set(option);
  }

  setCategory(category: string): void {
    this._selectedCategory.set(category);
  }

  clearFilters(): void {
    this._searchTerm.set('');
    this._sortOption.set('name-asc');
    this._selectedCategory.set('');
  }

  // ── Static / pure utility methods ──────────────────────────────────────────

  /**
   * Returns a formatted display name for a dessert
   */
  formatName(dessert: Dessert): string {
    return dessert.name.trim();
  }

  /** Returns the correct image src for a given viewport hint. */
  getImageSrc(
    dessert: Dessert,
    viewport: 'mobile' | 'tablet' | 'desktop' | 'thumbnail' = 'desktop',
  ): string {
    return dessert.image[viewport];
  }

  /** Find a single dessert by id; returns undefined when not found. */
  findById(id: number): Dessert | undefined {
    return this._allDesserts.find((d) => d.id === id);
  }
}
