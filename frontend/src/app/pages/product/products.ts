import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/productService';
import { Product } from '../../models/product';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './products.html'
})
export class Products implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];

  searchTerm = '';
  stockFilter = 'all';
  sortOption = 'name';

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // GET - All products
  loadProducts(): void {

    this.productService.getProducts().subscribe({

      next: (products) => {

        console.log('PRODUCTS RECEIVED:', products);
        console.log('IS ARRAY:', Array.isArray(products));

        this.products = Array.isArray(products)
          ? products
          : [];

        this.applyFilters();
      },

      error: (error) => {
        console.error('ERROR LOADING PRODUCTS:', error);
      }

    });
  }

  // Search
  onSearch(): void {
    this.applyFilters();
  }

  // Stock filter
  onStockFilterChange(): void {
    this.applyFilters();
  }

  // Sort
  onSortChange(): void {
    this.applyFilters();
  }

  // Apply search, filters and sorting
  applyFilters(): void {

    let result = [...this.products];

    /*
     * SEARCH
     *
     * Search by product name or product code.
     */
    const search = this.searchTerm.trim().toLowerCase();

    if (search !== '') {

      result = result.filter(product =>
        product.nameProduct.toLowerCase().includes(search) ||
        product.codeProduct.toLowerCase().includes(search)
      );

    }

    /*
     * STOCK FILTER
     */
    if (this.stockFilter === 'in-stock') {

      result = result.filter(product =>
        product.quantity > product.stockMin
      );

    }

    if (this.stockFilter === 'low-stock') {

      result = result.filter(product =>
        product.quantity > 0 &&
        product.quantity <= product.stockMin
      );

    }

    if (this.stockFilter === 'out-of-stock') {

      result = result.filter(product =>
        product.quantity === 0
      );

    }

    /*
     * SORT
     */
    if (this.sortOption === 'name') {

      result.sort((a, b) =>
        a.nameProduct.localeCompare(b.nameProduct)
      );

    }

    if (this.sortOption === 'name-desc') {

      result.sort((a, b) =>
        b.nameProduct.localeCompare(a.nameProduct)
      );

    }

    if (this.sortOption === 'quantity') {

      result.sort((a, b) =>
        a.quantity - b.quantity
      );

    }

    if (this.sortOption === 'quantity-desc') {

      result.sort((a, b) =>
        b.quantity - a.quantity
      );

    }

    this.filteredProducts = result;
  }

  // Stock status
  getStockStatus(product: Product): string {

    if (product.quantity === 0) {
      return 'Out of Stock';
    }

    if (product.quantity <= product.stockMin) {
      return 'Low Stock';
    }

    return 'In Stock';
  }

  // Create
  newProduct(): void {

    console.log('NEW PRODUCT BUTTON CLICKED');

    this.router.navigate(['/products/new']);
  }

  // Read
  viewProduct(product: Product): void {

    console.log('VIEW PRODUCT:', product);

    this.router.navigate(['/products', product.id]);
  }

  // Update
  editProduct(product: Product): void {

    console.log('EDIT PRODUCT:', product);

    this.router.navigate(['/products', product.id, 'edit']);
  }

  // Delete
  deleteProduct(product: Product): void {

    const confirmed = confirm(
      `Are you sure you want to delete "${product.nameProduct}"?`
    );

    if (!confirmed) {
      return;
    }

    console.log('DELETE PRODUCT:', product);

    this.productService.deleteProduct(product.id).subscribe({

      next: () => {

        console.log('PRODUCT DELETED:', product);

        this.products = this.products.filter(
          p => p.id !== product.id
        );

        this.applyFilters();
      },

      error: (error) => {

        console.error('ERROR DELETING PRODUCT:', error);

      }

    });
  }
}
