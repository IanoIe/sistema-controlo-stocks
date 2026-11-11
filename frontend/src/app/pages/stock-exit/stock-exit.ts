import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StockExitService } from '../../service/stockExitService';
import { ProductService } from '../../service/productService';
import { StockExitModel } from '../../models/stock-exit';
import { Product } from '../../models/product';
import { Sidebar } from '../../layout/sidebar/sidebar';

/**
 * Stock exit component responsible for managing inventory removals.
 *
 * Allows users to view existing stock exit records, select available
 * products and register new stock exits by specifying the product,
 * quantity and exit date.
 *
 * Communicates with the backend API to retrieve products,
 * create stock exits and update the inventory records.
 */
@Component({
  selector: 'app-stock-exit',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './stock-exit.html'
})
export class StockExit implements OnInit {

  // ==========================================
  // STOCK EXITS AND PRODUCTS
  // ==========================================

  // Stores all registered stock exit records retrieved from the API.
  stockExits: StockExitModel[] = [];

  // Stores all products available for stock exit operations.
  products: Product[] = [];


  // ==========================================
  // COMPONENT STATES
  // ==========================================

  // Controls the visibility of the new stock exit form.
  showNewExit = false;

  // Indicates whether a stock exit creation request is in progress.
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
  // STOCK EXIT FORM DATA
  // ==========================================

  // Stores the values entered in the stock exit form.
  // Initializes the exit date with the current local date and time.
  formData = {
    productId: '',
    quantity: 1,
    dateStockExit: this.getCurrentDate()
  };


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  // Injects the services responsible for managing stock exits
  // and retrieving available products from the backend API.
  constructor(
    private stockExitService: StockExitService,
    private productService: ProductService
  ) {}


  // ==========================================
  // COMPONENT INITIALIZATION
  // ==========================================

  /**
   * Initializes the stock exit component.
   *
   * Retrieves all existing stock exit records and loads
   * the available products required for creating new exits.
   */
  ngOnInit(): void {

    // Loads all existing stock exit records.
    this.loadStockExits();

    // Retrieves the products available in the inventory.
    this.loadProducts();
  }


  // ==========================================
  // LOAD STOCK EXITS
  // ==========================================

  /**
   * Retrieves all stock exit records from the backend API.
   *
   * Updates the component state with the returned records
   * and manages errors that may occur during the request.
   *
   * Displays an appropriate error message if the operation fails.
   */
  loadStockExits(): void {

    // Requests all registered stock exits from the backend.
    this.stockExitService.getStockExits().subscribe({

      // Handles the successful response from the API.
      next: (exits) => {

        // Stores the retrieved stock exit records.
        this.stockExits = exits;

        // Logs the retrieved records for debugging purposes.
        console.log('STOCK EXITS RECEIVED:', exits);
      },

      // Handles errors returned when retrieving stock exits.
      error: (error) => {

        // Logs the error for debugging purposes.
        console.error('ERROR LOADING STOCK EXITS:', error);

        // Displays an error message to the user.
        this.errorMessage = 'Could not load stock exits.';
      }
    });
  }


  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  /**
   * Retrieves all available products from the backend API.
   *
   * These products are displayed in the stock exit form
   * so users can select which product will have its stock reduced.
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
  // OPEN NEW STOCK EXIT FORM
  // ==========================================

  /**
   * Opens the form used to register a new stock exit.
   *
   * Resets all form fields to their default values
   * and clears previous error and success messages.
   *
   * Initializes the exit date with the current local date and time.
   */
  openNewExit(): void {

    // Clears previous error and success messages.
    this.errorMessage = '';
    this.successMessage = '';

    // Resets the form fields with their default values.
    this.formData = {
      productId: '',
      quantity: 1,
      dateStockExit: this.getCurrentDate()
    };

    // Displays the new stock exit form.
    this.showNewExit = true;
  }


  // ==========================================
  // CLOSE NEW STOCK EXIT FORM
  // ==========================================

  /**
   * Closes the new stock exit form.
   *
   * Hides the form and clears any existing error message
   * to prevent previous validation errors from being displayed
   * when the form is opened again.
   */
  closeNewExit(): void {

    // Hides the stock exit form.
    this.showNewExit = false;

    // Clears the current error message.
    this.errorMessage = '';
  }


  // ==========================================
  // SAVE STOCK EXIT
  // ==========================================

  /**
   * Validates the stock exit form and creates a new stock exit.
   *
   * Verifies that a valid product has been selected,
   * that the quantity is a positive integer and that an exit date
   * has been provided.
   *
   * Retrieves the selected product IRI and prepares the request payload
   * before sending the data to the backend API.
   *
   * Updates the component state and refreshes the stock exits list
   * after successful creation.
   */
  saveExit(): void {

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
    // VALIDATE EXIT DATE
    // ------------------------------------------

    // Ensures that a stock exit date has been provided.
    if (!this.formData.dateStockExit) {
      this.errorMessage = 'Please select a date.';
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
        'Product IRI is missing. Check the GET /products response.';

      // Logs the selected product for debugging purposes.
      console.error('SELECTED PRODUCT:', selectedProduct);

      return;
    }


    // ------------------------------------------
    // PREPARE STOCK EXIT PAYLOAD
    // ------------------------------------------

    // Creates the request payload containing the stock exit information.
    const payload = {

      // Specifies the quantity of products being removed from inventory.
      quantity,

      // Converts the selected exit date into ISO 8601 format.
      // Ensures compatibility with the backend API.
      dateStockExit: new Date(
        this.formData.dateStockExit
      ).toISOString(),

      // Associates the stock exit with the selected product using its IRI.
      product: productIri
    };


    // ------------------------------------------
    // SEND STOCK EXIT REQUEST
    // ------------------------------------------

    // Activates the saving indicator while the request is being processed.
    this.saving = true;

    // Sends the stock exit payload to the backend API.
    this.stockExitService.createStockExit(payload).subscribe({

      // Handles the successful stock exit creation response.
      next: (result) => {

        // Logs the created stock exit for debugging purposes.
        console.log('STOCK EXIT CREATED:', result);

        // Deactivates the saving indicator.
        this.saving = false;

        // Closes the stock exit form after successful creation.
        this.showNewExit = false;

        // Displays a success message confirming the operation.
        this.successMessage = 'Stock exit created successfully!';

        // Reloads the stock exits list to include the newly created record.
        this.loadStockExits();
      },

      // Handles errors returned by the backend during stock exit creation.
      error: (error) => {

        // Deactivates the saving indicator after the failed request.
        this.saving = false;

        // Logs the HTTP status and response body for debugging purposes.
        console.error('ERROR CREATING STOCK EXIT:', error.status);
        console.error('ERROR BODY:', error.error);

        // Displays the error description returned by the backend.
        // Uses a default message when the API does not provide a description.
        this.errorMessage =
          error.error?.detail ||
          error.error?.['hydra:description'] ||
          'Could not create stock exit. Check the data and try again.';
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
