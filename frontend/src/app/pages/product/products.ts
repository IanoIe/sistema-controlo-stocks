import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/productService';
import { Product } from '../../models/product';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './products.html'
})
export class Products implements OnInit {

  products: Product[] = [];

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
      },

      error: (error) => {
        console.error('ERROR LOADING PRODUCTS:', error);
      }

    });
  }

  // CREATE - Navigate to create form
  newProduct(): void {

    console.log('NEW PRODUCT BUTTON CLICKED');

    this.router.navigate(['/products/new']);
  }

  // READ - View product
  viewProduct(product: Product): void {

    console.log('VIEW PRODUCT:', product);

    this.router.navigate(['/products', product.id]);
  }

  // UPDATE - Navigate to edit form
  editProduct(product: Product): void {

    console.log('EDIT PRODUCT:', product);

    this.router.navigate(['/products', product.id, 'edit']);
  }

  // DELETE - Delete product
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

        // Remove product from the current list
        this.products = this.products.filter(
          p => p.id !== product.id
        );
      },

      error: (error) => {

        console.error('ERROR DELETING PRODUCT:', error);

      }

    });
  }
}
