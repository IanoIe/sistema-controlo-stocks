
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { Sidebar } from '../../layout/sidebar/sidebar';

import { Product } from '../../models/product';
import { ProductService } from '../../service/productService';

import { StockEntryModel } from '../../models/stock-entry';
import { StockEntryService } from '../../service/stockEntryService';

import { StockExitModel } from '../../models/stock-exit';
import { StockExitService } from '../../service/stockExitService';

import { AuthService } from '../../service/AuthService';

// ==========================================
// RECENT OPERATION MODEL
// ==========================================
interface RecentOperation {
  id: number;
  type: 'Entry' | 'Exit';
  quantity: number;
  date: string;
  productName: string;
  timestamp: number;
}

// ==========================================
// DASHBOARD COMPONENT
// ==========================================
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    Sidebar
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

  // ==========================================
  // PRODUCTS BY CATEGORY
  // ==========================================
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

  // Total estimated value of current inventory
  totalInventoryValue = 0;
  formattedInventoryValue = '0,00 €';

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
  // RECENT OPERATIONS
  // ==========================================
  recentOperations: RecentOperation[] = [];

  // ==========================================
  // CONSTRUCTOR
  // ==========================================
  constructor(
    private productService: ProductService,
    private stockEntryService: StockEntryService,
    private stockExitService: StockExitService,
    private authService: AuthService,
    private router: Router
  ) {}

  // ==========================================
  // INITIALIZATION
  // ==========================================
  ngOnInit(): void {
    this.loadProducts();
    this.loadStockEntries();
    this.loadStockExits();
  }

  // ==========================================
  // LOGOUT
  // ==========================================
  logout(): void {
    const confirmed = window.confirm(
      'Are you sure you want to log out?'
    );

    if (!confirmed) {
      return;
    }

    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login'], {
          replaceUrl: true
        });
      },
      error: (error) => {
        console.error('ERROR LOGGING OUT:', error);
      }
    });
  }

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================
  private loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;

        // TOTAL PRODUCTS
        this.totalProducts = products.length;

        // INVENTORY VALUE
        // Unit price * current quantity
        this.totalInventoryValue = products.reduce(
          (total, product) => {
            const price = Number(product.price);
            const quantity = Number(product.quantity);

            if (
              !Number.isFinite(price) ||
              !Number.isFinite(quantity)
            ) {
              return total;
            }

            return total + (price * quantity);
          },
          0
        );

        // FORMAT INVENTORY VALUE
        this.formattedInventoryValue =
          this.totalInventoryValue.toLocaleString('pt-PT', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) + ' €';

        // OUT OF STOCK
        this.outOfStockProducts = products.filter(
          product => product.quantity <= 0
        );

        this.totalOutOfStock = this.outOfStockProducts.length;

        // LOW STOCK
        // Excludes products already out of stock
        this.lowStockProducts = products.filter(
          product =>
            product.quantity > 0 &&
            product.quantity <= product.stockMin
        );

        this.totalLowStock = this.lowStockProducts.length;

        // PRODUCTS BY CATEGORY
        this.calculateCategoryStats();

        // DEBUG INFORMATION
        console.log('DASHBOARD PRODUCTS:', this.products);
        console.log('TOTAL PRODUCTS:', this.totalProducts);
        console.log('INVENTORY VALUE:', this.totalInventoryValue);
        console.log('TOTAL OUT OF STOCK:', this.totalOutOfStock);
        console.log('TOTAL LOW STOCK:', this.totalLowStock);
        console.log('CATEGORY STATS:', this.categoryStats);
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
  // CALCULATE PRODUCTS BY CATEGORY
  // ==========================================
  private calculateCategoryStats(): void {
    const categories: Record<string, number> = {};

    this.products.forEach(product => {
      const categoryName = product.category?.nameCategory;

      if (!categoryName) {
        return;
      }

      categories[categoryName] =
        (categories[categoryName] ?? 0) + 1;
    });

    const maxCount = Math.max(
      ...Object.values(categories),
      0
    );

    this.categoryStats = Object.entries(categories).map(
      ([name, count]) => ({
        name,
        count,
        percentage:
          maxCount > 0 ? (count / maxCount) * 100 : 0
      })
    );

    console.log('CATEGORY STATS:', this.categoryStats);
  }

  // ==========================================
  // LOAD STOCK ENTRIES
  // ==========================================
  private loadStockEntries(): void {
    this.stockEntryService.getStockEntries().subscribe({
      next: (entries) => {
        this.stockEntries = entries;

        // TOTAL ENTRY QUANTITY
        this.totalEntries = entries.reduce(
          (total, entry) => total + entry.quantity,
          0
        );

        console.log('STOCK ENTRIES:', this.stockEntries);
        console.log('TOTAL ENTRIES:', this.totalEntries);

        // UPDATE RECENT OPERATIONS
        this.calculateRecentOperations();

        // UPDATE STOCK EVOLUTION
        this.calculateStockEvolution();
      },
      error: (error) => {
        console.error(
          'ERROR LOADING DASHBOARD STOCK ENTRIES:',
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

        // TOTAL EXIT QUANTITY
        this.totalExits = exits.reduce(
          (total, exit) => total + exit.quantity,
          0
        );

        console.log('STOCK EXITS:', this.stockExits);
        console.log('TOTAL EXITS:', this.totalExits);

        // UPDATE RECENT OPERATIONS
        this.calculateRecentOperations();

        // UPDATE STOCK EVOLUTION
        this.calculateStockEvolution();
      },
      error: (error) => {
        console.error(
          'ERROR LOADING DASHBOARD STOCK EXITS:',
          error
        );
      }
    });
  }

  // ==========================================
  // CALCULATE RECENT OPERATIONS
  // ==========================================
  private calculateRecentOperations(): void {
    const entries: RecentOperation[] = this.stockEntries.map(
      entry => ({
        id: entry.id,
        type: 'Entry',
        quantity: entry.quantity,
        date: entry.dateStockEntry,
        productName:
          entry.product?.nameProduct ?? 'Unknown product',
        timestamp: new Date(entry.dateStockEntry).getTime()
      })
    );

    const exits: RecentOperation[] = this.stockExits.map(
      exit => ({
        id: exit.id,
        type: 'Exit',
        quantity: exit.quantity,
        date: exit.dateStockExit,
        productName:
          exit.product?.nameProduct ?? 'Unknown product',
        timestamp: new Date(exit.dateStockExit).getTime()
      })
    );

    this.recentOperations = [...entries, ...exits]
      .filter(operation =>
        Number.isFinite(operation.timestamp)
      )
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  }

  // ==========================================
  // CALCULATE STOCK EVOLUTION
  // ==========================================
  private calculateStockEvolution(): void {
    const operations: {
      date: Date;
      quantity: number;
    }[] = [];

    // STOCK ENTRIES = POSITIVE QUANTITY
    this.stockEntries.forEach(entry => {
      operations.push({
        date: new Date(entry.dateStockEntry),
        quantity: entry.quantity
      });
    });

    // STOCK EXITS = NEGATIVE QUANTITY
    this.stockExits.forEach(exit => {
      operations.push({
        date: new Date(exit.dateStockExit),
        quantity: -exit.quantity
      });
    });

    // ORDER OPERATIONS BY DATE
    operations.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    // CALCULATE CUMULATIVE MOVEMENTS
    let currentStock = 0;

    this.stockEvolution = operations.map(operation => {
      currentStock += operation.quantity;

      return {
        date: operation.date.toLocaleDateString('pt-PT', {
          day: '2-digit',
          month: '2-digit'
        }),
        stock: currentStock
      };
    });

    console.log('STOCK EVOLUTION:', this.stockEvolution);
  }

  // ==========================================
  // GET MAXIMUM STOCK FOR GRAPH
  // ==========================================
  getMaxStock(): number {
    if (this.stockEvolution.length === 0) {
      return 1;
    }

    return Math.max(
      ...this.stockEvolution.map(point => point.stock),
      1
    );
  }

  // ==========================================
  // NAVIGATE TO ALERTS
  // ==========================================
  goToAlerts(): void {
    this.router.navigate(['/alerts']);
  }
}
