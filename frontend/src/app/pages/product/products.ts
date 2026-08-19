import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/productService';
import { Product } from '../../models/product';
import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './products.html'
})
export class Products implements OnInit {

  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
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
}

