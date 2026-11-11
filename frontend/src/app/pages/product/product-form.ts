import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Sidebar } from "../../layout/sidebar/sidebar";
import { ProductService } from "../../service/productService";
import { Product } from "../../models/product";
import { Category } from "../../models/category";
import { CategoriesService } from "../../service/categoriesService";
import { CreateProduct } from "../../models/create-product";

/**
 * Product form component responsible for creating and updating products.
 * Provides product information management, category selection
 * and navigation between the product listing and editing pages.
 */
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './product-form.html'
})
export class ProductForm implements OnInit {

  // ==========================================
  // PRODUCT FORM DATA
  // ==========================================

  // Stores the product information entered in the form.
  // Initializes all fields with default values.
  product: CreateProduct = {
    codeProduct: '',
    nameProduct: '',
    category: '',
    price: '',
    quantity: 0,
    stockMin: 0
  };

  // ==========================================
  // CATEGORIES
  // ==========================================

  // Stores the list of available categories for product selection.
  categories: Category[] = [];

  // ==========================================
  // FORM STATE
  // ==========================================

  // Stores the ID of the product being edited.
  // Remains null when creating a new product.
  productId: number | null = null;

  // Indicates whether the form is being used to edit an existing product.
  isEditMode = false;

  // Indicates whether a product loading operation is in progress.
  loading = false;

  // Stores error messages displayed when an operation fails.
  error = '';

  // Stores the original navigation destination to preserve the user's context.
  private returnTo: string | null = null;

  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  /**
   * Initializes the services required to manage products and categories,
   * retrieve route parameters and handle application navigation.
   */
  constructor(
    private productService: ProductService,
    private categoryService: CategoriesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // ==========================================
  // INITIALIZATION
  // ==========================================

  /**
   * Initializes the product form component.
   * Checks whether a product ID exists in the route to determine
   * if the component should operate in creation or editing mode.
   * Also retrieves the available categories for the form.
   */
  ngOnInit(): void {

    // Retrieves the product ID from the current route parameters.
    const id = this.route.snapshot.paramMap.get('id');

    // Retrieves the original navigation destination from the query parameters.
    this.returnTo = this.route.snapshot.queryParamMap.get('returnTo');

    // Checks whether the component was opened with a product ID.
    if (id !== null) {

      // Converts the route parameter into a numeric product ID.
      this.productId = Number(id);

      // Validates whether the provided product ID is a positive integer.
      if (!Number.isInteger(this.productId) || this.productId <= 0) {
        this.error = 'Invalid product ID.';
        return;
      }

      // Enables editing mode and retrieves the selected product.
      this.isEditMode = true;
      this.loadProduct(this.productId);
    }

    // Retrieves all available categories from the category service.
    this.categoryService.getCategories().subscribe({

      // Handles the successful response from the service.
      next: (categories) => {

        // Updates the list of categories available in the form.
        this.categories = categories;
      },

      // Handles errors that occur while retrieving categories.
      error: (error) => {
        console.error('ERROR LOADING CATEGORIES:', error);
      }
    });
  }

  // ==========================================
  // LOAD PRODUCT
  // ==========================================

  /**
   * Retrieves an existing product using its ID.
   * Maps the received product data to the form structure
   * and updates the loading and error states accordingly.
   *
   * @param id - The unique identifier of the product to retrieve.
   */
  loadProduct(id: number): void {

    // Activates the loading state and clears previous errors.
    this.loading = true;
    this.error = '';

    // Requests the selected product from the product service.
    this.productService.getProduct(id).subscribe({

      // Handles the successful response containing the product data.
      next: (product: Product) => {

        // Maps the retrieved product properties to the form model.
        // Converts category ID and price values into strings
        // to match the expected form field types.
        this.product = {
          codeProduct: product.codeProduct,
          nameProduct: product.nameProduct,
          category: String(product.category?.id ?? ''),
          price: String(product.price),
          quantity: product.quantity,
          stockMin: product.stockMin
        };

        // Indicates that the product loading process has finished.
        this.loading = false;
      },

      // Handles errors that occur while retrieving the product.
      error: (error) => {
        console.error('ERROR LOADING PRODUCT:', error);

        // Displays an error message and stops the loading state.
        this.error = 'Unable to load product.';
        this.loading = false;
      }
    });
  }

  // ==========================================
  // CREATE OR UPDATE PRODUCT
  // ==========================================

  /**
   * Handles the product form submission.
   * Validates the selected category, prepares the product payload
   * and determines whether to create a new product or update
   * an existing one based on the current form mode.
   *
   * After a successful update, returns the user to the original page.
   * After a successful creation, redirects the user to the products list.
   */
  createproduct(): void {

    // Clears any previous form error messages.
    this.error = '';

    // Prepares the product data in the format expected by the API.
    // The category is represented using its API resource identifier.
    const productToSave: CreateProduct = {
      nameProduct: this.product.nameProduct,
      codeProduct: this.product.codeProduct,
      price: this.product.price,
      quantity: this.product.quantity,
      stockMin: this.product.stockMin,
      category: `/api/categories/${this.product.category}`
    };

    // Validates whether a category has been selected.
    if (!this.product.category) {
      this.error = 'Please select a category.';
      return;
    }

    // Checks whether the form is in editing mode
    // and a valid product ID is available.
    if (this.isEditMode && this.productId !== null) {
      // Sends the updated product information to the product service.
      this.productService
        .updateProduct(this.productId, productToSave)
        .subscribe({
          // Returns to the original page after a successful update.
          next: () => {
            this.goBackAfterSave();
          },
          // Handles errors that occur while updating the product.
          error: (error) => {
            console.error('ERROR UPDATING PRODUCT:', error);
            this.error = 'Unable to update product.';
          }
        });
      // Stops execution to prevent the creation request from running.
      return;
    }
    // Creates a new product when the form is not in editing mode.
    this.productService.createProduct(productToSave).subscribe({
      // Redirects to the products list after successful creation.
      next: () => {
        this.router.navigate(['/products']);
      },
      // Handles errors that occur while creating the product.
      error: (error) => {
        console.error('ERROR CREATING PRODUCT:', error);
        this.error = 'Unable to create product.';
      }
    });
  }

  // ==========================================
  // RETURN AFTER SAVING
  // ==========================================

  /**
   * Navigates the user back to the appropriate page after updating a product.
   * If the user originally accessed the form from a category page,
   * redirects them to that category. Otherwise, returns to the products list.
   */
  goBackAfterSave(): void {
    // Checks whether the original destination is a category page.
    if (this.returnTo?.startsWith('/categories/')) {
      // Returns to the original category page.
      this.router.navigateByUrl(this.returnTo);
    } else {
      // Returns to the main products listing page.
      this.router.navigate(['/products']);
    }
  }

  // ==========================================
  // CANCEL FORM
  // ==========================================

  /**
   * Cancels the current form operation.
   * In editing mode, returns the user to the original page.
   * In creation mode, redirects the user to the products list.
   */
  cancel(): void {
    // Checks whether the form is being used to edit an existing product.
    if (this.isEditMode) {
      // Returns to the original page without saving further changes.
      this.goBackAfterSave();
    } else {
      // Redirects to the products list when creating a new product.
      this.router.navigate(['/products']);
    }
  }
}
