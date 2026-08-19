import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sidebar } from '../../layout/sidebar/sidebar';

import { Product } from '../../models/product';
import { ProductService } from '../../service/productService';

import { StockEntryModel } from '../../models/stock-entry';
import { StockEntryService } from '../../service/stockEntryService';

import { StockExitModel } from '../../models/stock-exit';
import { StockExitService } from '../../service/stockExitService';


@Component({
  selector: 'app-reports',
  standalone: true,

  imports: [
    CommonModule,
    Sidebar
  ],

  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class Reports implements OnInit {

  // ==========================================
  // PRODUCTS
  // ==========================================

  products: Product[] = [];

  totalProducts = 0;

  totalStock = 0;

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
  // CATEGORY REPORT
  // ==========================================

  categoryStats: {
    name: string;
    count: number;
  }[] = [];


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

 printReport(): void {
  window.print();
}


  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  private loadProducts(): void {

    this.productService.getProducts().subscribe({

      next: (products) => {

        this.products = products;

        // Total number of products
        this.totalProducts = products.length;


        // Current total stock
        this.totalStock = products.reduce(
          (total, product) =>
            total + product.quantity,
          0
        );


        // Products out of stock
        this.totalOutOfStock =
          products.filter(
            product => product.quantity === 0
          ).length;


        // Low stock products
        this.totalLowStock =
          products.filter(
            product =>
              product.quantity > 0 &&
              product.quantity <= product.stockMin
          ).length;


        // Categories
        this.calculateCategoryStats();


        console.log(
          'REPORT PRODUCTS:',
          this.products
        );

        console.log(
          'TOTAL PRODUCTS:',
          this.totalProducts
        );

        console.log(
          'TOTAL STOCK:',
          this.totalStock
        );

        console.log(
          'TOTAL LOW STOCK:',
          this.totalLowStock
        );

        console.log(
          'TOTAL OUT OF STOCK:',
          this.totalOutOfStock
        );

      },

      error: (error) => {

        console.error(
          'ERROR LOADING REPORT PRODUCTS:',
          error
        );

      }

    });

  }


  // ==========================================
  // LOAD ENTRIES
  // ==========================================

  private loadStockEntries(): void {

    this.stockEntryService.getStockEntries().subscribe({

      next: (entries) => {

        this.stockEntries = entries;

        this.totalEntries = entries.reduce(
          (total, entry) =>
            total + entry.quantity,
          0
        );


        console.log(
          'REPORT ENTRIES:',
          this.stockEntries
        );

        console.log(
          'TOTAL ENTRIES:',
          this.totalEntries
        );

      },

      error: (error) => {

        console.error(
          'ERROR LOADING REPORT ENTRIES:',
          error
        );

      }

    });

  }


  // ==========================================
  // LOAD EXITS
  // ==========================================

  private loadStockExits(): void {

    this.stockExitService.getStockExits().subscribe({

      next: (exits) => {

        this.stockExits = exits;

        this.totalExits = exits.reduce(
          (total, exit) =>
            total + exit.quantity,
          0
        );


        console.log(
          'REPORT EXITS:',
          this.stockExits
        );

        console.log(
          'TOTAL EXITS:',
          this.totalExits
        );

      },

      error: (error) => {

        console.error(
          'ERROR LOADING REPORT EXITS:',
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


    this.categoryStats =
      Object.entries(categories).map(
        ([name, count]) => ({
          name,
          count
        })
      );


    console.log(
      'REPORT CATEGORY STATS:',
      this.categoryStats
    );

  }

}
