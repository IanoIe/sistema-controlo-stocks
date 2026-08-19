import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { Sidebar } from '../../layout/sidebar/sidebar';

import { Product } from '../../models/product';
import { ProductService } from '../../service/productService';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar
  ],
  templateUrl: './alerts.html'
})
export class Alerts implements OnInit {

  // Todos os produtos
  products: Product[] = [];

  // Produtos sem stock
  outOfStockProducts: Product[] = [];

  // Produtos com stock baixo
  lowStockProducts: Product[] = [];

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadAlerts();
  }

  private loadAlerts(): void {

    this.productService.getProducts().subscribe({

      next: (products) => {

        // Guardar todos os produtos
        this.products = products;

        // Produtos sem stock
        this.outOfStockProducts = products.filter(
          product => product.quantity === 0
        );

        // Produtos com stock baixo
        this.lowStockProducts = products.filter(
          product =>
            product.quantity > 0 &&
            product.quantity <= product.stockMin
        );

        console.log(
          'ALERT PRODUCTS:',
          this.products
        );

        console.log(
          'OUT OF STOCK:',
          this.outOfStockProducts
        );

        console.log(
          'LOW STOCK:',
          this.lowStockProducts
        );
      },

      error: (error) => {

        console.error(
          'ERROR LOADING ALERTS:',
          error
        );

      }

    });
  }
}
