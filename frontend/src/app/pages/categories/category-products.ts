import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ProductService } from '../../service/productService';
import { Product } from '../../models/product';
import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [CommonModule, RouterLink, Sidebar],
  templateUrl: './category-products.html'
})
export class CategoryProducts implements OnInit {
  products: Product[] = [];
  categoryId = 0;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.error = 'Invalid category ID.';
      this.loading = false;
      console.error('Invalid category ID:', id);
      return;
    }

    this.categoryId = id;
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    this.productService.getProductsByCategory(this.categoryId)
      .subscribe({
        next: (products: Product[]) => {
          this.products = products;
          this.loading = false;

          console.log('Category products loaded successfully:', products);
        },
        error: (error: unknown) => {
          console.error('Failed to load category products:', error);
          this.error = 'Failed to load products. Please try again.';
          this.loading = false;
        }
      });
  }
}
