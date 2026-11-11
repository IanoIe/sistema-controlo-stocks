import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Sidebar } from "../../layout/sidebar/sidebar";
import { Product } from "../../models/product";
import { ProductService } from "../../service/productService";
import { ActivatedRoute, Route, Router } from "@angular/router";

/**
 * Product detail component responsible for retrieving and displaying
 * information about a specific product.
 * Also provides navigation to edit the product or return
 * to the previous product or category page.
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './product-detail.html'
})
export class ProductDetail implements OnInit {

  // Stores the details of the selected product.
  // Null indicates that no product has been loaded yet.
  product: Product | null = null;

  // Indicates whether the product information is currently being loaded.
  loading = true;

  // Indicates whether an error occurred while retrieving the product.
  error = false;

  /**
   * Initializes the services required to retrieve product information,
   * access route parameters and handle application navigation.
   */
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Initializes the product detail component.
   * Retrieves the product ID from the current route,
   * validates it and requests the corresponding product information.
   * Updates the component state depending on the request result.
   */
  ngOnInit(): void {

    // Retrieves the product ID from the route parameters.
    const id = this.route.snapshot.paramMap.get('id');

    // Checks whether a product ID was provided in the URL.
    if (!id) {
      console.error('PRODUCT ID NOT FOUND');
      this.loading = false;
      this.error = true;
      return;
    }

    // Converts the route parameter into a numeric product ID.
    const productId = Number(id);

    // Validates whether the provided ID is a valid number.
    if (isNaN(productId)) {
      console.error('INVALID PRODUCT ID:', id);
      this.loading = false;
      this.error = true;
      return;
    }

    // Logs the product ID before requesting its information.
    console.log('LOADING PRODUCT:', productId);

    // Retrieves the selected product using the product service.
    this.productService.getProduct(productId).subscribe({

      // Handles the successful response from the service.
      next: (product) => {

        // Logs the retrieved product information for debugging purposes.
        console.log('PRODUCT RECEIVED:', product);

        // Stores the retrieved product in the component property.
        this.product = product;

        // Indicates that the loading process has finished.
        this.loading = false;
      },

      // Handles errors that occur while retrieving the product.
      error: (error) => {

        console.error('ERROR LOADING PRODUCT:', error);

        // Stops the loading process and displays the error state.
        this.loading = false;
        this.error = true;
      }
    });
  }

  /**
   * Navigates to the product editing page.
   * Checks whether a product is available before navigating.
   * Preserves the returnTo query parameter when provided,
   * allowing the user to return to the original page after editing.
   */
  editProduct(): void {

    // Prevents navigation if no product has been loaded.
    if (!this.product) {
      return;
    }

    // Retrieves the original destination from the query parameters.
    const returnTo = this.route.snapshot.queryParamMap.get('returnTo');

    // Navigates to the editing page of the selected product.
    // Preserves the returnTo parameter when it exists.
    this.router.navigate(['/products', this.product.id, 'edit'],
      {
        queryParams: returnTo ? { returnTo } : {}
      }
    );
  }

  /**
   * Navigates back to the previous product listing context.
   * If the user arrived from a category page, redirects them
   * to that category. Otherwise, redirects them to the products list.
   */
  backToProducts(): void {

    // Retrieves the original destination from the query parameters.
    const returnTo = this.route.snapshot.queryParamMap.get('returnTo');

    // Returns to the category page when the original route belongs to a category.
    if (returnTo?.startsWith('/categories/')) {
      this.router.navigateByUrl(returnTo);
    } else {

      // Otherwise, redirects the user to the main products page.
      this.router.navigate(['/products']);
    }
  }
}
