import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { Product } from '../../models/product';
import { ProductService } from '../../service/productService';
import { StockEntryModel } from '../../models/stock-entry';
import { StockEntryService } from '../../service/stockEntryService';
import { StockExitModel } from '../../models/stock-exit';
import { StockExitService } from '../../service/stockExitService';

/**
 * Reports component responsible for generating inventory reports.
 *
 * Retrieves product information, stock entry records and stock exit records
 * from the backend API.
 *
 * Calculates inventory statistics, stock quantities and product distribution
 * across categories.
 *
 * Provides an option to print the generated report or save it as a PDF.
 */

// ==========================================
// REPORTS COMPONENT
// ==========================================
@Component({
  selector: 'app-reports',
  standalone: true,

  imports: [
    CommonModule,
    Sidebar
  ],

  templateUrl: './reports.html',
})
export class Reports implements OnInit {

  // ==========================================
  // PRODUCTS
  // ==========================================

  // Stores all products retrieved from the backend API.
  products: Product[] = [];

  // Stores the total number of registered products.
  totalProducts = 0;

  // Stores the combined current stock quantity of all products.
  totalStock = 0;

  // Stores the number of products whose stock is below or equal to the minimum stock level.
  totalLowStock = 0;

  // Stores the number of products that are completely out of stock.
  totalOutOfStock = 0;


  // ==========================================
  // STOCK ENTRIES
  // ==========================================

  // Stores all stock entry records retrieved from the backend API.
  stockEntries: StockEntryModel[] = [];

  // Stores the total quantity of products added to inventory
  // through all registered stock entry operations.
  totalEntries = 0;


  // ==========================================
  // STOCK EXITS
  // ==========================================

  // Stores all stock exit records retrieved from the backend API.
  stockExits: StockExitModel[] = [];

  // Stores the total quantity of products removed from inventory
  // through all registered stock exit operations.
  totalExits = 0;


  // ==========================================
  // CATEGORY REPORT
  // ==========================================

  // Stores the product distribution across categories.
  // Each entry contains the category name and its associated product count.
  categoryStats: {
    name: string;
    count: number;
  }[] = [];


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  /**
   * Initializes the dependencies required by the reports component.
   *
   * Injects the services responsible for retrieving product information,
   * stock entry records and stock exit records from the backend API.
   */
  constructor(
    private productService: ProductService,
    private stockEntryService: StockEntryService,
    private stockExitService: StockExitService
  ) {}


  // ==========================================
  // COMPONENT INITIALIZATION
  // ==========================================

  /**
   * Initializes the reports component.
   *
   * Triggers the retrieval of product information, stock entries
   * and stock exits when the component is first loaded.
   *
   * These operations provide the data required to calculate
   * the inventory statistics and generate the reports.
   */
  ngOnInit(): void {

    // Retrieve product information and calculate inventory statistics.
    this.loadProducts();

    // Retrieve all registered stock entry operations.
    this.loadStockEntries();

    // Retrieve all registered stock exit operations.
    this.loadStockExits();
  }


  // ==========================================
  // PRINT REPORT
  // ==========================================

  /**
   * Opens the browser's native print dialog.
   *
   * Allows the user to print the generated report
   * or save it as a PDF document.
   */
  printReport(): void {

    // Opens the browser's print dialog.
    window.print();
  }


  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  /**
   * Retrieves all registered products from the backend API.
   *
   * Updates the component's product collection and calculates
   * the main inventory statistics, including the total number
   * of products, current stock quantity, low stock products
   * and products that are out of stock.
   *
   * Also triggers the calculation of product distribution
   * across categories once the product data has been received.
   */
  private loadProducts(): void {

    // Requests all registered products from the backend API.
    this.productService.getProducts().subscribe({

      // Handles the successful response containing the product collection.
      next: (products) => {

        // ------------------------------------------
        // STORE PRODUCTS
        // ------------------------------------------

        // Updates the component with the retrieved product collection.
        this.products = products;


        // ------------------------------------------
        // CALCULATE TOTAL PRODUCTS
        // ------------------------------------------

        // Calculates the total number of registered products.
        this.totalProducts = products.length;


        // ------------------------------------------
        // CALCULATE TOTAL STOCK
        // ------------------------------------------

        // Calculates the combined current quantity of all products.
        // Uses reduce() to accumulate the quantity of each product.
        this.totalStock = products.reduce(
          (total, product) =>
            total + product.quantity,
          0
        );


        // ------------------------------------------
        // CALCULATE OUT OF STOCK PRODUCTS
        // ------------------------------------------

        // Counts products whose current quantity is exactly zero.
        this.totalOutOfStock =
          products.filter(
            product => product.quantity === 0
          ).length;


        // ------------------------------------------
        // CALCULATE LOW STOCK PRODUCTS
        // ------------------------------------------

        // Counts products whose current quantity is below
        // or equal to their defined minimum stock level.
        // Excludes products that are already out of stock.
        this.totalLowStock =
          products.filter(
            product =>
              product.quantity > 0 &&
              product.quantity <= product.stockMin
          ).length;


        // ------------------------------------------
        // CALCULATE CATEGORY STATISTICS
        // ------------------------------------------

        // Groups the retrieved products by category
        // and calculates the number of products in each category.
        this.calculateCategoryStats();


        // ------------------------------------------
        // DEBUG INFORMATION
        // ------------------------------------------

        // Logs the retrieved products and calculated inventory statistics.
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

      // Handles errors returned when retrieving product information.
      error: (error) => {

        // Logs the error for debugging and troubleshooting purposes.
        console.error(
          'ERROR LOADING REPORT PRODUCTS:',
          error
        );
      }
    });
  }


  // ==========================================
  // LOAD STOCK ENTRIES
  // ==========================================

  /**
   * Retrieves all stock entry records from the backend API.
   *
   * Updates the component's stock entry collection and calculates
   * the total quantity of products added to inventory.
   *
   * The calculated total is used to display the overall stock
   * entry activity in the inventory report.
   */
  private loadStockEntries(): void {

    // Requests all registered stock entry records from the backend API.
    this.stockEntryService.getStockEntries().subscribe({

      // Handles the successful response containing the stock entries.
      next: (entries) => {

        // ------------------------------------------
        // STORE STOCK ENTRIES
        // ------------------------------------------

        // Updates the component with the retrieved stock entry records.
        this.stockEntries = entries;


        // ------------------------------------------
        // CALCULATE TOTAL ENTRIES
        // ------------------------------------------

        // Calculates the combined quantity of all registered stock entries.
        // Each entry contributes its quantity to the accumulated total.
        this.totalEntries = entries.reduce(
          (total, entry) =>
            total + entry.quantity,
          0
        );


        // ------------------------------------------
        // DEBUG INFORMATION
        // ------------------------------------------

        // Logs the retrieved stock entries and calculated total quantity.
        console.log(
          'REPORT ENTRIES:',
          this.stockEntries
        );

        console.log(
          'TOTAL ENTRIES:',
          this.totalEntries
        );
      },

      // Handles errors returned when retrieving stock entry records.
      error: (error) => {

        // Logs the error for debugging and troubleshooting purposes.
        console.error(
          'ERROR LOADING REPORT ENTRIES:',
          error
        );
      }
    });
  }


  // ==========================================
  // LOAD STOCK EXITS
  // ==========================================

  /**
   * Retrieves all stock exit records from the backend API.
   *
   * Updates the component's stock exit collection and calculates
   * the total quantity of products removed from inventory.
   *
   * The calculated total provides an overview of stock removal
   * activity and contributes to the inventory report.
   */
  private loadStockExits(): void {

    // Requests all registered stock exit records from the backend API.
    this.stockExitService.getStockExits().subscribe({

      // Handles the successful response containing the stock exits.
      next: (exits) => {

        // ------------------------------------------
        // STORE STOCK EXITS
        // ------------------------------------------

        // Updates the component with the retrieved stock exit records.
        this.stockExits = exits;


        // ------------------------------------------
        // CALCULATE TOTAL EXITS
        // ------------------------------------------

        // Calculates the combined quantity of all registered stock exits.
        // Each exit contributes its quantity to the accumulated total.
        this.totalExits = exits.reduce(
          (total, exit) =>
            total + exit.quantity,
          0
        );


        // ------------------------------------------
        // DEBUG INFORMATION
        // ------------------------------------------

        // Logs the retrieved stock exits and calculated total quantity.
        console.log(
          'REPORT EXITS:',
          this.stockExits
        );

        console.log(
          'TOTAL EXITS:',
          this.totalExits
        );
      },

      // Handles errors returned when retrieving stock exit records.
      error: (error) => {

        // Logs the error for debugging and troubleshooting purposes.
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

  /**
   * Calculates the distribution of products across registered categories.
   *
   * Iterates through the available product collection and groups
   * products according to their assigned category.
   *
   * Counts the number of products belonging to each category
   * and stores the resulting statistics in the categoryStats property.
   *
   * Products without an assigned category are excluded from the calculation.
   */
  private calculateCategoryStats(): void {

    // ------------------------------------------
    // INITIALIZE CATEGORY COUNTERS
    // ------------------------------------------

    // Creates a temporary object used to accumulate
    // the number of products associated with each category.
    const categories: {
      [key: string]: number;
    } = {};


    // ------------------------------------------
    // GROUP PRODUCTS BY CATEGORY
    // ------------------------------------------

    // Iterates through all products currently stored in the component.
    this.products.forEach(product => {

      // Retrieves the category name associated with the current product.
      const categoryName =
        product.category?.nameCategory;

      // Excludes products that do not have an assigned category.
      if (!categoryName) {
        return;
      }

      // Initializes the category counter when the category
      // is encountered for the first time.
      if (!categories[categoryName]) {
        categories[categoryName] = 0;
      }

      // Increments the product count for the corresponding category.
      categories[categoryName]++;
    });


    // ------------------------------------------
    // PREPARE CATEGORY STATISTICS
    // ------------------------------------------

    // Converts the category counters object into an array
    // containing the category name and its corresponding product count.
    this.categoryStats = Object.entries(categories).map(([name, count]) => ({
        name,
        count
      })
    );


    // ------------------------------------------
    // DEBUG INFORMATION
    // ------------------------------------------

    // Logs the calculated product distribution across categories.
    console.log(
      'REPORT CATEGORY STATS:',
      this.categoryStats
    );
  }
}
