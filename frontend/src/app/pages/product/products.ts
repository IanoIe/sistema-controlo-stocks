import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/productService';
import { Product } from '../../models/product';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { Router } from '@angular/router';

/**
 * Products component responsible for displaying and managing
 * the list of products available in the application.
 * Provides product searching, stock filtering, sorting
 * and CRUD (Create, Read, Update, Delete) operations.
 */
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './products.html'
})
export class Products implements OnInit {

  // ==========================================
  // PRODUCT DATA
  // ==========================================

  // Stores the complete list of products retrieved from the API.
  products: Product[] = [];

  // Stores the products after applying the selected search,
  // stock filters and sorting options.
  filteredProducts: Product[] = [];

  // ==========================================
  // SEARCH, FILTER AND SORT OPTIONS
  // ==========================================

  // Stores the search term entered by the user.
  searchTerm = '';

  // Defines the selected stock filter.
  // Possible values include: all, in-stock, low-stock and out-of-stock.
  stockFilter = 'all';

  // Defines the selected sorting option.
  // Products can be sorted by name or quantity in ascending
  // or descending order.
  sortOption = 'name';

  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  /**
   * Initializes the product service to retrieve and manage products
   * and the router to handle navigation between application pages.
   */
  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  // ==========================================
  // INITIALIZATION
  // ==========================================

  /**
   * Initializes the products component.
   * Automatically retrieves the product list when the component loads.
   */
  ngOnInit(): void {
    this.loadProducts();
  }

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  /**
   * Retrieves all products from the API.
   * Validates the response to ensure it is an array,
   * updates the product list and applies the default filters.
   * Logs an error if the request fails.
   */
  loadProducts(): void {

    // Requests all products from the product service.
    this.productService.getProducts().subscribe({

      // Handles the successful response from the API.
      next: (products) => {

        // Logs the received products for debugging purposes.
        console.log('PRODUCTS RECEIVED:', products);
        console.log('IS ARRAY:', Array.isArray(products));

        // Ensures that the response is an array before storing it.
        // Assigns an empty array if the response has an unexpected format.
        this.products = Array.isArray(products)
          ? products
          : [];

        // Applies the current search, stock filters and sorting options.
        this.applyFilters();
      },

      // Handles errors that occur while retrieving products.
      error: (error) => {
        console.error('ERROR LOADING PRODUCTS:', error);
      }

    });
  }

  // ==========================================
  // SEARCH PRODUCTS
  // ==========================================

  /**
   * Handles changes to the product search input.
   * Reapplies the search criteria, stock filters and sorting options.
   */
  onSearch(): void {
    this.applyFilters();
  }

  // ==========================================
  // STOCK FILTER
  // ==========================================

  /**
   * Handles changes to the selected stock filter.
   * Updates the displayed products according to their stock status.
   */
  onStockFilterChange(): void {
    this.applyFilters();
  }

  // ==========================================
  // SORT PRODUCTS
  // ==========================================

  /**
   * Handles changes to the selected sorting option.
   * Reapplies all filters and sorts the resulting product list.
   */
  onSortChange(): void {
    this.applyFilters();
  }

  // ==========================================
  // APPLY SEARCH, FILTERS AND SORTING
  // ==========================================

  /**
   * Applies the selected search criteria, stock filters
   * and sorting options to the complete product list.
   *
   * The filtering process includes:
   * - Searching products by name or product code.
   * - Filtering products according to their stock status.
   * - Sorting products alphabetically or by available quantity.
   *
   * Updates the filteredProducts property with the final result.
   */
  applyFilters(): void {

    // Creates a copy of the original product list
    // to avoid modifying the complete products array.
    let result = [...this.products];

    // ------------------------------------------
    // SEARCH BY NAME OR PRODUCT CODE
    // ------------------------------------------

    // Removes unnecessary spaces and converts the search term to lowercase.
    const search = this.searchTerm.trim().toLowerCase();

    // Applies the search only when the search field is not empty.
    if (search !== '') {

      // Keeps products whose name or product code contains the search term.
      result = result.filter(product =>
        product.nameProduct.toLowerCase().includes(search) ||
        product.codeProduct.toLowerCase().includes(search)
      );

    }

    // ------------------------------------------
    // FILTER BY STOCK STATUS
    // ------------------------------------------

    // Displays products whose quantity is above the minimum stock level.
    if (this.stockFilter === 'in-stock') {

      result = result.filter(product =>
        product.quantity > product.stockMin
      );

    }

    // Displays products with a positive quantity
    // that has reached or fallen below the minimum stock level.
    if (this.stockFilter === 'low-stock') {

      result = result.filter(product =>
        product.quantity > 0 &&
        product.quantity <= product.stockMin
      );

    }

    // Displays products that have no available stock.
    if (this.stockFilter === 'out-of-stock') {

      result = result.filter(product =>
        product.quantity === 0
      );

    }

    // ------------------------------------------
    // SORT PRODUCTS
    // ------------------------------------------

    // Sorts products alphabetically by name in ascending order.
    if (this.sortOption === 'name') {

      result.sort((a, b) =>
        a.nameProduct.localeCompare(b.nameProduct)
      );

    }

    // Sorts products alphabetically by name in descending order.
    if (this.sortOption === 'name-desc') {

      result.sort((a, b) =>
        b.nameProduct.localeCompare(a.nameProduct)
      );

    }

    // Sorts products by quantity in ascending order.
    if (this.sortOption === 'quantity') {

      result.sort((a, b) =>
        a.quantity - b.quantity
      );

    }

    // Sorts products by quantity in descending order.
    if (this.sortOption === 'quantity-desc') {

      result.sort((a, b) =>
        b.quantity - a.quantity
      );

    }

    // Updates the displayed product list with the filtered and sorted results.
    this.filteredProducts = result;
  }

  // ==========================================
  // GET STOCK STATUS
  // ==========================================

  /**
   * Determines the current stock status of a product.
   *
   * Returns:
   * - 'Out of Stock' when the available quantity is zero.
   * - 'Low Stock' when the quantity is at or below the minimum stock level.
   * - 'In Stock' when the quantity is above the minimum stock level.
   *
   * @param product - The product whose stock status must be checked.
   * @returns The corresponding stock status label.
   */
  getStockStatus(product: Product): string {

    // Checks whether the product has no available stock.
    if (product.quantity === 0) {
      return 'Out of Stock';
    }

    // Checks whether the product has reached its minimum stock level.
    if (product.quantity <= product.stockMin) {
      return 'Low Stock';
    }

    // Returns the default status when sufficient stock is available.
    return 'In Stock';
  }

  // ==========================================
  // CREATE PRODUCT
  // ==========================================

  /**
   * Navigates to the product creation page.
   * Allows the user to register a new product in the application.
   */
  newProduct(): void {

    // Logs the creation action for debugging purposes.
    console.log('NEW PRODUCT BUTTON CLICKED');

    // Redirects the user to the new product form.
    this.router.navigate(['/products/new']);
  }

  // ==========================================
  // VIEW PRODUCT
  // ==========================================

  /**
   * Navigates to the details page of the selected product.
   *
   * @param product - The product whose details will be displayed.
   */
  viewProduct(product: Product): void {

    // Logs the selected product for debugging purposes.
    console.log('VIEW PRODUCT:', product);

    // Navigates to the product detail page using its unique ID.
    this.router.navigate(['/products', product.id]);
  }

  // ==========================================
  // EDIT PRODUCT
  // ==========================================

  /**
   * Navigates to the editing page of the selected product.
   *
   * @param product - The product whose information will be updated.
   */
  editProduct(product: Product): void {

    // Logs the selected product for debugging purposes.
    console.log('EDIT PRODUCT:', product);

    // Navigates to the product editing form using its unique ID.
    this.router.navigate(['/products', product.id, 'edit']);
  }

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  /**
   * Deletes the selected product after user confirmation.
   * Sends a deletion request to the product service.
   * If the deletion is successful, removes the product
   * from the local list and reapplies the active filters.
   *
   * If the request fails, logs the corresponding error.
   *
   * @param product - The product that will be deleted.
   */
  deleteProduct(product: Product): void {

    // Requests confirmation before deleting the selected product.
    const confirmed = confirm(
      `Are you sure you want to delete "${product.nameProduct}"?`
    );

    // Cancels the deletion operation if the user does not confirm.
    if (!confirmed) {
      return;
    }

    // Logs the selected product for debugging purposes.
    console.log('DELETE PRODUCT:', product);

    // Sends the deletion request to the product service.
    this.productService.deleteProduct(product.id).subscribe({

      // Handles the successful deletion response.
      next: () => {

        // Logs the successfully deleted product.
        console.log('PRODUCT DELETED:', product);

        // Removes the deleted product from the local product list.
        this.products = this.products.filter(
          p => p.id !== product.id
        );

        // Refreshes the displayed list while preserving
        // the currently selected search and filter options.
        this.applyFilters();
      },

      // Handles errors that occur during the deletion request.
      error: (error) => {

        console.error('ERROR DELETING PRODUCT:', error);

      }

    });
  }
}
