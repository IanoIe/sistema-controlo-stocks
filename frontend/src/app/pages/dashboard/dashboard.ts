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

/**
 * Represents a recent stock operation, either an entry or an exit.
 * Contains the operation details required for dashboard display
 * and chronological sorting.
 */
interface RecentOperation {
  id: number;
  type: 'Entry' | 'Exit';
  quantity: number;
  date: string;
  productName: string;
  timestamp: number;
}

/**
 * Main dashboard component responsible for displaying
 * product statistics, inventory information, stock movements
 * and recent operations.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, Sidebar],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {

  // ==========================================
  // PRODUCTS
  // ==========================================

  // Stores the complete list of products.
  products: Product[] = [];

  // Stores products whose quantity is below or equal to the minimum stock level.
  lowStockProducts: Product[] = [];

  // Stores products that are currently out of stock.
  outOfStockProducts: Product[] = [];

  // ==========================================
  // PRODUCTS BY CATEGORY
  // ==========================================

  // Stores the number of products per category and their relative percentage.
  categoryStats: {
    name: string;
    count: number;
    percentage: number;
  }[] = [];

  // ==========================================
  // STOCK EVOLUTION
  // ==========================================

  // Stores the cumulative stock evolution over time.
  stockEvolution: {
    date: string;
    stock: number;
  }[] = [];

  // ==========================================
  // DASHBOARD TOTALS
  // ==========================================

  // Stores the total number of registered products.
  totalProducts = 0;

  // Stores the total number of products with low stock.
  totalLowStock = 0;

  // Stores the total number of products that are out of stock.
  totalOutOfStock = 0;

  // Stores the estimated total value of the current inventory.
  totalInventoryValue = 0;

  // Stores the formatted inventory value using the Portuguese currency format.
  formattedInventoryValue = '0,00 €';

  // ==========================================
  // STOCK ENTRIES
  // ==========================================

  // Stores all registered stock entry records.
  stockEntries: StockEntryModel[] = [];

  // Stores the total quantity of products added to stock.
  totalEntries = 0;

  // ==========================================
  // STOCK EXITS
  // ==========================================

  // Stores all registered stock exit records.
  stockExits: StockExitModel[] = [];

  // Stores the total quantity of products removed from stock.
  totalExits = 0;

  // ==========================================
  // RECENT OPERATIONS
  // ==========================================

  // Stores the five most recent stock entry and exit operations.
  recentOperations: RecentOperation[] = [];

  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  /**
   * Initializes the required services for retrieving product information,
   * stock entries, stock exits and handling application navigation.
   */
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

  /**
   * Initializes the dashboard component.
   * Loads product information, stock entries and stock exits
   * to populate the dashboard statistics and visualizations.
   */
  ngOnInit(): void {
    this.loadProducts();
    this.loadStockEntries();
    this.loadStockExits();
  }

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  /**
   * Retrieves all products from the product service.
   * Calculates the total number of products, estimated inventory value,
   * out-of-stock products and low-stock products.
   * Also triggers the calculation of product statistics by category.
   */
  private loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;

        // Calculates the total number of registered products.
        this.totalProducts = products.length;

        // Calculates the estimated inventory value by multiplying
        // each product's unit price by its current stock quantity.
        this.totalInventoryValue = products.reduce(
          (total, product) => {
            const price = Number(product.price);
            const quantity = Number(product.quantity);

            // Ignores products with invalid price or quantity values.
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

        // Formats the inventory value using the Portuguese locale
        // with exactly two decimal places and the euro currency symbol.
        this.formattedInventoryValue =
          this.totalInventoryValue.toLocaleString('pt-PT', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) + ' €';

        // Filters products whose stock quantity is zero or negative.
        this.outOfStockProducts = products.filter(
          product => product.quantity <= 0
        );

        // Updates the total number of out-of-stock products.
        this.totalOutOfStock = this.outOfStockProducts.length;

        // Filters products with a positive quantity
        // that is below or equal to the minimum stock level.
        // Products already out of stock are excluded.
        this.lowStockProducts = products.filter(
          product =>
            product.quantity > 0 &&
            product.quantity <= product.stockMin
        );

        // Updates the total number of low-stock products.
        this.totalLowStock = this.lowStockProducts.length;

        // Calculates the number of products registered in each category.
        this.calculateCategoryStats();

        // Logs dashboard information for debugging purposes.
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

  /**
   * Calculates the number of products registered in each category.
   * Determines the relative percentage of products per category
   * based on the category with the highest product count.
   * Updates the category statistics used by the dashboard.
   */
  private calculateCategoryStats(): void {

    // Creates an object to store the number of products per category.
    const categories: Record<string, number> = {};

    // Iterates through all products and groups them by category.
    this.products.forEach(product => {
      const categoryName = product.category?.nameCategory;

      // Skips products that do not have an associated category.
      if (!categoryName) {
        return;
      }

      // Increments the product count for the corresponding category.
      categories[categoryName] =
        (categories[categoryName] ?? 0) + 1;
    });

    // Determines the highest number of products in a single category.
    const maxCount = Math.max(
      ...Object.values(categories),
      0
    );

    // Converts the category data into an array containing
    // the category name, product count and relative percentage.
    this.categoryStats = Object.entries(categories).map(
      ([name, count]) => ({
        name,
        count,
        percentage:
          maxCount > 0 ? (count / maxCount) * 100 : 0
      })
    );

    // Logs the calculated category statistics for debugging purposes.
    console.log('CATEGORY STATS:', this.categoryStats);
  }

  // ==========================================
  // LOAD STOCK ENTRIES
  // ==========================================

  /**
   * Retrieves all stock entry records from the stock entry service.
   * Calculates the total quantity of products added to stock
   * and updates the recent operations and stock evolution data.
   */
  private loadStockEntries(): void {
    this.stockEntryService.getStockEntries().subscribe({
      next: (entries) => {
        this.stockEntries = entries;

        // Calculates the total quantity of products added to stock.
        this.totalEntries = entries.reduce(
          (total, entry) => total + entry.quantity,
          0
        );

        // Logs stock entry information for debugging purposes.
        console.log('STOCK ENTRIES:', this.stockEntries);
        console.log('TOTAL ENTRIES:', this.totalEntries);

        // Updates the list of the five most recent stock operations.
        this.calculateRecentOperations();

        // Recalculates the cumulative stock evolution over time.
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

  /**
   * Retrieves all stock exit records from the stock exit service.
   * Calculates the total quantity of products removed from stock
   * and updates the recent operations and stock evolution data.
   */
  private loadStockExits(): void {
    this.stockExitService.getStockExits().subscribe({
      next: (exits) => {
        this.stockExits = exits;

        // Calculates the total quantity of products removed from stock.
        this.totalExits = exits.reduce(
          (total, exit) => total + exit.quantity,
          0
        );

        // Logs stock exit information for debugging purposes.
        console.log('STOCK EXITS:', this.stockExits);
        console.log('TOTAL EXITS:', this.totalExits);

        // Updates the list of the five most recent stock operations.
        this.calculateRecentOperations();

        // Recalculates the cumulative stock evolution over time.
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

  /**
   * Combines stock entries and exits into a single list of operations.
   * Converts each record into a common structure, sorts operations
   * by date in descending order and keeps only the five most recent ones.
   */
  private calculateRecentOperations(): void {

    // Converts stock entry records into the recent operation format.
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

    // Converts stock exit records into the recent operation format.
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

    // Combines both operation lists, removes invalid dates,
    // sorts operations from newest to oldest and keeps the five latest.
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

  /**
   * Calculates the cumulative stock movement over time.
   * Stock entries are treated as positive movements,
   * while stock exits are treated as negative movements.
   * Sorts all operations chronologically and calculates
   * the resulting stock balance after each operation.
   */
  private calculateStockEvolution(): void {

    // Stores all stock movements with their corresponding dates
    // and positive or negative quantity changes.
    const operations: {
      date: Date;
      quantity: number;
    }[] = [];

    // Adds stock entry operations as positive quantity movements.
    this.stockEntries.forEach(entry => {
      operations.push({
        date: new Date(entry.dateStockEntry),
        quantity: entry.quantity
      });
    });

    // Adds stock exit operations as negative quantity movements.
    this.stockExits.forEach(exit => {
      operations.push({
        date: new Date(exit.dateStockExit),
        quantity: -exit.quantity
      });
    });
    // Sorts all stock movements from oldest to newest.
    operations.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    // Initializes the stock balance before processing movements.
    let currentStock = 0;
    // Calculates the cumulative stock balance after each operation
    // and stores the corresponding date and quantity for the graph.
    this.stockEvolution = operations.map(operation => {
      currentStock += operation.quantity;
      return {
        // Formats the operation date using the Portuguese locale.
        date: operation.date.toLocaleDateString('pt-PT', {
          day: '2-digit',
          month: '2-digit'
        }),
        // Stores the cumulative stock balance at this point in time.
        stock: currentStock
      };
    });
    // Logs stock evolution data for debugging purposes.
    console.log('STOCK EVOLUTION:', this.stockEvolution);
  }

  // ==========================================
  // GET MAXIMUM STOCK FOR GRAPH
  // ==========================================

  /**
   * Determines the maximum stock value recorded in the stock evolution data.
   * Returns a minimum value of 1 when no stock evolution data is available,
   * ensuring that the graph always has a valid maximum scale.
   */
  getMaxStock(): number {
    // Returns 1 when there are no stock evolution records.
    if (this.stockEvolution.length === 0) {
      return 1;
    }
    // Returns the highest stock value, with a minimum fallback of 1.
    return Math.max(
      ...this.stockEvolution.map(point => point.stock),
      1
    );
  }

  // ==========================================
  // NAVIGATE TO ALERTS
  // ==========================================

  /**
   * Navigates the user to the alerts page
   * to view products with low stock or no available stock.
   */
  goToAlerts(): void {
    this.router.navigate(['/alerts']);
  }
}
