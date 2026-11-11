import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StockEntryService } from '../../service/stockEntryService';
import { ProductService } from '../../service/productService';
import { StockEntryModel } from '../../models/stock-entry';
import { Product } from '../../models/product';
import { Sidebar } from '../../layout/sidebar/sidebar';

/**
 * Stock entry component responsible for managing inventory additions.
 *
 * Allows users to view existing stock entries, select available products
 * and register new stock entries by specifying the product, quantity
 * and entry date.
 *
 * Communicates with the backend API to retrieve products,
 * create stock entries and update the inventory records.
 */
@Component({
  selector: 'app-stock-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './stock-entry.html'
})
export class StockEntry implements OnInit {

  // ==========================================
  // STOCK ENTRIES AND PRODUCTS
  // ==========================================

  // Stores all registered stock entry records retrieved from the API.
  stockEntries: StockEntryModel[] = [];

  // Stores all products available for stock entry operations.
  products: Product[] = [];


  // ==========================================
  // COMPONENT STATES
  // ==========================================

  // Controls the visibility of the new stock entry form.
  showNewEntry = false;

  // Indicates whether a stock entry creation request is in progress.
  saving = false;

  // Indicates whether available products are currently being loaded.
  loadingProducts = false;


  // ==========================================
  // FEEDBACK MESSAGES
  // ==========================================

  // Stores error messages displayed when an operation fails.
  errorMessage = '';

  // Stores success messages displayed after a successful operation.
  successMessage = '';


  // ==========================================
  // STOCK ENTRY FORM DATA
  // ==========================================

  // Stores the values entered in the stock entry form.
  // Initializes the entry date with the current local date and time.
  formData = {
    productId: '',
    quantity: 1,
    dateStockEntry: this.getCurrentDate()
  };


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  // Injects the services responsible for retrieving products
  // and managing stock entry operations through the backend API.
  constructor(
    private stockEntryService: StockEntryService,
    private productService: ProductService
  ) {}


  // ==========================================
  // COMPONENT INITIALIZATION
  // ==========================================

  /**
   * Initializes the stock entry component.
   *
   * Retrieves all existing stock entry records and loads
   * the available products required for creating new entries.
   */
  ngOnInit(): void {

    // Loads the existing stock entry records.
    this.loadStockEntries();

    // Retrieves the products available in the inventory.
    this.loadProducts();
  }


  // ==========================================
  // LOAD STOCK ENTRIES
  // ==========================================

  /**
   * Retrieves all stock entry records from the backend API.
   *
   * Updates the component state with the returned records
   * and handles errors that may occur during the request.
   */
  loadStockEntries(): void {

    // Requests all registered stock entries from the backend.
    this.stockEntryService.getStockEntries().subscribe({

      // Handles the successful response from the API.
      next: (entries) => {

        // Stores the retrieved stock entry records.
        this.stockEntries = entries;
      },

      // Handles errors returned when retrieving stock entries.
      error: (error) => {

        // Logs the error for debugging purposes.
        console.error('ERROR LOADING STOCK ENTRIES:', error);
      }
    });
  }


  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  /**
   * Retrieves all available products from the backend API.
   *
   * These products are displayed in the stock entry form
   * so that users can select which product will receive additional stock.
   *
   * Manages the loading state and handles potential API errors.
   */
  loadProducts(): void {

    // Activates the loading indicator while products are being retrieved.
    this.loadingProducts = true;

    // Requests the available products from the backend API.
    this.productService.getProducts().subscribe({

      // Handles the successful response from the API.
      next: (products) => {

        // Ensures the API response is an array before storing the products.
        this.products = Array.isArray(products) ? products : [];

        // Deactivates the loading indicator after receiving the response.
        this.loadingProducts = false;

        // Logs the retrieved products for debugging purposes.
        console.log('PRODUCTS RECEIVED:', this.products);
      },

      // Handles errors returned when retrieving products.
      error: (error) => {

        // Deactivates the loading indicator after a failed request.
        this.loadingProducts = false;

        // Logs the error for debugging purposes.
        console.error('ERROR LOADING PRODUCTS:', error);

        // Displays an error message to the user.
        this.errorMessage = 'Could not load products.';
      }
    });
  }


  // ==========================================
  // OPEN NEW STOCK ENTRY FORM
  // ==========================================

  /**
   * Opens the form used to register a new stock entry.
   *
   * Resets all form fields to their default values
   * and clears previous error and success messages.
   *
   * Initializes the entry date with the current local date and time.
   */
  openNewEntry(): void {

    // Clears previous error and success messages.
    this.errorMessage = '';
    this.successMessage = '';

    // Resets the form fields with their default values.
    this.formData = {
      productId: '',
      quantity: 1,
      dateStockEntry: this.getCurrentDate()
    };

    // Displays the new stock entry form.
    this.showNewEntry = true;
  }


  // ==========================================
  // CLOSE NEW STOCK ENTRY FORM
  // ==========================================

  /**
   * Closes the new stock entry form.
   *
   * Hides the form and clears any existing error message
   * to ensure that previous validation errors are not displayed
   * when the form is opened again.
   */
  closeNewEntry(): void {

    // Hides the stock entry form.
    this.showNewEntry = false;

    // Clears the current error message.
    this.errorMessage = '';
  }


  // ==========================================
  // SAVE STOCK ENTRY
  // ==========================================

  /**
   * Validates the stock entry form and creates a new stock entry.
   *
   * Verifies that a valid product has been selected,
   * that the quantity is a positive integer and that an entry date
   * has been provided.
   *
   * Retrieves the selected product IRI and prepares the request payload
   * before sending the data to the backend API.
   *
   * Updates the component state and refreshes the stock entries list
   * after successful creation.
   */
  saveEntry(): void {

    // Clears previous error and success messages.
    this.errorMessage = '';
    this.successMessage = '';


    // ------------------------------------------
    // CONVERT FORM VALUES
    // ------------------------------------------

    // Converts the selected product ID into a number.
    const productId = Number(this.formData.productId);

    // Converts the entered quantity into a number.
    const quantity = Number(this.formData.quantity);


    // ------------------------------------------
    // VALIDATE SELECTED PRODUCT
    // ------------------------------------------

    // Searches for the selected product in the available products list.
    const selectedProduct = this.products.find(
      product => product.id === productId
    );

    // Prevents the operation if no valid product has been selected.
    if (!selectedProduct) {
      this.errorMessage = 'Please select a valid product.';
      return;
    }


    // ------------------------------------------
    // VALIDATE QUANTITY
    // ------------------------------------------

    // Ensures that the quantity is a positive integer.
    if (!Number.isInteger(quantity) || quantity <= 0) {
      this.errorMessage = 'Quantity must be a positive integer.';
      return;
    }


    // ------------------------------------------
    // VALIDATE ENTRY DATE
    // ------------------------------------------

    // Ensures that an entry date has been provided.
    if (!this.formData.dateStockEntry) {
      this.errorMessage = 'Please select an entry date.';
      return;
    }


    // ------------------------------------------
    // RETRIEVE PRODUCT IRI
    // ------------------------------------------

    // Retrieves the product IRI returned by API Platform.
    // The IRI identifies the selected product in the backend API.
    const productIri = (
      selectedProduct as Product & { '@id'?: string }
    )['@id'];

    // Stops the operation if the selected product does not have an IRI.
    if (!productIri) {

      // Displays an error message explaining the missing product IRI.
      this.errorMessage =
        'The product IRI was not returned by the API. Check the product response.';

      // Logs the selected product for debugging purposes.
      console.error('SELECTED PRODUCT:', selectedProduct);

      return;
    }


    // ------------------------------------------
    // PREPARE STOCK ENTRY PAYLOAD
    // ------------------------------------------

    // Creates the request payload containing the stock entry information.
    const payload = {

      // Specifies the quantity of products being added to the inventory.
      quantity,

      // Converts the selected entry date into ISO 8601 format.
      // This format ensures compatibility with the backend API.
      dateStockEntry: new Date(
        this.formData.dateStockEntry
      ).toISOString(),

      // Associates the stock entry with the selected product using its IRI.
      product: productIri
    };


    // ------------------------------------------
    // SEND STOCK ENTRY REQUEST
    // ------------------------------------------

    // Activates the saving indicator while the request is being processed.
    this.saving = true;

    // Sends the stock entry payload to the backend API.
    this.stockEntryService.createStockEntry(payload).subscribe({

      // Handles the successful stock entry creation response.
      next: () => {

        // Deactivates the saving indicator.
        this.saving = false;

        // Closes the stock entry form after successful creation.
        this.showNewEntry = false;

        // Displays a success message confirming the operation.
        this.successMessage = 'Stock entry created successfully!';

        // Reloads the stock entries list to include the newly created record.
        this.loadStockEntries();
      },

      // Handles errors returned by the backend during stock entry creation.
      error: (error) => {

        // Deactivates the saving indicator after the failed request.
        this.saving = false;

        // Logs the HTTP status and response body for debugging purposes.
        console.error('STATUS:', error.status);
        console.error('ERROR BODY:', error.error);

        // Displays the error description returned by the backend.
        // Uses a default message when the API does not provide a description.
        this.errorMessage =
          error.error?.detail ||
          error.error?.['hydra:description'] ||
          'Could not create stock entry.';
      }
    });
  }


  // ==========================================
  // GET CURRENT LOCAL DATE
  // ==========================================

  /**
   * Generates the current local date and time.
   *
   * Adjusts the date using the local timezone offset
   * to prevent unwanted timezone conversion differences.
   *
   * Returns the date in YYYY-MM-DDTHH:mm format,
   * which is required by HTML datetime-local inputs.
   *
   * @returns The current local date and time as a formatted string.
   */
  private getCurrentDate(): string {

    // Retrieves the current date and time.
    const now = new Date();

    // Adjusts the date according to the local timezone offset.
    const localDate = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    );

    // Returns the date in the format required by datetime-local inputs.
    return localDate.toISOString().slice(0, 16);
  }
}
