import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { Product } from '../../models/product';
import { ProductService } from '../../service/productService';
@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './alerts.html'
})

export class Alerts implements OnInit {
  // Stores the complete list of products.
  products: Product[] = [];
  // Stores products that are currently out of stock.
  outOfStockProducts: Product[] = [];
  // Stores products whose quantity is below or equal to the minimum stock level.
  lowStockProducts: Product[] = [];

  constructor(
    private productService: ProductService
  ) {}

  /**
   * Initializes the component and loads the product stock alerts.
   */
  ngOnInit(): void {
    this.loadAlerts();
  }

  /**
   * Retrieves all products from the product service and identifies
   * products that are out of stock or have reached their minimum
   * stock threshold.
   *
   * Updates the corresponding properties with the filtered results
   * and logs the information to the browser console.
   * Handles any errors that occur during the request.
   */
  private loadAlerts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        // Stores the complete list of retrieved products.
        this.products = products;
        // Filters products with a quantity of zero.
        this.outOfStockProducts = products.filter(
          product => product.quantity === 0
        );
        // Filters products with a positive quantity
        // that is less than or equal to the minimum stock level.
        this.lowStockProducts = products.filter(
          product =>
            product.quantity > 0 &&
            product.quantity <= product.stockMin
        );
        // Logs the complete product list for debugging purposes.
        console.log(
          'ALERT PRODUCTS:',
          this.products
        );
        // Logs products that are currently out of stock.
        console.log(
          'OUT OF STOCK:',
          this.outOfStockProducts
        );
        // Logs products that have reached the low stock threshold.
        console.log(
          'LOW STOCK:',
          this.lowStockProducts
        );
      },
      // Handles errors that occur while retrieving product information.
      error: (error) => {
        console.error(
          'ERROR LOADING ALERTS:',
          error
        );
      }
    });
  }
}
