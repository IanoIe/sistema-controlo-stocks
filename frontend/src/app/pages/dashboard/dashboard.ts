import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { Sidebar } from '../../layout/sidebar/sidebar';

import { Product } from '../../models/product';
import { ProductService } from '../../service/productService';

import { StockEntryModel } from '../../models/stock-entry';
import { StockEntryService } from '../../service/stockEntryService';

import { StockExitModel } from '../../models/stock-exit';
import { StockExitService } from '../../service/stockExitService';


@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    Sidebar,
  ],

  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  // ==========================================
  // PRODUCTS
  // ==========================================
  products: Product[] = [];
  lowStockProducts: Product[] = [];
  outOfStockProducts: Product[] = [];


  // Products grouped by category
  categoryStats: {
    name: string;
    count: number;
    percentage: number;
  }[] = [];


  // ==========================================
  // STOCK EVOLUTION
  // ==========================================
  stockEvolution: {
    date: string;
    stock: number;
  }[] = [];


  // ==========================================
  // DASHBOARD TOTALS
  // ==========================================
  totalProducts = 0;
  totalLowStock = 0;
  totalOutOfStock = 0;

  // ==========================================
  // STOCK ENTRIES
  // ==========================================
  stockEntries: StockEntryModel[] = [];
  totalEntries = 0;

  // ==========================================
  // STOCK EXITS
  // ==========================================
  stockExits: StockExitModel[] = [];
  totalExits = 0;


  // ==========================================
  // CONSTRUCTOR
  // ==========================================
  constructor(
    private productService: ProductService,
    private stockEntryService: StockEntryService,
    private stockExitService: StockExitService
  ) {}


  // ==========================================
  // INIT
  // ==========================================
  ngOnInit(): void {
    this.loadProducts();
    this.loadStockEntries();
    this.loadStockExits();
  }


  // ==========================================
  // LOAD PRODUCTS
  // ==========================================
  private loadProducts(): void {

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;

        // --------------------------------------
        // TOTAL PRODUCTS
        // --------------------------------------
        this.totalProducts = products.length;


        // --------------------------------------
        // OUT OF STOCK
        // --------------------------------------
        this.outOfStockProducts = products.filter(
          product => product.quantity === 0
        );
        this.totalOutOfStock =
          this.outOfStockProducts.length;


        // --------------------------------------
        // LOW STOCK
        // --------------------------------------
        this.lowStockProducts = products.filter(
          product =>
            product.quantity > 0 &&
            product.quantity <= product.stockMin
        );

        this.totalLowStock =
          this.lowStockProducts.length;
        // --------------------------------------
        // PRODUCTS BY CATEGORY
        // --------------------------------------
        this.calculateCategoryStats();


        // --------------------------------------
        // CONSOLE
        // --------------------------------------
        console.log(
          'DASHBOARD PRODUCTS:',
          this.products
        );
        console.log(
          'TOTAL PRODUCTS:',
          this.totalProducts
        );
        console.log(
          'TOTAL OUT OF STOCK:',
          this.totalOutOfStock
        );
        console.log(
          'TOTAL LOW STOCK:',
          this.totalLowStock
        );
        console.log(
          'CATEGORY STATS:',
          this.categoryStats
        );
      },
      error: (error) => {
        console.error(
          'ERROR LOADING DASHBOARD PRODUCTS:',
          error
        );
      }
    });
  }


  // ==========================================
  // PRODUCTS BY CATEGORY
  // ==========================================
  private calculateCategoryStats(): void {
    const categories: {
      [key: string]: number;
    } = {};

    // Count products by category
    this.products.forEach(product => {
      const categoryName =
        product.category?.nameCategory;
      if (!categoryName) {
        return;
      }
      if (!categories[categoryName]) {
        categories[categoryName] = 0;
      }
      categories[categoryName]++;
    });


    // Largest quantity found
    const maxCount =
      Math.max(
        ...Object.values(categories),
        0
      );


    // Create an array for the HTML.
    this.categoryStats =
      Object.entries(categories).map(
        ([name, count]) => {
          return {
            name: name,
            count: count,
            percentage:
              maxCount > 0
                ? (count / maxCount) * 100
                : 0
          };
        }
      );
    console.log(
      'CATEGORY STATS:',
      this.categoryStats
    );

  }


  // ==========================================
  // LOAD STOCK ENTRIES
  // ==========================================
  private loadStockEntries(): void {
    this.stockEntryService.getStockEntries().subscribe({
      next: (entries) => {
        this.stockEntries = entries;
        // --------------------------------------
        // TOTAL ENTRIES
        // --------------------------------------
        this.totalEntries = entries.reduce(
          (total, entry) =>
            total + entry.quantity,
          0
        );
        console.log(
          'STOCK ENTRIES:',
          this.stockEntries
        );

        console.log(
          'TOTAL ENTRIES:',
          this.totalEntries
        );
        // Update evolution
        this.calculateStockEvolution();
      },
      error: (error) => {
        console.error(
          'ERROR LOADING STOCK ENTRIES:',
          error
        );
      }
    });
  }


  // ==========================================
  // LOAD STOCK EXITS
  // ==========================================
  private loadStockExits(): void {
    this.stockExitService.getStockExits().subscribe({
      next: (exits) => {
        this.stockExits = exits;

        // --------------------------------------
        // TOTAL EXITS
        // --------------------------------------
        this.totalExits = exits.reduce(
          (total, exit) =>
            total + exit.quantity,
          0
        );
        console.log(
          'STOCK EXITS:',
          this.stockExits
        );
        console.log(
          'TOTAL EXITS:',
          this.totalExits
        );
        // Update evolution
        this.calculateStockEvolution();
      },
      error: (error) => {
        console.error(
          'ERROR LOADING STOCK EXITS:',
          error
        );
      }
    });
  }


  // ==========================================
  // STOCK EVOLUTION
  // ==========================================
  private calculateStockEvolution(): void {
    const operations: {
      date: Date;
      quantity: number;
    }[] = [];


    // --------------------------------------
    // ENTRIES = POSITIVE
    // --------------------------------------
    this.stockEntries.forEach(entry => {
      operations.push({
        date: new Date(
          entry.dateStockEntry
        ),
        quantity: entry.quantity
      });
    });


    // --------------------------------------
    // EXITS = NEGATIVE
    // --------------------------------------
    this.stockExits.forEach(exit => {
      operations.push({
        date: new Date(
          exit.dateStockExit
        ),
        quantity: -exit.quantity
      });
    });


    // --------------------------------------
    // ORDER BY DATE
    // --------------------------------------
    operations.sort(
      (a, b) =>
        a.date.getTime() -
        b.date.getTime()
    );


    // --------------------------------------
    // CALCULATE STOCK
    // --------------------------------------
    let currentStock = 0;
    this.stockEvolution =
      operations.map(operation => {

        currentStock +=
          operation.quantity;

        return {

          date:
            operation.date.toLocaleDateString(
              'pt-PT',
              {
                day: '2-digit',
                month: '2-digit'
              }
            ),

          stock: currentStock

        };

      });

    console.log(
      'STOCK EVOLUTION:',
      this.stockEvolution
    );

  }


  // ==========================================
  // MAX STOCK FOR GRAPH
  // ==========================================
  getMaxStock(): number {

    if (this.stockEvolution.length === 0) {
      return 1;
    }

    return Math.max(
      ...this.stockEvolution.map(
        point => point.stock
      ),
      1
    );

  }

}
